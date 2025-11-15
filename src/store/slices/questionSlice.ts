import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Question, QuestionFilters, QuestionListResponse } from '../../types/question.types';
import questionService from '../../services/question.service';

export interface QuestionState {
  items: Question[];
  currentQuestion: Question | null;
  loading: boolean;
  error: string | null;
  pagination: { page: number; limit: number; total: number; totalPages: number };
  filters: QuestionFilters;
  stats: { total: number; published: number; draft: number; underReview: number; archived: number } | null;
  selectedIds: string[];
}

const initialState: QuestionState = {
  items: [],
  currentQuestion: null,
  loading: false,
  error: null,
  pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
  filters: {},
  stats: null,
  selectedIds: [],
};

// Async thunks
export const fetchQuestions = createAsyncThunk<
  QuestionListResponse,
  { page: number; limit: number; filters?: QuestionFilters },
  { rejectValue: string }
>('questions/fetchQuestions', async (params, { rejectWithValue }) => {
  try {
    return await questionService.getQuestions(params.page, params.limit, params.filters);
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch questions');
  }
});

export const fetchQuestionById = createAsyncThunk<Question, string, { rejectValue: string }>(
  'questions/fetchQuestionById',
  async (id, { rejectWithValue }) => {
    try {
      return await questionService.getQuestionById(id);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch question');
    }
  }
);

export const publishQuestion = createAsyncThunk<Question, string, { rejectValue: string }>(
  'questions/publishQuestion',
  async (id, { rejectWithValue }) => {
    try {
      return await questionService.publishQuestion(id);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to publish question');
    }
  }
);

export const archiveQuestion = createAsyncThunk<Question, string, { rejectValue: string }>(
  'questions/archiveQuestion',
  async (id, { rejectWithValue }) => {
    try {
      return await questionService.archiveQuestion(id);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to archive question');
    }
  }
);

export const deleteQuestion = createAsyncThunk<void, string, { rejectValue: string }>(
  'questions/deleteQuestion',
  async (id, { rejectWithValue }) => {
    try {
      await questionService.deleteQuestion(id);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete question');
    }
  }
);

export const fetchQuestionStats = createAsyncThunk<
  { total: number; published: number; draft: number; underReview: number; archived: number },
  void,
  { rejectValue: string }
>('questions/fetchStats', async (_, { rejectWithValue }) => {
  try {
    return await questionService.getQuestionStats();
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch stats');
  }
});

const questionSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<QuestionFilters>) => {
      state.filters = action.payload;
      state.pagination.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.pagination.limit = action.payload;
      state.pagination.page = 1;
    },
    toggleSelectId: (state, action: PayloadAction<string>) => {
      const index = state.selectedIds.indexOf(action.payload);
      if (index > -1) {
        state.selectedIds.splice(index, 1);
      } else {
        state.selectedIds.push(action.payload);
      }
    },
    selectAllIds: (state) => {
      state.selectedIds = state.items.map((item: Question) => item.id);
    },
    clearSelectedIds: (state) => {
      state.selectedIds = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch questions';
      })
      .addCase(fetchQuestionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestionById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentQuestion = action.payload;
      })
      .addCase(fetchQuestionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch question';
      })
      .addCase(publishQuestion.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((item: Question) => item.id === action.payload.id);
        if (index > -1) state.items[index] = action.payload;
        if (state.currentQuestion?.id === action.payload.id) state.currentQuestion = action.payload;
      })
      .addCase(archiveQuestion.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((item: Question) => item.id === action.payload.id);
        if (index > -1) state.items[index] = action.payload;
        if (state.currentQuestion?.id === action.payload.id) state.currentQuestion = action.payload;
      })
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item: Question) => item.id !== action.meta.arg);
        state.selectedIds = state.selectedIds.filter((id) => id !== action.meta.arg);
      })
      .addCase(fetchQuestionStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export const { setFilters, setPage, setLimit, toggleSelectId, selectAllIds, clearSelectedIds } =
  questionSlice.actions;

export default questionSlice.reducer;

