import type { RootState } from '../store';

export const selectTestItems = (state: RootState) => state.tests.items;
export const selectCurrentTest = (state: RootState) => state.tests.currentTest;
export const selectTestLoading = (state: RootState) => state.tests.loading;
export const selectTestError = (state: RootState) => state.tests.error;
export const selectTestPagination = (state: RootState) => state.tests.pagination;
export const selectTestFilters = (state: RootState) => state.tests.filters;
export const selectTestStats = (state: RootState) => state.tests.stats;
export const selectSelectedTestIds = (state: RootState) => state.tests.selectedIds;

