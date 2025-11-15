# VedAI Admin Dashboard

A comprehensive React 18 + TypeScript admin dashboard for managing educational content, questions, tests, users, and analytics.

## Features

- 🔐 Role-based access control (RBAC)
- 📚 Content management module
- ❓ Question bank management
- 📝 Test configuration and publishing
- 👥 User management with permissions
- 📊 Analytics and reporting
- 🎨 Light/Dark theme support
- 📱 Responsive design
- 🔄 Real-time notifications

## Tech Stack

- **React 18.x** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Redux Toolkit** - State management
- **Material-UI (MUI)** - Component library
- **Tailwind CSS** - Utility-first CSS
- **React Router v6** - Routing
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **Yup** - Schema validation
- **Recharts** - Data visualization
- **Day.js** - Date manipulation

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── common/         # Common UI components
│   ├── forms/          # Form components
│   ├── dialogs/        # Modal components
│   ├── tables/         # Table components
│   ├── cards/          # Card components
│   ├── charts/         # Chart components
│   └── alerts/         # Alert components
├── pages/              # Page components
│   ├── auth/           # Authentication pages
│   ├── dashboard/      # Dashboard pages
│   ├── content/        # Content management pages
│   ├── questions/      # Question bank pages
│   ├── tests/          # Test management pages
│   ├── users/          # User management pages
│   ├── analytics/      # Analytics pages
│   ├── audit/          # Audit log pages
│   └── settings/       # Settings pages
├── services/           # API services
├── store/              # Redux store
│   ├── slices/         # Redux slices
│   └── selectors/      # Redux selectors
├── hooks/              # Custom hooks
├── types/              # TypeScript types
├── utils/              # Utility functions
├── styles/             # Global styles
├── context/            # React context
├── guards/             # Route guards
├── middleware/         # Custom middleware
└── layouts/            # Layout components
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

3. Create `.env.local` file:
   ```
   VITE_API_URL=http://localhost:8000/api
   VITE_ENV=development
   VITE_LOG_LEVEL=debug
   ```

## Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Build

Build for production:

```bash
npm run build
```

## Type Checking

Run TypeScript type checker:

```bash
npm run type-check
```

## Linting

Run ESLint:

```bash
npm run lint
```

## Features Overview

### Authentication
- Email/Password login
- JWT token management
- Auto token refresh
- Session persistence
- Remember me functionality

### Role-Based Access Control
- Super Admin
- Content Manager
- Question Manager
- Test Manager
- Teacher

### Permissions
- Content upload, organize, review, publish
- Question create, review, publish
- Test create, configure, publish
- User management
- Analytics and reporting
- Audit logging

### Content Management
- File upload with drag & drop
- Content organization
- Status tracking (draft, under review, approved, published, archived)
- Bulk operations
- Content analytics

### Question Bank
- Rich text editor for questions
- Multiple choice support
- Difficulty levels (easy, medium, hard)
- Bloom's taxonomy support
- Question review workflow
- Success rate tracking

### Test Management
- Test creation and configuration
- Question selection (manual or auto-generated)
- Marking scheme configuration
- Test publishing
- Test analytics

### User Management
- User CRUD operations
- Role assignment
- Permission management
- Password management
- User activity tracking

### Analytics & Reporting
- Dashboard with key metrics
- Content analytics
- Question analytics
- Test analytics
- User analytics
- Report generation (PDF, Excel)

## API Integration

The app expects the following API endpoints:

### Authentication
- `POST /admin/users/login` - User login
- `POST /admin/users/logout` - User logout
- `GET /admin/users/me` - Get current user
- `POST /admin/users/change-password` - Change password
- `POST /auth/refresh` - Refresh token

### Content
- `POST /admin/content/upload` - Upload content
- `GET /admin/content` - List content
- `GET /admin/content/:id` - Get content details
- `PUT /admin/content/:id` - Update content
- `PATCH /admin/content/:id/organize` - Organize content
- `POST /admin/content/:id/publish` - Publish content
- `POST /admin/content/:id/archive` - Archive content
- `DELETE /admin/content/:id` - Delete content

### Questions
- `POST /admin/questions` - Create question
- `GET /admin/questions` - List questions
- `GET /admin/questions/:id` - Get question details
- `PUT /admin/questions/:id` - Update question
- `PATCH /admin/questions/:id/publish` - Publish question
- `POST /admin/questions/:id/archive` - Archive question
- `DELETE /admin/questions/:id` - Delete question

### Tests
- `POST /admin/tests` - Create test
- `GET /admin/tests` - List tests
- `GET /admin/tests/:id` - Get test details
- `PUT /admin/tests/:id` - Update test
- `POST /admin/tests/:id/publish` - Publish test
- `POST /admin/tests/:id/archive` - Archive test
- `DELETE /admin/tests/:id` - Delete test

### Users
- `POST /admin/users/register` - Create user
- `GET /admin/users` - List users
- `GET /admin/users/:id` - Get user details
- `PUT /admin/users/:id` - Update user
- `PATCH /admin/users/:id/role` - Change user role
- `POST /admin/users/:id/deactivate` - Deactivate user
- `DELETE /admin/users/:id` - Delete user

### Analytics
- `GET /analytics/dashboard` - Dashboard statistics
- `GET /analytics/content` - Content analytics
- `GET /analytics/questions` - Question analytics
- `GET /analytics/tests` - Test analytics
- `GET /analytics/users` - User analytics
- `POST /analytics/reports` - Generate report
- `GET /analytics/export` - Export data

## Environment Variables

- `VITE_API_URL` - Backend API base URL
- `VITE_ENV` - Environment (development/production)
- `VITE_LOG_LEVEL` - Log level (debug/info/warn/error)

## Code Style

- ESLint for linting
- Prettier for formatting
- TypeScript strict mode
- Conventional commits for git

## Performance

- Code splitting with Vite
- Lazy loading of routes
- Component memoization
- Redux memoized selectors
- Virtual scrolling for large lists
- Image optimization

## Security

- JWT authentication
- Token refresh mechanism
- HTTPS for production
- CSRF protection (via API)
- XSS prevention
- Content Security Policy

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## License

This project is proprietary and confidential.

## Support

For support, contact: support@vedai.com

