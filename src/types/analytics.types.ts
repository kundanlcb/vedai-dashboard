// Analytics type definitions

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalContent: number;
  totalQuestions: number;
  totalTests: number;
  totalAttempts: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  date?: string;
}

export interface ContentAnalytics {
  totalContent: number;
  bySubject: Record<string, number>;
  byChapter: Record<string, number>;
  publishingRate: number;
  processingStatus: Record<string, number>;
  averageProcessingTime: number;
  usage: { views: number; downloads: number };
  successRate: number;
}

export interface QuestionAnalytics {
  totalQuestions: number;
  byDifficulty: Record<string, number>;
  byBloomsLevel: Record<string, number>;
  averageSuccessRate: number;
  totalAttempts: number;
  successRateDistribution: number[];
  mostAttempted: { id: string; text: string; attempts: number }[];
}

export interface TestAnalytics {
  totalTests: number;
  totalAttempts: number;
  averageScore: number;
  passRate: number;
  completionRate: number;
  averageTimeMinutes: number;
  studentPerformance: { score: number; count: number }[];
  trendingTests: { id: string; name: string; attempts: number }[];
}

export interface AnalyticsFilters {
  dateRange?: { from: string; to: string };
  class?: string;
  subject?: string;
  chapter?: string;
}

