import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl:
      import.meta.env.VITE_API_URL || "https://dogerek-server.vercel.app/api",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "Dashboard",
    "FacultyAdmin",
    "Club",
    "Student",
    "Attendance",
    "AttendanceReport",
    "StudentAttendance",
    "ClubAttendanceReport",
    "Faculties",
    "Groups",
    "CommonFaculties",
    "CommonGroups",
  ],
  endpoints: () => ({}),
});
