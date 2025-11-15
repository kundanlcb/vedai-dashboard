import type { RootState } from '../store';

export const selectTheme = (state: RootState) => state.ui.theme;
export const selectSidebarOpen = (state: RootState) => state.ui.sidebarOpen;
export const selectLoading = (state: RootState) => state.ui.loading;

