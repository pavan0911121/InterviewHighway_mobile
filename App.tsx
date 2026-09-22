/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useCallback, useEffect, useState } from 'react';
import { StatusBar, View, ActivityIndicator, AppState, Text, Button, StyleSheet } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import SplashScreen from './src/screens/SplashScreen';
import { useSelector, useDispatch } from 'react-redux';
import * as AsyncStore from "./src/AsyncStore";
import { getUserRole, loginSuccess, clearUserData } from './src/Redux/slices/loginSlice';
import { refreshAccessToken } from './src/Networking/Client';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [storedRole, setStoredRole] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [startupError, setStartupError] = useState(false);
  const [startupAttempt, setStartupAttempt] = useState(0);
  const selector = useSelector((state: any) => state.login);
  const dispatch = useDispatch();
  const role = selector?.role || storedRole;
  const isLoggedIn = selector?.isAuthenticated;

  const loadStoredSession = useCallback(async () => {
    const [token, userData, userRole, isLogin] = await Promise.all([
      AsyncStore.getData(AsyncStore.Keys.USER_TOKEN),
      AsyncStore.getData(AsyncStore.Keys.USER_DATA),
      AsyncStore.getData(AsyncStore.Keys.ROLE),
      AsyncStore.getData(AsyncStore.Keys.IS_LOGIN),
    ]);
    if (token && isLogin === 'true') {
      const user = userData ? JSON.parse(userData) : null;
      setStoredRole(userRole ? JSON.parse(userRole) : null);
      dispatch(loginSuccess({ user, token, isAuthenticated: true }));
    } else {
      setStoredRole(null);
      dispatch(clearUserData());
    }
  }, [dispatch]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let mounted = true;
    setStartupError(false);

    const initializeSession = async () => {
      try {
        await refreshAccessToken();
      } catch (error: any) {
        if ([400, 401, 403].includes(error?.status)) {
          await AsyncStore.multiRemove([
            AsyncStore.Keys.USER_TOKEN, AsyncStore.Keys.REFRESH_TOKEN,
            AsyncStore.Keys.USER_DATA, AsyncStore.Keys.ROLE,
            AsyncStore.Keys.IS_LOGIN, AsyncStore.Keys.USER_ID,
            AsyncStore.Keys.IS_VERIFIED, AsyncStore.Keys.EMP_ID, AsyncStore.Keys.ORG_ID,
          ]);
        } else {
          throw error;
        }
      }
      if (!mounted) {
        return;
      }
      await loadStoredSession();
      if (!mounted) {
        return;
      }
      setAuthReady(true);
      timeout = setTimeout(() => setShowSplash(false), 1400);
    };

    initializeSession().catch(() => {
      if (mounted) {
        setStartupError(true);
      }
    });

    return () => {
      mounted = false;
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [dispatch, loadStoredSession, startupAttempt]);

  useEffect(() => {
    if (!authReady) {
      return;
    }
    const sub = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        loadStoredSession().catch(() => console.warn('Unable to restore stored session'));
      }
    });
    return () => sub.remove();
  }, [authReady, loadStoredSession]);

  useEffect(() => {
    if (authReady && selector?.isAuthenticated && selector?.user?.id && !role) {
      dispatch(getUserRole(selector.user.id) as any);
      console.log('Fetching user role for user:', selector?.user?.id);
    }
  }, [authReady, selector?.isAuthenticated, selector?.user?.id, role, dispatch]);

  useEffect(() => {
    if (!isLoggedIn) {
      setStoredRole(null);
    }
  }, [isLoggedIn]);

  if (startupError) {
    return (
      <View style={styles.centered}>
        <Text>Unable to connect. Please try again.</Text>
        <Button title="Retry" onPress={() => setStartupAttempt(attempt => attempt + 1)} />
      </View>
    );
  }

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
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <AppNavigator isUserLoggedIn={false} userType={null} />
      )}

    </>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default App;
