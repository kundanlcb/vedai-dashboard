import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface AuthUser {
  id: number;
  email: string;
  full_name: string;
  role: string;
  permissions: string[];
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: localStorage.getItem('auth_token') || null,
  loading: false,
  error: null,
};

// For now, we'll create placeholder thunks that will be implemented when API is ready
export const loginUser = createAsyncThunk<
  { access_token: string; token_type: string; user: AuthUser },
  { email: string; password: string },
  { rejectValue: string }
>(
  'auth/loginUser',
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      // Placeholder - will be replaced with actual API call
      return {
        access_token: 'placeholder_token',
        token_type: 'bearer',
        user: {
          id: 1,
          email: credentials.email,
          full_name: 'Admin User',
          role: 'super_admin',
          permissions: [],
        },
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      return rejectWithValue(message);
    }
  }
);

export const logoutUser = createAsyncThunk<null>('auth/logoutUser', async () => {
  localStorage.removeItem('auth_token');
  return null;
});

export const getCurrentUser = createAsyncThunk<
  AuthUser,
  void,
  { rejectValue: string }
>('auth/getCurrentUser', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return rejectWithValue('No token found');
    }
    // Placeholder - will be replaced with actual API call
    return {
      id: 1,
      email: 'admin@vedai.com',
      full_name: 'Admin User',
      role: 'super_admin',
      permissions: [],
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get user';
    return rejectWithValue(message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      localStorage.setItem('auth_token', action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login user
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.access_token;
        localStorage.setItem('auth_token', action.payload.access_token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Logout user
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = null;
      })
      // Get current user
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload as string;
      });
  },
});

export const { setToken, clearError } = authSlice.actions;
export default authSlice.reducer;

