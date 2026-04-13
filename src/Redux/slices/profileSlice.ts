import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import client from '../../Networking/Client';
import { COURSE_ENDPOINTS, PROFILE_ENDPOINTS} from '../../Networking/EndPoints';


interface profileState {
   data: object | null;
    isLoading: boolean;
    error: string | null;
    total: number
   
}

const initialState: profileState = {
    data: null,
    isLoading: false,
    error: null,
    total: 0
};
//Recommended jobs API call
export const getProfileData = createAsyncThunk(
    "profile/getProfileData",
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await client.get(PROFILE_ENDPOINTS.profileData(userId));
            console.log(response,"");
            
            return response.data || response;
        } catch (error: any) {
            console.log('Error fetching profile data:', error);
            return rejectWithValue({
                message: error?.message || 'Failed to fetch profile data',
                code: error?.code || 'ERROR',
            });
        }
    }
);

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // getProfileData async thunk handlers
            .addCase(getProfileData.pending, (state) => {
                state.isLoading = true;
                state.error = null;

            })
            .addCase(getProfileData.fulfilled, (state, action) => {
                state.isLoading = false;
                const data = action.payload;
                console.log(data,"datatafromslice");
                
                state.data = data; // Assuming the API returns an array of courses
                state.error = null;
            })
            .addCase(getProfileData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                console.log('Error fetching profile data:', action.payload);
            })
    }
});

export const {

} = profileSlice.actions;

export default profileSlice.reducer;
