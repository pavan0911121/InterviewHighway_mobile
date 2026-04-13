/**
 * API Configuration and Endpoints
 * Centralized endpoint management for all API calls
 */

// Base URLs
export const API_BASE_URL = 'https://api.interviewhighway.com';
export const RAILWAY_API_BASE_URL = 'https://interviewhighway-v2-production.up.railway.app';
// ============================================================================
// ============================================================================
// ============================================================================
// JOB_SEEKER ENDPOINTS
// ============================================================================
// ============================================================================
// ============================================================================

// =======================
// AUTH ENDPOINTS
// =======================

export const AUTH_ENDPOINTS = {
  login: `${API_BASE_URL}/auth/v1/token?grant_type=password`,
  userData: `${API_BASE_URL}/auth/v1/user`,
};

// ===========================
// USER ENDPOINTS (Main API)
// ==========================

export const USER_ENDPOINTS = {
  role: (userId: string) =>
    `${API_BASE_URL}/rest/v1/users?select=user_type&auth_user_id=eq.${userId}`,
  
  isVerified: (userId: string) =>
    `${API_BASE_URL}/rest/v1/users?select=id%2Cis_verified&auth_user_id=eq.${userId}`,
};

// =======================
// PROFILE ENDPOINTS
// ======================

export const PROFILE_ENDPOINTS = {
  profilePercentage: (userId: string) =>
    `${API_BASE_URL}/rest/v1/profiles?select=*&user_id=eq.${userId}`,
  
  profileData: (userId: string) =>
    `${API_BASE_URL}/rest/v1/profiles?select=*&user_id=eq.${userId}`,
  
  personalDataUpdate: (userId: string) =>
    `${RAILWAY_API_BASE_URL}/api/profiles/user/${userId}/personal`,
  
  bioUpdate: (userId: string) =>
    `${RAILWAY_API_BASE_URL}/api/profiles/user/${userId}/bio`,
  
  socialLinksUpdate: (userId: string) =>
    `${RAILWAY_API_BASE_URL}/api/profiles/user/${userId}/links`,
};

// =====================
// COURSE ENDPOINTS
// =====================

export const COURSE_ENDPOINTS = {
  courseDetails: `${API_BASE_URL}/rest/v1/courses?select=*&is_published=eq.true&order=created_at.desc`,
};

// ======================
// SKILLS ENDPOINTS
// ======================

export const SKILLS_ENDPOINTS = {
  getAllSkills: `${RAILWAY_API_BASE_URL}/api/skills`,
  
  addSkill: (userId: string) =>
    `${RAILWAY_API_BASE_URL}/api/skills/user/${userId}`,
};

// ===================
// JOBS ENDPOINTS
// ===================

export const JOBS_ENDPOINTS = {
  recommendedJobs: `${RAILWAY_API_BASE_URL}/api/jobs`,
};

// =================
// VIDEO ENDPOINTS
// =================

export const VIDEO_ENDPOINTS = {
  getVideoData: (userId: string) =>
    `${RAILWAY_API_BASE_URL}/api/video/user/${userId}`,
  
  uploadVideo: `${RAILWAY_API_BASE_URL}/api/video/upload`,
  
  deleteVideo: (userId: string) =>
    `${RAILWAY_API_BASE_URL}/api/video/user/${userId}`,
};

// =======================
// EXPERIENCE ENDPOINTS
// =======================

export const EXPERIENCE_ENDPOINTS = {
  addExperience: (userId: string) =>
    `${RAILWAY_API_BASE_URL}/api/work-experience/user/${userId}`,
};

// ======================
// EDUCATION ENDPOINTS
// ======================

export const EDUCATION_ENDPOINTS = {
  addEducation: (userId: string) =>
    `${RAILWAY_API_BASE_URL}/api/education/user/${userId}`,
};

// ===================
// RESUME ENDPOINTS
// ===================

export const RESUME_ENDPOINTS = {
  uploadResume: `${RAILWAY_API_BASE_URL}/api/resumes`,
  
  getUserResumes: (userId: string) =>
    `${RAILWAY_API_BASE_URL}/api/resumes/user/${userId}`,
};

// ============================================================================
// ============================================================================
// ============================================================================
// EMPLOYER ENDPOINTS
// ============================================================================
// ============================================================================
// ============================================================================

export const EMPLOYER_ENDPOINTS = {
  // Dashboard stats
  employerDashboardStats: (userId: string) =>
    `${RAILWAY_API_BASE_URL}/api/employer/dashboard/stats?userId=${userId}`,
  
  // Jobs list
  employerJobsList: (userId: string) =>
    `${RAILWAY_API_BASE_URL}/api/employer/jobs?userId=${userId}`,
  
  // Applications list
  employerApplicationsList: (userId: string) =>
    `${RAILWAY_API_BASE_URL}/api/employer/applications?userId=${userId}`,
  
  // Credit tiers
  employerCreditTiers: `${RAILWAY_API_BASE_URL}/api/employer/credits/tiers`,
  
  // Employer credits
  employerCredits: (userId: string) =>
    `${RAILWAY_API_BASE_URL}/api/employer/credits?userId=${userId}`,
  
  // Transactions
  employerTransactions: (userId: string, limit: number = 20, offset: number = 0) =>
    `${RAILWAY_API_BASE_URL}/api/employer/credits/transactions?userId=${userId}&limit=${limit}&offset=${offset}`,
  
  // Company profile
  employerCompanyProfile: (userId: string) =>
    `${RAILWAY_API_BASE_URL}/api/employer/profile?userId=${userId}`,
  
  // Analytics - Applications Timeline
  analyticsApplicationsTimeline: (userId: string, period: string = '30d') =>
    `${RAILWAY_API_BASE_URL}/api/employer/dashboard/applications-timeline?userId=${userId}&period=${period}`,
  
  // Analytics - Job Performance
  analyticsJobsPerformance: (userId: string) =>
    `${RAILWAY_API_BASE_URL}/api/employer/dashboard/jobs-performance?userId=${userId}`,
  
  // Analytics - Count Stats
  analyticsCount: (userId: string) =>
    `${RAILWAY_API_BASE_URL}/api/employer/dashboard/stats?userId=${userId}`,
};

// ============================================================================
// CONVENIENT EXPORTS - All endpoints in one object
// ============================================================================

export const API_ENDPOINTS = {
  auth: AUTH_ENDPOINTS,
  user: USER_ENDPOINTS,
  profile: PROFILE_ENDPOINTS,
  courses: COURSE_ENDPOINTS,
  skills: SKILLS_ENDPOINTS,
  jobs: JOBS_ENDPOINTS,
  videos: VIDEO_ENDPOINTS,
  experience: EXPERIENCE_ENDPOINTS,
  education: EDUCATION_ENDPOINTS,
  resumes: RESUME_ENDPOINTS,
  employer: EMPLOYER_ENDPOINTS,
};

export default API_ENDPOINTS;
