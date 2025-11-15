# Phase 2 Implementation Plan

**Prepared**: November 15, 2025
**Priority**: Phase 2 Missing Features
**Estimated Timeline**: 2-3 weeks

---

## 1. IMMEDIATE SETUP (Priority 0)

### Install Chart Library
```bash
npm install recharts
# OR
npm install chart.js react-chartjs-2
```

### Install Additional Libraries
```bash
npm install react-dropzone xlsx jsPDF react-pdf
npm install react-quill # Rich text editor
npm install day.js lodash
```

---

## 2. DETAIL & EDIT PAGES (Priority 1)

### Content Module
**Files to Create**:
- `src/pages/content/ContentDetailPage.tsx`
- `src/pages/content/ContentEditPage.tsx`
- `src/pages/content/ContentOrganizePage.tsx`

**Features**:
- View file information & metadata
- Edit metadata (title, description, etc.)
- Show processing status & embeddings
- File preview (PDF/video)
- Organize by class/subject/chapter
- Delete & publish actions

**Estimated Effort**: 3 days

---

### Question Module
**Files to Create**:
- `src/pages/questions/QuestionDetailPage.tsx`
- `src/pages/questions/QuestionEditPage.tsx`
- `src/pages/questions/QuestionReviewPage.tsx`
- `src/pages/questions/QuestionBankPage.tsx`

**Features**:
- View question details
- Edit question (same form as create)
- Review workflow (approve/reject)
- Tree view: Subject → Chapter → Topic → Questions
- Duplicate/clone questions

**Estimated Effort**: 4 days

---

### Test Module
**Files to Create**:
- `src/pages/tests/TestDetailPage.tsx`
- `src/pages/tests/TestEditPage.tsx`
- `src/pages/tests/TestConfigurePage.tsx`
- `src/pages/tests/TestPublishPage.tsx`

**Features**:
- View test details & statistics
- Edit test configuration
- Add/remove/reorder questions
- Change marks per question
- Publish workflow
- Access settings (start/end dates, password)

**Estimated Effort**: 4 days

---

### User Module
**Files to Create**:
- `src/pages/users/UserDetailPage.tsx`
- `src/pages/users/UserEditPage.tsx`
- `src/pages/users/ProfilePage.tsx` (enhance existing)

**Features**:
- View user profile
- Edit user details (name, phone, role)
- Change password
- View login history
- View activity logs
- Manage assigned subjects/classes

**Estimated Effort**: 3 days

---

## 3. CHART VISUALIZATIONS (Priority 2)

### Create Chart Components
**Files to Create**:
- `src/components/charts/BarChart.tsx`
- `src/components/charts/LineChart.tsx`
- `src/components/charts/PieChart.tsx`
- `src/components/charts/AreaChart.tsx`
- `src/components/charts/Heatmap.tsx`

### Update Analytics Pages
**Files to Update**:
- `src/pages/analytics/AnalyticsDashboard.tsx` - Add user growth, content upload, test attempts charts
- `src/pages/analytics/ContentAnalyticsPage.tsx` - Add pie (by subject), bar (by chapter), line (upload trend)
- `src/pages/analytics/QuestionAnalyticsPage.tsx` - Add pie (difficulty), bar (by subject), line (success rate)
- `src/pages/analytics/TestAnalyticsPage.tsx` - Add bar (attempts), line (score trend), pie (pass/fail)

**Estimated Effort**: 5 days

---

## 4. REPORT & EXPORT (Priority 3)

### Create Report Service
**Files to Create**:
- `src/services/report.service.ts` - Report generation
- `src/services/export.service.ts` - Export to PDF/Excel

### Create Pages
**Files to Create**:
- `src/pages/analytics/ReportPage.tsx` - Report builder
- `src/pages/analytics/ExportPage.tsx` - Export options

**Features**:
- Select report type (content, question, test, user, custom)
- Choose metrics to include
- Select date range
- Generate PDF/Excel
- Download file
- Email report (optional)
- Schedule reports (optional)

**Estimated Effort**: 4 days

---

## 5. AUDIT & LOGGING (Priority 4)

### Create Audit Service
**Files to Create**:
- `src/services/audit.service.ts`
- `src/types/audit.types.ts`
- `src/store/slices/auditSlice.ts`
- `src/store/selectors/auditSelectors.ts`

### Create Pages
**Files to Create**:
- `src/pages/audit/AuditLogPage.tsx` - All audit logs
- `src/pages/audit/ActivityLogPage.tsx` - User activities
- `src/pages/audit/SecurityLogPage.tsx` - Security events

**Features**:
- View audit logs with timestamp & user
- Filter by date, user, action
- Export logs
- Search functionality

**Estimated Effort**: 3 days

---

## 6. SETTINGS MODULE (Priority 5)

### Create Settings Service
**Files to Create**:
- `src/services/settings.service.ts`
- `src/types/settings.types.ts`

### Create Pages
**Files to Create**:
- `src/pages/settings/SettingsPage.tsx` - Main settings
- `src/pages/settings/GeneralSettings.tsx` - General options
- `src/pages/settings/SecuritySettings.tsx` - Security options
- `src/pages/settings/NotificationSettings.tsx` - Notification prefs

**Features**:
- Theme settings (light/dark)
- Language selection
- Email notifications
- Security options
- System configuration
- Backup & restore

**Estimated Effort**: 3 days

---

## 7. ADVANCED COMPONENTS (Priority 6)

### Generic Components
**Files to Create**:
- `src/components/common/DataTable.tsx` - Generic data table
- `src/components/common/FilterPanel.tsx` - Advanced filters
- `src/components/dialogs/ConfirmDialog.tsx` - Reusable confirm
- `src/components/dialogs/SelectQuestionsModal.tsx` - Question selection
- `src/components/dialogs/PreviewModal.tsx` - Preview any item

### Form Components
**Files to Create**:
- `src/components/forms/ChangePasswordForm.tsx`
- `src/components/forms/BulkUploadForm.tsx`
- `src/components/forms/RichTextEditor.tsx`

**Estimated Effort**: 4 days

---

## 8. IMPLEMENTATION ORDER

### Week 1
1. Install dependencies (chart library, etc.)
2. Create chart components
3. Update analytics pages with charts
4. Create ContentDetailPage & ContentEditPage

### Week 2
1. Create QuestionDetailPage & QuestionEditPage
2. Create QuestionReviewPage & QuestionBankPage
3. Create TestDetailPage & TestEditPage
4. Create TestConfigurePage & TestPublishPage

### Week 3
1. Create UserDetailPage & UserEditPage
2. Create ReportPage & ExportPage
3. Create AuditLogPage, ActivityLogPage, SecurityLogPage
4. Create SettingsPages

### Week 4 (Optional)
1. Create advanced components
2. Optimize performance
3. Add animations & transitions
4. Polish UI/UX

---

## 9. TESTING CHECKLIST

### Unit Tests (Per Page)
- [ ] Page renders correctly
- [ ] Redux dispatches correct actions
- [ ] Form validation works
- [ ] API calls are made
- [ ] Error handling works

### Integration Tests
- [ ] Create → List → Detail → Edit → Delete flow
- [ ] Filtering & pagination work
- [ ] Bulk operations work
- [ ] Analytics data displays correctly

### E2E Tests
- [ ] Complete user workflows
- [ ] Permission-based access
- [ ] Error scenarios

---

## 10. CODE QUALITY CHECKLIST

- [ ] 100% TypeScript type coverage (no `any`)
- [ ] Zero ESLint errors
- [ ] Consistent formatting (Prettier)
- [ ] JSDoc comments for complex functions
- [ ] Relative path imports (no path aliases)
- [ ] No unused imports/exports
- [ ] Proper error handling
- [ ] Loading states on all async operations
- [ ] useEffect dependencies correct
- [ ] Redux selectors memoized

---

## 11. DOCUMENTATION UPDATES

After each phase, update:
- `IMPLEMENTATION_vs_REQUIREMENTS.md` - Mark as complete
- Component library documentation
- API integration guide
- Setup guide

---

## 12. ESTIMATED TIMELINE

| Phase | Days | Completion % |
|-------|------|--------------|
| Current (Phase 1) | Completed | 52% |
| Detail/Edit Pages | 3 weeks | 75% |
| Charts & Reports | 2 weeks | 90% |
| Audit & Settings | 2 weeks | 100% |
| **Total** | **7 weeks** | **100%** |

---

## 13. DEPENDENCIES & BLOCKERS

### Ready to Go ✅
- Redux structure is solid
- API services are defined
- Type definitions are complete
- State management patterns established

### Need Backend ⚠️
- All API endpoints (can mock if needed)
- User roles & permissions
- File processing status
- Audit event logging

### Need Decisions 🤔
- Chart library (Recharts vs Chart.js)
- Rich text editor (react-quill vs draft.js)
- PDF generation (jsPDF vs pdfkit)
- Email notification system

---

## QUICK START GUIDE FOR PHASE 2

### 1. Install Charts
```bash
npm install recharts
```

### 2. Create Chart Components
Use Recharts to create reusable chart components that accept data arrays.

### 3. Update Analytics Pages
Integrate charts into existing analytics pages.

### 4. Create Detail Pages
Copy-paste list page and modify to show single item details.

### 5. Create Edit Pages
Copy-paste create page and modify to load existing data.

### 6. Test Everything
Ensure all CRUD operations work end-to-end.

---

## SUCCESS CRITERIA

✅ All pages load without errors
✅ All forms submit successfully
✅ All CRUD operations work
✅ Charts display correctly
✅ Filters & pagination work
✅ Bulk operations succeed
✅ Reports generate & download
✅ Audit logs capture all actions
✅ Settings persist
✅ 100% TypeScript strict mode
✅ Zero ESLint errors
✅ Responsive on all devices
✅ <3 second load time

---

**Next**: Start Phase 2 with chart integration and detail pages.

