import { configureStore } from '@reduxjs/toolkit';
import loginSlice from './slices/loginSlice';
import uiReducer from './slices/uiSlice';
import homeSlice from './slices/homeSlice';
import coursesSlice from './slices/coursesSlice';

export const store = configureStore({
  reducer: {
    login:loginSlice,
    home: homeSlice,
    courses:coursesSlice,
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
