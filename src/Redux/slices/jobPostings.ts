import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import client from '../../Networking/Client';
import { EMPLOYER_ENDPOINTS } from '../../Networking/EndPoints';


interface jobPostingsState {
    data: object | null;
    isLoading: boolean;
    error: string | null;
    total: number
   
}

const initialState: jobPostingsState = {
    data: null,
    isLoading: false,
    error: null,
    total: 0
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
    }
});

export const {
    clearEmployerJobPostingsData
} = jobPostingsSlice.actions;

export default jobPostingsSlice.reducer;
