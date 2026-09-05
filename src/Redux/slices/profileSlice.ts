import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import client from '../../Networking/Client';
import { VIDEO_ENDPOINTS, PROFILE_ENDPOINTS,SKILLS_ENDPOINTS, EXPERIENCE_ENDPOINTS, RESUME_ENDPOINTS, EDUCATION_ENDPOINTS} from '../../Networking/EndPoints';


interface profileState {
   data: object | null;
    isLoading: boolean;
    error: string | null;
    total: number;
    videoData: any | null;
    isVideoUploading: boolean;
    videoUploadError: string | null;
    allSkills: any[];
    userSkills: any[];
    personalData: object | null;
    bioData: object | null;
    addedSkillData: object | null;
    workExperience: any[];
    resumes: any[];
    educationData: any[];
}

const initialState: profileState = {
    data: null,
    isLoading: false,
    error: null,
    total: 0,
    videoData: null,
    isVideoUploading: false,
    videoUploadError: null,
    allSkills: [],
    userSkills: [],
    personalData: null,
    bioData: null,
    addedSkillData: null,
    workExperience: [],
    resumes: [],
    educationData: [],
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

//personal data API call
export const getPersonalData = createAsyncThunk(
    "profile/getPersonalData",
    async ({ userId, payload }: { userId: string; payload: any }, { rejectWithValue }) => {
        try {
            const response = await client.put(PROFILE_ENDPOINTS.personalData(userId), payload);
            return response.data || response;
        } catch (error: any) {
            console.log('Error fetching personal data:', error);
            return rejectWithValue({
                message: error?.message || 'Failed to fetch personal data',
                code: error?.code || 'ERROR',
            });
        }
    }
);
//Bio update API call
export const updateBio = createAsyncThunk(
    "profile/updateBio",
    async ({ userId, payload }: { userId: string; payload: any }, { rejectWithValue }) => {
        try {
            const response = await client.put(PROFILE_ENDPOINTS.bioUpdate(userId), payload);
            return response.data || response;
        } catch (error: any) {
            console.log('Error updating bio:', error);
            return rejectWithValue({
                message: error?.message || 'Failed to update bio',
                code: error?.code || 'ERROR',
            });
        }
    }
);
//get All Skills API call
export const getAllSkills = createAsyncThunk(
    "profile/getAllSkills",
    async (_: void, { rejectWithValue }) => {
        try {
            const response = await client.get(SKILLS_ENDPOINTS.getAllSkills);
            return response.data || response;
        } catch (error: any) {
            console.log('Error fetching all skills:', error);
            return rejectWithValue({
                message: error?.message || 'Failed to fetch all skills',
                code: error?.code || 'ERROR',
            });
        }
    }
);
//AddSkill API call
export const addSkill = createAsyncThunk(
    "profile/addSkill",
    async ({ userId, payload }: { userId: string; payload: any }, { rejectWithValue }) => {
        try {
            const response = await client.post(SKILLS_ENDPOINTS.addOrGetSkills(userId), payload);
            return response.data || response;
        } catch (error: any) {
            console.log('Error adding skill:', error);
            return rejectWithValue({
                message: error?.message || 'Failed to add skill',
                code: error?.code || 'ERROR',
            });
        }
    }
);
//getUserSkills API call
export const getUserSkills = createAsyncThunk(
    "profile/getUserSkills",
    async ({ userId }: { userId: string }, { rejectWithValue }) => {
        try {
            const response = await client.get(SKILLS_ENDPOINTS.addOrGetSkills(userId));
            return response.data || response;
        } catch (error: any) {
            console.log('Error fetching user skills:', error);
            return rejectWithValue({
                message: error?.message || 'Failed to fetch user skills',
                code: error?.code || 'ERROR',
            });
        }
    }
);
//deleteSkill API call
export const deleteSkill = createAsyncThunk(
    "profile/deleteSkill",
    async ({ userId, skillId }: { userId: string; skillId: string }, { rejectWithValue }) => {
        try {
            const response = await client.delete(SKILLS_ENDPOINTS.deleteSkill(userId, skillId));
            return response.data || response;
        } catch (error: any) {
            console.log('Error deleting skill:', error);
            return rejectWithValue({
                message: error?.message || 'Failed to delete skill',
                code: error?.code || 'ERROR',
            });
        }
    }
);
//get work experience API call
export const getWorkExperience = createAsyncThunk(
    "profile/getWorkExperience",
    async ({ userId }: { userId: string }, { rejectWithValue }) => {
        try {
            const response = await client.get(EXPERIENCE_ENDPOINTS.getWorkExperience(userId));
            return response.data || response;
        } catch (error: any) {
            console.log('Error fetching work experience:', error);
            return rejectWithValue({
                message: error?.message || 'Failed to fetch work experience',
                code: error?.code || 'ERROR',
            });
        }
    }
);
//get education API call
export const getEducation = createAsyncThunk(
    "profile/getEducation",
    async ({ userId }: { userId: string }, { rejectWithValue }) => {
        try {
            const response = await client.get(EDUCATION_ENDPOINTS.addEducation(userId));
            return response.data || response;
        } catch (error: any) {
            console.log('Error fetching education:', error);
            return rejectWithValue({
                message: error?.message || 'Failed to fetch education',
                code: error?.code || 'ERROR',
            });
        }
    }
);
//add education API call
export const addEducation = createAsyncThunk(
    "profile/addEducation",
    async ({ userId, payload }: { userId: string; payload: any }, { rejectWithValue }) => {
        try {
            const response = await client.post(EDUCATION_ENDPOINTS.addEducation(userId), payload);
            return response.data || response;
        } catch (error: any) {
            console.log('Error adding education:', error);
            return rejectWithValue({
                message: error?.message || 'Failed to add education',
                code: error?.code || 'ERROR',
            });
        }
    }
);
//get Resume API call
export const getResumes = createAsyncThunk(
    "profile/getResumes",
    async ({ userId }: { userId: string }, { rejectWithValue }) => {
        try {
            const response = await client.get(RESUME_ENDPOINTS.getUserResumes(userId));
            return response.data || response;
        } catch (error: any) {
            console.log('Error fetching resume:', error);
            return rejectWithValue({
                message: error?.message || 'Failed to fetch resume',
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
                state.videoData = null;
            })
            // getVideoData async thunk handlers
            .addCase(getVideoData.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getVideoData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.videoData = action.payload;
                state.error = null;
            })
            .addCase(getVideoData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.videoData = null;
            });
            // getPersonalData async thunk handlers
            builder
            .addCase(getPersonalData.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getPersonalData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.personalData = action.payload; // Assuming the API returns personal data
                state.error = null;
            })
            .addCase(getPersonalData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
            // updateBio async thunk handlers
            builder
            .addCase(updateBio.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateBio.fulfilled, (state, action) => {
                state.isLoading = false;
                state.bioData = action.payload; // Assuming the API returns updated bio data
                state.error = null;
            })
            .addCase(updateBio.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
            // addSkill async thunk handlers
            builder
            .addCase(addSkill.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addSkill.fulfilled, (state, action) => {
                state.isLoading = false;
                state.addedSkillData = action.payload; // Assuming the API returns updated skills data
                state.error = null;
            })
            .addCase(addSkill.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
            //getAllSkills async thunk handlers
            builder
            .addCase(getAllSkills.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getAllSkills.fulfilled, (state, action) => {
                state.isLoading = false;
                state.allSkills = action.payload; // Assuming the API returns all skills data
                state.error = null;
            })
            .addCase(getAllSkills.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
            //Get User Skills async thunk handlers
            builder
            .addCase(getUserSkills.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getUserSkills.fulfilled, (state, action) => {
                state.isLoading = false;
                state.userSkills = action.payload; // Assuming the API returns user skills data
                state.error = null;
            })
            .addCase(getUserSkills.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
            //getWorkExperience async thunk handlers
            builder
            .addCase(getWorkExperience.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getWorkExperience.fulfilled, (state, action) => {
                state.isLoading = false;
                state.workExperience = action.payload; // Assuming the API returns work experience data
                state.error = null;
            })
            .addCase(getWorkExperience.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
            //getEducation async thunk handlers
            builder
            .addCase(getEducation.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getEducation.fulfilled, (state, action) => {
                state.isLoading = false;
                state.educationData = action.payload; // Assuming the API returns education data
                state.error = null;
            })
            .addCase(getEducation.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
            //getResumes async thunk handlers
            builder
            .addCase(getResumes.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getResumes.fulfilled, (state, action) => {
                state.isLoading = false;
                state.resumes = action.payload; // Assuming the API returns resumes data
                state.error = null;
            })
            .addCase(getResumes.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    }
});

export const {
    clearProfileData,
    clearError,
    clearVideoUploadError,
} = profileSlice.actions;

export default profileSlice.reducer;
