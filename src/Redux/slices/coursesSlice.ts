import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import client from '../../Networking/Client';
import { COURSE_ENDPOINTS, JOBS_ENDPOINTS } from '../../Networking/EndPoints';


interface coursesState {
    courses: object | null;
    isLoading: boolean;
    error: string | null;
    total: number
   
}

const initialState: coursesState = {
    courses: null,
    isLoading: false,
    error: null,
    total: 0
};
//Recommended jobs API call
export const getCourses = createAsyncThunk(
    "courses/getCourses",
    async (_, { rejectWithValue }) => {
        try {
            const response = await client.get(COURSE_ENDPOINTS.courseDetails);
            return response.data || response;
        } catch (error: any) {
            console.log('Error fetching courses:', error);
            return rejectWithValue({
                message: error?.message || 'Failed to fetch courses',
                code: error?.code || 'ERROR',
            });
        }
    }
);

const coursesSlice = createSlice({
    name: 'courses',
    initialState,
    reducers: {
        clearCoursesData: (state) => {
            state.courses = null;
            state.total = 0;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // getCourses async thunk handlers
            .addCase(getCourses.pending, (state) => {
                state.isLoading = true;
                state.error = null;

            })
            .addCase(getCourses.fulfilled, (state, action) => {
                state.isLoading = false;
                state.courses = action.payload; // Assuming the API returns an array of courses
                console.log(state.courses, "state courses");
                state.error = null;
                console.log('Courses fetched successfully:', action.payload);
            })
            .addCase(getCourses.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                console.log('Error fetching courses:', action.payload);
            })
    }
});

export const {
    clearCoursesData,
} = coursesSlice.actions;

export default coursesSlice.reducer;
