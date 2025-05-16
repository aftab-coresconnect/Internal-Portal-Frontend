import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Project } from './projectSlice';

// Fetch all projects
export const fetchProjects = createAsyncThunk(
  'projects/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/projects');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error fetching projects');
    }
  }
);

// Fetch project by ID
export const fetchProjectById = createAsyncThunk(
  'projects/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/projects/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error fetching project');
    }
  }
);

// Create new project
export const createProject = createAsyncThunk(
  'projects/create',
  async (projectData: Partial<Project>, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/projects', projectData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error creating project');
    }
  }
);

// Update project
export const updateProject = createAsyncThunk(
  'projects/update',
  async ({ id, projectData }: { id: string; projectData: Partial<Project> }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/projects/${id}`, projectData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error updating project');
    }
  }
);

// Delete project
export const deleteProject = createAsyncThunk(
  'projects/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/projects/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error deleting project');
    }
  }
); 