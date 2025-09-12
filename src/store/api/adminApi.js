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
        params: { facultyId },
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
      query: (params) => ({
        url: "/admin/clubs",
        params,
      }),
      providesTags: ["Club"],
    }),

    // Students
    getStudents: builder.query({
      query: (params) => ({
        url: "/admin/students",
        params,
      }),
      providesTags: ["Student"],
    }),

    // Attendance
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
      invalidatesTags: ["Student", "Dashboard", "Faculties", "Groups"],
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
  useSyncHemisDataMutation,
} = adminApi;
