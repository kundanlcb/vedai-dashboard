import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  DashboardStats,
  ContentAnalytics,
  QuestionAnalytics,
  TestAnalytics,
  AnalyticsFilters,
} from '../../types/analytics.types';
import analyticsService from '../../services/analytics.service';

export interface AnalyticsState {
  dashboardStats: DashboardStats | null;
  contentAnalytics: ContentAnalytics | null;
  questionAnalytics: QuestionAnalytics | null;
  testAnalytics: TestAnalytics | null;
  loading: boolean;
  error: string | null;
  filters: AnalyticsFilters;
}

const initialState: AnalyticsState = {
  dashboardStats: null,
  contentAnalytics: null,
  questionAnalytics: null,
  testAnalytics: null,
  loading: false,
  error: null,
  filters: {},
};

export const fetchDashboardStats = createAsyncThunk<
  DashboardStats,
  AnalyticsFilters | undefined,
  { rejectValue: string }
>('analytics/fetchDashboardStats', async (filters, { rejectWithValue }) => {
  try {
    return await analyticsService.getDashboardStats(filters);
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch dashboard stats');
  }
});

export const fetchContentAnalytics = createAsyncThunk<
  ContentAnalytics,
  AnalyticsFilters | undefined,
  { rejectValue: string }
>('analytics/fetchContentAnalytics', async (filters, { rejectWithValue }) => {
  try {
    return await analyticsService.getContentAnalytics(filters);
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch content analytics');
  }
});

export const fetchQuestionAnalytics = createAsyncThunk<
  QuestionAnalytics,
  AnalyticsFilters | undefined,
  { rejectValue: string }
>('analytics/fetchQuestionAnalytics', async (filters, { rejectWithValue }) => {
  try {
    return await analyticsService.getQuestionAnalytics(filters);
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch question analytics');
  }
});

export const fetchTestAnalytics = createAsyncThunk<
  TestAnalytics,
  AnalyticsFilters | undefined,
  { rejectValue: string }
>('analytics/fetchTestAnalytics', async (filters, { rejectWithValue }) => {
  try {
    return await analyticsService.getTestAnalytics(filters);
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch test analytics');
  }
});

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<AnalyticsFilters>) => {
      state.filters = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardStats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch stats';
      })
      .addCase(fetchContentAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContentAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.contentAnalytics = action.payload;
      })
      .addCase(fetchContentAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch content analytics';
      })
      .addCase(fetchQuestionAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestionAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.questionAnalytics = action.payload;
      })
      .addCase(fetchQuestionAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch question analytics';
      })
      .addCase(fetchTestAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTestAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.testAnalytics = action.payload;
      })
      .addCase(fetchTestAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch test analytics';
      });
  },
});

export const { setFilters, clearError } = analyticsSlice.actions;

export default analyticsSlice.reducer;

