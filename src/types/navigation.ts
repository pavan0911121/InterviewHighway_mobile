export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  AccountTypeSelection: undefined;
};

export type AppStackParamList = {
  Dashboard: undefined;
  Profile: undefined;
  Settings: undefined;
};

export type BottomTabParamList = {
  HomeTab: undefined;
  CoursesTab: undefined;
  MyApplicationsTab: undefined;
  PaymentsTab: undefined;
  ProfileTab: undefined;
};

export type RootStackParamList = AuthStackParamList & AppStackParamList;