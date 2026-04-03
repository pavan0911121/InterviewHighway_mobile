/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import { StatusBar, View, ActivityIndicator } from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import SplashScreen from './src/screens/SplashScreen';
import { Provider, useSelector } from 'react-redux';
import { store } from './src/Redux';
import * as AsyncStore from "./src/AsyncStore";


function AppContent() {
  // const { isLoggedIn, isLoading: authLoading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const selector = useSelector((state:any) => state.login);
  
  console.log("Selector data in AppContent:", {
    token: selector?.token,
    user: selector?.user,
    isAuthenticated: selector?.isAuthenticated,
    isLoading: selector?.isLoading,
  });
  
  useEffect(() => {
    const isRunningTests = typeof process !== 'undefined' &&
      (process.env as NodeJS.ProcessEnv)?.JEST_WORKER_ID !== undefined;

    if (isRunningTests) {
      setShowSplash(false);
      return;
    }
    LocalStorageaData();
    // Show splash screen for 1.4 seconds
    const timeout = setTimeout(() => {
      setShowSplash(false);
    }, 1400);
    return () => clearTimeout(timeout);
  }, []);
  
  // Update login state when Redux state changes
  useEffect(() => {
    if (selector?.isAuthenticated && selector?.token) {
      setIsLoggedIn(true);
      if (selector?.user) {
        setUserData(selector?.user);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, [selector?.isAuthenticated, selector?.token, selector?.user]);
  const LocalStorageaData = async () => {
    try {
      const token = await AsyncStore.getData(AsyncStore?.Keys?.USER_TOKEN);
      const userLoggedInData = await AsyncStore.getData(AsyncStore?.Keys?.USER_DATA);

      if(token){
        setIsLoggedIn(true);
      }
      if(userLoggedInData){
        const parsedUserData = JSON.parse(userLoggedInData);
        setUserData(parsedUserData);
        console.log("User data retrieved from local storage:", parsedUserData);
      } else {
        console.log("No user data found in local storage.");
      }
    } catch (error) {
      console.log('Error retrieving user data from local storage:', error);
      return null;
    }
  }

  // Show splash screen while initializing
  if (showSplash) {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SplashScreen />
      </>
    );
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <AppNavigator isUserLoggedIn={isLoggedIn} userType="employer" />
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </SafeAreaProvider>
    </Provider>
  );
}

export default App;
