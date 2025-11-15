import axiosInstance from './api';
import type { User, UserFilters, UserListResponse, CreateUserRequest, UpdateUserRequest } from '../types/user.types';

const userService = {
  async getUsers(page: number = 1, limit: number = 10, filters?: UserFilters): Promise<UserListResponse> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (filters?.role) params.append('role', filters.role);
    if (filters?.status) params.append('status', filters.status);

    const response = await axiosInstance.get<UserListResponse>(`/users?${params}`);
    return response.data;
  },

  async getUserById(id: string): Promise<User> {
    const response = await axiosInstance.get<User>(`/users/${id}`);
    return response.data;
  },

  async createUser(data: CreateUserRequest): Promise<User> {
    const response = await axiosInstance.post<User>('/users', data);
    return response.data;
  },

  async updateUser(id: string, data: UpdateUserRequest): Promise<User> {
    const response = await axiosInstance.put<User>(`/users/${id}`, data);
    return response.data;
  },

  async changePassword(id: string, currentPassword: string, newPassword: string): Promise<void> {
    await axiosInstance.post(`/users/${id}/change-password`, { currentPassword, newPassword });
  },

  async deactivateUser(id: string): Promise<User> {
    const response = await axiosInstance.patch<User>(`/users/${id}/deactivate`, {});
    return response.data;
  },

  async activateUser(id: string): Promise<User> {
    const response = await axiosInstance.patch<User>(`/users/${id}/activate`, {});
    return response.data;
  },

  async deleteUser(id: string): Promise<void> {
    await axiosInstance.delete(`/users/${id}`);
  },

  async bulkDeactivate(ids: string[]): Promise<void> {
    await axiosInstance.post('/users/bulk/deactivate', { ids });
  },

  async bulkActivate(ids: string[]): Promise<void> {
    await axiosInstance.post('/users/bulk/activate', { ids });
  },

  async bulkDelete(ids: string[]): Promise<void> {
    await axiosInstance.post('/users/bulk/delete', { ids });
  },

  async getUserStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    pending: number;
  }> {
    const response = await axiosInstance.get('/users/stats');
    return response.data;
  },

  async getSubjects(): Promise<string[]> {
    const response = await axiosInstance.get<{ subjects: string[] }>('/users/subjects');
    return response.data.subjects;
  },

  async getClasses(): Promise<string[]> {
    const response = await axiosInstance.get<{ classes: string[] }>('/users/classes');
    return response.data.classes;
  },
};

export default userService;

