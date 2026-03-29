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
import { Provider } from 'react-redux';
import { store } from './src/Redux';

function AppContent() {
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const isRunningTests = typeof process !== 'undefined' &&
      (process.env as NodeJS.ProcessEnv)?.JEST_WORKER_ID !== undefined;

    if (isRunningTests) {
      setShowSplash(false);
      return;
    }

    // Show splash screen for 1.4 seconds
    const timeout = setTimeout(() => {
      setShowSplash(false);
    }, 1400);

    return () => clearTimeout(timeout);
  }, []);

  // Show splash screen while initializing
  if (showSplash || authLoading) {
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
      <AppNavigator isUserLoggedIn={false} userType="employer" />
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
