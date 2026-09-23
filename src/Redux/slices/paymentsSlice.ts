import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import client from '../../Networking/Client';
import { PAYMENT_ENDPOINTS } from '../../Networking/EndPoints';


interface paymentsState {
    data: object | null;
    isPaymentsLoading: boolean;
    error: string | null;
    total: number

}

const initialState: paymentsState = {
    data: null,
    isPaymentsLoading: false,
    error: null,
    total: 0
};
//Recommended jobs API call
export const getPaymentHistoryData = createAsyncThunk(
    "payments/getPaymentHistoryData",
    async (_, { rejectWithValue }) => {
        try {
            const response = await client.get(PAYMENT_ENDPOINTS.paymentHistory);
            return response.data || response;
        } catch (error: any) {
            console.log('Error fetching payment history data:', error);
            return rejectWithValue({
                message: error?.message || 'Failed to fetch payment history data',
                code: error?.code || 'ERROR',
            });
        }
    }
);

const paymentsSlice = createSlice({
    name: 'payments',
    initialState,
    reducers: {
        clearPaymentData: (state) => {
            state.data = null;
            state.total = 0;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // getPaymentHistoryData async thunk handlers
            .addCase(getPaymentHistoryData.pending, (state) => {
                state.isPaymentsLoading = true;
                state.error = null;

            })
            .addCase(getPaymentHistoryData.fulfilled, (state, action) => {
                state.isPaymentsLoading = false;
                const data = action.payload;
                state.data = data; // Assuming the API returns an array of courses
                state.error = null;
            })
            .addCase(getPaymentHistoryData.rejected, (state, action) => {
                state.isPaymentsLoading = false;
                state.error = action.payload as string;
            })
    }
});

export const {
    clearPaymentData,
    clearError

} = paymentsSlice.actions;

export default paymentsSlice.reducer;
