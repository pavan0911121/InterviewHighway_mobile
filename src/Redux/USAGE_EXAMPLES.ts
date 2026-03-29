// USAGE EXAMPLES FOR REDUX SETUP

// 1. In your App.tsx or main entry point, wrap your app with Redux Provider:
/*
import { Provider } from 'react-redux';
import { store } from './src/Redux/Store';

export default function App() {
  return (
    <Provider store={store}>
      <YourAppComponent />
    </Provider>
  );
}
*/

// 2. Using postDeviceInfo async thunk with token check from AsyncStorage:
/*
import { useAppDispatch, useAppSelector } from './src/Redux/hooks';
import { postDeviceInfo } from './src/Redux';
import DeviceInfo from 'react-native-device-info';

function DeviceInfoComponent() {
  const dispatch = useAppDispatch();
  const { isLoading, error, deviceInfoPosted } = useAppSelector((state) => state.auth);

  const handlePostDeviceInfo = async () => {
    const devicePayload = {
      deviceId: await DeviceInfo.getUniqueId(),
      deviceName: await DeviceInfo.getDeviceName(),
      osVersion: await DeviceInfo.getSystemVersion(),
      appVersion: await DeviceInfo.getVersion(),
      // Add other device info as needed
    };

    // This will automatically check if token exists in AsyncStorage
    // If no token: it will reject with 'NO_TOKEN' error and logout user
    // If token exists: it will add token to payload and make API call
    dispatch(postDeviceInfo(devicePayload));
  };

  return (
    <View>
      {isLoading && <Text>Posting device info...</Text>}
      {error && <Text style={{ color: 'red' }}>Error: {error}</Text>}
      {deviceInfoPosted && <Text style={{ color: 'green' }}>Device info posted!</Text>}
      <Button 
        title="Post Device Info" 
        onPress={handlePostDeviceInfo}
        disabled={isLoading}
      />
    </View>
  );
}
*/

// 3. Using Redux in a component (example):
/*
import { useAppDispatch, useAppSelector } from './src/Redux/hooks';
import { loginSuccess, logout } from './src/Redux';

function LoginComponent() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  
  const handleLogin = () => {
    dispatch(
      loginSuccess({
        user: {
          id: '1',
          email: 'user@example.com',
          name: 'John Doe',
          role: 'jobseeker',
        },
        token: 'your-token-here',
      })
    );
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <View>
      {isLoading && <Text>Loading...</Text>}
      {isAuthenticated ? (
        <View>
          <Text>Welcome, {user?.name}</Text>
          <Button title="Logout" onPress={handleLogout} />
        </View>
      ) : (
        <Button title="Login" onPress={handleLogin} />
      )}
    </View>
  );
}
*/

// 4. Using UI slice:
/*
import { useAppDispatch, useAppSelector } from './src/Redux/hooks';
import { toggleDarkMode, addNotification } from './src/Redux';
import { v4 as uuidv4 } from 'uuid'; // or use any ID generator

function UIComponent() {
  const dispatch = useAppDispatch();
  const { isDarkMode, notifications } = useAppSelector((state) => state.ui);

  const showNotification = () => {
    dispatch(
      addNotification({
        id: uuidv4(),
        message: 'Operation successful!',
        type: 'success',
      })
    );
  };

  return (
    <View>
      <Button title="Toggle Dark Mode" onPress={() => dispatch(toggleDarkMode())} />
      <Text>Dark Mode: {isDarkMode ? 'ON' : 'OFF'}</Text>
      <Button title="Show Notification" onPress={showNotification} />
      {notifications.map((notif) => (
        <Text key={notif.id}>{notif.message}</Text>
      ))}
    </View>
  );
}
*/

// 5. Handling postDeviceInfo in useEffect:
/*
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './src/Redux/hooks';
import { postDeviceInfo } from './src/Redux';

function AppInitializer() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, token, deviceInfoPosted } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Post device info when user is authenticated and hasn't posted yet
    if (isAuthenticated && token && !deviceInfoPosted) {
      dispatch(postDeviceInfo({ /* device data */ }));
    }
  }, [isAuthenticated, token, deviceInfoPosted, dispatch]);

  return null;
}
*/

