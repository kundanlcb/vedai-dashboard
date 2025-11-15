import axiosInstance from './api';
import type { Test, TestFilters, TestListResponse, CreateTestRequest } from '../types/test.types';

const testService = {
  async getTests(page: number = 1, limit: number = 10, filters?: TestFilters): Promise<TestListResponse> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (filters?.subject) params.append('subject', filters.subject);
    if (filters?.chapter) params.append('chapter', filters.chapter);
    if (filters?.class) params.append('class', filters.class);
    if (filters?.status) params.append('status', filters.status);

    const response = await axiosInstance.get<TestListResponse>(`/tests?${params}`);
    return response.data;
  },

  async getTestById(id: string): Promise<Test> {
    const response = await axiosInstance.get<Test>(`/tests/${id}`);
    return response.data;
  },

  async createTest(data: CreateTestRequest): Promise<Test> {
    const response = await axiosInstance.post<Test>('/tests', data);
    return response.data;
  },

  async updateTest(id: string, data: CreateTestRequest): Promise<Test> {
    const response = await axiosInstance.put<Test>(`/tests/${id}`, data);
    return response.data;
  },

  async changeTestStatus(id: string, status: string): Promise<Test> {
    const response = await axiosInstance.patch<Test>(`/tests/${id}/status`, { status });
    return response.data;
  },

  async publishTest(id: string): Promise<Test> {
    return this.changeTestStatus(id, 'published');
  },

  async archiveTest(id: string): Promise<Test> {
    return this.changeTestStatus(id, 'archived');
  },

  async deleteTest(id: string): Promise<void> {
    await axiosInstance.delete(`/tests/${id}`);
  },

  async bulkPublish(ids: string[]): Promise<void> {
    await axiosInstance.post('/tests/bulk/publish', { ids });
  },

  async bulkArchive(ids: string[]): Promise<void> {
    await axiosInstance.post('/tests/bulk/archive', { ids });
  },

  async bulkDelete(ids: string[]): Promise<void> {
    await axiosInstance.post('/tests/bulk/delete', { ids });
  },

  async getTestStats(): Promise<{
    total: number;
    published: number;
    draft: number;
    underReview: number;
    archived: number;
  }> {
    const response = await axiosInstance.get('/tests/stats');
    return response.data;
  },

  async getSubjects(): Promise<string[]> {
    const response = await axiosInstance.get<{ subjects: string[] }>('/tests/subjects');
    return response.data.subjects;
  },

  async getChapters(subject: string): Promise<string[]> {
    const response = await axiosInstance.get<{ chapters: string[] }>(`/tests/chapters/${subject}`);
    return response.data.chapters;
  },

  async getClasses(): Promise<string[]> {
    const response = await axiosInstance.get<{ classes: string[] }>('/tests/classes');
    return response.data.classes;
  },
};

export default testService;

