# Content Management - Implementation Notes

**Quick reference for developers**

## Files to Edit

```
src/types/content.types.ts              ← Type definitions
src/services/content.service.ts         ← API calls
src/store/slices/contentSlice.ts        ← Redux state
src/store/selectors/contentSelectors.ts ← Selectors
src/components/tables/ContentTable.tsx  ← Table component
src/pages/content/ContentListPage.tsx   ← List page
src/pages/content/ContentUploadPage.tsx ← Upload page
```

## API Endpoints Needed (18)

**Content CRUD**
- `GET /api/content` (with pagination & filters)
- `GET /api/content/:id`
- `POST /api/content/upload` (FormData)
- `PUT /api/content/:id/metadata`
- `PATCH /api/content/:id/status`
- `DELETE /api/content/:id`

**Bulk**
- `POST /api/content/bulk/publish`
- `POST /api/content/bulk/archive`
- `POST /api/content/bulk/delete`

**Data**
- `GET /api/content/stats`
- `GET /api/content/subjects`
- `GET /api/content/chapters/:subject`
- `GET /api/content/classes`
- `GET /api/content/export?format=excel`

## Key Classes/Functions

```typescript
// Service
contentService.getContent()
contentService.uploadContent()
contentService.publishContent()
contentService.exportContent()

// Redux
dispatch(fetchContent())
dispatch(publishContent())
useSelector(selectContentItems)
useSelector(selectContentLoading)

// Components
<ContentTable items={} onPublish={} />
<ContentListPage />
<ContentUploadPage />
```

## Important Notes

- File size: max 100MB
- File types: PDF, TXT, MP4, MP3
- Pagination: 10/25/50 items
- Statuses: draft, under_review, approved, published, archived
- All methods in contentService.ts handle API calls
- Redux thunks handle async operations
- Material-UI components used throughout

## Status
- ✅ Frontend: Complete
- ⏳ Backend: Needs implementation
- ⏳ Testing: Ready to write

See CONTENT_MANAGEMENT.md for complete documentation.

