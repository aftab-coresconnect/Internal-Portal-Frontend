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
  clientId: string;
  clientName: string;
  status: 'Active' | 'Paused' | 'Completed' | 'Delivered';
  priority?: 'High' | 'Medium' | 'Low';
  figmaLink?: string;
  repoLink?: string;
  jiraLink?: string;
  startDate: string;
  deadline: string;
  techStack: string[];
  assignedDevelopers: Developer[];
  projectManager?: Developer;
  milestones?: string[];
  tags?: string[];
  budget?: number;
  spentBudget?: number;
  progressPercent?: number;
  satisfaction?: {
    quality?: number;
    communication?: number;
    timeliness?: number;
    overall?: number;
    reviewNote?: string;
  };
  notes?: string[];
  attachments?: { name: string; url: string }[];
  isArchived?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFormData {
  title: string;
  description: string;
  clientId: string;
  clientName: string;
  status: 'Active' | 'Paused' | 'Completed' | 'Delivered';
  priority?: 'High' | 'Medium' | 'Low';
  figmaLink?: string;
  repoLink?: string;
  jiraLink?: string;
  startDate: string;
  deadline: string;
  techStack: string[];
  assignedDevelopers: string[];
  projectManager?: string;
  initialMilestones?: InitialMilestone[];
  budget?: number;
  tags?: string[];
  satisfaction?: {
    quality?: number;
    communication?: number;
    timeliness?: number;
    overall?: number;
    reviewNote?: string;
  };
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
      console.log('Creating new project');
      console.log('Project data:', JSON.stringify(projectData, null, 2));
      
      // Ensure budget is a number
      const processedData = {
        ...projectData,
        budget: typeof projectData.budget === 'string' 
          ? parseFloat(projectData.budget) || 0 
          : projectData.budget || 0
      };
      
      console.log('Processed project data:', JSON.stringify(processedData, null, 2));
      const { data } = await api.post('/projects', processedData);
      return data;
    } catch (error: any) {
      console.error('Project creation error:', error);
      
      // Enhanced error details for debugging
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
        
        return rejectWithValue(
          error.response.data?.message || 
          `Server error: ${error.response.status} - ${error.response.statusText}`
        );
      } else if (error.request) {
        // Request was made but no response received
        console.error('No response received:', error.request);
        return rejectWithValue('No response from server. Please check your network connection.');
      } else {
        // Error setting up the request
        console.error('Request setup error:', error.message);
        return rejectWithValue(`Error: ${error.message}`);
      }
    }
  }
);

// Update project
export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ id, projectData }: { id: string; projectData: ProjectFormData }, { rejectWithValue }) => {
    try {
      console.log('Updating project:', id);
      console.log('Update data:', JSON.stringify(projectData, null, 2));
      
      const { data } = await api.put(`/projects/${id}`, projectData);
      return data;
    } catch (error: any) {
      console.error('Project update error:', error);
      
      // Enhanced error details for debugging
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
        
        return rejectWithValue(
          error.response.data?.message || 
          `Server error: ${error.response.status} - ${error.response.statusText}`
        );
      } else if (error.request) {
        // Request was made but no response received
        console.error('No response received:', error.request);
        return rejectWithValue('No response from server. Please check your network connection.');
      } else {
        // Error setting up the request
        console.error('Request setup error:', error.message);
        return rejectWithValue(`Error: ${error.message}`);
      }
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