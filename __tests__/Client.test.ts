import { Alert } from 'react-native';
import client, { refreshAccessToken } from '../src/Networking/Client';
import { AUTH_ENDPOINTS } from '../src/Networking/EndPoints';
import { getData, storeData, Keys } from '../src/AsyncStore';

jest.mock('../src/AsyncStore', () => ({
  Keys: { USER_TOKEN: 'USER_TOKEN', REFRESH_TOKEN: 'REFRESH_TOKEN' },
  getData: jest.fn(),
  storeData: jest.fn(),
}));

const fetchMock = jest.fn();
const originalFetch = global.fetch;
let storage: Record<string, string>;

const response = (status: number, data: unknown) => ({
  status,
  ok: status >= 200 && status < 300,
  json: async () => data,
  text: async () => JSON.stringify(data),
});

const deferred = <Value,>() => {
  let resolve!: (value: Value) => void;
  const promise = new Promise<Value>(fulfill => { resolve = fulfill; });
  return { promise, resolve };
};

beforeEach(() => {
  jest.clearAllMocks();
  fetchMock.mockReset();
  global.fetch = fetchMock;
  storage = { USER_TOKEN: 'expired-access', REFRESH_TOKEN: 'refresh-one' };
  (getData as jest.Mock).mockImplementation(async key => storage[key] ?? null);
  (storeData as jest.Mock).mockImplementation(async (key, value) => {
    storage[key] = value;
  });
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'info').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(Alert, 'alert').mockImplementation(() => {});
});

afterEach(() => jest.restoreAllMocks());

afterAll(() => {
  global.fetch = originalFetch;
});

test('refreshes a 401 and replays the original request with the new token', async () => {
  const requests: any[] = [];
  fetchMock.mockImplementation(async (url, config) => {
    requests.push({ url, ...config, headers: { ...config.headers } });
    if (url === AUTH_ENDPOINTS.refreshToken) {
      return response(200, { access_token: 'new-access', refresh_token: 'refresh-two' });
    }
    return config.headers.Authorization === 'Bearer new-access'
      ? response(200, { saved: true })
      : response(401, { message: 'Expired token' });
  });

  await expect(client.post('https://example.test/profile', { name: 'Test' }, { 'X-Request-ID': '123' }))
    .resolves.toMatchObject({ success: true, data: { saved: true } });

  expect(requests.map(request => request.url)).toEqual([
    'https://example.test/profile', AUTH_ENDPOINTS.refreshToken, 'https://example.test/profile',
  ]);
  expect(requests[2]).toMatchObject({
    method: 'POST', body: JSON.stringify({ name: 'Test' }),
    headers: { Authorization: 'Bearer new-access', 'X-Request-ID': '123' },
  });
  expect(JSON.parse(requests[1].body)).toEqual({ refresh_token: 'refresh-one' });
  expect(storage[Keys.REFRESH_TOKEN]).toBe('refresh-two');
});

test('concurrent 401 responses share one refresh and each request is replayed', async () => {
  const refreshResponse = deferred<ReturnType<typeof response>>();
  const refreshStarted = deferred<void>();
  fetchMock.mockImplementation(async (url, config) => {
    if (url === AUTH_ENDPOINTS.refreshToken) {
      refreshStarted.resolve();
      return refreshResponse.promise;
    }
    return response(config.headers.Authorization === 'Bearer new-access' ? 200 : 401, { url });
  });
  const first = client.get('https://example.test/first');
  const second = client.get('https://example.test/second');
  await refreshStarted.promise;
  expect(fetchMock.mock.calls.filter(([url]) => url === AUTH_ENDPOINTS.refreshToken)).toHaveLength(1);
  refreshResponse.resolve(response(200, { access_token: 'new-access' }));
  await expect(Promise.all([first, second])).resolves.toMatchObject([
    { success: true, data: { url: 'https://example.test/first' } },
    { success: true, data: { url: 'https://example.test/second' } },
  ]);
  expect(fetchMock).toHaveBeenCalledTimes(5);
});

test('new requests wait for an in-flight startup refresh', async () => {
  const refreshResponse = deferred<ReturnType<typeof response>>();
  const refreshStarted = deferred<void>();
  fetchMock.mockImplementation(async url => {
    if (url === AUTH_ENDPOINTS.refreshToken) {
      refreshStarted.resolve();
      return refreshResponse.promise;
    }
    return response(200, {});
  });
  const startup = refreshAccessToken();
  expect(refreshAccessToken()).toBe(startup);
  const request = client.get('https://example.test/queued');
  await refreshStarted.promise;
  expect(fetchMock).toHaveBeenCalledTimes(1);
  refreshResponse.resolve(response(200, { access_token: 'new-access' }));
  await Promise.all([startup, request]);
  expect(fetchMock).toHaveBeenLastCalledWith('https://example.test/queued', expect.objectContaining({
    headers: expect.objectContaining({ Authorization: 'Bearer new-access' }),
  }));
});

test('a delayed 401 reuses an already refreshed token', async () => {
  const delayedResponse = deferred<ReturnType<typeof response>>();
  const delayedStarted = deferred<void>();
  fetchMock.mockImplementation(async (url, config) => {
    if (url === AUTH_ENDPOINTS.refreshToken) {
      return response(200, { access_token: 'new-access' });
    }
    if (url.endsWith('/slow') && config.headers.Authorization === 'Bearer expired-access') {
      delayedStarted.resolve();
      return delayedResponse.promise;
    }
    return response(config.headers.Authorization === 'Bearer new-access' ? 200 : 401, {});
  });
  const delayedRequest = client.get('https://example.test/slow');
  await delayedStarted.promise;
  await client.get('https://example.test/fast');
  delayedResponse.resolve(response(401, {}));
  await expect(delayedRequest).resolves.toMatchObject({ success: true });
  expect(fetchMock.mock.calls.filter(([url]) => url === AUTH_ENDPOINTS.refreshToken)).toHaveLength(1);
});

test('does not loop when the retried request is still unauthorized', async () => {
  fetchMock.mockImplementation(async url => url === AUTH_ENDPOINTS.refreshToken
    ? response(200, { access_token: 'new-access' })
    : response(401, { message: 'Still unauthorized' }));
  await expect(client.get('https://example.test/private')).rejects.toMatchObject({
    type: 'ApplicationError', status: 401, message: 'Still unauthorized',
  });
  expect(fetchMock).toHaveBeenCalledTimes(3);
});

test.each([400, 401, 500])('propagates refresh failure %s without replay and releases the lock', async status => {
  fetchMock.mockImplementation(async url => response(url === AUTH_ENDPOINTS.refreshToken ? status : 401, { message: 'Failed' }));
  await expect(client.get('https://example.test/private')).rejects.toMatchObject({ status });
  expect(fetchMock).toHaveBeenCalledTimes(2);
  expect(storage.USER_TOKEN).toBe('expired-access');
  fetchMock.mockResolvedValue(response(200, { access_token: 'new-access' }));
  await expect(refreshAccessToken()).resolves.toBe('new-access');
});

test.each([AUTH_ENDPOINTS.login, AUTH_ENDPOINTS.refreshToken, AUTH_ENDPOINTS.signup])(
  'does not automatically refresh authentication endpoint %s', async endpoint => {
    fetchMock.mockResolvedValue(response(401, { message: 'Invalid credentials' }));
    await expect(client.post(endpoint, {})).rejects.toMatchObject({ status: 401 });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  },
);

test('respects the explicit refresh opt-out', async () => {
  fetchMock.mockResolvedValue(response(401, {}));
  await expect(client.get('https://example.test/public', {}, false)).rejects.toMatchObject({ status: 401 });
  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(Alert.alert).not.toHaveBeenCalled();
});

test('does not send a refresh request without a saved refresh token', async () => {
  delete storage.REFRESH_TOKEN;
  await expect(refreshAccessToken()).resolves.toBeNull();
  expect(fetchMock).not.toHaveBeenCalled();
  fetchMock.mockResolvedValue(response(401, {}));
  await expect(client.get('https://example.test/private')).rejects.toMatchObject({ status: 401 });
  expect(fetchMock).toHaveBeenCalledTimes(1);
});

test('rejects malformed refresh success without overwriting tokens', async () => {
  fetchMock.mockResolvedValue(response(200, { refresh_token: 'bad-response' }));
  await expect(refreshAccessToken()).rejects.toThrow('missing an access token');
  expect(storeData).not.toHaveBeenCalled();
});

test('replays FormData with the same body and no forced content type', async () => {
  const body = new FormData();
  body.append('name', 'Test');
  fetchMock.mockResolvedValueOnce(response(401, {}))
    .mockResolvedValueOnce(response(200, { access_token: 'new-access' }))
    .mockResolvedValueOnce(response(200, {}));
  await client.post('https://example.test/upload', body);
  expect(fetchMock.mock.calls[2][1].body).toBe(body);
  expect(fetchMock.mock.calls[2][1].headers['Content-Type']).toBeUndefined();
});