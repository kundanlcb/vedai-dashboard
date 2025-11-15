export interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'super_admin' | 'content_manager' | 'question_manager' | 'test_manager' | 'teacher';
  permissions: string[];
  phone?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: 'bearer';
  user: User;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

