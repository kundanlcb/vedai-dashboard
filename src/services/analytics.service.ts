import axiosInstance from './api';
import type {
  DashboardStats,
  ContentAnalytics,
  QuestionAnalytics,
  TestAnalytics,
  AnalyticsFilters,
} from '../types/analytics.types';

const analyticsService = {
  async getDashboardStats(filters?: AnalyticsFilters): Promise<DashboardStats> {
    const params = new URLSearchParams();
    if (filters?.dateRange?.from) params.append('fromDate', filters.dateRange.from);
    if (filters?.dateRange?.to) params.append('toDate', filters.dateRange.to);

    const response = await axiosInstance.get<DashboardStats>(`/analytics/dashboard?${params}`);
    return response.data;
  },

  async getContentAnalytics(filters?: AnalyticsFilters): Promise<ContentAnalytics> {
    const params = new URLSearchParams();
    if (filters?.dateRange?.from) params.append('fromDate', filters.dateRange.from);
    if (filters?.dateRange?.to) params.append('toDate', filters.dateRange.to);
    if (filters?.subject) params.append('subject', filters.subject);
    if (filters?.chapter) params.append('chapter', filters.chapter);

    const response = await axiosInstance.get<ContentAnalytics>(`/analytics/content?${params}`);
    return response.data;
  },

  async getQuestionAnalytics(filters?: AnalyticsFilters): Promise<QuestionAnalytics> {
    const params = new URLSearchParams();
    if (filters?.dateRange?.from) params.append('fromDate', filters.dateRange.from);
    if (filters?.dateRange?.to) params.append('toDate', filters.dateRange.to);
    if (filters?.subject) params.append('subject', filters.subject);
    if (filters?.chapter) params.append('chapter', filters.chapter);

    const response = await axiosInstance.get<QuestionAnalytics>(`/analytics/questions?${params}`);
    return response.data;
  },

  async getTestAnalytics(filters?: AnalyticsFilters): Promise<TestAnalytics> {
    const params = new URLSearchParams();
    if (filters?.dateRange?.from) params.append('fromDate', filters.dateRange.from);
    if (filters?.dateRange?.to) params.append('toDate', filters.dateRange.to);
    if (filters?.class) params.append('class', filters.class);
    if (filters?.subject) params.append('subject', filters.subject);

    const response = await axiosInstance.get<TestAnalytics>(`/analytics/tests?${params}`);
    return response.data;
  },

  async generateReport(
    type: 'content' | 'question' | 'test' | 'user' | 'custom',
    filters?: AnalyticsFilters
  ): Promise<{ reportId: string; url: string }> {
    const response = await axiosInstance.post('/analytics/reports', { type, filters });
    return response.data;
  },

  async exportData(
    type: 'content' | 'questions' | 'tests' | 'users' | 'analytics',
    format: 'csv' | 'excel' | 'pdf' | 'json',
    filters?: AnalyticsFilters
  ): Promise<Blob> {
    const params = new URLSearchParams({ format });
    if (filters?.dateRange?.from) params.append('fromDate', filters.dateRange.from);
    if (filters?.dateRange?.to) params.append('toDate', filters.dateRange.to);

    const response = await axiosInstance.get(`/analytics/export/${type}?${params}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default analyticsService;

