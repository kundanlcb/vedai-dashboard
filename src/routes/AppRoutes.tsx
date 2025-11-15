import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from '@guards/PrivateRoute';
import PublicRoute from '@guards/PublicRoute';

// Auth Pages
import LoginPage from '@pages/auth/LoginPage';

// Dashboard
import AdminDashboard from '@pages/dashboard/AdminDashboard';

// Content Pages
import ContentListPage from '@pages/content/ContentListPage';
import ContentUploadPage from '@pages/content/ContentUploadPage';
// Question Pages
import QuestionListPage from '@pages/questions/QuestionListPage';
import QuestionCreatePage from '@pages/questions/QuestionCreatePage';

// Test Pages
import TestListPage from '@pages/tests/TestListPage';
import TestCreatePage from '@pages/tests/TestCreatePage';
// User Pages
import UserListPage from '@pages/users/UserListPage';
import UserCreatePage from '@pages/users/UserCreatePage';
import UserDetailPage from '@pages/users/UserDetailPage';
import UserEditPage from '@pages/users/UserEditPage';
import ProfilePage from '@pages/users/ProfilePage';

// Analytics
import AnalyticsDashboard from '@pages/analytics/AnalyticsDashboard';

// Settings
import SettingsPage from '@pages/settings/SettingsPage';

// Error Pages
import NotFoundPage from '@pages/NotFoundPage';
import UnauthorizedPage from '@pages/UnauthorizedPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        }
      />

      {/* Content Routes */}
      <Route
        path="/content"
        element={
          <PrivateRoute>
            <ContentListPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/content/upload"
        element={
          <PrivateRoute>
            <ContentUploadPage />
          </PrivateRoute>
        }
      />

      {/* Question Routes */}
      <Route
        path="/questions"
        element={
          <PrivateRoute>
            <QuestionListPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/questions/create"
        element={
          <PrivateRoute>
            <QuestionCreatePage />
          </PrivateRoute>
        }
      />

      {/* Test Routes */}
      <Route
        path="/tests"
        element={
          <PrivateRoute>
            <TestListPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/tests/create"
        element={
          <PrivateRoute>
            <TestCreatePage />
          </PrivateRoute>
        }
      />

      {/* User Routes */}
      <Route
        path="/users"
        element={
          <PrivateRoute>
            <UserListPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/users/create"
        element={
          <PrivateRoute>
            <UserCreatePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/users/:id"
        element={
          <PrivateRoute>
            <UserDetailPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/users/:id/edit"
        element={
          <PrivateRoute>
            <UserEditPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />

      {/* Analytics Routes */}
      <Route
        path="/analytics"
        element={
          <PrivateRoute>
            <AnalyticsDashboard />
          </PrivateRoute>
        }
      />

      {/* Settings Routes */}
      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <SettingsPage />
          </PrivateRoute>
        }
      />

      {/* Error Routes */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;

