import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import client from '../../Networking/Client';
import { VIDEO_ENDPOINTS, PROFILE_ENDPOINTS} from '../../Networking/EndPoints';


interface profileState {
   data: object | null;
    isLoading: boolean;
    error: string | null;
    total: number;
    videoData: any | null;
    isVideoUploading: boolean;
    videoUploadError: string | null;
}

const initialState: profileState = {
    data: null,
    isLoading: false,
    error: null,
    total: 0,
    videoData: null,
    isVideoUploading: false,
    videoUploadError: null,
};
type Config = {
  headers?: string;
};
//Recommended jobs API call
export const getProfileData = createAsyncThunk(
    "profile/getProfileData",
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await client.get(PROFILE_ENDPOINTS.profileData(userId));
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
//Upload video API call
export const uploadVideo = createAsyncThunk(
    "profile/uploadVideo",
    async (formData: FormData, { rejectWithValue }) => {
        try {
            // Content-Type (with multipart boundary) is set automatically by fetch for FormData
            const response = await client.post(VIDEO_ENDPOINTS.uploadVideo, formData);
            return response.data || response;
        } catch (error: any) {
            console.log('Error uploading video:', error);
            return rejectWithValue({
                message: error?.message || 'Failed to upload video',
                code: error?.code || 'ERROR',
            });
        }
    }
);

//get video data API call
export const getVideoData = createAsyncThunk(
    "profile/getVideoData",
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await client.get(VIDEO_ENDPOINTS.getVideoData(userId));
            return response.data || response;
        } catch (error: any) {
            console.log('Error fetching video data:', error);
            return rejectWithValue({
                message: error?.message || 'Failed to fetch video data',
                code: error?.code || 'ERROR',
            });
        }
    }
);

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        clearProfileData: (state) => {
            state.data = null;
            state.total = 0;
        },
        clearError: (state) => {
            state.error = null;
        },
        clearVideoUploadError: (state) => {
            state.videoUploadError = null;
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
                
                state.data = data; // Assuming the API returns an array of courses
                state.error = null;
            })
            .addCase(getProfileData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // uploadVideo async thunk handlers
            .addCase(uploadVideo.pending, (state) => {
                state.isVideoUploading = true;
                state.videoUploadError = null;
            })
            .addCase(uploadVideo.fulfilled, (state, action) => {
                state.isVideoUploading = false;
                state.videoData = action.payload;
                state.videoUploadError = null;
            })
            .addCase(uploadVideo.rejected, (state, action) => {
                state.isVideoUploading = false;
                state.videoUploadError = (action.payload as any)?.message || 'Failed to upload video';
            })
            // getVideoData async thunk handlers
            .addCase(getVideoData.fulfilled, (state, action) => {
                state.videoData = action.payload;
            })
    }
});

export const {
    clearProfileData,
    clearError,
    clearVideoUploadError,
} = profileSlice.actions;

export default profileSlice.reducer;
