import { baseApi } from "./baseApi";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Dashboard
    getDashboard: builder.query({
      query: () => "/admin/dashboard",
      providesTags: ["Dashboard"],
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
          ...(params.tutorId && { tutorId: params.tutorId }),
          ...(params.search && { search: params.search }),
        },
      }),
      providesTags: ["Club"],
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

    // Hemis Sync
    syncHemisData: builder.mutation({
      query: () => ({
        url: "/admin/sync-hemis",
        method: "POST",
      }),
      invalidatesTags: ["Student", "Dashboard", "Faculties", "Groups"],
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
  }),
});

export const {
  useGetDashboardQuery,
  useGetFacultiesQuery,
  useGetGroupsQuery,
  useGetFacultyAdminsQuery,
  useCreateFacultyAdminMutation,
  useUpdateFacultyAdminMutation,
  useDeleteFacultyAdminMutation,
  useGetClubsQuery,
  useGetStudentsQuery,
  useGetAttendanceQuery,
  useGetAttendanceReportQuery,
  useGetStudentAttendanceQuery,
  useGetClubAttendanceReportQuery,
  useSyncHemisDataMutation,
  useGetCommonFacultiesQuery,
  useGetCommonGroupsQuery,
} = adminApi;
