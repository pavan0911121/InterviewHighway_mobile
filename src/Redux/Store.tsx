import { configureStore } from '@reduxjs/toolkit';
import loginSlice from './slices/loginSlice';
import uiReducer from './slices/uiSlice';
import homeSlice from './slices/homeSlice';
import coursesSlice from './slices/coursesSlice';
import profileSlice from './slices/profileSlice';
import employerDashboardSlice from './slices/employerDashboardSlice';
import jobPostingsSlice from './slices/jobPostings';
import employerApplicationsSlice from './slices/employerApplicationsSlice';


export const store = configureStore({
  reducer: {
    login:loginSlice,
    home: homeSlice,
    courses:coursesSlice,
    profile:profileSlice,
    employerDashboard: employerDashboardSlice,
    jobPostings: jobPostingsSlice,
    employerApplications: employerApplicationsSlice,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware:any) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
