
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthStackParamList, AppStackParamList, BottomTabParamList } from '../types/navigation';

// Import screens
import {
  // ProfileScreen,
  // SettingsScreen,
  HomeTabScreen,
  ProfileTabScreen,
  LoginScreen,
  CoursesTabScreen,
  MyApplicationsTabScreen
} from '../screens';
import PaymentsTabScreen from '../screens/Payments/PaymentsTabScreen';
import AccountSelectionPage from '../screens/Auth/AccountSelectionPage';
import Signup from '../screens/Auth/Signup';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeTabScreen}
        options={{
          title: 'Home',
        }}
      />
      <Tab.Screen
        name="CoursesTab"
        component={CoursesTabScreen}
        options={{
          title: 'Courses',
        }}
      />
      <Tab.Screen
        name="MyApplicationsTab"
        component={MyApplicationsTabScreen}
        options={{
          title: 'My Applications',
        }}
      />
      <Tab.Screen
        name="PaymentsTab"
        component={PaymentsTabScreen}
        options={{
          title: 'Payments',
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileTabScreen}
        options={{
          title: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}

function AuthNavigator() {
  return (
    <AuthStack.Navigator
    initialRouteName='Login'
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen
        name="Login"
        component={LoginScreen}
      />
      <AuthStack.Screen
        name="AccountTypeSelection"
        component={AccountSelectionPage}
      />
      <AuthStack.Screen
        name="Signup"
        component={Signup}
      />

    </AuthStack.Navigator>
  );
}

function AppNavigatorStack() {
  return (
    <AppStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <AppStack.Screen
        name="Dashboard"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      {/* <AppStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
      <AppStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      /> */}
    </AppStack.Navigator>
  );
}

interface AppNavigatorProps {
  isUserLoggedIn: boolean;
}

function RootNavigator({ isUserLoggedIn }: AppNavigatorProps) {
  return (
    <NavigationContainer>
      {isUserLoggedIn ? <AppNavigatorStack /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

export default RootNavigator;