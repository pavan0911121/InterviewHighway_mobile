import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import client from '../../Networking/Client';
import { AUTH_ENDPOINTS, USER_ENDPOINTS } from '../../Networking/EndPoints';
import { getData } from '../../AsyncStore/asyncStorage';
import { USER_TOKEN } from '../../AsyncStore/keys';
import * as AsyncStore from "../../AsyncStore";
import { clear } from 'node:console';

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
  role?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  mobileNumber?: string | null;
  experienceLevel?: string | null;
  currentRole?: string | null;
  preferredLocation?: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  token: null,
  deviceInfoPosted: false,
  isVerified: false,
  role: null,
  firstName: null,
  lastName: null,
  email: null,
  mobileNumber: null,
  experienceLevel: null,
  currentRole: null,
  preferredLocation: null,

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
//Verified User API call
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
//USER Role API call
export const getUserRole = createAsyncThunk(
  "login/getUserRole",
  async (userId: any, { rejectWithValue }) => {
    try {
      const response = await client.get(USER_ENDPOINTS.role(userId));
      return response.data || response;
    } catch (error: any) {
      console.error('Error fetching user role data:', error);
      return rejectWithValue({
        message: error?.message || 'Failed to fetch user role data',
        code: error?.code || 'ERROR',
      });
    }
  }
);
//Check email API call
export const checkEmail = createAsyncThunk(
  "login/checkEmail",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await client.post(AUTH_ENDPOINTS.checkEmail, { email });
      return response.data || response;
    } catch (error: any) {
      console.error('Error checking email:', error);
      return rejectWithValue({
        message: error?.message || 'Failed to check email',
        code: error?.code || 'ERROR',
      });
    }
  }
);
//Register Job Seeker Api
export const registerJobSeeker = createAsyncThunk(
  "login/registerJobSeeker",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await client.post(AUTH_ENDPOINTS.signup, payload);
      return response.data || response;
    } catch (error: any) {
      console.error('Error registering job seeker:', error);
      return rejectWithValue({
        message: error?.message || 'Failed to register job seeker',
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
    updateUserData: (state, action: PayloadAction<{ firstName?: string; lastName?: string; email?: string; mobileNumber?: string }>) => {
      state.firstName = action.payload.firstName || null;
      state.lastName = action.payload.lastName || null;
      state.email = action.payload.email || null;
      state.mobileNumber = action.payload.mobileNumber || null;
    },
    updateExperience: (state, action: PayloadAction<{ experienceLevel?: string; currentRole?: string; preferredLocation?: string }>) => {
      state.experienceLevel = action.payload.experienceLevel || null;
      state.currentRole = action.payload.currentRole || null;
      state.preferredLocation = action.payload.preferredLocation || null;
    },
    clearUserData: (state) => {
      state.firstName = null;
      state.lastName = null;
      state.email = null;
      state.mobileNumber = null;
      state.experienceLevel = null;
      state.currentRole = null;
      state.preferredLocation = null;
      state.role = null;
      state.isVerified = false;
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.deviceInfoPosted = false;
      state.isLoading = false;
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
          AsyncStore.storeData(AsyncStore.Keys.ROLE, JSON.stringify(roleData));
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

        if (userId) {
          AsyncStore.storeData(AsyncStore.Keys.IS_VERIFIED, JSON.stringify(isVerified));
          AsyncStore.storeData(AsyncStore.Keys.USER_ID, JSON.stringify(userId));
        }
      })
      .addCase(getVerifiedUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as any)?.message || 'Failed to fetch verified user data';
      });
    // getUserRole async thunk handlers
    builder
      .addCase(getUserRole.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;

        const roleData = action.payload?.[0]?.user_type;
        if (roleData) {
          state.role = roleData;
          AsyncStore.storeData(AsyncStore.Keys.ROLE, JSON.stringify(roleData));
        }
      })
      .addCase(getUserRole.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as any)?.message || 'Failed to fetch user role data';
      });
    // checkEmail async thunk handlers
    builder
      .addCase(checkEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        // Handle email check response if needed
      })
      .addCase(checkEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as any)?.message || 'Failed to check email';
      });
    // registerJobSeeker async thunk handlers
    builder
      .addCase(registerJobSeeker.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerJobSeeker.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        // Handle job seeker registration response if needed
      })
      .addCase(registerJobSeeker.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as any)?.message || 'Failed to register job seeker';
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
  updateUserData,
  updateExperience,
clearUserData
} = loginSlice.actions;

export default loginSlice.reducer;
