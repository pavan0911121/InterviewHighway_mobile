export type AuthStackParamList = {
  Login: undefined;
  JobSeekerSignup: undefined;
  EmployerSignup: undefined;
  AccountTypeSelection: undefined;
};

export type AppStackParamList = {
  JobSeekerTabNavigator: undefined;
  EmployerHomeTabNavigator: undefined;
};

export type JobSeekerBottomTabParamList = {
  HomeTab: undefined;
  CoursesTab: undefined;
  MyApplicationsTab: undefined;
  PaymentsTab: undefined;
  ProfileTab: undefined;
};
export type EmployerBottomTabParamList = {
  EmployerDashboardTab: undefined;
  EmployerJobsTab: undefined;
  EmployerApplicationsTab: undefined;
  EmployerAnalyticsTab: undefined;
  EmployerCreditsTab: undefined;
  EmployerProfileTab: undefined;
};

export type RootStackParamList = AuthStackParamList & AppStackParamList;