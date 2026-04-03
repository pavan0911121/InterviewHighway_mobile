
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { AuthStackParamList, AppStackParamList, JobSeekerBottomTabParamList, EmployerBottomTabParamList } from '../types/navigation';

// Import screens
import {
  HomeTabScreen,
  ProfileTabScreen,
  LoginScreen,
  EmployerSignup,
  JobSeekerSignup,
  CoursesTabScreen,
  MyApplicationsTabScreen,
  EmployerDashboard,
  AnalyticsScreen,
  JobsScreen,
  ApplicationsScreen,
  CreditsScreen,
  CompanyProfileScreen
} from '../screens';
import PaymentsTabScreen from '../screens/JobSeekerApp/Payments/PaymentsTabScreen';
import AccountSelectionPage from '../screens/Auth/AccountSelectionPage';
import SideMenu from '../components/SideMenu';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();
const JobSeekerTab = createBottomTabNavigator<JobSeekerBottomTabParamList>();
const EmployerTab = createBottomTabNavigator<EmployerBottomTabParamList>();
const JobSeekerDrawer = createDrawerNavigator();
const EmployerDrawer = createDrawerNavigator();

function JobSeekerBottomTabNavigator() {
  return (
    <JobSeekerTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        headerShown: false,
      }}
    >
      <JobSeekerTab.Screen
        name="HomeTab"
        component={HomeTabScreen}
        options={{
          title: 'Home',
        }}
      />
      <JobSeekerTab.Screen
        name="CoursesTab"
        component={CoursesTabScreen}
        options={{
          title: 'Courses',
        }}
      />
      <JobSeekerTab.Screen
        name="MyApplicationsTab"
        component={MyApplicationsTabScreen}
        options={{
          title: 'My Applications',
        }}
      />
      <JobSeekerTab.Screen
        name="PaymentsTab"
        component={PaymentsTabScreen}
        options={{
          title: 'Payments',
        }}
      />
      <JobSeekerTab.Screen
        name="ProfileTab"
        component={ProfileTabScreen}
        options={{
          title: 'Profile',
        }}
      />
    </JobSeekerTab.Navigator>
  );
}

function JobSeekerDrawerNavigator() {
  return (
    <JobSeekerDrawer.Navigator
      drawerContent={(props) => <SideMenu {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'slide',
      }}
    >
      <JobSeekerDrawer.Screen
        name="JobSeekerTabs"
        component={JobSeekerBottomTabNavigator}
      />
    </JobSeekerDrawer.Navigator>
  );
}

function EmployerBottomTabNavigator() {
  return (
    <EmployerTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#165DFC',
        tabBarInactiveTintColor: '#8E8E93',
        headerShown: false,
      }}
    >
      <EmployerTab.Screen
        name="EmployerDashboardTab"
        component={EmployerDashboard}
        options={{
          title: 'Dashboard',
        }}
      />
      <EmployerTab.Screen
        name="EmployerJobsTab"
        component={JobsScreen}
        options={{
          title: 'Jobs',
        }}
      />
      <EmployerTab.Screen
        name="EmployerApplicationsTab"
        component={ApplicationsScreen}
        options={{
          title: 'Applications',
        }}
      />
      <EmployerTab.Screen
        name="EmployerAnalyticsTab"
        component={AnalyticsScreen}
        options={{
          title: 'Analytics',
        }}
      />
      <EmployerTab.Screen
        name="EmployerCreditsTab"
        component={CreditsScreen}
        options={{
          title: 'Credits',
        }}
      />
      <EmployerTab.Screen
        name="EmployerProfileTab"
        component={CompanyProfileScreen}
        options={{
          title: 'Company Profile',
        }}
      />
    </EmployerTab.Navigator>
  );
}

function EmployerDrawerNavigator() {
  return (
    <EmployerDrawer.Navigator
      drawerContent={(props) => <SideMenu {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'slide',
      }}
    >
      <EmployerDrawer.Screen
        name="EmployerTabs"
        component={EmployerBottomTabNavigator}
      />
    </EmployerDrawer.Navigator>
  );
}

function AuthNavigator() {
  return (
    <AuthStack.Navigator
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
        name="JobSeekerSignup"
        component={JobSeekerSignup}
      />
      <AuthStack.Screen
        name="EmployerSignup"
        component={EmployerSignup}
      />

    </AuthStack.Navigator>
  );
}

function JobSeekerAppNavigator() {
  return <JobSeekerDrawerNavigator />;
}

function EmployerAppNavigator() {
  return <EmployerDrawerNavigator />;
}

interface AppNavigatorProps {
  isUserLoggedIn: boolean;
  userType?: 'jobseeker' | 'employer';
}

function RootNavigator({ isUserLoggedIn, userType }: AppNavigatorProps) {
  return (
    <NavigationContainer>
      {isUserLoggedIn ? (
        userType === 'jobseeker' ? (
          <EmployerAppNavigator />
        ) : (
          <JobSeekerAppNavigator />
        )
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}

export default RootNavigator;