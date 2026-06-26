
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { AuthStackParamList, AppStackParamList, JobSeekerBottomTabParamList, EmployerBottomTabParamList, StackIdentifiersParamList } from '../types/navigation';
import { Home, BookOpen, Briefcase, CreditCard, User, BarChart3, TrendingUp, Building, Inbox } from 'lucide-react-native';

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
import Login from '../screens/Auth/LoginScreen';
import PaymentsTabScreen from '../screens/JobSeekerApp/Payments/PaymentsTabScreen';
import AccountSelectionPage from '../screens/Auth/AccountSelectionPage';
import SideMenu from '../components/SideMenu';
import CourseDetails from '../screens/JobSeekerApp/Courses/CourseDetails';
import PaymentStatusScreen from '../screens/JobSeekerApp/Courses/PaymentStatusScreen';
import { ActivityIndicator } from 'react-native';
import Lesson from '../screens/JobSeekerApp/Courses/Lesson';
import LessonDetails from '../screens/JobSeekerApp/Courses/LessonDetails';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();
const JobSeekerTab = createBottomTabNavigator<JobSeekerBottomTabParamList>();
const EmployerTab = createBottomTabNavigator<EmployerBottomTabParamList>();
const JobSeekerDrawer = createDrawerNavigator();
const EmployerDrawer = createDrawerNavigator();
const Stack = createNativeStackNavigator<StackIdentifiersParamList>();



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
          tabBarIcon: ({ color, size }) => (
            <Home color={color} size={size} />
          ),
        }}
      />
      <JobSeekerTab.Screen
        name="CoursesTab"
        component={CoursesTabScreen}
        options={{
          title: 'Courses',
          tabBarIcon: ({ color, size }) => (
            <BookOpen color={color} size={size} />
          ),
        }}
      />
      {/* <JobSeekerTab.Screen
        name="MyApplicationsTab"
        component={MyApplicationsTabScreen}
        options={{
          title: 'My Applications',
          tabBarIcon: ({ color, size }) => (
            <Briefcase color={color} size={size} />
          ),
        }}
      /> */}
      <JobSeekerTab.Screen
        name="PaymentsTab"
        component={PaymentsTabScreen}
        options={{
          title: 'Payments',
          tabBarIcon: ({ color, size }) => (
            <CreditCard color={color} size={size} />
          ),
        }}
      />
      <JobSeekerTab.Screen
        name="ProfileTab"
        component={ProfileTabScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <User color={color} size={size} />
          ),
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
      {/* Other Stack screens */}
      <Stack.Screen
       name="CourseDetails"
       component={CourseDetails}
     />
     <Stack.Screen
       name="PaymentStatusScreen"
       component={PaymentStatusScreen}
     />
      <Stack.Screen
        name="Lesson"
        component={Lesson}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="LessonDetails"
        component={LessonDetails}
        options={{ animation: 'slide_from_right' }}
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
          tabBarIcon: ({ color, size }) => (
            <BarChart3 color={color} size={size} />
          ),
        }}
      />
      <EmployerTab.Screen
        name="EmployerJobsTab"
        component={JobsScreen}
        options={{
          title: 'Jobs',
          tabBarIcon: ({ color, size }) => (
            <Briefcase color={color} size={size} />
          ),
        }}
      />
      <EmployerTab.Screen
        name="EmployerApplicationsTab"
        component={ApplicationsScreen}
        options={{
          title: 'Applications',
          tabBarIcon: ({ color, size }) => (
            <Inbox color={color} size={size} />
          ),
        }}
      />
      <EmployerTab.Screen
        name="EmployerAnalyticsTab"
        component={AnalyticsScreen}
        options={{
          title: 'Analytics',
          tabBarIcon: ({ color, size }) => (
            <TrendingUp color={color} size={size} />
          ),
        }}
      />
      <EmployerTab.Screen
        name="EmployerCreditsTab"
        component={CreditsScreen}
        options={{
          title: 'Credits',
          tabBarIcon: ({ color, size }) => (
            <CreditCard color={color} size={size} />
          ),
        }}
      />
      <EmployerTab.Screen
        name="EmployerProfileTab"
        component={CompanyProfileScreen}
        options={{
          title: 'Company Profile',
          tabBarIcon: ({ color, size }) => (
            <Building color={color} size={size} />
          ),
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
  userType?: 'job_seeker' | 'employer' | null;
}

function RootNavigator({ isUserLoggedIn, userType }: AppNavigatorProps) {
  let content = <ActivityIndicator size="large" color="#007AFF" />;
  if (isUserLoggedIn && userType === 'job_seeker') {
    content = <JobSeekerAppNavigator />;
  } else if (isUserLoggedIn && userType === 'employer') {
    content = <EmployerAppNavigator />;
  }else  {
    content = <AuthNavigator />;
  }

  return (
    <NavigationContainer key={`${isUserLoggedIn}-${userType}`}>
      {content}
    </NavigationContainer>
  );
}

export default RootNavigator;