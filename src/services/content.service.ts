import axiosInstance from './api';
import type { ContentFile, ContentFilters, ContentListResponse, ContentUploadRequest, ContentMetadata } from '../types/content.types';

export const contentService = {
  // Get all content with filters and pagination
  async getContent(
    page: number = 1,
    limit: number = 10,
    filters?: ContentFilters
  ): Promise<ContentListResponse> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(filters?.subject && { subject: filters.subject }),
      ...(filters?.chapter && { chapter: filters.chapter }),
      ...(filters?.class && { class: filters.class }),
      ...(filters?.searchText && { search: filters.searchText }),
      ...(filters?.status && { status: filters.status.join(',') }),
    });

    const response = await axiosInstance.get<ContentListResponse>(`/content?${params}`);
    return response.data;
  },

  // Get single content by ID
  async getContentById(id: string): Promise<ContentFile> {
    const response = await axiosInstance.get<ContentFile>(`/content/${id}`);
    return response.data;
  },

  // Upload new content
  async uploadContent(data: ContentUploadRequest): Promise<ContentFile> {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('class', data.class);
    formData.append('subject', data.subject);
    formData.append('chapter', data.chapter);
    formData.append('topic', data.topic);
    formData.append('tags', JSON.stringify(data.tags));
    formData.append('learningOutcomes', JSON.stringify(data.learningOutcomes));

    const response = await axiosInstance.post<ContentFile>('/content/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update content metadata
  async updateContentMetadata(id: string, metadata: ContentMetadata): Promise<ContentFile> {
    const response = await axiosInstance.put<ContentFile>(`/content/${id}/metadata`, metadata);
    return response.data;
  },

  // Change content status
  async changeContentStatus(id: string, status: string): Promise<ContentFile> {
    const response = await axiosInstance.patch<ContentFile>(`/content/${id}/status`, { status });
    return response.data;
  },

  // Publish content
  async publishContent(id: string): Promise<ContentFile> {
    return this.changeContentStatus(id, 'published');
  },

  // Archive content
  async archiveContent(id: string): Promise<ContentFile> {
    return this.changeContentStatus(id, 'archived');
  },

  // Delete content
  async deleteContent(id: string): Promise<void> {
    await axiosInstance.delete(`/content/${id}`);
  },

  // Bulk operations
  async bulkPublish(ids: string[]): Promise<void> {
    await axiosInstance.post('/content/bulk/publish', { ids });
  },

  async bulkArchive(ids: string[]): Promise<void> {
    await axiosInstance.post('/content/bulk/archive', { ids });
  },

  async bulkDelete(ids: string[]): Promise<void> {
    await axiosInstance.post('/content/bulk/delete', { ids });
  },

  // Export content list
  async exportContent(format: 'csv' | 'excel', filters?: ContentFilters): Promise<Blob> {
    const params = new URLSearchParams({
      format,
      ...(filters?.subject && { subject: filters.subject }),
      ...(filters?.chapter && { chapter: filters.chapter }),
      ...(filters?.class && { class: filters.class }),
      ...(filters?.status && { status: filters.status.join(',') }),
    });

    const response = await axiosInstance.get(`/content/export?${params}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Get content statistics
  async getContentStats(): Promise<{
    total: number;
    published: number;
    draft: number;
    underReview: number;
    archived: number;
  }> {
    const response = await axiosInstance.get('/content/stats');
    return response.data;
  },

  // Get available subjects
  async getSubjects(): Promise<string[]> {
    const response = await axiosInstance.get<{ subjects: string[] }>('/content/subjects');
    return response.data.subjects;
  },

  // Get chapters for subject
  async getChapters(subject: string): Promise<string[]> {
    const response = await axiosInstance.get<{ chapters: string[] }>(`/content/chapters/${subject}`);
    return response.data.chapters;
  },

  // Get classes
  async getClasses(): Promise<string[]> {
    const response = await axiosInstance.get<{ classes: string[] }>('/content/classes');
    return response.data.classes;
  },
};

export default contentService;

