import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch } from '@store/store';
import { selectIsAuthenticated, selectUser, selectUserRole, selectUserPermissions } from '@store/selectors/authSelectors';
import { loginUser, logoutUser } from '@store/slices/authSlice';
import { hasRole, hasPermission, hasAnyPermission, hasAllPermissions } from '@utils/rbac';
import type { LoginRequest } from '../types/auth';

// ...existing code...

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const role = useSelector(selectUserRole);
  const permissions = useSelector(selectUserPermissions);

  const login = async (credentials: LoginRequest) => {
    const result = await dispatch(loginUser(credentials)).unwrap();
    navigate('/dashboard');
    return result;
  };

  const logout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const can = (requiredPermission: string): boolean => {
    return hasPermission(permissions, requiredPermission);
  };

  const canAny = (requiredPermissions: string[]): boolean => {
    return hasAnyPermission(permissions, requiredPermissions);
  };

  const canAll = (requiredPermissions: string[]): boolean => {
    return hasAllPermissions(permissions, requiredPermissions);
  };

  const isRole = (requiredRole: string): boolean => {
    return hasRole(role, requiredRole);
  };

  return {
    isAuthenticated,
    user,
    role,
    permissions,
    login,
    logout,
    can,
    canAny,
    canAll,
    isRole,
  };
};

export default useAuth;

