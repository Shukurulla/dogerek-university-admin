// src/store/api/statisticsApi.js - Statistika API endpoints
import { baseApi } from "./baseApi";

export const statisticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get statistics by period
    getStatisticsByPeriod: builder.query({
      query: ({ startDate, endDate, scope = "faculty" }) => ({
        url: "/statistics/period",
        params: { startDate, endDate, scope },
      }),
      providesTags: ["Statistics"],
    }),

    // Get attendance trends
    getAttendanceTrends: builder.query({
      query: ({ startDate, endDate, scope = "faculty", groupBy = "day" }) => ({
        url: "/statistics/attendance-trends",
        params: { startDate, endDate, scope, groupBy },
      }),
      providesTags: ["Statistics"],
    }),

    // Get top performers
    getTopPerformers: builder.query({
      query: ({ startDate, endDate, scope = "faculty", limit = 10 }) => ({
        url: "/statistics/top-performers",
        params: { startDate, endDate, scope, limit },
      }),
      providesTags: ["Statistics"],
    }),

    // Get club statistics
    getClubStatistics: builder.query({
      query: ({ startDate, endDate, scope = "faculty" }) => ({
        url: "/statistics/clubs",
        params: { startDate, endDate, scope },
      }),
      providesTags: ["Statistics"],
    }),

    // Get faculty comparison (for university admin)
    getFacultyComparison: builder.query({
      query: ({ startDate, endDate }) => ({
        url: "/statistics/faculty-comparison",
        params: { startDate, endDate },
      }),
      providesTags: ["Statistics"],
    }),

    // Get student engagement metrics
    getStudentEngagement: builder.query({
      query: ({ startDate, endDate, scope = "faculty" }) => ({
        url: "/statistics/student-engagement",
        params: { startDate, endDate, scope },
      }),
      providesTags: ["Statistics"],
    }),

    // Get growth metrics
    getGrowthMetrics: builder.query({
      query: ({ startDate, endDate, scope = "faculty", compareWith }) => ({
        url: "/statistics/growth",
        params: { startDate, endDate, scope, compareWith },
      }),
      providesTags: ["Statistics"],
    }),

    // Get attendance heatmap data
    getAttendanceHeatmap: builder.query({
      query: ({ startDate, endDate, scope = "faculty" }) => ({
        url: "/statistics/attendance-heatmap",
        params: { startDate, endDate, scope },
      }),
      providesTags: ["Statistics"],
    }),

    // Get performance indicators
    getPerformanceIndicators: builder.query({
      query: ({ startDate, endDate, scope = "faculty" }) => ({
        url: "/statistics/performance-indicators",
        params: { startDate, endDate, scope },
      }),
      providesTags: ["Statistics"],
    }),

    // Export statistics report
    exportStatisticsReport: builder.mutation({
      query: ({ startDate, endDate, scope = "faculty", format = "xlsx" }) => ({
        url: "/statistics/export",
        method: "POST",
        body: { startDate, endDate, scope, format },
        responseHandler: (response) => response.blob(),
      }),
    }),

    // Get real-time statistics
    getRealTimeStatistics: builder.query({
      query: ({ scope = "faculty" }) => ({
        url: "/statistics/real-time",
        params: { scope },
      }),
      providesTags: ["Statistics"],
      // Refetch every 30 seconds for real-time data
      pollingInterval: 30000,
    }),

    // Get weekly/monthly reports
    getPeriodicReport: builder.query({
      query: ({ period = "week", scope = "faculty", offset = 0 }) => ({
        url: "/statistics/periodic-report",
        params: { period, scope, offset },
      }),
      providesTags: ["Statistics"],
    }),

    // Get attendance comparison between periods
    getAttendanceComparison: builder.query({
      query: ({
        currentStart,
        currentEnd,
        previousStart,
        previousEnd,
        scope = "faculty",
      }) => ({
        url: "/statistics/attendance-comparison",
        params: {
          currentStart,
          currentEnd,
          previousStart,
          previousEnd,
          scope,
        },
      }),
      providesTags: ["Statistics"],
    }),

    // Get student progress tracking
    getStudentProgress: builder.query({
      query: ({ studentId, startDate, endDate }) => ({
        url: `/statistics/student-progress/${studentId}`,
        params: { startDate, endDate },
      }),
      providesTags: (result, error, { studentId }) => [
        { type: "Statistics", id: `student-${studentId}` },
      ],
    }),

    // Get club performance metrics
    getClubPerformance: builder.query({
      query: ({ clubId, startDate, endDate }) => ({
        url: `/statistics/club-performance/${clubId}`,
        params: { startDate, endDate },
      }),
      providesTags: (result, error, { clubId }) => [
        { type: "Statistics", id: `club-${clubId}` },
      ],
    }),

    // Get predictive analytics
    getPredictiveAnalytics: builder.query({
      query: ({ scope = "faculty", type = "attendance" }) => ({
        url: "/statistics/predictive",
        params: { scope, type },
      }),
      providesTags: ["Statistics"],
    }),
  }),
});

export const {
  useGetStatisticsByPeriodQuery,
  useGetAttendanceTrendsQuery,
  useGetTopPerformersQuery,
  useGetClubStatisticsQuery,
  useGetFacultyComparisonQuery,
  useGetStudentEngagementQuery,
  useGetGrowthMetricsQuery,
  useGetAttendanceHeatmapQuery,
  useGetPerformanceIndicatorsQuery,
  useExportStatisticsReportMutation,
  useGetRealTimeStatisticsQuery,
  useGetPeriodicReportQuery,
  useGetAttendanceComparisonQuery,
  useGetStudentProgressQuery,
  useGetClubPerformanceQuery,
  useGetPredictiveAnalyticsQuery,
} = statisticsApi;
