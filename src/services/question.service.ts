import axiosInstance from './api';
import type { Question, QuestionFilters, QuestionListResponse, CreateQuestionRequest } from '../types/question.types';

const questionService = {
  // Get questions with pagination and filters
  async getQuestions(
    page: number = 1,
    limit: number = 10,
    filters?: QuestionFilters
  ): Promise<QuestionListResponse> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (filters?.subject) params.append('subject', filters.subject);
    if (filters?.chapter) params.append('chapter', filters.chapter);
    if (filters?.difficultyLevel) params.append('difficulty', filters.difficultyLevel);
    if (filters?.bloomsLevel) params.append('blooms', filters.bloomsLevel);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.status) params.append('status', filters.status);

    const response = await axiosInstance.get<QuestionListResponse>(`/questions?${params}`);
    return response.data;
  },

  // Get single question
  async getQuestionById(id: string): Promise<Question> {
    const response = await axiosInstance.get<Question>(`/questions/${id}`);
    return response.data;
  },

  // Create new question
  async createQuestion(data: CreateQuestionRequest): Promise<Question> {
    const response = await axiosInstance.post<Question>('/questions', data);
    return response.data;
  },

  // Update question
  async updateQuestion(id: string, data: CreateQuestionRequest): Promise<Question> {
    const response = await axiosInstance.put<Question>(`/questions/${id}`, data);
    return response.data;
  },

  // Change question status
  async changeQuestionStatus(id: string, status: string): Promise<Question> {
    const response = await axiosInstance.patch<Question>(`/questions/${id}/status`, { status });
    return response.data;
  },

  // Publish question
  async publishQuestion(id: string): Promise<Question> {
    return this.changeQuestionStatus(id, 'published');
  },

  // Archive question
  async archiveQuestion(id: string): Promise<Question> {
    return this.changeQuestionStatus(id, 'archived');
  },

  // Delete question
  async deleteQuestion(id: string): Promise<void> {
    await axiosInstance.delete(`/questions/${id}`);
  },

  // Bulk operations
  async bulkPublish(ids: string[]): Promise<void> {
    await axiosInstance.post('/questions/bulk/publish', { ids });
  },

  async bulkArchive(ids: string[]): Promise<void> {
    await axiosInstance.post('/questions/bulk/archive', { ids });
  },

  async bulkDelete(ids: string[]): Promise<void> {
    await axiosInstance.post('/questions/bulk/delete', { ids });
  },

  // Export questions
  async exportQuestions(format: 'csv' | 'excel', filters?: QuestionFilters): Promise<Blob> {
    const params = new URLSearchParams({ format });
    if (filters?.subject) params.append('subject', filters.subject);
    if (filters?.chapter) params.append('chapter', filters.chapter);
    if (filters?.type) params.append('type', filters.type);

    const response = await axiosInstance.get(`/questions/export?${params}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Get statistics
  async getQuestionStats(): Promise<{
    total: number;
    published: number;
    draft: number;
    underReview: number;
    archived: number;
  }> {
    const response = await axiosInstance.get('/questions/stats');
    return response.data;
  },

  // Get available options for filters
  async getSubjects(): Promise<string[]> {
    const response = await axiosInstance.get<{ subjects: string[] }>('/questions/subjects');
    return response.data.subjects;
  },

  async getChapters(subject: string): Promise<string[]> {
    const response = await axiosInstance.get<{ chapters: string[] }>(`/questions/chapters/${subject}`);
    return response.data.chapters;
  },

  async getClasses(): Promise<string[]> {
    const response = await axiosInstance.get<{ classes: string[] }>('/questions/classes');
    return response.data.classes;
  },
};

export default questionService;

