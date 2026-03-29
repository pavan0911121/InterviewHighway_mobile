import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/loginSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    login: authReducer,
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
