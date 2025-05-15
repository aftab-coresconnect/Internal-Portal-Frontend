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

// Register action
export const register = createAsyncThunk(
  'auth/register',
  async (
    { name, email, password, role }: { name: string; email: string; password: string; role: string },
    { rejectWithValue }
  ) => {
    try {      
      const { data } = await api.post('/auth/register', { name, email, password, role });
      
      // Store user info in localStorage
      localStorage.setItem('token', data.token);
      
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
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