// Test type definitions

export type TestStatus = 'draft' | 'under_review' | 'published' | 'archived';

export interface TestQuestion {
  questionId: string;
  marks: number;
  order: number;
}

export interface Test {
  id: string;
  name: string;
  description: string;
  class: string;
  subject: string;
  chapter: string;
  totalQuestions: number;
  totalMarks: number;
  duration: number;
  passingPercentage: number;
  showAnswersAfter: boolean;
  showScoreAfter: boolean;
  allowReview: boolean;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  negativeMarking: boolean;
  negativeMarkValue: number;
  correctAnswerMarks: number;
  status: TestStatus;
  questions: TestQuestion[];
  startDate?: string;
  endDate?: string;
  visibleToRoles: string[];
  passwordProtected: boolean;
  password?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  publishedDate?: string;
  totalAttempts: number;
  averageScore: number;
}

export interface TestFilters {
  subject?: string;
  chapter?: string;
  class?: string;
  status?: TestStatus;
  createdDateRange?: { from: string; to: string };
}

export interface TestListResponse {
  data: Test[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateTestRequest {
  name: string;
  description: string;
  class: string;
  subject: string;
  chapter: string;
  totalMarks: number;
  duration: number;
  passingPercentage: number;
  showAnswersAfter: boolean;
  showScoreAfter: boolean;
  allowReview: boolean;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  negativeMarking: boolean;
  negativeMarkValue: number;
  correctAnswerMarks: number;
  questions: TestQuestion[];
  startDate?: string;
  endDate?: string;
  visibleToRoles: string[];
  passwordProtected: boolean;
  password?: string;
}

