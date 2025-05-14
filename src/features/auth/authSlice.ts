import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { login, register, logout, fetchUsers, getUserFromToken, updateProfile } from './authActions';

// Define user interface
export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  title?: string;
  department?: string;
  skills?: Array<{ name: string; level: number }>;
  joinedAt?: Date;
  isActive?: boolean;
  effectiveness?: {
    progressScore: number;
    disciplineScore: number;
    communicationScore?: number;
    overall: number;
    notes?: string;
    lastEvaluated?: Date;
  };
}

// Define auth state interface
export interface AuthState {
  user: User | null;
  users: User[];
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  users: [],
  isLoading: false,
  error: null,
};

// Create slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Register cases
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Logout case
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })
      
      // GetUserFromToken cases
      .addCase(getUserFromToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserFromToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(getUserFromToken.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.error = action.payload as string;
      })
      
      // Fetch users cases (for project management)
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Update profile cases
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer; 