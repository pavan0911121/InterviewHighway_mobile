import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import client from '../../Networking/Client';
import { AUTH_ENDPOINTS } from '../../Networking/EndPoints';
import { getData } from '../../AsyncStore/asyncStorage';
import { USER_TOKEN } from '../../AsyncStore/keys';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'jobseeker' | 'employer';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
  deviceInfoPosted: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  token: null,
  deviceInfoPosted: false,
};

export const postUserData = createAsyncThunk(
  "login/postUserData",
  async (payload: any, { rejectWithValue }) => {
    try {
      // Check if token exists in AsyncStorage
    //   const token = await getData(USER_TOKEN);
      
    //   if (!token) {
    //     return rejectWithValue({
    //       message: 'No authentication token found. Please login first.',
    //       code: 'NO_TOKEN',
    //     });
    //   }

    //   // Add token to the payload or headers if needed
    //   const dataWithToken = {
    //     ...payload,
    //     token,
    //   };
    console.log("hello");
    
  console.log(AUTH_ENDPOINTS.login, payload, "api data");

      const response = await client.post(AUTH_ENDPOINTS.login, payload);
      console.log(response, "response from postUserData");
      
      return response.data || response;
    } catch (error: any) {
      console.error('Error posting user data:', error);
      return rejectWithValue({
        message: error?.message || 'Failed to post user data',
        code: error?.code || 'ERROR',
      });
    }
  }
);

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      state.error = null;
    },
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // postUserData async thunk handlers
      .addCase(postUserData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(postUserData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.deviceInfoPosted = true;
        state.error = null;
        
        // Update user and token if provided in response
        if (action.payload?.user) {
          state.user = action.payload.user;
        }
        if (action.payload?.token) {
          state.token = action.payload.token;
          state.isAuthenticated = true;
        }
      })
      .addCase(postUserData.rejected, (state, action) => {
        state.isLoading = false;
        state.deviceInfoPosted = false;
        state.error = (action.payload as any)?.message || 'Failed to post user data';
        
        // If no token error, logout the user
        if ((action.payload as any)?.code === 'NO_TOKEN') {
          state.isAuthenticated = false;
          state.token = null;
          state.user = null;
        }
      })
  }
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateUserProfile,
  clearError,
} = loginSlice.actions;

export default loginSlice.reducer;
