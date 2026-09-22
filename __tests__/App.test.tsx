/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Button } from 'react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from '../App';
import loginReducer from '../src/Redux/slices/loginSlice';
import client, { refreshAccessToken } from '../src/Networking/Client';
import { getData, multiRemove } from '../src/AsyncStore';
import AppNavigator from '../src/navigation/AppNavigator';

jest.mock('../src/navigation/AppNavigator', () => jest.fn(() => null));
jest.mock('../src/screens/SplashScreen', () => jest.fn(() => null));
jest.mock('../src/Networking/Client', () => ({
  __esModule: true,
  default: { get: jest.fn() },
  refreshAccessToken: jest.fn(),
}));
jest.mock('../src/AsyncStore', () => ({
  Keys: jest.requireActual('../src/AsyncStore/keys'),
  getData: jest.fn(),
  storeData: jest.fn(),
  multiRemove: jest.fn(),
}));

let renderer: ReactTestRenderer.ReactTestRenderer;
let storage: Record<string, string>;

beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
  storage = {
    USER_TOKEN: 'new-access', IS_LOGIN: 'true',
    USER_DATA: JSON.stringify({ id: 'user-one' }),
  };
  (getData as jest.Mock).mockImplementation(async key => storage[key] ?? null);
  (multiRemove as jest.Mock).mockImplementation(async keys => {
    keys.forEach((key: string) => delete storage[key]);
  });
  (client.get as jest.Mock).mockResolvedValue({ data: [{ user_type: 'job_seeker' }] });
  (refreshAccessToken as jest.Mock).mockReset();
});

afterEach(async () => {
  await ReactTestRenderer.act(async () => renderer?.unmount());
  jest.useRealTimers();
});

const renderApp = async () => {
  const store = configureStore({ reducer: { login: loginReducer } });
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<Provider store={store}><App /></Provider>);
  });
  return store;
};

test('waits for startup refresh before role requests or navigation', async () => {
  let finishRefresh!: (token: string) => void;
  (refreshAccessToken as jest.Mock).mockReturnValue(new Promise(resolve => {
    finishRefresh = resolve;
  }));
  const store = await renderApp();
  await ReactTestRenderer.act(async () => jest.advanceTimersByTime(2000));
  expect(client.get).not.toHaveBeenCalled();
  expect(AppNavigator).not.toHaveBeenCalled();

  await ReactTestRenderer.act(async () => finishRefresh('new-access'));
  expect(client.get).toHaveBeenCalledTimes(1);
  expect(store.getState().login.token).toBe('new-access');
  await ReactTestRenderer.act(async () => jest.advanceTimersByTime(1400));
  expect(AppNavigator).toHaveBeenCalledWith(expect.objectContaining({
    isUserLoggedIn: true, userType: 'job_seeker',
  }), undefined);
  expect(refreshAccessToken).toHaveBeenCalledTimes(1);
});

test('keeps navigation blocked on a temporary failure and allows retry', async () => {
  (refreshAccessToken as jest.Mock).mockRejectedValueOnce(new Error('Offline'))
    .mockResolvedValueOnce('new-access');
  await renderApp();
  expect(AppNavigator).not.toHaveBeenCalled();
  expect(multiRemove).not.toHaveBeenCalled();
  await ReactTestRenderer.act(async () => {
    renderer.root.findByType(Button).props.onPress();
  });
  await ReactTestRenderer.act(async () => jest.advanceTimersByTime(1400));
  expect(AppNavigator).toHaveBeenCalled();
  expect(refreshAccessToken).toHaveBeenCalledTimes(2);
});

test('clears a rejected session and opens login', async () => {
  (refreshAccessToken as jest.Mock).mockRejectedValue({ status: 400 });
  const store = await renderApp();
  await ReactTestRenderer.act(async () => jest.advanceTimersByTime(1400));
  expect(multiRemove).toHaveBeenCalledTimes(1);
  expect(store.getState().login.isAuthenticated).toBe(false);
  expect(client.get).not.toHaveBeenCalled();
  expect(AppNavigator).toHaveBeenCalledWith(expect.objectContaining({
    isUserLoggedIn: false, userType: null,
  }), undefined);
});
