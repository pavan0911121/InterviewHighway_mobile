import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import client from '../../Networking/Client';
import { EMPLOYER_ENDPOINTS } from '../../Networking/EndPoints';


interface jobPostingsState {
    data: object | null;
    isLoading: boolean;
    error: string | null;
    total: number
    jobCreationStatus: string | null; // Add this if you want to store the status of job creation

}

const initialState: jobPostingsState = {
    data: null,
    isLoading: false,
    error: null,
    total: 0,
    jobCreationStatus: null, // Initialize jobCreationStatus as null
};
//job posting stats API call
export const getJobPostingStats = createAsyncThunk(
    "jobPostings/getJobPostingStats",
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await client.get(EMPLOYER_ENDPOINTS.employerJobsList(userId));
            return response.data || response;
        } catch (error: any) {
            console.log('Error fetching job posting stats:', error);
            return rejectWithValue({
                message: error?.message || 'Failed to fetch job posting stats',
                code: error?.code || 'ERROR',
            });
        }
    }
);

// Create the jobPostings slice
export const postCreateJob = createAsyncThunk(
    "jobPostings/postCreateJob",
    async (jobData: any, { rejectWithValue }) => {
        try {
            const response = await client.post(EMPLOYER_ENDPOINTS.createJob(), jobData);
            return response.data || response;
        } catch (error: any) {
            console.log('Error fetching job posting stats:', error);
            return rejectWithValue({
                message: error?.message || 'Failed to fetch job posting stats',
                code: error?.code || 'ERROR',
            });
        }
    }
);

const jobPostingsSlice = createSlice({
    name: 'jobPostings',
    initialState,
    reducers: {
        clearEmployerJobPostingsData: (state) => {
            state.data = null;
            state.isLoading = false;
            state.error = null;
            state.total = 0;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // getJobPostingStats async thunk handlers
            .addCase(getJobPostingStats.pending, (state) => {
                state.isLoading = true;
                state.error = null;

            })
            .addCase(getJobPostingStats.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload; // Assuming the API returns an object with job posting stats
                console.log(state.data, "state data");
                state.error = null;
                console.log('Job posting stats fetched successfully:', action.payload);
            })
            .addCase(getJobPostingStats.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                console.log('Error fetching job posting stats:', action.payload);
            })
            // postCreateJob async thunk handlers
            .addCase(postCreateJob.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(postCreateJob.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload; // Assuming the API returns an object with the created job data
                console.log(state.data, "state data");
                state.error = null;
                state.jobCreationStatus = 'success';
                console.log('Job created successfully:', action.payload);
            })
            .addCase(postCreateJob.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.jobCreationStatus = 'error';
                console.log('Error creating job:', action.payload);
            });
    }
});

export const {
    clearEmployerJobPostingsData
} = jobPostingsSlice.actions;

export default jobPostingsSlice.reducer;
