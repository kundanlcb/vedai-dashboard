export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  CONTENT_MANAGER: 'content_manager',
  QUESTION_MANAGER: 'question_manager',
  TEST_MANAGER: 'test_manager',
  TEACHER: 'teacher',
} as const;

export const PERMISSIONS = {
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
} as const;

