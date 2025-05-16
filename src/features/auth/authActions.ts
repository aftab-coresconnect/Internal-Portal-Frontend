import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import { User } from './authSlice';

// Login action
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      
      // Make sure we have the token
      if (!data.token) {
        return rejectWithValue('Login response missing token');
      }
      
      // Store the token in localStorage
      localStorage.setItem('token', data.token);
      
      // Log the response for debugging
      console.log('Login successful, response:', data);
      
      return data;
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// Logout action
export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('token');
  return null;
});

// Get current user using stored token
export const getUserFromToken = createAsyncThunk(
  'auth/getUserFromToken',
  async (_, { rejectWithValue }) => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      // If no token, return early
      if (!token) {
        return rejectWithValue('No token found');
      }
      
      // Fetch current user with token (the API already adds the token via interceptor)
      const { data } = await api.get('/auth/me');
      return data;
    } catch (error: any) {
      // If token is invalid, remove it
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
      }
      return rejectWithValue(error.response?.data?.message || 'Session expired');
    }
  }
);

// Fetch users (for admin to assign to projects)
export const fetchUsers = createAsyncThunk(
  'auth/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/auth/users');
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

// Update user profile
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData: Partial<User>, { rejectWithValue }) => {
    try {
      const { data } = await api.put('/auth/profile', profileData);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

// Create user (admin only)
export const createUser = createAsyncThunk(
  'auth/createUser',
  async (
    userData: { 
      name: string; 
      email: string; 
      password: string; 
      role: string;
      title?: string;
      department?: string;
      isActive?: boolean;
    },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.post('/auth/users', userData);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create user');
    }
  }
);

// Get user by ID (admin only)
export const getUserById = createAsyncThunk(
  'auth/getUserById',
  async (userId: string, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/auth/users/${userId}`);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
    }
  }
);

// Update user (admin only)
export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (
    { userId, userData }: { 
      userId: string; 
      userData: Partial<User> 
    },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.put(`/auth/users/${userId}`, userData);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user');
    }
  }
);

// Delete user (admin only)
export const deleteUser = createAsyncThunk(
  'auth/deleteUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/auth/users/${userId}`);
      return { userId, ...data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
    }
  }
);

// Get users by role (admin only)
export const getUsersByRole = createAsyncThunk(
  'auth/getUsersByRole',
  async (role: string, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/auth/users/role/${role}`);
      return { role, users: data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users by role');
    }
  }
); 