# VedAI Admin Frontend - Complete Requirements Document

**Date**: November 14, 2025
**Version**: 1.0
**Status**: Requirements Specification

---

## Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Authentication & Authorization](#authentication--authorization)
5. [Admin Dashboard](#admin-dashboard)
6. [Content Management Module](#content-management-module)
7. [Question Bank Module](#question-bank-module)
8. [Test Management Module](#test-management-module)
9. [User Management Module](#user-management-module)
10. [Analytics & Reporting Module](#analytics--reporting-module)
11. [Common Components](#common-components)
12. [API Integration](#api-integration)
13. [UI/UX Guidelines](#uiux-guidelines)
14. [State Management](#state-management)
15. [Error Handling](#error-handling)
16. [Performance Requirements](#performance-requirements)

---

## Overview

### Purpose
Admin dashboard for VedAI platform to manage educational content, questions, tests, users, and analytics.

### Target Users
- Super Admins
- Content Managers
- Question Managers
- Test Managers
- Teachers
- System Admins

### Key Features
- Content upload and organization
- Question bank creation and management
- Test configuration and publishing
- User management and RBAC
- Analytics and reporting
- Audit logging and activity tracking

### Scope
- 6 main modules
- 50+ pages/screens
- 100+ components
- Real-time data updates
- Role-based access control
- Export functionality (PDF, Excel)

---

## Technology Stack

### Frontend Framework & Build Tools
```
- React 18.x (Latest stable)
- TypeScript (for type safety)
- Vite (Build tool)
- Node.js 18.x LTS
- npm/pnpm (Package manager)
```

### UI Framework & Styling
```
- Material-UI (MUI) v5.x (Component library)
- Tailwind CSS (Utility-first CSS)
- Emotion (CSS-in-JS for MUI)
- React Icons (Icon library)
```

### State Management
```
- Redux Toolkit (State management)
- Redux Thunk (Async actions)
- Reselect (Memoized selectors)
```

### HTTP & API
```
- Axios (HTTP client)
- React Query (Server state management)
- SWR (Alternative for data fetching)
```

### Form Handling
```
- React Hook Form (Lightweight form library)
- Yup (Schema validation)
- react-final-form (Alternative)
```

### Routing
```
- React Router v6
- React Router DOM
```

### Data & Utilities
```
- Day.js (Date/time manipulation)
- Lodash (Utility functions)
- React-toastify (Notifications)
- Axios (HTTP requests)
```

### File Handling
```
- react-dropzone (File upload)
- Papa Parse (CSV parsing)
- xlsx (Excel export)
- jsPDF (PDF generation)
```

### Testing
```
- Vitest (Unit testing)
- React Testing Library (Component testing)
- MSW (Mock Service Worker)
```

### Development Tools
```
- ESLint (Linting)
- Prettier (Code formatting)
- Husky (Git hooks)
- Environment variables (.env)
```

---

## Project Structure

```
vedai-admin-frontend/
├── public/
│   ├── favicon.ico
│   ├── logo.svg
│   └── assets/
│       ├── images/
│       ├── icons/
│       └── fonts/
│
├── src/
│   ├── index.tsx
│   ├── App.tsx
│   ├── App.css
│   │
│   ├── components/                 # Reusable components
│   │   ├── common/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Breadcrumb.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── FilterPanel.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   │
│   │   ├── forms/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── ChangePasswordForm.tsx
│   │   │   ├── UserForm.tsx
│   │   │   ├── ContentForm.tsx
│   │   │   ├── QuestionForm.tsx
│   │   │   ├── TestForm.tsx
│   │   │   └── BulkUploadForm.tsx
│   │   │
│   │   ├── dialogs/
│   │   │   ├── ConfirmDialog.tsx
│   │   │   ├── DeleteDialog.tsx
│   │   │   ├── DetailModal.tsx
│   │   │   ├── SelectQuestionsModal.tsx
│   │   │   └── PreviewModal.tsx
│   │   │
│   │   ├── tables/
│   │   │   ├── DataTable.tsx
│   │   │   ├── ContentTable.tsx
│   │   │   ├── QuestionTable.tsx
│   │   │   ├── TestTable.tsx
│   │   │   ├── UserTable.tsx
│   │   │   └── AuditLogTable.tsx
│   │   │
│   │   ├── cards/
│   │   │   ├── StatCard.tsx
│   │   │   ├── ContentCard.tsx
│   │   │   ├── QuestionCard.tsx
│   │   │   └── UserCard.tsx
│   │   │
│   │   ├── charts/
│   │   │   ├── BarChart.tsx
│   │   │   ├── LineChart.tsx
│   │   │   ├── PieChart.tsx
│   │   │   ├── DoughnutChart.tsx
│   │   │   └── AreaChart.tsx
│   │   │
│   │   └── alerts/
│   │       ├── ErrorAlert.tsx
│   │       ├── WarningAlert.tsx
│   │       ├── SuccessAlert.tsx
│   │       └── InfoAlert.tsx
│   │
│   ├── pages/                      # Page components
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── LogoutPage.tsx
│   │   │   ├── ForgotPasswordPage.tsx
│   │   │   └── ResetPasswordPage.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── DashboardOverview.tsx
│   │   │   ├── QuickStats.tsx
│   │   │   └── RecentActivity.tsx
│   │   │
│   │   ├── content/
│   │   │   ├── ContentListPage.tsx
│   │   │   ├── ContentDetailPage.tsx
│   │   │   ├── ContentUploadPage.tsx
│   │   │   ├── ContentEditPage.tsx
│   │   │   ├── ContentOrganizePage.tsx
│   │   │   └── ContentAnalyticsPage.tsx
│   │   │
│   │   ├── questions/
│   │   │   ├── QuestionListPage.tsx
│   │   │   ├── QuestionDetailPage.tsx
│   │   │   ├── QuestionCreatePage.tsx
│   │   │   ├── QuestionEditPage.tsx
│   │   │   ├── QuestionReviewPage.tsx
│   │   │   ├── QuestionBankPage.tsx
│   │   │   └── QuestionAnalyticsPage.tsx
│   │   │
│   │   ├── tests/
│   │   │   ├── TestListPage.tsx
│   │   │   ├── TestDetailPage.tsx
│   │   │   ├── TestCreatePage.tsx
│   │   │   ├── TestEditPage.tsx
│   │   │   ├── TestConfigurePage.tsx
│   │   │   ├── TestPublishPage.tsx
│   │   │   └── TestAnalyticsPage.tsx
│   │   │
│   │   ├── users/
│   │   │   ├── UserListPage.tsx
│   │   │   ├── UserDetailPage.tsx
│   │   │   ├── UserCreatePage.tsx
│   │   │   ├── UserEditPage.tsx
│   │   │   ├── UserRolePage.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   └── PermissionsPage.tsx
│   │   │
│   │   ├── analytics/
│   │   │   ├── AnalyticsDashboard.tsx
│   │   │   ├── ContentAnalytics.tsx
│   │   │   ├── QuestionAnalytics.tsx
│   │   │   ├── TestAnalytics.tsx
│   │   │   ├── UserAnalytics.tsx
│   │   │   ├── ReportPage.tsx
│   │   │   └── ExportPage.tsx
│   │   │
│   │   ├── audit/
│   │   │   ├── AuditLogPage.tsx
│   │   │   ├── ActivityLogPage.tsx
│   │   │   └── SecurityLogPage.tsx
│   │   │
│   │   ├── settings/
│   │   │   ├── SettingsPage.tsx
│   │   │   ├── GeneralSettings.tsx
│   │   │   ├── SecuritySettings.tsx
│   │   │   ├── NotificationSettings.tsx
│   │   │   └── SystemSettings.tsx
│   │   │
│   │   └── 404/
│   │       ├── NotFoundPage.tsx
│   │       ├── UnauthorizedPage.tsx
│   │       └── ErrorPage.tsx
│   │
│   ├── hooks/                      # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useUser.ts
│   │   ├── useFetch.ts
│   │   ├── useContentManager.ts
│   │   ├── useQuestionManager.ts
│   │   ├── useTestManager.ts
│   │   ├── useForm.ts
│   │   ├── useNotification.ts
│   │   ├── useTableState.ts
│   │   ├── usePagination.ts
│   │   ├── useDebounce.ts
│   │   ├── useLocalStorage.ts
│   │   └── useAsync.ts
│   │
│   ├── services/                   # API services
│   │   ├── api.ts
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── content.service.ts
│   │   ├── question.service.ts
│   │   ├── test.service.ts
│   │   ├── analytics.service.ts
│   │   ├── audit.service.ts
│   │   ├── storage.service.ts
│   │   ├── file.service.ts
│   │   └── export.service.ts
│   │
│   ├── store/                      # Redux store
│   │   ├── store.ts
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── userSlice.ts
│   │   │   ├── contentSlice.ts
│   │   │   ├── questionSlice.ts
│   │   │   ├── testSlice.ts
│   │   │   ├── analyticsSlice.ts
│   │   │   ├── notificationSlice.ts
│   │   │   └── uiSlice.ts
│   │   │
│   │   └── selectors/
│   │       ├── authSelectors.ts
│   │       ├── userSelectors.ts
│   │       ├── contentSelectors.ts
│   │       ├── questionSelectors.ts
│   │       ├── testSelectors.ts
│   │       ├── analyticsSelectors.ts
│   │       └── notificationSelectors.ts
│   │
│   ├── utils/                      # Utility functions
│   │   ├── constants.ts
│   │   ├── validators.ts
│   │   ├── formatters.ts
│   │   ├── helpers.ts
│   │   ├── localStorage.ts
│   │   ├── sessionStorage.ts
│   │   ├── dateUtils.ts
│   │   ├── fileUtils.ts
│   │   ├── stringUtils.ts
│   │   ├── numberUtils.ts
│   │   ├── arrayUtils.ts
│   │   └── errorHandler.ts
│   │
│   ├── types/                      # TypeScript interfaces
│   │   ├── index.ts
│   │   ├── auth.types.ts
│   │   ├── user.types.ts
│   │   ├── content.types.ts
│   │   ├── question.types.ts
│   │   ├── test.types.ts
│   │   ├── analytics.types.ts
│   │   ├── api.types.ts
│   │   ├── common.types.ts
│   │   └── form.types.ts
│   │
│   ├── styles/                     # Global styles
│   │   ├── globals.css
│   │   ├── variables.css
│   │   ├── theme.ts
│   │   ├── colors.ts
│   │   ├── breakpoints.ts
│   │   ├── typography.ts
│   │   └── mixins.ts
│   │
│   ├── context/                    # React Context
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx
│   │   ├── NotificationContext.tsx
│   │   └── LanguageContext.tsx
│   │
│   ├── guards/                     # Route guards
│   │   ├── PrivateRoute.tsx
│   │   ├── AdminRoute.tsx
│   │   ├── PublicRoute.tsx
│   │   └── roleBasedRoute.tsx
│   │
│   ├── middleware/                 # Custom middleware
│   │   ├── authMiddleware.ts
│   │   ├── errorMiddleware.ts
│   │   └── loggingMiddleware.ts
│   │
│   ├── layouts/                    # Layout components
│   │   ├── AdminLayout.tsx
│   │   ├── AuthLayout.tsx
│   │   ├── BlankLayout.tsx
│   │   └── DefaultLayout.tsx
│   │
│   └── App.tsx
│
├── tests/                          # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.example
├── .env.local
├── .eslintrc.js
├── .prettierrc
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
├── package.json
├── package-lock.json
└── README.md
```

---

## Authentication & Authorization

### Login Module
**Page**: LoginPage.tsx

**Components**:
- LoginForm
- RememberMe checkbox
- ForgotPassword link
- Loading states
- Error handling

**Features**:
- Email/Password login
- JWT token storage (localStorage/sessionStorage)
- Auto-redirect to dashboard
- Remember me functionality
- Error messages display
- Loading states

**API Endpoint**: POST /api/admin/users/login

**Response**:
```typescript
{
  access_token: string;
  token_type: "bearer";
  user: {
    id: number;
    email: string;
    full_name: string;
    role: string;
    permissions: string[];
  }
}
```

### Token Management
**Service**: auth.service.ts

**Functions**:
- `setToken(token: string)` - Store JWT
- `getToken()` - Retrieve JWT
- `removeToken()` - Clear JWT
- `isTokenValid()` - Check expiration
- `refreshToken()` - Get new token
- `isAuthenticated()` - Check if logged in

### Role-Based Access Control (RBAC)
**Roles**: 
- super_admin (All access)
- content_manager (Content operations)
- question_manager (Question operations)
- test_manager (Test operations)
- teacher (Limited access)

**Implementation**:
- PrivateRoute guard
- AdminRoute guard
- Permission checks on components
- API interceptor for auth

**Permissions**:
```
content.upload, content.organize, content.review, content.publish
question.create, question.review, question.publish
test.create, test.configure, test.publish
user.create, user.update, user.delete
analytics.view, reports.generate
audit.view, settings.manage
```

---

## Admin Dashboard

### Main Dashboard Page
**Page**: AdminDashboard.tsx

**Components**:
- Navbar
- Sidebar
- Main content area
- Footer
- Breadcrumb

**Features**:
- Overview cards (Users, Content, Questions, Tests)
- Recent activity feed
- Quick stats
- Charts (content uploads, questions created, tests taken)
- Quick actions (Upload content, Create question, etc.)
- Notifications

### Dashboard Overview
**Component**: DashboardOverview.tsx

**Widgets**:
1. **Summary Cards**
   - Total users
   - Total content
   - Total questions
   - Total tests
   - Active students
   - Engagement rate

2. **Activity Charts**
   - Content uploads (Line chart)
   - Question creation (Bar chart)
   - Test attempts (Area chart)
   - User growth (Line chart)

3. **Recent Activity**
   - Last 10 admin actions
   - Timestamps
   - Action type
   - User who performed
   - Entity affected

4. **Quick Actions**
   - Upload content
   - Create question
   - Create test
   - Create user
   - View reports

### Admin Sidebar
**Component**: Sidebar.tsx

**Menu Items**:
```
Dashboard
├─ Overview
├─ Analytics
└─ Activity

Content Management
├─ List Content
├─ Upload New
├─ Pending Review
└─ Published Content

Questions
├─ Question Bank
├─ Create Question
├─ Pending Review
├─ By Subject
└─ Analytics

Tests
├─ Tests List
├─ Create Test
├─ Configure
└─ Analytics

Users
├─ Users List
├─ Create User
├─ Roles
└─ Permissions

Reports & Analytics
├─ Content Analytics
├─ Question Analytics
├─ Test Analytics
├─ User Analytics
└─ Export Reports

Settings
├─ General Settings
├─ Security
├─ Notifications
└─ System

Audit
├─ Activity Logs
├─ Security Logs
└─ System Logs

Admin Profile
├─ My Profile
├─ Change Password
└─ Logout
```

---

## Content Management Module

### Content List Page
**Page**: ContentListPage.tsx

**Table Columns**:
- File name
- Subject
- Chapter
- Status (draft, under_review, approved, published, archived)
- Created date
- Updated date
- Actions (View, Edit, Organize, Publish, Archive, Delete)

**Filters**:
- Subject (dropdown)
- Chapter (dropdown)
- Status (multiple select)
- Class (dropdown)
- Created date range
- Updated date range

**Sorting**:
- By name
- By date
- By status
- By subject

**Pagination**:
- Rows per page: 10, 25, 50
- Next/Previous buttons
- Go to page

**Actions**:
- Bulk select
- Bulk publish
- Bulk archive
- Bulk delete
- Export to CSV/Excel

### Content Detail Page
**Page**: ContentDetailPage.tsx

**Sections**:
1. **File Information**
   - File name
   - File type
   - File size
   - Upload date
   - Uploaded by

2. **Metadata**
   - Title
   - Description
   - Class
   - Subject
   - Chapter
   - Topic
   - Tags
   - Learning outcomes

3. **Status**
   - Current status
   - Last updated
   - Published date
   - Review notes
   - Reviewed by

4. **Processing**
   - Processing status
   - Chunk count
   - Embedding status
   - Error messages (if any)

5. **Preview**
   - PDF viewer (if applicable)
   - Text preview
   - File information

**Actions**:
- Edit metadata
- Change organization
- Review and approve
- Publish
- Archive
- Delete
- Download file

### Content Upload Page
**Page**: ContentUploadPage.tsx

**Form Fields**:
- File input (drag & drop)
- Class (dropdown)
- Subject (dropdown)
- Chapter (dropdown)
- Topic (text input)
- Title (text input)
- Description (textarea)
- Tags (multi-select)
- Learning outcomes (multi-select)

**Features**:
- Drag & drop upload
- Progress bar
- File preview
- File validation
- Batch upload
- Upload history

**Validation**:
- File type (PDF, TXT, MP4, MP3)
- File size (max 100MB)
- Required fields

**Success**:
- Confirmation dialog
- File saved message
- Auto-redirect to list

### Content Organize Page
**Page**: ContentOrganizePage.tsx

**Features**:
- Hierarchical organization (Class → Subject → Chapter)
- Drag & drop reordering
- Bulk organize
- Preview before saving

**Form Fields**:
- Class selection
- Subject selection
- Chapter selection
- Topic (optional)
- Tags
- Learning outcomes

---

## Question Bank Module

### Question List Page
**Page**: QuestionListPage.tsx

**Table Columns**:
- Question text (truncated)
- Subject
- Chapter
- Difficulty level
- Bloom's level
- Type
- Marks
- Status
- Success rate
- Total attempts
- Actions (View, Edit, Review, Publish, Archive, Delete)

**Filters**:
- Subject
- Chapter
- Difficulty level (easy, medium, hard)
- Bloom's level
- Question type
- Status
- Success rate range
- Created date range

**Sorting**:
- By difficulty
- By success rate
- By attempts
- By date

### Question Create/Edit Page
**Page**: QuestionCreatePage.tsx / QuestionEditPage.tsx

**Form Sections**:

1. **Question Details**
   - Question text (textarea with rich editor)
   - Explanation (textarea with rich editor)
   - Question type (dropdown: MCQ, true/false, short answer, essay)
   - Marks (number input)

2. **Organization**
   - Class (dropdown)
   - Subject (dropdown)
   - Chapter (dropdown)
   - Topic (text input)

3. **Difficulty & Learning**
   - Difficulty level (radio: easy, medium, hard)
   - Bloom's level (dropdown: remember, understand, apply, analyze, evaluate, create)
   - Learning outcomes (multi-select)

4. **Options (for MCQ)**
   - Option A text
   - Option B text
   - Option C text
   - Option D text
   - Correct option (radio)

5. **Metadata**
   - Tags (multi-select)
   - Keywords (multi-select)

6. **Status**
   - Status (draft, under_review, published, archived)
   - Review notes (textarea)

**Features**:
- Rich text editor for question and explanation
- Preview before saving
- Save as draft
- Submit for review
- Publish directly (if authorized)
- Duplicate question
- Clone from existing

**Validation**:
- Required fields
- Question text length
- At least one option for MCQ
- One correct option
- All options must be different

### Question Review Page
**Page**: QuestionReviewPage.tsx

**Features**:
- View question details
- Compare with original (for edits)
- Approve or reject
- Add review notes
- Request changes
- View reviewer history

**Sections**:
- Question preview
- Review form
- Comment thread
- History timeline

### Question Bank (By Subject/Chapter)
**Page**: QuestionBankPage.tsx

**Display**:
- Tree view: Subject → Chapter → Topic → Questions
- Card view with filters
- List view with bulk actions

**Features**:
- View all questions per subject/chapter
- Group by difficulty
- Group by Bloom's level
- Statistics
- Export questions

---

## Test Management Module

### Test List Page
**Page**: TestListPage.tsx

**Table Columns**:
- Test name
- Subject
- Chapter
- Class
- Total questions
- Total marks
- Status
- Created date
- Published date
- Actions

**Filters**:
- Subject
- Chapter
- Class
- Status
- Created date range

### Test Create Page
**Page**: TestCreatePage.tsx

**Form Sections**:

1. **Basic Information**
   - Test name
   - Description
   - Class (dropdown)
   - Subject (dropdown)
   - Chapter (dropdown)

2. **Configuration**
   - Total marks
   - Duration (minutes)
   - Passing percentage
   - Show answers after test
   - Show score after submission
   - Allow review
   - Shuffle questions
   - Shuffle options

3. **Question Selection**
   - Manual selection (table with checkboxes)
   - Auto-generate (difficulty distribution)
   - Number of questions
   - Marks per question
   - Difficulty distribution (easy%, medium%, hard%)

4. **Marking Scheme**
   - Correct answer marks
   - Negative marking
   - Negative marks value

5. **Access & Publishing**
   - Status
   - Start date/time
   - End date/time
   - Visible to (user roles)
   - Password protected (optional)

**Features**:
- Question selection table
- Preview questions
- Difficulty distribution chart
- Marks calculation
- Save as draft
- Publish

### Test Configure Page
**Page**: TestConfigurePage.tsx

**Sections**:
- Basic settings
- Question configuration
- Marking scheme
- Access settings
- Published settings

**Features**:
- Update test details
- Add/remove questions
- Reorder questions
- Change marks per question
- Modify settings
- View preview

---

## User Management Module

### User List Page
**Page**: UserListPage.tsx

**Table Columns**:
- Email
- Full name
- Role
- Status (active/inactive)
- Last login
- Created date
- Actions (View, Edit, Change Role, Deactivate, Delete)

**Filters**:
- Role
- Status
- Created date range
- Last login range

**Sorting**:
- By name
- By role
- By last login
- By created date

### User Create Page
**Page**: UserCreatePage.tsx

**Form Fields**:
- Email (text input with validation)
- Full name (text input)
- Password (password input with strength meter)
- Role (dropdown)
- Phone (optional)
- Assigned subjects (multi-select)
- Assigned classes (multi-select)

**Validation**:
- Email format
- Email uniqueness
- Password strength (min 8 chars, uppercase, lowercase, number, special char)
- Required fields

**Features**:
- Email verification
- Send welcome email
- Set temporary password
- Auto-generate password

### User Edit Page
**Page**: UserEditPage.tsx

**Editable Fields**:
- Full name
- Phone
- Role (if authorized)
- Assigned subjects
- Assigned classes

**Features**:
- Update user details
- Change password
- Change role
- Deactivate/activate user
- View login history
- View activity

### User Profile Page
**Page**: ProfilePage.tsx

**Sections**:
1. **Personal Information**
   - Full name
   - Email
   - Phone
   - Role
   - Status

2. **Security**
   - Change password
   - Two-factor authentication
   - Active sessions
   - Recent logins

3. **Preferences**
   - Theme (light/dark)
   - Language
   - Notifications
   - Email preferences

4. **Activity**
   - Recent actions
   - Login history
   - Device information

---

## Analytics & Reporting Module

### Analytics Dashboard
**Page**: AnalyticsDashboard.tsx

**Widgets**:
1. **Overall Statistics**
   - Total users (active, inactive)
   - Total content uploaded
   - Total questions created
   - Total tests published
   - Total student attempts

2. **Charts**
   - User growth (Line chart)
   - Content uploads per month (Bar chart)
   - Questions created per month (Bar chart)
   - Test attempts per day (Area chart)
   - Most used content (Pie chart)
   - Most attempted questions (Bar chart)

3. **Filters**
   - Date range
   - Class
   - Subject
   - Chapter

### Content Analytics Page
**Page**: ContentAnalyticsPage.tsx

**Metrics**:
- Total content uploaded
- Content by subject
- Content by chapter
- Publishing rate
- Processing status
- Average processing time
- Content usage (views, downloads)
- Most viewed content
- Content success rate (based on question attempts)

**Visualizations**:
- Pie chart: Content by subject
- Bar chart: Content per chapter
- Line chart: Upload trend
- Table: Detailed statistics

### Question Analytics Page
**Page**: QuestionAnalyticsPage.tsx

**Metrics**:
- Total questions created
- Questions by difficulty
- Questions by Bloom's level
- Average success rate
- Total attempts
- Question quality (success rate distribution)
- Difficulty distribution
- Most attempted questions
- Trending topics

**Visualizations**:
- Pie chart: By difficulty/Bloom's level
- Bar chart: By subject/chapter
- Line chart: Success rate trend
- Heatmap: Difficulty vs success rate

### Test Analytics Page
**Page**: TestAnalyticsPage.tsx

**Metrics**:
- Total tests published
- Total test attempts
- Average score
- Pass rate
- Completion rate
- Time taken (average)
- Question analysis (difficulty stats)
- Student performance
- Trending tests

**Visualizations**:
- Bar chart: Attempts per test
- Line chart: Average score trend
- Pie chart: Pass/Fail distribution
- Table: Detailed test statistics

### Report Generation
**Page**: ReportPage.tsx

**Report Types**:
1. **Content Report**
   - Content summary
   - Upload statistics
   - Processing status
   - Usage metrics

2. **Question Report**
   - Question statistics
   - Difficulty distribution
   - Success rate analysis
   - Trending questions

3. **Test Report**
   - Test statistics
   - Student performance
   - Question analysis
   - Trends and insights

4. **User Report**
   - User growth
   - Activity statistics
   - Role distribution
   - Active vs inactive

5. **Custom Report**
   - Select metrics
   - Date range
   - Grouping options
   - Filters

**Features**:
- Generate report
- Preview
- Download as PDF
- Download as Excel
- Email report
- Schedule reports
- Save templates

### Export Page
**Page**: ExportPage.tsx

**Export Options**:
- Content list (CSV, Excel, PDF)
- Questions (CSV, Excel, JSON)
- Tests (CSV, Excel, PDF)
- Users (CSV, Excel)
- Analytics reports (PDF, Excel)
- Audit logs (CSV, Excel)

**Features**:
- Select export format
- Select fields to export
- Date range filter
- Progress indicator
- Download file

---

## Common Components

### Navbar Component
**Component**: Navbar.tsx

**Features**:
- Logo/App name
- Search bar
- Notifications icon
- User profile dropdown
- Logout button
- Theme toggle
- Help/Support link

### Sidebar Component
**Component**: Sidebar.tsx

**Features**:
- Collapsible menu
- Active menu indicator
- Icons with labels
- Sub-menus
- Responsive (hide on mobile)

### Data Table Component
**Component**: DataTable.tsx

**Features**:
- Columns definition
- Sorting
- Filtering
- Pagination
- Row selection
- Bulk actions
- Export
- Column resizing
- Column visibility toggle

### Forms
**Components**:
- TextInput
- SelectInput
- MultiSelectInput
- DateInput
- DateRangeInput
- FileInput
- TextAreaInput
- RichTextEditor
- CheckboxInput
- RadioInput
- FormGroup
- FormError
- SubmitButton

### Dialogs/Modals
**Components**:
- ConfirmDialog (Yes/No)
- AlertDialog
- FormDialog
- FullScreenDialog
- Modal
- Drawer (Side panel)

### Cards
**Components**:
- StatCard (shows count, icon, title)
- ContentCard (title, description, actions)
- UserCard (user info, role, actions)
- QuestionCard (question preview, type, difficulty)

### Charts (Using Chart.js or Recharts)
**Components**:
- LineChart
- BarChart
- PieChart
- DoughnutChart
- AreaChart
- ScatterChart
- RadarChart

### Alerts & Notifications
**Components**:
- ErrorAlert
- WarningAlert
- SuccessAlert
- InfoAlert
- Toast notifications

### Loading States
**Components**:
- Skeleton loaders
- Progress bars
- Spinners
- Loading overlay

### Pagination
**Component**: Pagination.tsx

**Features**:
- Previous/Next buttons
- Page numbers
- Go to page input
- Rows per page selector
- Total count display

### Breadcrumb
**Component**: Breadcrumb.tsx

**Features**:
- Navigation breadcrumb trail
- Clickable links
- Current page highlight

### Search & Filter
**Components**:
- SearchBar (text search)
- FilterPanel (advanced filters)
- DateRangeFilter
- MultiSelectFilter
- ClearFilters button

---

## API Integration

### Base Configuration
**File**: services/api.ts

```typescript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Axios instance with interceptors
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (add auth token)
// Response interceptor (handle errors, refresh token)
// Error interceptor (retry logic)
```

### Auth Service
**File**: services/auth.service.ts

**Methods**:
- `login(email, password)` → POST /admin/users/login
- `logout()` → Clear token
- `getCurrentUser()` → GET /admin/users/{id}
- `changePassword(old, new)` → POST /admin/users/{id}/change-password
- `refreshToken()` → POST /auth/refresh

### Content Service
**File**: services/content.service.ts

**Methods**:
- `uploadContent(file, metadata)` → POST /admin/content/upload
- `getContentList(filters, pagination)` → GET /admin/content
- `getContent(id)` → GET /admin/content/{id}
- `updateContent(id, data)` → PUT /admin/content/{id}
- `organizeContent(id, organization)` → PATCH /admin/content/{id}/organize
- `publishContent(id)` → POST /admin/content/{id}/publish
- `archiveContent(id)` → POST /admin/content/{id}/archive
- `deleteContent(id)` → DELETE /admin/content/{id}
- `getContentChunks(id)` → GET /admin/content/{id}/chunks

### Question Service
**File**: services/question.service.ts

**Methods**:
- `createQuestion(data)` → POST /admin/questions
- `getQuestionList(filters, pagination)` → GET /admin/questions
- `getQuestion(id)` → GET /admin/questions/{id}
- `updateQuestion(id, data)` → PUT /admin/questions/{id}
- `publishQuestion(id)` → PATCH /admin/questions/{id}/publish
- `archiveQuestion(id)` → POST /admin/questions/{id}/archive
- `deleteQuestion(id)` → DELETE /admin/questions/{id}
- `getBySubjectChapter(subject, chapter)` → GET /admin/questions/by-subject/{subject}/{chapter}

### Test Service
**File**: services/test.service.ts

**Methods**:
- `createTest(data)` → POST /admin/tests
- `getTestList(filters)` → GET /admin/tests
- `getTest(id)` → GET /admin/tests/{id}
- `updateTest(id, data)` → PUT /admin/tests/{id}
- `publishTest(id)` → POST /admin/tests/{id}/publish
- `archiveTest(id)` → POST /admin/tests/{id}/archive
- `deleteTest(id)` → DELETE /admin/tests/{id}

### User Service
**File**: services/user.service.ts

**Methods**:
- `createUser(data)` → POST /admin/users/register
- `getUserList(filters)` → GET /admin/users
- `getUser(id)` → GET /admin/users/{id}
- `updateUser(id, data)` → PUT /admin/users/{id}
- `changeUserRole(id, role)` → PATCH /admin/users/{id}/role
- `deactivateUser(id)` → POST /admin/users/{id}/deactivate
- `deleteUser(id)` → DELETE /admin/users/{id}

### Analytics Service
**File**: services/analytics.service.ts

**Methods**:
- `getDashboardStats()` → GET /analytics/dashboard
- `getContentAnalytics(filters)` → GET /analytics/content
- `getQuestionAnalytics(filters)` → GET /analytics/questions
- `getTestAnalytics(filters)` → GET /analytics/tests
- `getUserAnalytics(filters)` → GET /analytics/users
- `generateReport(type, filters)` → POST /analytics/reports
- `exportData(type, format, filters)` → GET /analytics/export

### Audit Service
**File**: services/audit.service.ts

**Methods**:
- `getAuditLogs(filters)` → GET /admin/users/{id}/audit-log
- `getActivityLogs(filters)` → GET /audit/activity
- `getSecurityLogs(filters)` → GET /audit/security

---

## UI/UX Guidelines

### Color Scheme
```
Primary: #1976D2 (Blue)
Secondary: #DC004E (Pink)
Success: #4CAF50 (Green)
Warning: #FFC107 (Amber)
Error: #F44336 (Red)
Info: #2196F3 (Blue)
Background: #FAFAFA (Light Gray)
Surface: #FFFFFF (White)
Text Primary: #212121 (Dark Gray)
Text Secondary: #757575 (Medium Gray)
Disabled: #BDBDBD (Light Gray)
```

### Typography
```
Headlines:
- H1: 32px, 500 weight, line-height 1.5
- H2: 28px, 500 weight, line-height 1.5
- H3: 24px, 500 weight, line-height 1.5
- H4: 20px, 500 weight, line-height 1.5
- H5: 16px, 500 weight, line-height 1.5
- H6: 14px, 500 weight, line-height 1.5

Body:
- Body1: 16px, 400 weight, line-height 1.5
- Body2: 14px, 400 weight, line-height 1.5

Captions:
- Caption: 12px, 400 weight, line-height 1.5
- Overline: 12px, 600 weight, line-height 1.5
```

### Spacing
```
Base unit: 8px
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
2xl: 48px
```

### Responsive Breakpoints
```
Mobile: 320px - 640px
Tablet: 641px - 1024px
Desktop: 1025px - 1440px
Wide: 1441px+
```

### Dark Mode
- Toggle theme button
- Persist preference (localStorage)
- Adjust all colors for dark mode

---

## State Management

### Redux Store Structure
```
{
  auth: {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
  },
  content: {
    items: ContentMetadata[];
    selectedItem: ContentMetadata | null;
    filters: ContentFilters;
    pagination: Pagination;
    loading: boolean;
    error: string | null;
  },
  questions: {
    items: QuestionBankAdmin[];
    selectedItem: QuestionBankAdmin | null;
    filters: QuestionFilters;
    pagination: Pagination;
    loading: boolean;
    error: string | null;
  },
  tests: {
    items: Test[];
    selectedItem: Test | null;
    filters: TestFilters;
    pagination: Pagination;
    loading: boolean;
    error: string | null;
  },
  users: {
    items: AdminUser[];
    selectedItem: AdminUser | null;
    filters: UserFilters;
    pagination: Pagination;
    loading: boolean;
    error: string | null;
  },
  analytics: {
    dashboardStats: DashboardStats | null;
    contentAnalytics: ContentAnalytics | null;
    questionAnalytics: QuestionAnalytics | null;
    testAnalytics: TestAnalytics | null;
    userAnalytics: UserAnalytics | null;
    loading: boolean;
    error: string | null;
  },
  notifications: {
    toasts: Toast[];
    dialogs: Dialog[];
  },
  ui: {
    theme: 'light' | 'dark';
    sidebarOpen: boolean;
    loading: boolean;
  }
}
```

### Redux Thunks (Async Actions)
- `fetchContentList`
- `uploadContent`
- `publishContent`
- `createQuestion`
- `publishQuestion`
- `createTest`
- `publishTest`
- `createUser`
- `fetchAnalytics`
- `generateReport`

---

## Error Handling

### Error Scenarios
1. **Network Errors**
   - No internet connection
   - Server timeout
   - Request failed

2. **Authentication Errors**
   - Invalid credentials
   - Token expired
   - Unauthorized access

3. **Validation Errors**
   - Invalid input
   - Duplicate entry
   - Missing required field

4. **Server Errors**
   - 500 Internal Server Error
   - 400 Bad Request
   - 403 Forbidden
   - 404 Not Found

### Error Handling Strategy

**HTTP Interceptor**:
```typescript
// Handle 401 - Redirect to login
// Handle 403 - Show unauthorized dialog
// Handle 500 - Show server error dialog
// Retry failed requests (with exponential backoff)
// Log errors for debugging
```

**UI Components**:
- Error alerts
- Error messages in forms
- Toast notifications
- Error pages (404, 500)
- Fallback UI

**User Feedback**:
- Clear error messages
- Suggested actions
- Retry buttons
- Report issue button

---

## Performance Requirements

### Metrics
- Page load time: < 3 seconds
- Time to interactive: < 5 seconds
- First contentful paint: < 2 seconds
- Largest contentful paint: < 2.5 seconds
- Cumulative layout shift: < 0.1

### Optimization Strategies
1. **Code Splitting**
   - Route-based code splitting
   - Component lazy loading

2. **Bundle Optimization**
   - Minification
   - Tree shaking
   - Compression

3. **Caching**
   - HTTP caching
   - Service workers
   - Local storage

4. **Image Optimization**
   - WebP format
   - Responsive images
   - Lazy loading

5. **Rendering Performance**
   - Virtual scrolling for large lists
   - Memoization
   - Debouncing/Throttling
   - React.lazy and Suspense

6. **Network**
   - API response caching
   - Pagination for large datasets
   - Infinite scrolling (optional)

---

## Development Guidelines

### Naming Conventions
```
Components: PascalCase (LoginForm.tsx)
Hooks: camelCase with 'use' prefix (useAuth.ts)
Services: camelCase (auth.service.ts)
Types: PascalCase (User.types.ts)
Constants: UPPER_SNAKE_CASE (constants.ts)
Functions: camelCase (formatDate())
Variables: camelCase (userList)
CSS classes: kebab-case (.user-list)
```

### Code Quality
- ESLint rules enforced
- Prettier formatting
- TypeScript strict mode
- 80%+ test coverage
- No console.log in production

### Git Workflow
- Feature branches: `feature/feature-name`
- Bug fixes: `fix/bug-name`
- Hotfixes: `hotfix/hotfix-name`
- Commit messages: conventional commits

### Documentation
- Component documentation (JSDoc)
- Service documentation
- Type definitions
- README.md files
- Storybook for components

---

## Deployment

### Build & Deploy Process
1. **Development**: `npm run dev`
2. **Build**: `npm run build`
3. **Test**: `npm run test`
4. **Preview**: `npm run preview`
5. **Deploy**: Push to main branch (auto-deploy via CI/CD)

### Environment Variables
```
REACT_APP_API_URL=https://api.vedai.com/api
REACT_APP_ENV=production
REACT_APP_LOG_LEVEL=error
```

### CI/CD Pipeline
- GitHub Actions / GitLab CI
- Automated tests on PR
- Code coverage reports
- Automated deployment

---

## Summary

This comprehensive requirements document covers:
- ✅ Complete project structure
- ✅ All modules (Content, Questions, Tests, Users, Analytics)
- ✅ Authentication & authorization
- ✅ Component architecture
- ✅ API integration points
- ✅ State management
- ✅ Error handling
- ✅ Performance requirements
- ✅ Development guidelines

**Ready for frontend development with React, TypeScript, Material-UI, Redux, and Axios.**


