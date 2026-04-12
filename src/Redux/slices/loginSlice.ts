import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import client from '../../Networking/Client';
import { AUTH_ENDPOINTS, USER_ENDPOINTS } from '../../Networking/EndPoints';
import { getData } from '../../AsyncStore/asyncStorage';
import { USER_TOKEN } from '../../AsyncStore/keys';
import * as AsyncStore from "../../AsyncStore";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  isVerified?: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
  deviceInfoPosted: boolean;
  isVerified?: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  token: null,
  deviceInfoPosted: false,
  isVerified: false,
};
//Login API call
export const postUserData = createAsyncThunk(
  "login/postUserData",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await client.post(AUTH_ENDPOINTS.login, payload);
      return response.data || response;
    } catch (error: any) {
      console.log('Error posting user data:', error);
      return rejectWithValue({
        message: error?.message || 'Failed to post user data',
        code: error?.code || 'ERROR',
      });
    }
  }
);
//Role API call
export const getRole = createAsyncThunk(
  "login/getRole",
  async (userId: any, { rejectWithValue }) => {
    try {
      const response = await client.get(USER_ENDPOINTS.role(userId));
      return response.data || response;
    } catch (error: any) {
      console.error('Error fetching role data:', error);
      return rejectWithValue({
        message: error?.message || 'Failed to fetch role data',
        code: error?.code || 'ERROR',
      });
    }
  }
);
//Role API call
export const getVerifiedUser = createAsyncThunk(
  "login/getVerifiedUser",
  async (userId: any, { rejectWithValue }) => {
    try {
      const response = await client.get(USER_ENDPOINTS.isVerified(userId));
      return response.data || response;
    } catch (error: any) {
      console.error('Error fetching verified user data:', error);
      return rejectWithValue({
        message: error?.message || 'Failed to fetch verified user data',
        code: error?.code || 'ERROR',
      });
    }
  }
);
// USER_ENDPOINTS

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
        const dataObj = action.payload;
        
        // Extract token - check multiple possible field names
        const token = dataObj?.access_token || dataObj?.token;
        if (token) {
          state.token = token;
          state.isAuthenticated = true;
          AsyncStore.storeData(AsyncStore.Keys.USER_TOKEN, token);
          AsyncStore.storeData(AsyncStore.Keys.IS_LOGIN, "true");
        }
        
        // Extract user data - check multiple possible field names
        const user = dataObj?.user || dataObj?.data?.user;
        if (user) {
          state.user = user;
          AsyncStore.storeData(AsyncStore.Keys.USER_DATA, JSON.stringify(user));
        }
        
        // If we have a token, consider login successful
        if (token) {
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
      // getRole async thunk handlers
      .addCase(getRole.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        const roleData = action.payload?.[0]?.user_type;
        if (state.user) {
          state.user.role = roleData;
          AsyncStore.storeData(AsyncStore.Keys.ROLE, JSON.parse(roleData));
        }
      })
      .addCase(getRole.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as any)?.message || 'Failed to fetch role data';
      });
      // getVerifiedUser async thunk handlers
      builder
      .addCase(getVerifiedUser.pending, (state) => {
        state.error = null;
      })
      .addCase(getVerifiedUser.fulfilled, (state, action) => {
        state.error = null;
        const isVerified = action.payload?.[0]?.is_verified || false;
        const userId = action.payload?.[0]?.id || null;
        console.log(userId,"userId");
        if (userId) {
          AsyncStore.storeData(AsyncStore.Keys.IS_VERIFIED, JSON.stringify(isVerified));
          AsyncStore.storeData(AsyncStore.Keys.USER_ID, JSON.stringify(userId));
        }
      })
      .addCase(getVerifiedUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as any)?.message || 'Failed to fetch verified user data';
      });

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
