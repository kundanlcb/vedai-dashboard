import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ContentFile, ContentFilters, ContentListResponse } from '../../types/content.types';
import contentService from '../../services/content.service';

export interface ContentState {
  items: ContentFile[];
  currentItem: ContentFile | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: ContentFilters;
  stats: {
    total: number;
    published: number;
    draft: number;
    underReview: number;
    archived: number;
  } | null;
  selectedIds: string[];
}

const initialState: ContentState = {
  items: [],
  currentItem: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  filters: {},
  stats: null,
  selectedIds: [],
};

// Async thunks
export const fetchContent = createAsyncThunk<
  ContentListResponse,
  { page: number; limit: number; filters?: ContentFilters },
  { rejectValue: string }
>('content/fetchContent', async (params, { rejectWithValue }) => {
  try {
    return await contentService.getContent(params.page, params.limit, params.filters);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch content';
    return rejectWithValue(message);
  }
});

export const fetchContentById = createAsyncThunk<
  ContentFile,
  string,
  { rejectValue: string }
>('content/fetchContentById', async (id, { rejectWithValue }) => {
  try {
    return await contentService.getContentById(id);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch content';
    return rejectWithValue(message);
  }
});

export const publishContent = createAsyncThunk<
  ContentFile,
  string,
  { rejectValue: string }
>('content/publishContent', async (id, { rejectWithValue }) => {
  try {
    return await contentService.publishContent(id);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to publish content';
    return rejectWithValue(message);
  }
});

export const archiveContent = createAsyncThunk<
  ContentFile,
  string,
  { rejectValue: string }
>('content/archiveContent', async (id, { rejectWithValue }) => {
  try {
    return await contentService.archiveContent(id);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to archive content';
    return rejectWithValue(message);
  }
});

export const deleteContent = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>('content/deleteContent', async (id, { rejectWithValue }) => {
  try {
    await contentService.deleteContent(id);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete content';
    return rejectWithValue(message);
  }
});

export const fetchContentStats = createAsyncThunk<
  { total: number; published: number; draft: number; underReview: number; archived: number },
  void,
  { rejectValue: string }
>('content/fetchStats', async (_, { rejectWithValue }) => {
  try {
    return await contentService.getContentStats();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch stats';
    return rejectWithValue(message);
  }
});

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<ContentFilters>) => {
      state.filters = action.payload;
      state.pagination.page = 1; // Reset to first page when filters change
    },
    clearFilters: (state) => {
      state.filters = {};
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
      const id = action.payload;
      const index = state.selectedIds.indexOf(id);
      if (index > -1) {
        state.selectedIds.splice(index, 1);
      } else {
        state.selectedIds.push(id);
      }
    },
    selectAllIds: (state) => {
      state.selectedIds = state.items.map((item) => item.id);
    },
    clearSelectedIds: (state) => {
      state.selectedIds = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch content
      .addCase(fetchContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContent.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch content';
      })
      // Fetch single content
      .addCase(fetchContentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContentById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentItem = action.payload;
      })
      .addCase(fetchContentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch content';
      })
      // Publish content
      .addCase(publishContent.pending, (state) => {
        state.loading = true;
      })
      .addCase(publishContent.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index > -1) {
          state.items[index] = action.payload;
        }
        if (state.currentItem?.id === action.payload.id) {
          state.currentItem = action.payload;
        }
      })
      // Archive content
      .addCase(archiveContent.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index > -1) {
          state.items[index] = action.payload;
        }
        if (state.currentItem?.id === action.payload.id) {
          state.currentItem = action.payload;
        }
      })
      // Delete content
      .addCase(deleteContent.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item: ContentFile) => item.id !== action.meta.arg);
        state.selectedIds = state.selectedIds.filter((id) => id !== action.meta.arg);
      })
      // Fetch stats
      .addCase(fetchContentStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export const {
  setFilters,
  clearFilters,
  setPage,
  setLimit,
  toggleSelectId,
  selectAllIds,
  clearSelectedIds,
  clearError,
} = contentSlice.actions;

export default contentSlice.reducer;

