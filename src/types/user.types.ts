// User type definitions

export type UserRole = 'admin' | 'teacher' | 'content_creator' | 'question_creator';
export type UserStatus = 'active' | 'inactive' | 'pending';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  assignedSubjects: string[];
  assignedClasses: string[];
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface UserFilters {
  role?: UserRole;
  status?: UserStatus;
  createdDateRange?: { from: string; to: string };
  lastLoginRange?: { from: string; to: string };
}

export interface UserListResponse {
  data: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateUserRequest {
  email: string;
  fullName: string;
  password: string;
  role: UserRole;
  phone?: string;
  assignedSubjects: string[];
  assignedClasses: string[];
}

export interface UpdateUserRequest {
  fullName?: string;
  phone?: string;
  role?: UserRole;
  assignedSubjects?: string[];
  assignedClasses?: string[];
}

