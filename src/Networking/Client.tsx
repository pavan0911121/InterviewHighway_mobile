import React from 'react';
import { Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { Keys, getData, storeData } from '../AsyncStore';
import { API_BASE_URL, RAILWAY_API_BASE_URL } from '../Networking/EndPoints';

let isNetworkDialogOpen = false;
let isTokenRefreshInProgress = false;

// Type definitions
interface HeadersConfig {
  [key: string]: string;
}

interface RequestConfig {
  method: string;
  headers: HeadersConfig;
  body?: string;
}

interface APIResponse {
  success: boolean;
  data?: any;
  status?: number;
}

interface APIError {
  type: string;
  status: number;
  message: string;
  body?: any;
}

/**
 * Main HTTP Client function for API calls
 * @param {string | null} authToken - Authorization token
 * @param {string} url - API endpoint URL
 * @param {string} methodType - HTTP method (GET, POST, PUT, DELETE)
 * @param {any} body - Request body
 * @param {object} customConfig - Custom headers configuration
 * @param {boolean} isValidate - Whether to validate token and refresh if needed
 */
export const client = async (
  authToken: string | null,
  url: string,
  methodType: string,
  body: any = null,
  customConfig: HeadersConfig = {},
  isValidate: boolean = true
): Promise<any> => {
  // Check network connectivity
  const netState = await NetInfo.fetch();
  
  if (netState.isConnected !== true) {
    if (!isNetworkDialogOpen) {
      isNetworkDialogOpen = true;
      Alert.alert('Network Error', 'Please check your internet connection', [
        {
          text: 'OK',
          onPress: () => {
            isNetworkDialogOpen = false;
          },
        },
      ]);
    }
    return Promise.reject('No internet connection');
  }

  // Check for 2G network
  if (netState.type === 'cellular' && netState.details?.cellularGeneration === '2g') {
    console.warn('Poor network detected - 2G connection');
  }

  const headers: HeadersConfig = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...customConfig,
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const config: RequestConfig = {
    method: methodType,
    headers,
  };

  if (body && (methodType === 'POST' || methodType === 'PUT')) {
    config.body = JSON.stringify(body);
  }

  try {
    let response = await fetch(url, config);

    // Handle 401 Unauthorized
    if (response.status === 401 && isValidate) {
      if (!isTokenRefreshInProgress) {
        isTokenRefreshInProgress = true;
        const refreshed = await refreshAccessToken();
        isTokenRefreshInProgress = false;

        if (refreshed) {
          // Retry the original request with new token
          const newToken = await getData(Keys.USER_TOKEN);
          if (newToken) {
            headers['Authorization'] = `Bearer ${newToken}`;
            config.headers = headers;
            response = await fetch(url, config);
          }
        } else {
          // Force logout if token refresh failed
          await handleLogout();
          return Promise.reject('Session expired. Please login again.');
        }
      }
    }

    // Handle 401 for login API (invalid credentials)
    if (response.status === 401 && !isValidate) {
      try {
        const errData = await response.clone().json();
        Alert.alert('Login Failed', errData.message || 'Invalid credentials', [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ]);
      } catch (e) {
        Alert.alert('Login Failed', 'Invalid credentials', [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ]);
      }
    }

    return response;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Something went wrong';
    console.error('API Error:', err, 'URL:', url);
    return Promise.reject(errorMessage);
  }
};

/**
 * Refresh access token using refresh token
 */
const refreshAccessToken = async (): Promise<boolean> => {
  try {
    const refreshToken = await getData(Keys.USER_TOKEN);

    if (!refreshToken) {
      return false;
    }

    const headers: HeadersConfig = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    const config: RequestConfig = {
      method: 'POST',
      headers,
      body: JSON.stringify({ refreshToken }),
    };

    const response = await fetch(`${API_BASE_URL}/auth/v1/refresh`, config);
    const responseData = await response.clone().json();

    if (response.status === 200) {
      // Store new tokens
      if (responseData.accessToken) {
        await storeData(Keys.USER_TOKEN, responseData.accessToken);
      }
      if (responseData.refreshToken) {
        await storeData(Keys.USER_TOKEN, responseData.refreshToken);
      }
      return true;
    } else {
      return false;
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Token refresh failed';
    console.error('Token Refresh Error:', errorMessage);
    return false;
  }
};

/**
 * Handle logout on token expiry
 */
const handleLogout = async (): Promise<void> => {
  try {
    // Clear all stored data
    // You can emit an event or navigate to login screen
    console.log('User logged out due to token expiry');
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Logout error';
    console.error('Logout Error:', errorMessage);
  }
};

/**
 * GET request
 */
client.get = async function (endpoint: string, customConfig: HeadersConfig = {}, isValidate: boolean = true): Promise<APIResponse> {
  const token = await getData(Keys.USER_TOKEN);
  const response = await client(token, endpoint, 'GET', null, customConfig, isValidate);
  return parseAPIResponse(response);
};

/**
 * POST request
 */
client.post = async function (endpoint: string, body: any, customConfig: HeadersConfig = {}, isValidate: boolean = true): Promise<APIResponse> {
  const token = await getData(Keys.USER_TOKEN);
  const response = await client(token, endpoint, 'POST', body, customConfig, isValidate);
  return parseAPIResponse(response);
};

/**
 * PUT request
 */
client.put = async function (endpoint: string, body: any, customConfig: HeadersConfig = {}, isValidate: boolean = true): Promise<APIResponse> {
  const token = await getData(Keys.USER_TOKEN);
  const response = await client(token, endpoint, 'PUT', body, customConfig, isValidate);
  return parseAPIResponse(response);
};

/**
 * DELETE request
 */
client.delete = async function (endpoint: string, body: any = null, customConfig: HeadersConfig = {}, isValidate: boolean = true): Promise<APIResponse> {
  const token = await getData(Keys.USER_TOKEN);
  const response = await client(token, endpoint, 'DELETE', body, customConfig, isValidate);
  return parseAPIResponse(response);
};

/**
 * Parse API response
 */
export const parseAPIResponse = async (response: Response): Promise<APIResponse> => {
  try {
    const responseText = await response.text();

    if (!responseText) {
      if (response.ok) {
        return { success: true, data: null };
      }
      throw {
        type: 'EmptyResponse',
        status: response.status,
        message: 'Empty response from server',
      };
    }

    const parsedJSON = JSON.parse(responseText);

    if (response.ok) {
      return { success: true, data: parsedJSON, status: response.status };
    }

    if (response.status >= 500) {
      throw {
        type: 'ServerError',
        status: response.status,
        message: 'Server error occurred',
        body: parsedJSON,
      };
    }

    if (response.status >= 400) {
      throw {
        type: 'ApplicationError',
        status: response.status,
        message: parsedJSON.message || 'Request failed',
        body: parsedJSON,
      };
    }

    return { success: false, data: parsedJSON, status: response.status };
  } catch (err) {
    if (err instanceof Error && 'type' in err) {
      return Promise.reject(err);
    }

    const errorBody = err instanceof Error ? err.message : String(err);

    return Promise.reject({
      type: 'InvalidJSON',
      status: response.status,
      message: 'Invalid JSON response',
      body: errorBody,
    });
  }
};

export default client;
