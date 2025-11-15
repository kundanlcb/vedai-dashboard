import { ROLES, PERMISSIONS } from '@/constants';

export const hasRole = (userRole: string | undefined, requiredRole: string): boolean => {
  const roleHierarchy: Record<string, number> = {
    [ROLES.SUPER_ADMIN]: 5,
    [ROLES.CONTENT_MANAGER]: 4,
    [ROLES.QUESTION_MANAGER]: 3,
    [ROLES.TEST_MANAGER]: 2,
    [ROLES.TEACHER]: 1,
  };

  const userLevel = (userRole ? roleHierarchy[userRole] : undefined) || 0;
  const requiredLevel = roleHierarchy[requiredRole] || 0;

  return userLevel >= requiredLevel;
};

export const hasPermission = (
  permissions: string[] | undefined,
  requiredPermission: string
): boolean => {
  return permissions?.includes(requiredPermission) || false;
};

export const hasAnyPermission = (
  permissions: string[] | undefined,
  requiredPermissions: string[]
): boolean => {
  return requiredPermissions.some((perm) => permissions?.includes(perm)) || false;
};

export const hasAllPermissions = (
  permissions: string[] | undefined,
  requiredPermissions: string[]
): boolean => {
  return requiredPermissions.every((perm) => permissions?.includes(perm)) || false;
};

export const getRoleLabel = (role: string): string => {
  const labels: Record<string, string> = {
    [ROLES.SUPER_ADMIN]: 'Super Admin',
    [ROLES.CONTENT_MANAGER]: 'Content Manager',
    [ROLES.QUESTION_MANAGER]: 'Question Manager',
    [ROLES.TEST_MANAGER]: 'Test Manager',
    [ROLES.TEACHER]: 'Teacher',
  };

  return labels[role] || role;
};

export const getPermissionLabel = (permission: string): string => {
  const labels: Record<string, string> = {
    [PERMISSIONS.CONTENT_UPLOAD]: 'Upload Content',
    [PERMISSIONS.CONTENT_ORGANIZE]: 'Organize Content',
    [PERMISSIONS.CONTENT_REVIEW]: 'Review Content',
    [PERMISSIONS.CONTENT_PUBLISH]: 'Publish Content',
    [PERMISSIONS.QUESTION_CREATE]: 'Create Questions',
    [PERMISSIONS.QUESTION_REVIEW]: 'Review Questions',
    [PERMISSIONS.QUESTION_PUBLISH]: 'Publish Questions',
    [PERMISSIONS.TEST_CREATE]: 'Create Tests',
    [PERMISSIONS.TEST_CONFIGURE]: 'Configure Tests',
    [PERMISSIONS.TEST_PUBLISH]: 'Publish Tests',
    [PERMISSIONS.USER_CREATE]: 'Create Users',
    [PERMISSIONS.USER_UPDATE]: 'Update Users',
    [PERMISSIONS.USER_DELETE]: 'Delete Users',
    [PERMISSIONS.ANALYTICS_VIEW]: 'View Analytics',
    [PERMISSIONS.REPORTS_GENERATE]: 'Generate Reports',
    [PERMISSIONS.AUDIT_VIEW]: 'View Audit Logs',
    [PERMISSIONS.SETTINGS_MANAGE]: 'Manage Settings',
  };

  return labels[permission] || permission;
};

