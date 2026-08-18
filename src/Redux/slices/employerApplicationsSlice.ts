import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import client from '../../Networking/Client';
import { EMPLOYER_ENDPOINTS } from '../../Networking/EndPoints';


interface EmployerApplicationsState {
    data: object | null;
    isLoading: boolean;
    error: string | null;
    total: number;
    candidateData?: object | null;
   
}

const initialState: EmployerApplicationsState = {
    data: null,
    isLoading: false,
    error: null,
    total: 0,
    candidateData: null,
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
//CandidateDetails API call
export const getCandidateDetails = createAsyncThunk(
    "employerApplications/getCandidateDetails",
    async (candidateId: string, { rejectWithValue }) => {
        try {
            const response = await client.get(EMPLOYER_ENDPOINTS.employerCheckCandidateDetails(candidateId));
            return response.data || response;
        } catch (error: any) {
            console.log('Error fetching candidate details:', error);
            return rejectWithValue({
                message: error?.message || 'Failed to fetch candidate details',
                code: error?.code || 'ERROR',
            });
        }
    }
);

const employerApplicationsSlice = createSlice({
    name: 'employerApplications',
    initialState,
    reducers: {
        clearEmplloyerApplicationsData: (state) => {
            state.data = null;
            state.total = 0;
        },
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
                state.error = null;
            })
            .addCase(getApplicationsList.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                console.log('Error fetching applications list:', action.payload);
            })
            .addCase(getCandidateDetails.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getCandidateDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.candidateData = action.payload; // Assuming the API returns an object with candidate details
                state.error = null;
            })
            .addCase(getCandidateDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                console.log('Error fetching candidate details:', action.payload);
            });
    }
});

export const {
    clearEmplloyerApplicationsData,
    clearError
} = employerApplicationsSlice.actions;

export default employerApplicationsSlice.reducer;
