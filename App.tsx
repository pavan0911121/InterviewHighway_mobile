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
import { Provider, useSelector, useDispatch } from 'react-redux';
import { store } from './src/Redux';
import * as AsyncStore from "./src/AsyncStore";
import { getUserRole } from './src/Redux/slices/loginSlice';


function AppContent() {
  // const { isLoggedIn, isLoading: authLoading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [userData, setUserData] = useState(null);
  const selector = useSelector((state:any) => state.login);
  const dispatch = useDispatch();
  
  
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
  }, [role]);
  
  // Update login state when Redux state changes
  useEffect(() => {
    if (selector?.isAuthenticated && selector?.token) {
      setIsLoggedIn(true);
      if (selector?.user) {
        setUserData(selector?.user);
      }
      // Get role from Redux state if available
      if (selector?.role) {
        setRole(selector?.role);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, [selector?.isAuthenticated, selector?.token, selector?.user, selector?.role]);

  // Fetch role immediately after login if user exists but role doesn't
  useEffect(() => {
    if (selector?.isAuthenticated && selector?.user && !selector?.role) {
      console.log("Fetching user role for user:", selector?.user?.id);
      dispatch(getUserRole(selector?.user?.id)as any);
    }
  }, [selector?.isAuthenticated, selector?.user, selector?.role, dispatch]);
  const LocalStorageaData = async () => {
    try {
      const token = await AsyncStore.getData(AsyncStore?.Keys?.USER_TOKEN);
      const userLoggedInData = await AsyncStore.getData(AsyncStore?.Keys?.USER_DATA);
      const userRole = await AsyncStore.getData(AsyncStore?.Keys?.ROLE);
      
      if(token){
        setIsLoggedIn(true);
      }
      if(userRole){
        console.log("User role found in local storage:", userRole);
        // Parse the stringified role
        const parsedRole = JSON.parse(userRole);
        setRole(parsedRole);
      }
      if(userLoggedInData){
        const parsedUserData = JSON.parse(userLoggedInData);
        setUserData(parsedUserData);
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
      {isLoggedIn && role ? (
        <AppNavigator isUserLoggedIn={isLoggedIn} userType={role as any} />
      ) : isLoggedIn && !role ? (
        // Show loading while fetching role
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <AppNavigator isUserLoggedIn={false} userType={null} />
      )}
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
