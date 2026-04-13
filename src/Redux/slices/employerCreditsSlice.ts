import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import client from '../../Networking/Client';
import { EMPLOYER_ENDPOINTS } from '../../Networking/EndPoints';


interface creditsState {
    data: object | null;
    isLoading: boolean;
    error: string | null;
    total: number,
    tiers?: object | null; // Add this if you want to store credit tiers in the same slice
   transactions?: object[] | null; // Add this if you want to store transactions in the same slice
}

const initialState: creditsState = {
    data: null,
    isLoading: false,
    error: null,
    total: 0,
    tiers: null, // Initialize tiers as null
    transactions: null, // Initialize transactions as null
};
//employer credits API call
export const getEmployerCredits = createAsyncThunk(
    "employerCredits/getEmployerCredits",
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await client.get(EMPLOYER_ENDPOINTS.employerCredits(userId));
            return response.data || response;
        } catch (error: any) {
            console.log('Error fetching employer credits:', error);
            return rejectWithValue({
                message: error?.message || 'Failed to fetch employer credits',
                code: error?.code || 'ERROR',
            });
        }
    }
);
//employer credit tiers API call
export const getEmployerCreditTiers = createAsyncThunk(
    "employerCredits/getEmployerCreditTiers",
    async (_: void, { rejectWithValue }) => {
        try {
            const response = await client.get(EMPLOYER_ENDPOINTS.employerCreditTiers);
            return response.data || response;
        } catch (error: any) {
            console.log('Error fetching employer credit tiers:', error);
            return rejectWithValue({
                message: error?.message || 'Failed to fetch employer credit tiers',
                code: error?.code || 'ERROR',
            });
        }
    }
);
//employer credit transaction API call
export const getEmployerCreditTransactions = createAsyncThunk(
    "employerCredits/getEmployerCreditTransactions",
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await client.get(EMPLOYER_ENDPOINTS.employerTransactions(userId, 20, 0));
            return response.data || response;
        } catch (error: any) {
            console.log('Error fetching employer credit transactions:', error);
            return rejectWithValue({
                message: error?.message || 'Failed to fetch employer credit transactions',
                code: error?.code || 'ERROR',
            });
        }
    }
);

const employerCreditsSlice = createSlice({
    name: 'employerCredits',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // getEmployerCredits async thunk handlers
            .addCase(getEmployerCredits.pending, (state) => {
                state.isLoading = true;
                state.error = null;

            })
            .addCase(getEmployerCredits.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload; // Assuming the API returns an object with employer credits
                console.log(state.data, "state data");
                state.error = null;
                console.log('Employer credits fetched successfully:', action.payload);
            })
            .addCase(getEmployerCredits.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                console.log('Error fetching employer credits:', action.payload);
            })
            // getEmployerCreditTiers async thunk handlers
            .addCase(getEmployerCreditTiers.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getEmployerCreditTiers.fulfilled, (state, action) => {
                state.isLoading = false;
                // Assuming the API returns an object with credit tiers, you can store it in a separate property if needed
                state.tiers = action.payload;
                state.error = null;
                console.log('Employer credit tiers fetched successfully:', action.payload);
            })
            .addCase(getEmployerCreditTiers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                console.log('Error fetching employer credit tiers:', action.payload);
            });
            // getEmployerCreditTransactions async thunk handlers
            builder 
            .addCase(getEmployerCreditTransactions.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getEmployerCreditTransactions.fulfilled, (state, action) => {
                state.isLoading = false;
                // Assuming the API returns an array of transactions, you can store it in a separate property if needed
                state.transactions = action.payload;
                state.error = null;
                console.log('Employer credit transactions fetched successfully:', action.payload);
            })
            .addCase(getEmployerCreditTransactions.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                console.log('Error fetching employer credit transactions:', action.payload);
            });
    }
});

export const {
    clearError,
} = employerCreditsSlice.actions;

export default employerCreditsSlice.reducer;
