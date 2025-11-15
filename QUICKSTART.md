# VedAI Admin Dashboard - Quick Start Guide

## Prerequisites

- Node.js 18.x LTS or higher
- npm 8.x or higher
- Git

## Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repo-url>
   cd vedai-dashboard
   ```

2. **Install dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Create environment file**:
   ```bash
   cp .env.example .env.local
   ```

4. **Configure API URL** (edit `.env.local`):
   ```
   VITE_API_URL=http://localhost:8000/api
   VITE_ENV=development
   VITE_LOG_LEVEL=debug
   ```

## Development

### Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

## Production

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## Project Structure Quick Reference

```
src/
├── components/     - Reusable UI components
├── pages/         - Page components
├── services/      - API services
├── store/         - Redux state management
├── hooks/         - Custom React hooks
├── types/         - TypeScript types
├── utils/         - Utility functions
├── styles/        - Global styles and theme
├── context/       - React context
├── guards/        - Route guards
├── layouts/       - Layout components
└── routes/        - Route configuration
```

## Available Pages

### Authentication
- **Login**: `/login` - User login page

### Dashboard
- **Dashboard**: `/dashboard` - Main admin dashboard

### Content Management
- **Content List**: `/content` - View all content
- **Upload Content**: `/content/upload` - Upload new content

### Questions
- **Question Bank**: `/questions` - View all questions
- **Create Question**: `/questions/create` - Create new question

### Tests
- **Tests List**: `/tests` - View all tests
- **Create Test**: `/tests/create` - Create new test

### Users
- **Users List**: `/users` - View all users
- **Create User**: `/users/create` - Create new user
- **Profile**: `/profile` - View own profile

### Analytics
- **Analytics**: `/analytics` - View analytics dashboard

### Settings
- **Settings**: `/settings` - System settings

### Error Pages
- **Not Found**: `/404` - Page not found
- **Unauthorized**: `/unauthorized` - Access denied

## Default Test Credentials

Currently using mock authentication. Once backend is ready, use actual credentials.

**Test Login**:
- Email: `admin@vedai.com`
- Password: Any password (mock login)

## Available Roles

1. **Super Admin** - Full system access
2. **Content Manager** - Manage content
3. **Question Manager** - Manage questions
4. **Test Manager** - Manage tests
5. **Teacher** - Limited access

## Theme

The application supports both light and dark themes. Click the theme toggle button in the top navigation to switch.

Theme preference is saved in localStorage and persists across sessions.

## Redux State

Current Redux state includes:
- **auth** - Authentication state and user info
- **ui** - UI state (theme, sidebar, loading)
- **notifications** - Toast notifications

Access state using Redux hooks:
```typescript
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUser } from '@store/selectors/authSelectors';

function MyComponent() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  // ...
}
```

## Custom Hooks

### useAuth
```typescript
import useAuth from '@hooks/useAuth';

const { isAuthenticated, user, login, logout, can, canAny, canAll, isRole } = useAuth();
```

### useNotification
```typescript
import useNotification from '@hooks/useNotification';

const { showSuccess, showError, showWarning, showInfo } = useNotification();
```

## Common Tasks

### Adding a New Page

1. Create file in `src/pages/[module]/[PageName].tsx`
2. Import layout (AdminLayout or AuthLayout)
3. Export component
4. Add route in `src/routes/AppRoutes.tsx`
5. Add menu item in Sidebar (if applicable)

### Adding a New Component

1. Create file in `src/components/[category]/[ComponentName].tsx`
2. Use TypeScript and PropTypes
3. Document with JSDoc comments
4. Export component

### Making API Calls

1. Create service file in `src/services/[module].service.ts`
2. Use axiosInstance from `@services/api`
3. Define and export service methods
4. Use in Redux thunks or components

### Checking Permissions

```typescript
import useAuth from '@hooks/useAuth';

const { can, canAny, canAll, isRole } = useAuth();

// Check single permission
if (can('content.upload')) {
  // Show upload button
}

// Check multiple permissions
if (canAny(['content.upload', 'content.review'])) {
  // Show content management
}

// Check role
if (isRole('super_admin')) {
  // Show admin-only features
}
```

## Styling

Use Tailwind CSS utility classes or MUI components:

```tsx
// Tailwind
<div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md">
  Content
</div>

// MUI
<Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
  Content
</Box>

// CSS Custom Properties
<div style={{ color: 'var(--primary)', padding: 'var(--spacing-md)' }}>
  Content
</div>
```

## Debugging

### Enable Debug Logging

Set `VITE_LOG_LEVEL=debug` in `.env.local`

### Redux DevTools

Install Redux DevTools browser extension for state inspection

### MUI Production Mode

Some warnings in development are expected. They'll be removed in production.

## Troubleshooting

### Port Already in Use

```bash
# Change port in vite.config.ts or use:
npm run dev -- --port 3000
```

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run build
```

### Type Errors

```bash
# Run type check
npm run type-check

# Check tsconfig.json for configuration
```

## Common Files to Edit

- **Add Routes**: `src/routes/AppRoutes.tsx`
- **Add Menu Items**: `src/components/common/Sidebar.tsx`
- **Update Theme**: `src/styles/theme.ts`
- **Global Styles**: `src/styles/globals.css`
- **Redux State**: `src/store/slices/`
- **API Services**: `src/services/`

## Next Steps

1. Set up backend API
2. Update `.env.local` with actual API URL
3. Implement content management module
4. Add data tables and forms
5. Implement analytics features
6. Add export functionality

## Support

For issues or questions:
1. Check the IMPLEMENTATION_PROGRESS.md for current status
2. Review ADMIN_FRONTEND_REQUIREMENTS.md for specifications
3. Check component props in TypeScript definitions

## Resources

- [React Documentation](https://react.dev)
- [Material-UI Documentation](https://mui.com)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org)
- [React Router Documentation](https://reactrouter.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Vite Documentation](https://vite.dev)

