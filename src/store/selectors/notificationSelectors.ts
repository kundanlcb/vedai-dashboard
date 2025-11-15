import type { RootState } from '../store';

export const selectToasts = (state: RootState) => state.notifications.toasts;

