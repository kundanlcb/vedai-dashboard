import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User, UserFilters, UserListResponse } from '../../types/user.types';
import userService from '../../services/user.service';

export interface UserState {
  items: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  pagination: { page: number; limit: number; total: number; totalPages: number };
  filters: UserFilters;
  stats: { total: number; active: number; inactive: number; pending: number } | null;
  selectedIds: string[];
}

const initialState: UserState = {
  items: [],
  currentUser: null,
  loading: false,
  error: null,
  pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
  filters: {},
  stats: null,
  selectedIds: [],
};

export const fetchUsers = createAsyncThunk<
  UserListResponse,
  { page: number; limit: number; filters?: UserFilters },
  { rejectValue: string }
>('users/fetchUsers', async (params, { rejectWithValue }) => {
  try {
    return await userService.getUsers(params.page, params.limit, params.filters);
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch users');
  }
});

export const fetchUserById = createAsyncThunk<User, string, { rejectValue: string }>(
  'users/fetchUserById',
  async (id, { rejectWithValue }) => {
    try {
      return await userService.getUserById(id);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch user');
    }
  }
);

export const deactivateUser = createAsyncThunk<User, string, { rejectValue: string }>(
  'users/deactivateUser',
  async (id, { rejectWithValue }) => {
    try {
      return await userService.deactivateUser(id);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to deactivate user');
    }
  }
);

export const activateUser = createAsyncThunk<User, string, { rejectValue: string }>(
  'users/activateUser',
  async (id, { rejectWithValue }) => {
    try {
      return await userService.activateUser(id);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to activate user');
    }
  }
);

export const deleteUser = createAsyncThunk<void, string, { rejectValue: string }>(
  'users/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      await userService.deleteUser(id);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete user');
    }
  }
);

export const fetchUserStats = createAsyncThunk<
  { total: number; active: number; inactive: number; pending: number },
  void,
  { rejectValue: string }
>('users/fetchStats', async (_, { rejectWithValue }) => {
  try {
    return await userService.getUserStats();
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch stats');
  }
});

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<UserFilters>) => {
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
      state.selectedIds = state.items.map((item: User) => item.id);
    },
    clearSelectedIds: (state) => {
      state.selectedIds = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch users';
      })
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch user';
      })
      .addCase(deactivateUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((item: User) => item.id === action.payload.id);
        if (index > -1) state.items[index] = action.payload;
        if (state.currentUser?.id === action.payload.id) state.currentUser = action.payload;
      })
      .addCase(activateUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((item: User) => item.id === action.payload.id);
        if (index > -1) state.items[index] = action.payload;
        if (state.currentUser?.id === action.payload.id) state.currentUser = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item: User) => item.id !== action.meta.arg);
        state.selectedIds = state.selectedIds.filter((id) => id !== action.meta.arg);
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export const { setFilters, setPage, setLimit, toggleSelectId, selectAllIds, clearSelectedIds } =
  userSlice.actions;

export default userSlice.reducer;

