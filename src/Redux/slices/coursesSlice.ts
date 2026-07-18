import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import client from '../../Networking/Client';
import { COURSE_ENDPOINTS, JOBS_ENDPOINTS } from '../../Networking/EndPoints';


interface coursesState {
    courses: object | null;
    isLoading: boolean;
    error: string | null;
    total: number
    orderData?: object | null;
    verifyData?: object | null;
    courseEnrollmentMessage?: string | null;
    enrolledCourse?: object | null;
    chapterId?: string | null;
    lessonId?: string | null;
    lessonsData?: object | null;
}

const initialState: coursesState = {
    courses: null,
    isLoading: false,
    error: null,
    total: 0,
    orderData: null,
    verifyData: null,
    courseEnrollmentMessage: null,
    enrolledCourse: null,
    chapterId: null,
    lessonId: null,
    lessonsData: null,
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
export const createOrder = createAsyncThunk(
    "courses/createOrder",
    async (body: any, { rejectWithValue }) => {
        try {
            const response = await client.post(COURSE_ENDPOINTS.createOrder, body);
            return response.data || response;
        } catch (error: any) {
            console.log('Error creating order:', error);
            return rejectWithValue({
                message: error?.message || 'Failed to create order',
                code: error?.code || 'ERROR',
            });
        }
    }
);

export const verifyOrder = createAsyncThunk(
    "courses/verifyOrder",
    async (body: any, { rejectWithValue }) => {
        try {
            const response = await client.post(COURSE_ENDPOINTS.verifyOrder, body);
            return response.data || response;
        } catch (error: any) {
            console.log('Error verifying order:', error);
            return rejectWithValue({
                message: error?.message || 'Failed to verify order',
                code: error?.code || 'ERROR',
            });
        }
    }
);
export const getEnrollmentCourses = createAsyncThunk(
    "courses/getEnrollmentCourses",
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await client.get(COURSE_ENDPOINTS.enrollmentCourses(userId));
            return response.data || response;
        } catch (error: any) {
            console.log('Error fetching enrollment courses:', error);
            return rejectWithValue({
                message: error?.message || 'Failed to fetch enrollment courses',
                code: error?.code || 'ERROR',
            });
        }
    }
);
export const getCourseChaptersById = createAsyncThunk(
    "courses/getCourseChaptersById",
    async (courseId: string, { rejectWithValue }) => {
        try {
            const response = await client.get(COURSE_ENDPOINTS.courseChaptersById(courseId));
            return response.data || response;
        } catch (error: any) {
            console.log('Error fetching course chapters:', error);
            return rejectWithValue({
                message: error?.message || 'Failed to fetch course chapters',
                code: error?.code || 'ERROR',
            });
        }
    }
);
export const getCourseChapterLessonDetailsById = createAsyncThunk(
    "courses/getCourseChapterLessonDetailsById",
    async (chapterId: string, { rejectWithValue }) => {
        try {
            const response = await client.get(COURSE_ENDPOINTS.courseChapterLessonDetailsById(chapterId));
            return response.data || response;
        } catch (error: any) {
            console.log('Error fetching course chapter lesson details:', error);
            return rejectWithValue({
                message: error?.message || 'Failed to fetch course chapter lesson details',
                code: error?.code || 'ERROR',
            });
        }
    }
);
export const getLessonDetailsById = createAsyncThunk(
    "courses/getLessonDetailsById",
    async (lessonId: string, { rejectWithValue }) => {
        try {
            const response = await client.get(COURSE_ENDPOINTS.lessonDetailsById(lessonId));
            return response.data || response;
        } catch (error: any) {
            console.log('Error fetching lesson details:', error);
            return rejectWithValue({
                message: error?.message || 'Failed to fetch lesson details',
                code: error?.code || 'ERROR',
            });
        }
    }
);
export const downloadLessonById = createAsyncThunk(
    "courses/downloadLessonById",
    async ({ lessonId, DocumentId }: { lessonId: string; DocumentId: string }, { rejectWithValue }) => {
        try {
            const response = await client.get(COURSE_ENDPOINTS.DownloadLessonById(lessonId, DocumentId), {
                responseType: 'blob', // Important for downloading files
            });
            return response.data || response;
        } catch (error: any) {
            console.log('Error downloading lesson:', error);
            return rejectWithValue({
                message: error?.message || 'Failed to download lesson',
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
        clearVerifyData: (state) => {
            state.verifyData = null;
        }
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
                state.error = null;
            })
            .addCase(getCourses.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // createOrder async thunk handlers 
            .addCase(createOrder.pending, (state) => {
                state.isLoading = true;
                state.error = null;

            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.orderData = action.payload;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
        // verifyOrder async thunk handlers
        builder
            .addCase(verifyOrder.pending, (state) => {
                state.isLoading = true;
                state.error = null;

            })
            .addCase(verifyOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.verifyData = action.payload;
            })
            .addCase(verifyOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
        // getEnrollmentCourses async thunk handlers
        builder
            .addCase(getEnrollmentCourses.pending, (state) => {
                state.isLoading = true;
                state.error = null;

            })
            .addCase(getEnrollmentCourses.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;// Assuming the API returns an array of enrolled courses
                state.enrolledCourse = action.payload.enrollments;
            })
            .addCase(getEnrollmentCourses.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                const payload: any = action.payload;
                state.courseEnrollmentMessage = payload?.message ?? (typeof payload === 'string' ? payload : null);
            });
        // getCourseChaptersById async thunk handlers
        builder
            .addCase(getCourseChaptersById.pending, (state) => {
                state.isLoading = true;
                state.error = null;

            })
            .addCase(getCourseChaptersById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;// Assuming the API returns an array of course chapters
                state.chapterId = action.payload[0]?.id; // Assuming the API returns an array of chapters and you want the first chapter's ID
                // You can store the chapters in the state if needed
            })
            .addCase(getCourseChaptersById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
        // getCourseChapterLessonDetailsById async thunk handlers
        builder
            .addCase(getCourseChapterLessonDetailsById.pending, (state) => {
                state.isLoading = true;
                state.error = null;

            })
            .addCase(getCourseChapterLessonDetailsById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;// Assuming the API returns an array of lessons
                state.lessonId = action.payload[0]?.id; // Assuming the API returns an array of lessons and you want the first lesson's ID
                // You can store the lessons in the state if needed
            })
            .addCase(getCourseChapterLessonDetailsById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
        // getLessonDetailsById async thunk handlers
        builder
            .addCase(getLessonDetailsById.pending, (state) => {
                state.isLoading = true;
                state.error = null;

            })
            .addCase(getLessonDetailsById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;// Assuming the API returns lesson details
                state.lessonsData = action.payload.data; // Assuming the API returns lesson details
                // You can store the lesson details in the state if needed
            })
            .addCase(getLessonDetailsById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    }
});

export const {
    clearCoursesData,
    clearError,
    clearVerifyData
} = coursesSlice.actions;

export default coursesSlice.reducer;
