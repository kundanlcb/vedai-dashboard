import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Test, TestFilters, TestListResponse } from '../../types/test.types';
import testService from '../../services/test.service';

export interface TestState {
  items: Test[];
  currentTest: Test | null;
  loading: boolean;
  error: string | null;
  pagination: { page: number; limit: number; total: number; totalPages: number };
  filters: TestFilters;
  stats: { total: number; published: number; draft: number; underReview: number; archived: number } | null;
  selectedIds: string[];
}

const initialState: TestState = {
  items: [],
  currentTest: null,
  loading: false,
  error: null,
  pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
  filters: {},
  stats: null,
  selectedIds: [],
};

export const fetchTests = createAsyncThunk<
  TestListResponse,
  { page: number; limit: number; filters?: TestFilters },
  { rejectValue: string }
>('tests/fetchTests', async (params, { rejectWithValue }) => {
  try {
    return await testService.getTests(params.page, params.limit, params.filters);
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch tests');
  }
});

export const fetchTestById = createAsyncThunk<Test, string, { rejectValue: string }>(
  'tests/fetchTestById',
  async (id, { rejectWithValue }) => {
    try {
      return await testService.getTestById(id);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch test');
    }
  }
);

export const publishTest = createAsyncThunk<Test, string, { rejectValue: string }>(
  'tests/publishTest',
  async (id, { rejectWithValue }) => {
    try {
      return await testService.publishTest(id);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to publish test');
    }
  }
);

export const archiveTest = createAsyncThunk<Test, string, { rejectValue: string }>(
  'tests/archiveTest',
  async (id, { rejectWithValue }) => {
    try {
      return await testService.archiveTest(id);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to archive test');
    }
  }
);

export const deleteTest = createAsyncThunk<void, string, { rejectValue: string }>(
  'tests/deleteTest',
  async (id, { rejectWithValue }) => {
    try {
      await testService.deleteTest(id);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete test');
    }
  }
);

export const fetchTestStats = createAsyncThunk<
  { total: number; published: number; draft: number; underReview: number; archived: number },
  void,
  { rejectValue: string }
>('tests/fetchStats', async (_, { rejectWithValue }) => {
  try {
    return await testService.getTestStats();
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch stats');
  }
});

const testSlice = createSlice({
  name: 'tests',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<TestFilters>) => {
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
      state.selectedIds = state.items.map((item: Test) => item.id);
    },
    clearSelectedIds: (state) => {
      state.selectedIds = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTests.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchTests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch tests';
      })
      .addCase(fetchTestById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTestById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTest = action.payload;
      })
      .addCase(fetchTestById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch test';
      })
      .addCase(publishTest.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((item: Test) => item.id === action.payload.id);
        if (index > -1) state.items[index] = action.payload;
        if (state.currentTest?.id === action.payload.id) state.currentTest = action.payload;
      })
      .addCase(archiveTest.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((item: Test) => item.id === action.payload.id);
        if (index > -1) state.items[index] = action.payload;
        if (state.currentTest?.id === action.payload.id) state.currentTest = action.payload;
      })
      .addCase(deleteTest.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item: Test) => item.id !== action.meta.arg);
        state.selectedIds = state.selectedIds.filter((id) => id !== action.meta.arg);
      })
      .addCase(fetchTestStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export const { setFilters, setPage, setLimit, toggleSelectId, selectAllIds, clearSelectedIds } =
  testSlice.actions;

export default testSlice.reducer;

