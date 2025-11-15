import axiosInstance from './api';
import type { LoginRequest, LoginResponse, ChangePasswordRequest, User } from '../types/auth';

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await axiosInstance.post<LoginResponse>('/admin/users/login', credentials);
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await axiosInstance.post('/admin/users/logout');
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
    }
  },

  async getCurrentUser(): Promise<User> {
    const response = await axiosInstance.get<User>('/admin/users/me');
    return response.data;
  },

  async changePassword(data: ChangePasswordRequest): Promise<void> {
    await axiosInstance.post('/admin/users/change-password', data);
  },

  async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axiosInstance.post<{ access_token: string }>(
      '/auth/refresh',
      { refresh_token: refreshToken }
    );

    const { access_token } = response.data;
    localStorage.setItem('auth_token', access_token);
    return access_token;
  },

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },

  setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  },

  removeToken(): void {
    localStorage.removeItem('auth_token');
  },

  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  },

  isAuthenticated(): boolean {
    return this.isTokenValid();
  },
};

export default authService;


