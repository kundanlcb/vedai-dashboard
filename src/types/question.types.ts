// Question type definitions

export type QuestionType = 'mcq' | 'true_false' | 'short_answer' | 'essay';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type BloomsLevel = 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';
export type QuestionStatus = 'draft' | 'under_review' | 'published' | 'archived';

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  text: string;
  explanation: string;
  type: QuestionType;
  marks: number;
  class: string;
  subject: string;
  chapter: string;
  topic: string;
  difficultyLevel: DifficultyLevel;
  bloomsLevel: BloomsLevel;
  learningOutcomes: string[];
  options: QuestionOption[];
  tags: string[];
  keywords: string[];
  status: QuestionStatus;
  reviewNotes: string;
  successRate: number;
  totalAttempts: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  reviewedBy?: string;
}

export interface QuestionFilters {
  subject?: string;
  chapter?: string;
  difficultyLevel?: DifficultyLevel;
  bloomsLevel?: BloomsLevel;
  type?: QuestionType;
  status?: QuestionStatus;
  successRateRange?: { min: number; max: number };
  createdDateRange?: { from: string; to: string };
}

export interface QuestionListResponse {
  data: Question[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateQuestionRequest {
  text: string;
  explanation: string;
  type: QuestionType;
  marks: number;
  class: string;
  subject: string;
  chapter: string;
  topic: string;
  difficultyLevel: DifficultyLevel;
  bloomsLevel: BloomsLevel;
  learningOutcomes: string[];
  options: QuestionOption[];
  tags: string[];
  keywords: string[];
}

