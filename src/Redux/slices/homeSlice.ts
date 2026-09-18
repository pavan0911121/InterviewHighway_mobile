import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import client from '../../Networking/Client';
import { AUTH_ENDPOINTS, JOBS_ENDPOINTS, PROFILE_ENDPOINTS, USER_ENDPOINTS } from '../../Networking/EndPoints';
import { getData } from '../../AsyncStore/asyncStorage';
import * as AsyncStore from "../../AsyncStore";
import { clear } from 'node:console';


interface homeState {
    user: object | null;
    isLoading: boolean;
    error: string | null;
    recommendedJobs: any[]; // Adjust the type based on your job data structure
    total: number
    savedJobs: any[]; // Adjust the type based on your saved jobs data structure
    userMetaData: object | null;
    jobDetails: any | null;
    profileByIdData: any | null;
    jobApplicationResponse: any | null;
    alreadyAppliedJobMessage: string | null;
}

const initialState: homeState = {
    user: null,
    isLoading: false,
    error: null,
    recommendedJobs: [],
    total: 0,
    savedJobs: [],
    userMetaData: null,
    jobDetails: null,
    profileByIdData: null,
    jobApplicationResponse: null,
    alreadyAppliedJobMessage: null,
};
//Recommended jobs API call
export const getRecommendedJobs = createAsyncThunk(
    "home/getRecommendedJobs",
    async (_, { rejectWithValue }) => {
        try {
            const response = await client.get(JOBS_ENDPOINTS.recommendedJobs);
            return response.data || response;
        } catch (error: any) {
            console.log('Error fetching recommended jobs:', error);
            return rejectWithValue({
                message: error?.message || 'Failed to fetch recommended jobs',
                code: error?.code || 'ERROR',
            });
        }
    }
);
//saved jobs API call
export const getSavedJobsList = createAsyncThunk(
    "home/getSavedJobsList",
    async (_, { rejectWithValue }) => {
        try {
            const response = await client.get(JOBS_ENDPOINTS.savedJobs);
            return response.data || response;
        } catch (error: any) {
            console.log('Error fetching saved jobs:', error);
            return rejectWithValue({
                message: error?.message || 'Failed to fetch saved jobs',
                code: error?.code || 'ERROR',
            });
        }
    }
);
// Save job API call
export const saveJob = createAsyncThunk(
    "home/saveJob",
    async ({ userId, payload }: { userId: string, payload: any }, { rejectWithValue }) => {
        try {
            const response = await client.post(JOBS_ENDPOINTS.saveJob(userId), payload);
            return response.data || response;
        } catch (error: any) {
            console.log('Error saving job:', error);
            return rejectWithValue({
                message: error?.message || 'Failed to save job',
                code: error?.code || 'ERROR',
            });
        }
    }
);
// Job details API call
export const getJobDetails = createAsyncThunk(
    "home/getJobDetails",
    async (jobId: string, { rejectWithValue }) => {
        try {
            const response = await client.get(JOBS_ENDPOINTS.jobDetails(jobId));
            return response.data || response;
        } catch (error: any) {
            console.log('Error fetching job details:', error);
            return rejectWithValue({
                message: error?.message || 'Failed to fetch job details',
                code: error?.code || 'ERROR',
            });
        }
    }
);
//User meta data Api call
export const getUserMetaData = createAsyncThunk(
    "home/getUserMetaData",
    async (_, { rejectWithValue }) => {
        try {
            const response = await client.get(AUTH_ENDPOINTS.userData);
            return response.data || response;
        } catch (error: any) {
            console.log('Error fetching user meta data:', error);
            return rejectWithValue({
                message: error?.message || 'Failed to fetch user meta data',
                code: error?.code || 'ERROR',
            });
        }
    }
);
//Profile By Id API call
export const getProfileById = createAsyncThunk(
    "home/getProfileById",
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await client.get(PROFILE_ENDPOINTS.profileById(userId));
            return response.data || response;
        } catch (error: any) {
            console.log('Error fetching profile by id:', error);
            return rejectWithValue({
                message: error?.message || 'Failed to fetch profile by id',
                code: error?.code || 'ERROR',
            });
        }
    }
);
//apply job API call
export const applyJob = createAsyncThunk(
    "home/applyJob",
    async (applicationData: any, { rejectWithValue }) => {
        try {
            const response = await client.post(JOBS_ENDPOINTS.applyJob(), applicationData);
            return response.data || response;
        } catch (error: any) {
            console.log('Error applying for job:', error);
            return rejectWithValue({
                message: error?.message || 'Failed to apply for job',
                code: error?.code || 'ERROR',
            });
        }
    }
);

const homeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {
        clearHomeData: (state) => {
            state.user = null;
            state.isLoading = false;
            state.error = null;
            state.recommendedJobs = [];
            state.total = 0;
            state.savedJobs = [];
            state.userMetaData = null;
            state.jobDetails = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // getRecommendedJobs async thunk handlers
            .addCase(getRecommendedJobs.pending, (state) => {
                state.isLoading = true;
                state.error = null;

            })
            .addCase(getRecommendedJobs.fulfilled, (state, action) => {
                state.isLoading = false;
                state.recommendedJobs = action.payload; // Assuming the API returns an array of jobs
                state.error = null;
            })
            .addCase(getRecommendedJobs.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                console.log('Error fetching recommended jobs:', action.payload);
            })
            // getJobDetails async thunk handlers
            .addCase(getJobDetails.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getJobDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.jobDetails = action.payload;
                state.error = null;
            })
            .addCase(getJobDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                console.log('Error fetching job details:', action.payload);
            })
            //saved jobs async thunk handlers
            .addCase(getSavedJobsList.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getSavedJobsList.fulfilled, (state, action) => {
                state.isLoading = false;
                state.savedJobs = action.payload; // Assuming the API returns an array of saved jobs
                state.error = null;
            })
            .addCase(getSavedJobsList.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                console.log('Error fetching saved jobs:', action.payload);
            })
            //saveJob async thunk handlers
            .addCase(saveJob.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(saveJob.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(saveJob.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                console.log('Error saving job:', action.payload);
            })
            //getUserMetaData async thunk handlers
            .addCase(getUserMetaData.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getUserMetaData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.userMetaData = action.payload;
                state.error = null;
            })
            .addCase(getUserMetaData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            //getProfileById async thunk handlers
            .addCase(getProfileById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getProfileById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.profileByIdData = action.payload;
                state.error = null;
            })
            .addCase(getProfileById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                console.log('Error fetching profile by id:', action.payload);
            })
            //applyJob async thunk handlers
            .addCase(applyJob.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(applyJob.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.jobApplicationResponse = action.payload;
            })
            .addCase(applyJob.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.alreadyAppliedJobMessage = action.payload as string;
                console.log('Error applying for job:', action.payload);
            });
    }
});

export const {
    clearHomeData,
    clearError,
} = homeSlice.actions;

export default homeSlice.reducer;
