import type { RootState } from '../store';

export const selectUserItems = (state: RootState) => state.users.items;
export const selectCurrentUser = (state: RootState) => state.users.currentUser;
export const selectUserLoading = (state: RootState) => state.users.loading;
export const selectUserError = (state: RootState) => state.users.error;
export const selectUserPagination = (state: RootState) => state.users.pagination;
export const selectUserFilters = (state: RootState) => state.users.filters;
export const selectUserStats = (state: RootState) => state.users.stats;
export const selectSelectedUserIds = (state: RootState) => state.users.selectedIds;

