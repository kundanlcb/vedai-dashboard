import type { RootState } from '../store';

export const selectQuestionItems = (state: RootState) => state.questions.items;
export const selectCurrentQuestion = (state: RootState) => state.questions.currentQuestion;
export const selectQuestionLoading = (state: RootState) => state.questions.loading;
export const selectQuestionError = (state: RootState) => state.questions.error;
export const selectQuestionPagination = (state: RootState) => state.questions.pagination;
export const selectQuestionFilters = (state: RootState) => state.questions.filters;
export const selectQuestionStats = (state: RootState) => state.questions.stats;
export const selectSelectedQuestionIds = (state: RootState) => state.questions.selectedIds;

