import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import client from '../../Networking/Client';
import { EMPLOYER_ENDPOINTS } from '../../Networking/EndPoints';


interface EmployerApplicationsState {
    data: object | null;
    isLoading: boolean;
    error: string | null;
    total: number
   
}

const initialState: EmployerApplicationsState = {
    data: null,
    isLoading: false,
    error: null,
    total: 0
};
//applications list API call
export const getApplicationsList = createAsyncThunk(
    "employerApplications/getApplicationsList",
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await client.get(EMPLOYER_ENDPOINTS.employerApplicationsList(userId));
            return response.data || response;
        } catch (error: any) {
            console.log('Error fetching applications list:', error);
            return rejectWithValue({
                message: error?.message || 'Failed to fetch applications list',
                code: error?.code || 'ERROR',
            });
        }
    }
);

const employerApplicationsSlice = createSlice({
    name: 'employerApplications',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // getApplicationsList async thunk handlers
            .addCase(getApplicationsList.pending, (state) => {
                state.isLoading = true;
                state.error = null;

            })
            .addCase(getApplicationsList.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload; // Assuming the API returns an object with applications list
                console.log(state.data, "state data");
                state.error = null;
                console.log('Applications list fetched successfully:', action.payload);
            })
            .addCase(getApplicationsList.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                console.log('Error fetching applications list:', action.payload);
            })
    }
});

export const {

} = employerApplicationsSlice.actions;

export default employerApplicationsSlice.reducer;
