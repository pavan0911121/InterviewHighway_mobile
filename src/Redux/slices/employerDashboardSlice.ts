import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import client from '../../Networking/Client';
import { EMPLOYER_ENDPOINTS } from '../../Networking/EndPoints';


interface dashboardState {
    data: object | null;
    isLoading: boolean;
    error: string | null;
    total: number
   
}

const initialState: dashboardState = {
    data: null,
    isLoading: false,
    error: null,
    total: 0
};
//employer dashboard stats API call
export const getEmployerDashboardStats = createAsyncThunk(
    "employerDashboard/getEmployerDashboardStats",
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await client.get(EMPLOYER_ENDPOINTS.employerDashboardStats(userId));
            return response.data || response;
        } catch (error: any) {
            console.log('Error fetching employer dashboard stats:', error);
            return rejectWithValue({
                message: error?.message || 'Failed to fetch employer dashboard stats',
                code: error?.code || 'ERROR',
            });
        }
    }
);

const employerDashboardSlice = createSlice({
    name: 'employerDashboard',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearEmployerDashboardData: (state) => {
            state.data = null;
            state.total = 0;
        }
    },
    extraReducers: (builder) => {
        builder
            // getEmployerDashboardStats async thunk handlers
            .addCase(getEmployerDashboardStats.pending, (state) => {
                state.isLoading = true;
                state.error = null;

            })
            .addCase(getEmployerDashboardStats.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload; // Assuming the API returns an object with dashboard stats
                console.log(state.data, "state data");
                state.error = null;
                console.log('Employer dashboard stats fetched successfully:', action.payload);
            })
            .addCase(getEmployerDashboardStats.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                console.log('Error fetching employer dashboard stats:', action.payload);
            })
    }
});

export const {
    clearEmployerDashboardData
} = employerDashboardSlice.actions;

export default employerDashboardSlice.reducer;
