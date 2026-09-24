import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import client from '../../Networking/Client';
import { EMPLOYER_ENDPOINTS } from '../../Networking/EndPoints';


interface jobPostingsState {
    data: object | null;
    isLoading: boolean;
    error: string | null;
    total: number
    jobCreationStatus: string | null; // Add this if you want to store the status of job creation
    jobData: object | null; // Add this to store the job details when viewing a job
    selectedJobData: object | null; // Add this to store the selected job details
    jobApplicationsData: object | null; // Add this to store the employer job applications data
    applicationStatusData: object | null; // Add this to store the application status update response
    candidateSkillsData: object | null; // Add this to store the candidate skills data
    candidateWorkExperienceData: object | null; // Add this to store the candidate work experience data
    candidateEducationData: object | null; // Add this to store the candidate education data
    candidateVideoData: object | null; // Add this to store the candidate video data

}

const initialState: jobPostingsState = {
    data: null,
    isLoading: false,
    error: null,
    total: 0,
    jobCreationStatus: null, // Initialize jobCreationStatus as null
    jobData: null, // Initialize jobData as null
    selectedJobData: null, // Initialize selectedJobData as null
    jobApplicationsData: null, // Initialize jobApplicationsData as null
    applicationStatusData: null, // Initialize applicationStatusData as null
    candidateSkillsData: null, // Initialize candidateSkillsData as null
    candidateWorkExperienceData: null, // Initialize candidateWorkExperienceData as null
    candidateEducationData: null, // Initialize candidateEducationData as null
    candidateVideoData: null, // Initialize candidateVideoData as null
};
//job posting stats API call
export const getJobPostingStats = createAsyncThunk(
    "jobPostings/getJobPostingStats",
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await client.get(EMPLOYER_ENDPOINTS.employerJobsList(userId));
            return response.data || response;
        } catch (error: any) {
            console.log('Error fetching job posting stats:', error);
            return rejectWithValue({
                message: error?.message || 'Failed to fetch job posting stats',
                code: error?.code || 'ERROR',
            });
        }
    }
);
//employerjob data API call
export const getEmployerJobData = createAsyncThunk(
    "jobPostings/getEmployerJobData",
    async ({ userId, jobId }: { userId: string; jobId: string }, { rejectWithValue }) => {
        try {
            const response = await client.get(EMPLOYER_ENDPOINTS.employerJob(userId, jobId));
            return response.data || response;
        } catch (error: any) {
            console.log('Error fetching employer job data:', error);
            return rejectWithValue({
                message: error?.message || 'Failed to fetch employer job data',
                code: error?.code || 'ERROR',
            });
        }
    }
);
//employer Job Applications API call
export const getEmployerJobApplications = createAsyncThunk(
    "jobPostings/getEmployerJobApplications",
    async ({ userId, jobId }: { userId: string; jobId: string }, { rejectWithValue }) => {
        try {
            const response = await client.get(EMPLOYER_ENDPOINTS.employerJobApplications(userId, jobId));
            return response.data || response;
        } catch (error: any) {
            console.log('Error fetching employer job applications:', error);
            return rejectWithValue({
                message: error?.message || 'Failed to fetch employer job applications',
                code: error?.code || 'ERROR',
            });
        }
    }
);

// Create the jobPostings slice
export const postCreateJob = createAsyncThunk(
    "jobPostings/postCreateJob",
    async (jobData: any, { rejectWithValue }) => {
        try {
            const response = await client.post(EMPLOYER_ENDPOINTS.createJob(), jobData);
            return response.data || response;
        } catch (error: any) {
            console.log('Error fetching job posting stats:', error);
            return rejectWithValue({
                message: error?.message || 'Failed to fetch job posting stats',
                code: error?.code || 'ERROR',
            });
        }
    }
);
//ViewjobDetails API call
export const viewJobDetails = createAsyncThunk(
    "jobPostings/viewJobDetails",
    async ({ userId, jobId }: { userId: string; jobId: string }, { rejectWithValue }) => {
        try {
            const response = await client.get(EMPLOYER_ENDPOINTS.viewDetails(userId, jobId));
            return response.data || response;
        } catch (error: any) {
            console.log('Error fetching job details:', error);
            return rejectWithValue({
                message: error?.message || 'Failed to fetch job details',
                code: error?.code || 'ERROR',
            });
        }
    }
);
//Edit jobDetails API call
export const editJobDetails = createAsyncThunk(
    "jobPostings/editJobDetails",
    async ({ userId, jobId, jobData }: { userId: string; jobId: string; jobData: any }, { rejectWithValue }) => {
        try {
            const response = await client.put(EMPLOYER_ENDPOINTS.editJob(userId, jobId), jobData);
            return response.data || response;
        } catch (error: any) {
            console.log('Error editing job details:', error);
            return rejectWithValue({
                message: error?.message || 'Failed to edit job details',
                code: error?.code || 'ERROR',
            });
        }
    }
);
//Duplicate jobDetails API call
export const duplicateJobDetails = createAsyncThunk(
    "jobPostings/duplicateJobDetails",
    async ({ userId, jobId }: { userId: string; jobId: string }, { rejectWithValue }) => {
        try {
            const response = await client.put(EMPLOYER_ENDPOINTS.duplicateJob(userId, jobId), {});
            return response.data || response;
        } catch (error: any) {
            console.log('Error fetching job details:', error);
            return rejectWithValue({
                message: error?.message || 'Failed to fetch job details',
                code: error?.code || 'ERROR',
            });
        }
    }
);
//Publish job API call
export const publishJob = createAsyncThunk(
    "jobPostings/publishJob",
    async ({ jobId, body }: { jobId: string; body: any }, { rejectWithValue }) => {
        try {
            const response = await client.put(EMPLOYER_ENDPOINTS.publishJob(jobId ),body);
            return response.data || response;
        } catch (error: any) {
            console.log('Error publishing job details:', error);
            return rejectWithValue({
                message: error?.message || 'Failed to publish job details',
                code: error?.code || 'ERROR',
            });
        }
    }
);
//Delete job posting API call
export const deleteJobPosting = createAsyncThunk(
    "jobPostings/deleteJobPosting",
    async ({ userId, jobId }: { userId: string; jobId: string }, { rejectWithValue }) => {
        try {
            const response = await client.delete(EMPLOYER_ENDPOINTS.deleteJob(userId, jobId));
            return response.data || response;
        } catch (error: any) {
            console.log('Error deleting job posting:', error);
            return rejectWithValue({
                message: error?.message || 'Failed to delete job posting',
                code: error?.code || 'ERROR',
            });
        }
    }
);
//Update application status API call
export const updateApplicationStatus = createAsyncThunk(
    "jobPostings/updateApplicationStatus",
    async ({ applicationId, body }: { applicationId: string; body: any }, { rejectWithValue }) => {
        try {
            const response = await client.put(EMPLOYER_ENDPOINTS.updateApplicationStatus(applicationId), body);
            return response.data || response;
        } catch (error: any) {
            console.log('Error updating application status:', error);
            return rejectWithValue({
                message: error?.message || 'Failed to update application status',
                code: error?.code || 'ERROR',
            });
        }
    }
);
//Check candidate skills API call
export const checkCandidateSkills = createAsyncThunk(
    "jobPostings/checkCandidateSkills",
    async ({ candidateId }: { candidateId: string }, { rejectWithValue }) => {
        try {
            const response = await client.get(EMPLOYER_ENDPOINTS.employerCheckCandidateSkills(candidateId));
            return response.data || response;
        } catch (error: any) {
            console.log('Error fetching candidate skills:', error);
            return rejectWithValue({
                message: error?.message || 'Failed to fetch candidate skills',
                code: error?.code || 'ERROR',
            });
        }
    }
);
//Check candidate work experience API call
export const checkCandidateWork = createAsyncThunk(
    "jobPostings/checkCandidateWork",
    async ({ candidateId }: { candidateId: string }, { rejectWithValue }) => {
        try {
            const response = await client.get(EMPLOYER_ENDPOINTS.employerCheckCandidateWorkExperience(candidateId));
            return response.data || response;
        } catch (error: any) {
            console.log('Error fetching candidate work experience:', error);
            return rejectWithValue({
                message: error?.message || 'Failed to fetch candidate work experience',
                code: error?.code || 'ERROR',
            });
        }
    }
);
//check candidate education API call
export const checkCandidateEducation = createAsyncThunk(
    "jobPostings/checkCandidateEducation",
    async ({ candidateId }: { candidateId: string }, { rejectWithValue }) => {
        try {
            const response = await client.get(EMPLOYER_ENDPOINTS.employerCheckCandidateEducation(candidateId));
            return response.data || response;
        } catch (error: any) {
            console.log('Error fetching candidate education:', error);
            return rejectWithValue({
                message: error?.message || 'Failed to fetch candidate education',
                code: error?.code || 'ERROR',
            });
        }
    }
);
//check candidate video API call
export const checkCandidateVideo = createAsyncThunk(
    "jobPostings/checkCandidateVideo",
    async ({ candidateId }: { candidateId: string }, { rejectWithValue }) => {
        try {
            const response = await client.get(EMPLOYER_ENDPOINTS.employerCheckCandidateVideo(candidateId));
            return response.data || response;
        } catch (error: any) {
            console.log('Error fetching candidate video:', error);
            return rejectWithValue({
                message: error?.message || 'Failed to fetch candidate video',
                code: error?.code || 'ERROR',
            });
        }
    }
);



const jobPostingsSlice = createSlice({
    name: 'jobPostings',
    initialState,
    reducers: {
        clearEmployerJobPostingsData: (state) => {
            state.data = null;
            state.isLoading = false;
            state.error = null;
            state.total = 0;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // getJobPostingStats async thunk handlers
            .addCase(getJobPostingStats.pending, (state) => {
                state.isLoading = true;
                state.error = null;

            })
            .addCase(getJobPostingStats.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload; // Assuming the API returns an object with job posting stats
                state.error = null;
            })
            .addCase(getJobPostingStats.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                console.log('Error fetching job posting stats:', action.payload);
            })
            // postCreateJob async thunk handlers
            .addCase(postCreateJob.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(postCreateJob.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload; // Assuming the API returns an object with the created job data
                state.error = null;
                state.jobCreationStatus = 'success';
            })
            .addCase(postCreateJob.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.jobCreationStatus = 'error';
                console.log('Error creating job:', action.payload);
            })
            // viewJobDetails async thunk handlers
            .addCase(viewJobDetails.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(viewJobDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.jobData = action.payload;
                state.error = null;
            })
            .addCase(viewJobDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // duplicateJobDetails async thunk handlers
            .addCase(duplicateJobDetails.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(duplicateJobDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.jobData = action.payload;
                state.error = null;
            })
            .addCase(duplicateJobDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(editJobDetails.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(editJobDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.jobData = action.payload;
                state.error = null;
            })
            .addCase(editJobDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(publishJob.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(publishJob.fulfilled, (state, action) => {
                state.isLoading = false;
                state.jobData = action.payload;
                state.error = null;
            })
            .addCase(publishJob.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(deleteJobPosting.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteJobPosting.fulfilled, (state, action) => {
                state.isLoading = false;
                state.jobData = action.payload;
                state.error = null;
            })
            .addCase(deleteJobPosting.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            //employer job data async thunk handlers
            .addCase(getEmployerJobData.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getEmployerJobData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selectedJobData = action.payload;
                state.error = null;
            })
            .addCase(getEmployerJobData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            //employer job applications async thunk handlers
            .addCase(getEmployerJobApplications.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getEmployerJobApplications.fulfilled, (state, action) => {
                state.isLoading = false;
                state.jobApplicationsData = action.payload;
                state.error = null;
            })
            .addCase(getEmployerJobApplications.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            //update application status async thunk handlers
            .addCase(updateApplicationStatus.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateApplicationStatus.fulfilled, (state, action) => {
                state.isLoading = false;
                state.applicationStatusData = action.payload;
                state.error = null;
            })
            .addCase(updateApplicationStatus.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            //check candidate skills async thunk handlers
            .addCase(checkCandidateSkills.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(checkCandidateSkills.fulfilled, (state, action) => {
                state.isLoading = false;
                state.candidateSkillsData = action.payload;
                state.error = null;
            })
            .addCase(checkCandidateSkills.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            //check candidate work experience async thunk handlers
            .addCase(checkCandidateWork.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(checkCandidateWork.fulfilled, (state, action) => {
                state.isLoading = false;
                state.candidateWorkExperienceData = action.payload;
                state.error = null;
            })
            .addCase(checkCandidateWork.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            //check candidate education async thunk handlers
            .addCase(checkCandidateEducation.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(checkCandidateEducation.fulfilled, (state, action) => {
                state.isLoading = false;
                state.candidateEducationData = action.payload;
                state.error = null;
            })
            .addCase(checkCandidateEducation.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            //check candidate video async thunk handlers
            .addCase(checkCandidateVideo.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(checkCandidateVideo.fulfilled, (state, action) => {
                state.isLoading = false;
                state.candidateVideoData = action.payload;
                state.error = null;
            })
            .addCase(checkCandidateVideo.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

    }
});

export const {
    clearEmployerJobPostingsData
} = jobPostingsSlice.actions;

export default jobPostingsSlice.reducer;
