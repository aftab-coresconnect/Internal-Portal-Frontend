import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define user interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  token: string;
}

// Define auth state interface
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : null,
  isLoading: false,
  error: null,
};

// Create slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Login actions
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.user = action.payload;
      state.error = null;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Register actions
    registerStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    registerSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.user = action.payload;
      state.error = null;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    registerFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Logout action
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('user');
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    }
  },
});

// Export actions
export const {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout,
  clearError,
} = authSlice.actions;

// Export reducer
export default authSlice.reducer; 