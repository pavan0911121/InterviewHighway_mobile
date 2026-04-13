import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import client from '../../Networking/Client';
import { EMPLOYER_ENDPOINTS } from '../../Networking/EndPoints';
import employerCreditsSlice, { getEmployerCredits } from './employerCreditsSlice';


interface analyticsState {
    data: object | null;
    isLoading: boolean;
    error: string | null;
    total: number
    timelineData: Array<any> | null;
   
}

const initialState: analyticsState = {
    data: null,
    isLoading: false,
    error: null,
    total: 0,
    timelineData: null
};
//employer analytics API call
export const getEmployerAnalytics = createAsyncThunk(
    "employerAnalytics/getEmployerAnalytics",
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await client.get(EMPLOYER_ENDPOINTS.analyticsCount(userId));
            return response.data || response;
        } catch (error: any) {
            console.log('Error fetching employer analytics:', error);
            return rejectWithValue({
                message: error?.message || 'Failed to fetch employer analytics',
                code: error?.code || 'ERROR',
            });
        }
    }
);
//employer timeline API call
export const getEmployerTimeline = createAsyncThunk(
    "employerAnalytics/getEmployerTimeline",
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await client.get(EMPLOYER_ENDPOINTS.analyticsApplicationsTimeline(userId));
            return response.data || response;
        } catch (error: any) {
            console.log('Error fetching employer timeline:', error);
            return rejectWithValue({
                message: error?.message || 'Failed to fetch employer timeline',
                code: error?.code || 'ERROR',
            });
        }
    }
);

const employerAnalyticsSlice = createSlice({
    name: 'employerAnalytics',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // getEmployerAnalytics async thunk handlers
            .addCase(getEmployerAnalytics.pending, (state) => {
                state.isLoading = true;
                state.error = null;

            })
            .addCase(getEmployerAnalytics.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload; // Assuming the API returns an object with employer analytics
                console.log(state.data, "state data");
                state.error = null;
                console.log('Employer analytics fetched successfully:', action.payload);
            })
            .addCase(getEmployerAnalytics.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                console.log('Error fetching employer analytics:', action.payload);
            })
            // getEmployerTimeline async thunk handlers
            .addCase(getEmployerTimeline.pending, (state) => {
                state.isLoading = true;
                state.error = null;

            })
            .addCase(getEmployerTimeline.fulfilled, (state, action) => {
                state.isLoading = false;
                state.timelineData = action.payload; // Assuming the API returns an array with employer timeline analytics
                console.log(state.timelineData, "state timeline data");
                state.error = null;
                console.log('Employer timeline analytics fetched successfully:', action.payload);
            })
            .addCase(getEmployerTimeline.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                console.log('Error fetching employer timeline analytics:', action.payload);
            })
    }
});

export const {

} = employerAnalyticsSlice.actions;

export default employerAnalyticsSlice.reducer;
