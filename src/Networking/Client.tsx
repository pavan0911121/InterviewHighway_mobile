import React from 'react';
import { Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { Keys, getData, storeData } from '../AsyncStore';
import { API_BASE_URL, RAILWAY_API_BASE_URL } from '../Networking/EndPoints';

let isNetworkDialogOpen = false;
let isTokenRefreshInProgress = false;
let tokenRefreshPromise: Promise<boolean> | null = null;

// Type definitions
interface HeadersConfig {
  [key: string]: string;
}

// interface TokenResponse {
//   access_token: string;
//   refresh_token: string;
//   expires_in: number;
//   token_type: string;
// }

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
  // const netState = await NetInfo.fetch();
  
  // if (netState.isConnected !== true) {
  //   if (!isNetworkDialogOpen) {
  //     isNetworkDialogOpen = true;
  //     Alert.alert('Network Error', 'Please check your internet connection', [
  //       {
  //         text: 'OK',
  //         onPress: () => {
  //           isNetworkDialogOpen = false;
  //         },
  //       },
  //     ]);
  //   }
  //   return Promise.reject('No internet connection');
  // }

  // // Check for 2G network
  // if (netState.type === 'cellular' && netState.details?.cellularGeneration === '2g') {
  //   console.warn('Poor network detected - 2G connection');
  // }

  const headers: HeadersConfig = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'apikey': 'sb_publishable_tY1AthKjAKBTZP0TxJ1KfQ_PCL8VdIk',
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

    // Handle 401 Unauthorized - Token expired
    // if (response.status === 401 && isValidate) {
    //   console.warn('🔄 Token expired (401 Unauthorized), attempting to refresh...');
      
    //   // Use existing refresh promise if already in progress
    //   if (!tokenRefreshPromise) {
    //     tokenRefreshPromise = refreshAccessToken();
    //   }
      
    //   const refreshed = await tokenRefreshPromise;
    //   tokenRefreshPromise = null;

    //   if (refreshed) {
    //     // Retry the original request with new token
    //     const newToken = await getData(Keys.USER_TOKEN);
    //     if (newToken) {
    //       console.log('✓ Token refreshed successfully, retrying original request...');
    //       headers['Authorization'] = `Bearer ${newToken}`;
    //       config.headers = headers;
    //       response = await fetch(url, config);
          
    //       // Check if retry was successful
    //       if (response.ok) {
    //         console.log('✓ Retried request successful after token refresh');
    //         return response;
    //       }
    //     }
    //   } else {
    //     // Force logout if token refresh failed
    //     console.error('✗ Token refresh failed, logging out...');
    //     await handleLogout();
    //     return Promise.reject('Session expired. Please login again.');
    //   }
    // }

    // Handle 401 for login API (invalid credentials) - only show alert for login endpoints
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
 * Uses Supabase auth refresh endpoint to obtain a new access token
 * Endpoint: POST ${API_BASE_URL}/auth/v1/token?grant_type=refresh_token
 * Request body: { refresh_token: 'token_value' }
 */
// const refreshAccessToken = async (): Promise<boolean> => {
//   try {
//     // Get the refresh token from storage
//     const refreshToken = await getData(Keys.REFRESH_TOKEN);

//     if (!refreshToken) {
//       console.error('❌ No refresh token available for token refresh');
//       return false;
//     }

//     const headers: HeadersConfig = {
//       'accept': '*/*',
//       'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
//       'Content-Type': 'application/json',
//       'apikey': 'sb_publishable_tY1AthKjAKBTZP0TxJ1KfQ_PCL8VdIk',
//       'origin': 'https://interviewhighway.com',
//       'x-client-info': 'supabase-ssr/0.6.1 createBrowserClient',
//       'x-supabase-api-version': '2024-01-01',
//     };

//     const config: RequestConfig = {
//       method: 'POST',
//       headers,
//       // Only send refresh_token in body, grant_type is in URL
//       body: JSON.stringify({ 
//         refresh_token: refreshToken 
//       }),
//     };

//     console.log('🔄 Initiating token refresh with refresh token...');
//     const response = await fetch(`${API_BASE_URL}/auth/v1/token?grant_type=refresh_token`, config);
    
//     console.log(`📡 Token refresh API response status: ${response.status}`);
    
//     if (!response.ok) {
//       console.error(`❌ Token refresh failed with status ${response.status}`);
//       const errorBody = await response.text();
//       console.error('Token refresh error details:', errorBody);
//       return false;
//     }

//     const responseData = await response.json();
//     console.log('📦 Token refresh response received:', { 
//       has_access_token: !!responseData.access_token, 
//       has_refresh_token: !!responseData.refresh_token,
//       expires_in: responseData.expires_in 
//     });

//     // Validate response contains required tokens
//     if (!responseData.access_token) {
//       console.error('❌ Token refresh response missing access_token');
//       console.error('Response data:', responseData);
//       return false;
//     }

//     // Store new access token immediately
//     await storeData(Keys.USER_TOKEN, responseData.access_token);
//     console.log('✅ Access token refreshed and stored successfully');
    
//     // Store new refresh token if provided
//     if (responseData.refresh_token) {
//       await storeData(Keys.REFRESH_TOKEN, responseData.refresh_token);
//       console.log('✅ Refresh token updated and stored');
//     }
    
//     // Log additional info if available
//     if (responseData.expires_in) {
//       console.log(`⏱️ Token expires in ${responseData.expires_in} seconds`);
//     }
    
//     console.log('✅ Token refresh completed successfully');
//     return true;
//   } catch (err) {
//     const errorMessage = err instanceof Error ? err.message : 'Token refresh failed';
//     console.error('❌ Token Refresh Error:', errorMessage);
//     console.error('Stack trace:', err instanceof Error ? err.stack : 'No stack trace');
//     return false;
//   }
// };

/**
 * Handle logout on token expiry
 * Clears all authentication data from async storage
 */
// const handleLogout = async (): Promise<void> => {
//   try {
//     // Clear authentication tokens from storage
//     await storeData(Keys.USER_TOKEN, '');
//     await storeData(Keys.REFRESH_TOKEN, '');
//     await storeData(Keys.IS_LOGIN, 'false');
//     await storeData(Keys.ROLE, '');
//     await storeData(Keys.USER_ID, '');
    
//     console.log('✓ User logged out - all authentication data cleared');
    
//     // TODO: Emit logout event or navigate to login screen
//     // You can use Redux dispatch, context, or event emitter here
//     // Example: dispatch(logout());
//   } catch (err) {
//     const errorMessage = err instanceof Error ? err.message : 'Logout error';
//     console.error('Logout Error:', errorMessage);
//   }
// };

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
  // const response = await client(token, endpoint, 'POST', body, customConfig, isValidate);
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
 * Parse API response and convert to standardized format
 * Handles both successful and error responses
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
      //console.log(`✓ API Response successful [${response.status}]`);
      return { success: true, data: parsedJSON, status: response.status };
    }

    // Handle server errors (5xx)
    if (response.status >= 500) {
      console.error(`✗ Server Error [${response.status}]:`, parsedJSON);
      throw {
        type: 'ServerError',
        status: response.status,
        message: 'Server error occurred',
        body: parsedJSON,
      };
    }

    // Handle client errors (4xx)
    if (response.status >= 400) {
      console.error(`✗ Application Error [${response.status}]:`, parsedJSON);
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
    console.error('JSON Parse Error:232', errorBody);
    return Promise.reject({
      type: 'InvalidJSON',
      status: response.status,
      message: (err as any)?.body?.msg || 'Failed to parse response',
      body: errorBody,
    });
  }
};

export default client;
