import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/axios';

// Project types
export interface Developer {
  _id: string;
  name: string;
  email: string;
  role: string;
}

// Initial milestone type in project creation
export interface InitialMilestone {
  id: string;
  title: string;
  description: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Delayed';
  startDate: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  clientName?: string;
  status: 'Active' | 'Paused' | 'Completed';
  figmaLink?: string;
  repoLink?: string;
  jiraLink?: string;
  startDate: string;
  deadline: string;
  techStack: string[];
  assignedDevelopers: Developer[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFormData {
  title: string;
  description: string;
  clientName?: string;
  status: 'Active' | 'Paused' | 'Completed';
  figmaLink?: string;
  repoLink?: string;
  jiraLink?: string;
  startDate: string;
  deadline: string;
  techStack: string[];
  assignedDevelopers: string[];
  initialMilestones?: InitialMilestone[];
}

interface ProjectState {
  projects: Project[];
  selectedProject: Project | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: ProjectState = {
  projects: [],
  selectedProject: null,
  loading: false,
  error: null,
  success: false,
};

// Get all projects
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/projects');
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch projects');
    }
  }
);

// Get project by ID
export const fetchProjectById = createAsyncThunk(
  'projects/fetchProjectById',
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/projects/${id}`);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch project');
    }
  }
);

// Create new project
export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData: ProjectFormData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/projects', projectData);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create project');
    }
  }
);

// Update project
export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ id, projectData }: { id: string; projectData: ProjectFormData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/projects/${id}`, projectData);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update project');
    }
  }
);

// Delete project
export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/projects/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete project');
    }
  }
);

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    resetProjectState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearSelectedProject: (state) => {
      state.selectedProject = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all projects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action: PayloadAction<Project[]>) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch project by id
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action: PayloadAction<Project>) => {
        state.loading = false;
        state.selectedProject = action.payload;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create project
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createProject.fulfilled, (state, action: PayloadAction<Project>) => {
        state.loading = false;
        state.projects.push(action.payload);
        state.success = true;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      // Update project
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateProject.fulfilled, (state, action: PayloadAction<Project>) => {
        state.loading = false;
        const index = state.projects.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
        state.selectedProject = action.payload;
        state.success = true;
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      // Delete project
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteProject.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.projects = state.projects.filter((p) => p._id !== action.payload);
        state.success = true;
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const { resetProjectState, clearSelectedProject } = projectSlice.actions;
export default projectSlice.reducer; 