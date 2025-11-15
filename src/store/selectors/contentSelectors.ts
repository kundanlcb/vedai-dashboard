import type { RootState } from '../store';

export const selectContentItems = (state: RootState) => state.content.items;
export const selectCurrentContent = (state: RootState) => state.content.currentItem;
export const selectContentLoading = (state: RootState) => state.content.loading;
export const selectContentError = (state: RootState) => state.content.error;
export const selectContentPagination = (state: RootState) => state.content.pagination;
export const selectContentFilters = (state: RootState) => state.content.filters;
export const selectContentStats = (state: RootState) => state.content.stats;
export const selectSelectedContentIds = (state: RootState) => state.content.selectedIds;
export const selectContentPage = (state: RootState) => state.content.pagination.page;
export const selectContentLimit = (state: RootState) => state.content.pagination.limit;
export const selectContentTotal = (state: RootState) => state.content.pagination.total;

