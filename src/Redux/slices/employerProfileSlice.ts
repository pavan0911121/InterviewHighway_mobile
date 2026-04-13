import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import client from '../../Networking/Client';
import {EMPLOYER_ENDPOINTS} from '../../Networking/EndPoints';


interface profileState {
    courses: object | null;
    isLoading: boolean;
    error: string | null;
    total: number
   
}

const initialState: profileState = {
    courses: null,
    isLoading: false,
    error: null,
    total: 0
};
//Recommended jobs API call
export const getEmployerProfile = createAsyncThunk(
    "profile/getEmployerProfile",
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await client.get(EMPLOYER_ENDPOINTS.employerCompanyProfile(userId));
            return response.data || response;
        } catch (error: any) {
            console.log('Error fetching employer profile:', error);
            return rejectWithValue({
                message: error?.message || 'Failed to fetch employer profile',
                code: error?.code || 'ERROR',
            });
        }
    }
);

const employerProfileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // getEmployerProfile async thunk handlers
            .addCase(getEmployerProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;

            })
            .addCase(getEmployerProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.courses = action.payload; // Assuming the API returns an array of courses
                console.log(state.courses, "state courses");
                state.error = null;
                console.log('Employer profile fetched successfully:', action.payload);
            })
            .addCase(getEmployerProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                console.log('Error fetching employer profile:', action.payload);
            })
    }
});

export const {

} = employerProfileSlice.actions;

export default employerProfileSlice.reducer;
