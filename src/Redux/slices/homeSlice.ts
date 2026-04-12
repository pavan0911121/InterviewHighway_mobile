import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import client from '../../Networking/Client';
import { AUTH_ENDPOINTS, JOBS_ENDPOINTS, USER_ENDPOINTS } from '../../Networking/EndPoints';
import { getData } from '../../AsyncStore/asyncStorage';
import * as AsyncStore from "../../AsyncStore";


interface homeState {
    user: object | null;
    isLoading: boolean;
    error: string | null;
    recommendedJobs: any[]; // Adjust the type based on your job data structure
    total: number
}

const initialState: homeState = {
    user: null,
    isLoading: false,
    error: null,
    recommendedJobs: [],
    total: 0
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

const homeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {
        clearError: (state) => {
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
    }
});

export const {

} = homeSlice.actions;

export default homeSlice.reducer;
