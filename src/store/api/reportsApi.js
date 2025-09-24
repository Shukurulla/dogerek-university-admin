import { baseApi } from "./baseApi";

export const reportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get comprehensive report data
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

    // Get faculty statistics
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

    // Get attendance analytics
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

    // Get top performers
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

    // Get club rankings
    getClubRankings: builder.query({
      query: ({ startDate, endDate, facultyId, sortBy = "students" }) => ({
        url: "/reports/club-rankings",
        params: {
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
          ...(facultyId && { facultyId }),
          sortBy,
        },
      }),
      providesTags: ["ClubRankings"],
    }),

    // Get engagement metrics
    getEngagementMetrics: builder.query({
      query: ({ startDate, endDate, facultyId }) => ({
        url: "/reports/engagement-metrics",
        params: {
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
          ...(facultyId && { facultyId }),
        },
      }),
      providesTags: ["EngagementMetrics"],
    }),

    // Get comparative analysis
    getComparativeAnalysis: builder.query({
      query: ({ currentPeriod, previousPeriod, facultyId }) => ({
        url: "/reports/comparative-analysis",
        params: {
          currentStart: currentPeriod?.start,
          currentEnd: currentPeriod?.end,
          previousStart: previousPeriod?.start,
          previousEnd: previousPeriod?.end,
          ...(facultyId && { facultyId }),
        },
      }),
      providesTags: ["ComparativeAnalysis"],
    }),

    // Export report as Excel
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

    // Export report as PDF
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

    // Get summary statistics
    getSummaryStatistics: builder.query({
      query: ({ startDate, endDate, facultyId }) => ({
        url: "/reports/summary",
        params: {
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
          ...(facultyId && { facultyId }),
        },
      }),
      providesTags: ["SummaryStats"],
    }),

    // Get trend analysis
    getTrendAnalysis: builder.query({
      query: ({
        period = "month",
        metrics = ["attendance", "enrollment"],
        facultyId,
      }) => ({
        url: "/reports/trends",
        params: {
          period,
          metrics: metrics.join(","),
          ...(facultyId && { facultyId }),
        },
      }),
      providesTags: ["TrendAnalysis"],
    }),

    // Get cross-faculty statistics
    getCrossFacultyStats: builder.query({
      query: ({ startDate, endDate }) => ({
        url: "/reports/cross-faculty",
        params: {
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
        },
      }),
      providesTags: ["CrossFacultyStats"],
    }),

    // Get predictive insights
    getPredictiveInsights: builder.query({
      query: ({ basedOnPeriod = "3months", predictFor = "1month" }) => ({
        url: "/reports/predictive-insights",
        params: {
          basedOnPeriod,
          predictFor,
        },
      }),
      providesTags: ["PredictiveInsights"],
    }),
  }),
});

export const {
  useGetReportDataQuery,
  useGetFacultyStatisticsQuery,
  useGetAttendanceAnalyticsQuery,
  useGetTopPerformersQuery,
  useGetClubRankingsQuery,
  useGetEngagementMetricsQuery,
  useGetComparativeAnalysisQuery,
  useExportReportExcelMutation,
  useExportReportPDFMutation,
  useGetSummaryStatisticsQuery,
  useGetTrendAnalysisQuery,
  useGetCrossFacultyStatsQuery,
  useGetPredictiveInsightsQuery,
} = reportApi;
