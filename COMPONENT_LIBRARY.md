# Component Library & API Reference

## Table of Contents
1. [Custom Hooks](#custom-hooks)
2. [Guards](#guards)
3. [Services](#services)
4. [Utilities](#utilities)
5. [Types](#types)

## Custom Hooks

### useAuth
```typescript
const useAuth = (): {
  isAuthenticated: boolean;
  user: User | null;
  role: string | undefined;
  permissions: string[];
  login: (credentials: LoginRequest) => Promise<any>;
  logout: () => Promise<void>;
  can: (requiredPermission: string) => boolean;
  canAny: (requiredPermissions: string[]) => boolean;
  canAll: (requiredPermissions: string[]) => boolean;
  isRole: (requiredRole: string) => boolean;
}
```

**Usage**:
```tsx
import useAuth from '@hooks/useAuth';

function MyComponent() {
  const { isAuthenticated, user, login, logout, can } = useAuth();
  
  return (
    <>
      {isAuthenticated ? (
        <div>
          Welcome {user?.full_name}
          {can('content.upload') && <UploadButton />}
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <LoginForm />
      )}
    </>
  );
}
```

### useNotification
```typescript
const useNotification = (): {
  showSuccess: (message: string, duration?: number) => string;
  showError: (message: string, duration?: number) => string;
  showWarning: (message: string, duration?: number) => string;
  showInfo: (message: string, duration?: number) => string;
}
```

**Usage**:
```tsx
import useNotification from '@hooks/useNotification';

function MyComponent() {
  const { showSuccess, showError } = useNotification();
  
  const handleSave = async () => {
    try {
      await save();
      showSuccess('Saved successfully!');
    } catch (error) {
      showError('Failed to save');
    }
  };
  
  return <button onClick={handleSave}>Save</button>;
}
```

## Route Guards

### PrivateRoute
Protects routes that require authentication.

```tsx
import PrivateRoute from '@guards/PrivateRoute';

<Route
  path="/dashboard"
  element={
    <PrivateRoute>
      <DashboardPage />
    </PrivateRoute>
  }
/>
```

### PublicRoute
Redirects authenticated users away from login.

```tsx
import PublicRoute from '@guards/PublicRoute';

<Route
  path="/login"
  element={
    <PublicRoute>
      <LoginPage />
    </PublicRoute>
  }
/>
```

### AdminRoute
Protects admin-only routes based on role.

```tsx
import AdminRoute from '@guards/AdminRoute';

<Route
  path="/users"
  element={
    <AdminRoute requiredRole="super_admin">
      <UserListPage />
    </AdminRoute>
  }
/>
```

## Services

### Auth Service
```typescript
// src/services/auth.service.ts

export const authService = {
  login(credentials: LoginRequest): Promise<LoginResponse>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User>;
  changePassword(data: ChangePasswordRequest): Promise<void>;
  refreshToken(): Promise<string>;
  getToken(): string | null;
  setToken(token: string): void;
  removeToken(): void;
  isTokenValid(): boolean;
  isAuthenticated(): boolean;
}
```

**Usage**:
```tsx
import authService from '@services/auth.service';

// Login
const response = await authService.login({ 
  email: 'user@example.com', 
  password: 'password' 
});

// Check authentication
if (authService.isAuthenticated()) {
  const user = await authService.getCurrentUser();
}

// Logout
await authService.logout();
```

### Axios Instance
Configured with auth interceptors and error handling.

```typescript
import axiosInstance from '@services/api';

// Make authenticated requests
const response = await axiosInstance.get('/api/content');

// The auth token is automatically added to headers
// Errors are automatically handled with retry logic
```

## Utilities

### RBAC Utilities
```typescript
import { 
  hasRole, 
  hasPermission, 
  hasAnyPermission, 
  hasAllPermissions,
  getRoleLabel,
  getPermissionLabel 
} from '@utils/rbac';

// Check role
const isAdmin = hasRole(userRole, 'super_admin');

// Check permission
const canUpload = hasPermission(permissions, 'content.upload');

// Check multiple permissions
const canManageContent = hasAnyPermission(permissions, [
  'content.upload',
  'content.organize',
  'content.review'
]);

// Check all permissions
const isFull Manager = hasAllPermissions(permissions, [
  'content.upload',
  'content.organize',
  'content.review',
  'content.publish'
]);

// Get labels for UI display
const roleLabel = getRoleLabel('super_admin'); // "Super Admin"
const permLabel = getPermissionLabel('content.upload'); // "Upload Content"
```

### Validators
```typescript
import {
  validateEmail,
  validatePassword,
  getPasswordStrength
} from '@utils/validators';

// Validate email
const isValid = validateEmail('user@example.com'); // true

// Validate password with detailed errors
const validation = validatePassword('Test123!@#');
console.log(validation.valid); // true
console.log(validation.errors); // []

// Get password strength
const strength = getPasswordStrength('Password1!'); // "strong"
```

### Formatters
```typescript
import {
  formatDate,
  formatDateTime,
  formatTime,
  formatRelativeTime,
  isToday,
  isYesterday,
  daysAgo,
  formatFileSize,
  formatCurrency,
  formatNumber,
  formatPercentage
} from '@utils/formatters';

// Date formatting
formatDate('2025-11-14'); // "14/11/2025"
formatDateTime('2025-11-14T10:30:00'); // "14/11/2025 10:30"
formatTime('2025-11-14T10:30:00'); // "10:30:00"

// Relative time
formatRelativeTime('2025-11-14'); // "1 day ago"

// Date checks
isToday('2025-11-14');
isYesterday('2025-11-13');
daysAgo('2025-11-10'); // 4

// File size
formatFileSize(1024); // "1 KB"
formatFileSize(1048576); // "1 MB"

// Currency and numbers
formatCurrency(1000, 'USD'); // "$1,000.00"
formatNumber(1234.567, 2); // "1,234.57"
formatPercentage(95.5, 1); // "95.5%"
```

## Types

### Authentication Types
```typescript
// src/types/auth.types.ts

interface User {
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

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  token_type: 'bearer';
  user: User;
}

interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}

interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, any>;
}
```

### Common Types
```typescript
// src/types/common.types.ts

interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

interface ListResponse<T> {
  success: boolean;
  data: T[];
  pagination: Pagination;
}

type Theme = 'light' | 'dark';
type Status = 'active' | 'inactive' | 'pending' | 'archived';

const ROLES = {
  SUPER_ADMIN: 'super_admin',
  CONTENT_MANAGER: 'content_manager',
  QUESTION_MANAGER: 'question_manager',
  TEST_MANAGER: 'test_manager',
  TEACHER: 'teacher',
};

const PERMISSIONS = {
  CONTENT_UPLOAD: 'content.upload',
  CONTENT_ORGANIZE: 'content.organize',
  CONTENT_REVIEW: 'content.review',
  CONTENT_PUBLISH: 'content.publish',
  QUESTION_CREATE: 'question.create',
  QUESTION_REVIEW: 'question.review',
  QUESTION_PUBLISH: 'question.publish',
  TEST_CREATE: 'test.create',
  TEST_CONFIGURE: 'test.configure',
  TEST_PUBLISH: 'test.publish',
  USER_CREATE: 'user.create',
  USER_UPDATE: 'user.update',
  USER_DELETE: 'user.delete',
  ANALYTICS_VIEW: 'analytics.view',
  REPORTS_GENERATE: 'reports.generate',
  AUDIT_VIEW: 'audit.view',
  SETTINGS_MANAGE: 'settings.manage',
};
```

## Redux State & Selectors

### Auth State
```typescript
// src/store/slices/authSlice.ts

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Selectors
import {
  selectIsAuthenticated,
  selectUser,
  selectToken,
  selectAuthLoading,
  selectAuthError,
  selectUserRole,
  selectUserPermissions
} from '@store/selectors/authSelectors';
```

### UI State
```typescript
// src/store/slices/uiSlice.ts

interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  loading: boolean;
}

// Selectors
import {
  selectTheme,
  selectSidebarOpen,
  selectLoading
} from '@store/selectors/uiSelectors';

// Actions
import {
  toggleTheme,
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  setLoading
} from '@store/slices/uiSlice';
```

### Notification State
```typescript
// src/store/slices/notificationSlice.ts

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface NotificationState {
  toasts: Toast[];
}

// Selector
import { selectToasts } from '@store/selectors/notificationSelectors';

// Actions
import { addToast, removeToast, clearToasts } from '@store/slices/notificationSlice';
```

## Layouts

### AdminLayout
Main layout for authenticated users with sidebar and header.

```tsx
import AdminLayout from '@layouts/AdminLayout';

<AdminLayout>
  <YourContent />
</AdminLayout>
```

### AuthLayout
Layout for login and authentication pages.

```tsx
import AuthLayout from '@layouts/AuthLayout';

<AuthLayout>
  <LoginForm />
</AuthLayout>
```

## Theme

Access theme in components:
```tsx
import { useThemeContext } from '@context/ThemeContext';

function MyComponent() {
  const { isDarkMode, toggleTheme } = useThemeContext();
  
  return (
    <button onClick={toggleTheme}>
      {isDarkMode ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
}
```

CSS Variables available:
```css
--primary: #1976D2
--secondary: #DC004E
--success: #4CAF50
--warning: #FFC107
--error: #F44336
--info: #2196F3
--background: #FAFAFA (light) / #121212 (dark)
--surface: #FFFFFF (light) / #1E1E1E (dark)
--text-primary: #212121 (light) / #FFFFFF (dark)
--text-secondary: #757575 (light) / #B0B0B0 (dark)
--disabled: #BDBDBD (light) / #424242 (dark)

--spacing-xs: 4px
--spacing-sm: 8px
--spacing-md: 16px
--spacing-lg: 24px
--spacing-xl: 32px
--spacing-2xl: 48px
```

## Environment Variables

Available environment variables:

```
VITE_API_URL          # Backend API base URL (default: http://localhost:8000/api)
VITE_ENV              # Environment: development | production
VITE_LOG_LEVEL        # Log level: debug | info | warn | error
```

---

For more details, see the individual file documentation or check the inline JSDoc comments in the source code.

