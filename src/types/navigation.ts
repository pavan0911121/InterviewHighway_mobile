export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

export type AppStackParamList = {
  Dashboard: undefined;
  Profile: undefined;
  Settings: undefined;
};

export type BottomTabParamList = {
  HomeTab: undefined;
  ProfileTab: undefined;
};

export type RootStackParamList = AuthStackParamList & AppStackParamList;