import type { RootState } from '../store';

export const selectDashboardStats = (state: RootState) => state.analytics.dashboardStats;
export const selectContentAnalytics = (state: RootState) => state.analytics.contentAnalytics;
export const selectQuestionAnalytics = (state: RootState) => state.analytics.questionAnalytics;
export const selectTestAnalytics = (state: RootState) => state.analytics.testAnalytics;
export const selectAnalyticsLoading = (state: RootState) => state.analytics.loading;
export const selectAnalyticsError = (state: RootState) => state.analytics.error;
export const selectAnalyticsFilters = (state: RootState) => state.analytics.filters;

