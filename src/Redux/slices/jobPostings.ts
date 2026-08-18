import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import client from '../../Networking/Client';
import { EMPLOYER_ENDPOINTS } from '../../Networking/EndPoints';


interface jobPostingsState {
    data: object | null;
    isLoading: boolean;
    error: string | null;
    total: number
    jobCreationStatus: string | null; // Add this if you want to store the status of job creation
    jobData: object | null; // Add this to store the job details when viewing a job

}

const initialState: jobPostingsState = {
    data: null,
    isLoading: false,
    error: null,
    total: 0,
    jobCreationStatus: null, // Initialize jobCreationStatus as null
    jobData: null, // Initialize jobData as null
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
//ViewjobDetails API call
export const viewJobDetails = createAsyncThunk(
    "jobPostings/viewJobDetails",
    async ({ userId, jobId }: { userId: string; jobId: string }, { rejectWithValue }) => {
        try {
            const response = await client.get(EMPLOYER_ENDPOINTS.viewDetails(userId, jobId));
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
//Edit jobDetails API call
export const editJobDetails = createAsyncThunk(
    "jobPostings/editJobDetails",
    async ({ userId, jobId, jobData }: { userId: string; jobId: string; jobData: any }, { rejectWithValue }) => {
        try {
            const response = await client.put(EMPLOYER_ENDPOINTS.editJob(userId, jobId), jobData);
            return response.data || response;
        } catch (error: any) {
            console.log('Error editing job details:', error);
            return rejectWithValue({
                message: error?.message || 'Failed to edit job details',
                code: error?.code || 'ERROR',
            });
        }
    }
);
//Duplicate jobDetails API call
export const duplicateJobDetails = createAsyncThunk(
    "jobPostings/duplicateJobDetails",
    async ({ userId, jobId }: { userId: string; jobId: string }, { rejectWithValue }) => {
        try {
            const response = await client.put(EMPLOYER_ENDPOINTS.duplicateJob(userId, jobId), {});
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
//Publish job API call
export const publishJob = createAsyncThunk(
    "jobPostings/publishJob",
    async ({ jobId, body }: { jobId: string; body: any }, { rejectWithValue }) => {
        try {
            const response = await client.put(EMPLOYER_ENDPOINTS.publishJob(jobId ),body);
            return response.data || response;
        } catch (error: any) {
            console.log('Error publishing job details:', error);
            return rejectWithValue({
                message: error?.message || 'Failed to publish job details',
                code: error?.code || 'ERROR',
            });
        }
    }
);
//Delete job posting API call
export const deleteJobPosting = createAsyncThunk(
    "jobPostings/deleteJobPosting",
    async ({ userId, jobId }: { userId: string; jobId: string }, { rejectWithValue }) => {
        try {
            const response = await client.delete(EMPLOYER_ENDPOINTS.deleteJob(userId, jobId));
            return response.data || response;
        } catch (error: any) {
            console.log('Error deleting job posting:', error);
            return rejectWithValue({
                message: error?.message || 'Failed to delete job posting',
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
            })
            // viewJobDetails async thunk handlers
            .addCase(viewJobDetails.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(viewJobDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.jobData = action.payload;
                state.error = null;
            })
            .addCase(viewJobDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // duplicateJobDetails async thunk handlers
            .addCase(duplicateJobDetails.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(duplicateJobDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.jobData = action.payload;
                state.error = null;
            })
            .addCase(duplicateJobDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(editJobDetails.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(editJobDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.jobData = action.payload;
                state.error = null;
            })
            .addCase(editJobDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(publishJob.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(publishJob.fulfilled, (state, action) => {
                state.isLoading = false;
                state.jobData = action.payload;
                state.error = null;
            })
            .addCase(publishJob.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(deleteJobPosting.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteJobPosting.fulfilled, (state, action) => {
                state.isLoading = false;
                state.jobData = action.payload;
                state.error = null;
            })
            .addCase(deleteJobPosting.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

    }
});

export const {
    clearEmployerJobPostingsData
} = jobPostingsSlice.actions;

export default jobPostingsSlice.reducer;
