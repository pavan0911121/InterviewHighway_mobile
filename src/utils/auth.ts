// import AsyncStorage from '@react-native-async-storage/async-storage';

// const AUTH_TOKEN_KEY = 'authToken';
// const USER_DATA_KEY = 'userData';

// export const authUtils = {
//   /**
//    * Save authentication token
//    */
//   async saveToken(token: string): Promise<void> {
//     try {
//       await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
//     } catch (error) {
//       console.error('Error saving auth token:', error);
//       throw error;
//     }
//   },

//   /**
//    * Get authentication token
//    */
//   async getToken(): Promise<string | null> {
//     try {
//       const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
//       return token;
//     } catch (error) {
//       console.error('Error retrieving auth token:', error);
//       return null;
//     }
//   },

//   /**
//    * Check if user is authenticated
//    */
//   async isAuthenticated(): Promise<boolean> {
//     try {
//       const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
//       return !!token;
//     } catch (error) {
//       console.error('Error checking authentication:', error);
//       return false;
//     }
//   },

//   /**
//    * Save user data
//    */
//   async saveUserData(userData: any): Promise<void> {
//     try {
//       await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
//     } catch (error) {
//       console.error('Error saving user data:', error);
//       throw error;
//     }
//   },

//   /**
//    * Get user data
//    */
//   async getUserData(): Promise<any> {
//     try {
//       const userData = await AsyncStorage.getItem(USER_DATA_KEY);
//       return userData ? JSON.parse(userData) : null;
//     } catch (error) {
//       console.error('Error retrieving user data:', error);
//       return null;
//     }
//   },

//   /**
//    * Logout user - remove token and user data
//    */
//   async logout(): Promise<void> {
//     try {
//       await Promise.all([
//         AsyncStorage.removeItem(AUTH_TOKEN_KEY),
//         AsyncStorage.removeItem(USER_DATA_KEY),
//       ]);
//     } catch (error) {
//       console.error('Error during logout:', error);
//       throw error;
//     }
//   },

//   /**
//    * Clear all auth data
//    */
//   async clearAll(): Promise<void> {
//     try {
//       await AsyncStorage.clear();
//     } catch (error) {
//       console.error('Error clearing all data:', error);
//       throw error;
//     }
//   },
// };
