import { baseApi } from "./baseApi";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Dashboard
    getDashboard: builder.query({
      query: () => "/admin/dashboard",
      providesTags: ["Dashboard"],
    }),

    // Categories
    getCategories: builder.query({
      query: (params = {}) => ({
        url: "/categories",
        params: {
          ...(params.isActive !== undefined && { isActive: params.isActive }),
        },
      }),
      providesTags: ["Category"],
    }),

    createCategory: builder.mutation({
      query: (data) => ({
        url: "/categories",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),

    updateCategory: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/categories/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Category", "Club"],
    }),

    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),

    getCategoryById: builder.query({
      query: (id) => `/categories/${id}`,
      providesTags: (result, error, id) => [{ type: "Category", id }],
    }),

    // Faculties
    getFaculties: builder.query({
      query: () => "/admin/faculties",
      providesTags: ["Faculties"],
    }),

    // Groups
    getGroups: builder.query({
      query: (facultyId) => ({
        url: "/admin/groups",
        params: facultyId ? { facultyId } : {},
      }),
      providesTags: ["Groups"],
    }),

    // Faculty Admins
    getFacultyAdmins: builder.query({
      query: () => "/admin/faculty-admins",
      providesTags: ["FacultyAdmin"],
    }),

    createFacultyAdmin: builder.mutation({
      query: (data) => ({
        url: "/admin/faculty-admin",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["FacultyAdmin", "Dashboard"],
    }),

    updateFacultyAdmin: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/faculty-admin/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["FacultyAdmin"],
    }),

    deleteFacultyAdmin: builder.mutation({
      query: (id) => ({
        url: `/admin/faculty-admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["FacultyAdmin", "Dashboard"],
    }),

    // Clubs
    getClubs: builder.query({
      query: (params = {}) => ({
        url: "/admin/clubs",
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          ...(params.facultyId && { facultyId: params.facultyId }),
          ...(params.categoryId && { categoryId: params.categoryId }),
          ...(params.tutorId && { tutorId: params.tutorId }),
          ...(params.search && { search: params.search }),
        },
      }),
      providesTags: ["Club"],
    }),

    getClubById: builder.query({
      query: (id) => `/clubs/${id}`,
      providesTags: (result, error, id) => [{ type: "Club", id }],
    }),

    createClub: builder.mutation({
      query: (data) => ({
        url: "/faculty/club",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Club", "Dashboard"],
    }),

    updateClub: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/faculty/club/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Club", "Dashboard"],
    }),

    deleteClub: builder.mutation({
      query: (id) => ({
        url: `/faculty/club/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Club", "Dashboard"],
    }),

    // Students
    getStudents: builder.query({
      query: (params = {}) => ({
        url: "/admin/students",
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          ...(params.facultyId && { facultyId: params.facultyId }),
          ...(params.groupId && { groupId: params.groupId }),
          ...(params.busy !== null &&
            params.busy !== undefined && { busy: params.busy }),
          ...(params.search && { search: params.search }),
        },
      }),
      providesTags: ["Student"],
    }),

    getStudentById: builder.query({
      query: (id) => `/students/${id}`,
      providesTags: (result, error, id) => [{ type: "Student", id }],
    }),

    // Attendance
    getAttendance: builder.query({
      query: (params = {}) => ({
        url: "/admin/attendance",
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          ...(params.clubId && { clubId: params.clubId }),
          ...(params.startDate && { startDate: params.startDate }),
          ...(params.endDate && { endDate: params.endDate }),
        },
      }),
      providesTags: ["Attendance"],
    }),

    getAttendanceDetails: builder.query({
      query: (id) => `/attendance/${id}`,
      providesTags: (result, error, id) => [{ type: "Attendance", id }],
    }),

    // Attendance Reports
    getAttendanceReport: builder.query({
      query: (params = {}) => ({
        url: "/attendance/report",
        params: {
          ...(params.startDate && { startDate: params.startDate }),
          ...(params.endDate && { endDate: params.endDate }),
          ...(params.facultyId && { facultyId: params.facultyId }),
        },
      }),
      providesTags: ["AttendanceReport"],
    }),

    getStudentAttendance: builder.query({
      query: ({ studentId, ...params }) => ({
        url: `/attendance/student/${studentId}`,
        params: {
          ...(params.clubId && { clubId: params.clubId }),
          ...(params.startDate && { startDate: params.startDate }),
          ...(params.endDate && { endDate: params.endDate }),
        },
      }),
      providesTags: ["StudentAttendance"],
    }),

    getClubAttendanceReport: builder.query({
      query: ({ clubId, ...params }) => ({
        url: `/attendance/club/${clubId}/report`,
        params: {
          ...(params.startDate && { startDate: params.startDate }),
          ...(params.endDate && { endDate: params.endDate }),
        },
      }),
      providesTags: ["ClubAttendanceReport"],
    }),

    // Tutors
    getTutors: builder.query({
      query: (params = {}) => ({
        url: "/faculty/tutors",
        params: {
          ...(params.facultyId && { facultyId: params.facultyId }),
        },
      }),
      providesTags: ["Tutor"],
    }),

    createTutor: builder.mutation({
      query: (data) => ({
        url: "/faculty/tutor",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Tutor", "Dashboard"],
    }),

    updateTutor: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/faculty/tutor/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Tutor"],
    }),

    deleteTutor: builder.mutation({
      query: (id) => ({
        url: `/faculty/tutor/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tutor", "Dashboard"],
    }),

    // Enrollments
    getEnrollments: builder.query({
      query: (params = {}) => ({
        url: "/faculty/enrollments",
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          ...(params.status && { status: params.status }),
          ...(params.clubId && { clubId: params.clubId }),
        },
      }),
      providesTags: ["Enrollment"],
    }),

    processEnrollment: builder.mutation({
      query: ({ id, action, rejectionReason }) => ({
        url: `/faculty/enrollment/${id}/process`,
        method: "POST",
        body: { action, rejectionReason },
      }),
      invalidatesTags: ["Enrollment", "Student", "Club", "Dashboard"],
    }),

    // External Courses
    getExternalCourses: builder.query({
      query: (params = {}) => ({
        url: "/student/external-courses",
        params: {
          ...(params.studentId && { studentId: params.studentId }),
        },
      }),
      providesTags: ["ExternalCourse"],
    }),

    // Hemis Sync
    syncHemisData: builder.mutation({
      query: () => ({
        url: "/admin/sync-hemis",
        method: "POST",
      }),
      invalidatesTags: ["Student", "Dashboard", "Faculties", "Groups"],
    }),

    // Reports & Statistics
    getReportData: builder.query({
      query: ({ startDate, endDate, facultyId }) => ({
        url: "/reports/comprehensive",
        params: {
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
          ...(facultyId && { facultyId }),
        },
      }),
      providesTags: ["Report"],
    }),

    getFacultyStatistics: builder.query({
      query: ({ startDate, endDate }) => ({
        url: "/reports/faculty-statistics",
        params: {
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
        },
      }),
      providesTags: ["FacultyStats"],
    }),

    getAttendanceAnalytics: builder.query({
      query: ({ startDate, endDate, facultyId, groupBy = "day" }) => ({
        url: "/reports/attendance-analytics",
        params: {
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
          ...(facultyId && { facultyId }),
          groupBy,
        },
      }),
      providesTags: ["AttendanceAnalytics"],
    }),

    getTopPerformers: builder.query({
      query: ({
        startDate,
        endDate,
        facultyId,
        limit = 10,
        type = "students",
      }) => ({
        url: "/reports/top-performers",
        params: {
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
          ...(facultyId && { facultyId }),
          limit,
          type,
        },
      }),
      providesTags: ["TopPerformers"],
    }),

    // Export functions
    exportReportExcel: builder.mutation({
      query: ({ startDate, endDate, facultyId, includeDetails = true }) => ({
        url: "/reports/export/excel",
        method: "POST",
        body: {
          startDate,
          endDate,
          facultyId,
          includeDetails,
        },
        responseHandler: (response) => response.blob(),
      }),
    }),

    exportReportPDF: builder.mutation({
      query: ({ startDate, endDate, facultyId, includeCharts = true }) => ({
        url: "/reports/export/pdf",
        method: "POST",
        body: {
          startDate,
          endDate,
          facultyId,
          includeCharts,
        },
        responseHandler: (response) => response.blob(),
      }),
    }),

    // Common endpoints
    getCommonFaculties: builder.query({
      query: () => "/faculties",
      providesTags: ["CommonFaculties"],
    }),

    getCommonGroups: builder.query({
      query: (facultyId) => ({
        url: "/groups",
        params: facultyId ? { facultyId } : {},
      }),
      providesTags: ["CommonGroups"],
    }),

    // Notifications
    getNotifications: builder.query({
      query: (params = {}) => ({
        url: "/notifications",
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          ...(params.seen !== undefined && { seen: params.seen }),
        },
      }),
      providesTags: ["Notification"],
    }),

    markNotificationAsSeen: builder.mutation({
      query: (id) => ({
        url: `/notifications/${id}/seen`,
        method: "PUT",
      }),
      invalidatesTags: ["Notification"],
    }),

    // User Profile
    getUserProfile: builder.query({
      query: () => "/auth/profile",
      providesTags: ["Profile"],
    }),

    updateUserProfile: builder.mutation({
      query: (data) => ({
        url: "/auth/profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Profile"],
    }),

    changePassword: builder.mutation({
      query: ({ oldPassword, newPassword }) => ({
        url: "/auth/change-password",
        method: "POST",
        body: { oldPassword, newPassword },
      }),
    }),
  }),
});

export const {
  // Dashboard
  useGetDashboardQuery,

  // Categories
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,

  // Faculties & Groups
  useGetFacultiesQuery,
  useGetGroupsQuery,
  useGetCommonFacultiesQuery,
  useGetCommonGroupsQuery,

  // Faculty Admins
  useGetFacultyAdminsQuery,
  useCreateFacultyAdminMutation,
  useUpdateFacultyAdminMutation,
  useDeleteFacultyAdminMutation,

  // Clubs
  useGetClubsQuery,
  useGetClubByIdQuery,
  useCreateClubMutation,
  useUpdateClubMutation,
  useDeleteClubMutation,

  // Students
  useGetStudentsQuery,
  useGetStudentByIdQuery,

  // Attendance
  useGetAttendanceQuery,
  useGetAttendanceDetailsQuery,
  useGetAttendanceReportQuery,
  useGetStudentAttendanceQuery,
  useGetClubAttendanceReportQuery,

  // Tutors
  useGetTutorsQuery,
  useCreateTutorMutation,
  useUpdateTutorMutation,
  useDeleteTutorMutation,

  // Enrollments
  useGetEnrollmentsQuery,
  useProcessEnrollmentMutation,

  // External Courses
  useGetExternalCoursesQuery,

  // Hemis Sync
  useSyncHemisDataMutation,

  // Reports & Statistics
  useGetReportDataQuery,
  useGetFacultyStatisticsQuery,
  useGetAttendanceAnalyticsQuery,
  useGetTopPerformersQuery,
  useExportReportExcelMutation,
  useExportReportPDFMutation,

  // Notifications
  useGetNotificationsQuery,
  useMarkNotificationAsSeenMutation,

  // User Profile
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useChangePasswordMutation,
} = adminApi;
