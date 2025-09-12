import { baseApi } from "./baseApi";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Dashboard
    getDashboard: builder.query({
      query: () => "/admin/dashboard",
      providesTags: ["Dashboard"],
    }),

    // Faculty Admins
    getFacultyAdmins: builder.query({
      query: () => "/admin/faculty-admins",
      providesTags: ["Faculty"],
    }),

    createFacultyAdmin: builder.mutation({
      query: (data) => ({
        url: "/admin/faculty-admin",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Faculty"],
    }),

    updateFacultyAdmin: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/faculty-admin/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Faculty"],
    }),

    deleteFacultyAdmin: builder.mutation({
      query: (id) => ({
        url: `/admin/faculty-admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Faculty"],
    }),

    // Reports
    getClubs: builder.query({
      query: (params) => ({
        url: "/admin/clubs",
        params,
      }),
      providesTags: ["Club"],
    }),

    getStudents: builder.query({
      query: (params) => ({
        url: "/admin/students",
        params,
      }),
      providesTags: ["Student"],
    }),

    getAttendance: builder.query({
      query: (params) => ({
        url: "/admin/attendance",
        params,
      }),
      providesTags: ["Attendance"],
    }),

    // Hemis Sync
    syncHemisData: builder.mutation({
      query: () => ({
        url: "/admin/sync-hemis",
        method: "POST",
      }),
      invalidatesTags: ["Student", "Dashboard"],
    }),
  }),
});

export const {
  useGetDashboardQuery,
  useGetFacultyAdminsQuery,
  useCreateFacultyAdminMutation,
  useUpdateFacultyAdminMutation,
  useDeleteFacultyAdminMutation,
  useGetClubsQuery,
  useGetStudentsQuery,
  useGetAttendanceQuery,
  useSyncHemisDataMutation,
} = adminApi;
