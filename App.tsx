/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import { StatusBar, View, ActivityIndicator, AppState, AppStateStatus } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import SplashScreen from './src/screens/SplashScreen';
import { useSelector, useDispatch } from 'react-redux';
import * as AsyncStore from "./src/AsyncStore";
import { getUserRole, loginSuccess, clearUserData, refreshToken } from './src/Redux/slices/loginSlice';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const selector = useSelector((state: any) => state.login);
  const dispatch = useDispatch();

  useEffect(() => {

    const isRunningTests = typeof process !== 'undefined' &&
      (process.env as NodeJS.ProcessEnv)?.JEST_WORKER_ID !== undefined;

    if (isRunningTests) {
      setShowSplash(false);
      return;
    }
    let timeout: NodeJS.Timeout;
    let mounted = true;

    const loadStorage = async () => {
      await LocalStorageaData();
      if (mounted) {
        timeout = setTimeout(() => {
          setShowSplash(false);
        }, 1400);
      }
    };

    loadStorage();

    const handleAppState = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        LocalStorageaData();
      }
    };

    const sub = AppState.addEventListener('change', handleAppState);

    return () => {
      mounted = false;
      if (timeout) {
        clearTimeout(timeout);
      }
      sub.remove();
    };
  }, []);

  useEffect(() => {
    if (selector?.errorCode) {
      if (selector.errorCode == 401) {
        handleRefreshToken();
      }
    }
     
  }, [selector?.errorCode]);

  const handleRefreshToken = async () => {
    const refreshTokenValue = await AsyncStore.getData(AsyncStore?.Keys?.REFRESH_TOKEN);
    const payload = {
      'refresh_token': refreshTokenValue
    }
    dispatch(refreshToken(payload) as any);

    handleUserRole(selector?.role);
  }

  useEffect(() => {
    LocalStorageaData();
  }, [selector?.isAuthenticated, selector?.userId, selector?.role]);

  useEffect(() => {
    setUserData(selector?.user ?? null);
    setRole(selector?.role ?? null);
  }, [selector?.user, selector?.role]);

  useEffect(() => {
    if (selector?.isAuthenticated && selector?.user && !selector?.role) {
      handleUserRole(selector?.user?.id);
    }
  }, [selector?.isAuthenticated, selector?.user, selector?.role, dispatch]);

  const handleUserRole = (userId: string | null) => {
    const response = dispatch(getUserRole(userId) as any);
  }

  const LocalStorageaData = async () => {
    try {
      const tokenValue = await AsyncStore.getData(AsyncStore?.Keys?.USER_TOKEN);
      const userLoggedInData = await AsyncStore.getData(AsyncStore?.Keys?.USER_DATA);
      const userRole = await AsyncStore.getData(AsyncStore?.Keys?.ROLE);
      const isLogin = await AsyncStore.getData(AsyncStore?.Keys?.IS_LOGIN);

      setToken(tokenValue ?? null);
      setIsLoggedIn(isLogin === 'true');

      // If token exists in storage but Redux isn't updated, dispatch loginSuccess
      if (tokenValue && !selector?.isAuthenticated) {
        try {
          const parsedUser = userLoggedInData ? JSON.parse(userLoggedInData) : null;
          dispatch((loginSuccess as any)({ user: parsedUser, token: tokenValue, isAuthenticated: true }));
        } catch (e) {
          dispatch((loginSuccess as any)({ user: null, token: tokenValue, isAuthenticated: true }));
        }
      }

      // If token removed from storage but Redux still thinks authenticated, clear Redux
      if (!tokenValue && selector?.isAuthenticated) {
        dispatch(clearUserData() as any);
      }

      if (userRole) {
        const parsedRole = JSON.parse(userRole);
        setRole(parsedRole);
      }
      if (userLoggedInData) {
        const parsedUserData = JSON.parse(userLoggedInData);
        setUserData(parsedUserData);
      }
    } catch (error) {
      console.warn('Error loading local storage auth data', error);
      setToken(null);
    }
  };



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
      {/* <StatusBar barStyle="dark-content" /> */}
      {isLoggedIn && role ? (
        <AppNavigator isUserLoggedIn={isLoggedIn} userType={role as any} />
      ) : isLoggedIn && !role ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <AppNavigator isUserLoggedIn={false} userType={null} />
      )}

    </>
  );
}

export default App;
