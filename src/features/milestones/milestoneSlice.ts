import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/axios';
import { Developer } from '../projects/projectSlice';

// Milestone types
export interface Milestone {
  _id: string;
  title: string;
  description: string;
  project: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Delayed';
  startDate: string;
  dueDate: string;
  completedDate?: string;
  priority: 'High' | 'Medium' | 'Low';
  assignedTo: Developer[];
  dependencies?: Milestone[];
  progressPercentage: number;
  notes?: string[];
  attachments?: { name: string; url: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface MilestoneFormData {
  title: string;
  description: string;
  project: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Delayed';
  startDate: string;
  dueDate: string;
  completedDate?: string;
  priority: 'High' | 'Medium' | 'Low';
  assignedTo: string[];
  dependencies?: string[];
  progressPercentage: number;
  notes?: string[];
  attachments?: { name: string; url: string }[];
}

interface MilestoneState {
  milestones: Milestone[];
  userMilestones: Milestone[];
  projectMilestones: Milestone[];
  selectedMilestone: Milestone | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  notification: string | null;
}

const initialState: MilestoneState = {
  milestones: [],
  userMilestones: [],
  projectMilestones: [],
  selectedMilestone: null,
  loading: false,
  error: null,
  success: false,
  notification: null,
};

// Get all milestones for a project
export const fetchProjectMilestones = createAsyncThunk(
  'milestones/fetchProjectMilestones',
  async (projectId: string, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/milestones/project/${projectId}`);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch milestones');
    }
  }
);

// Get milestone by ID
export const fetchMilestoneById = createAsyncThunk(
  'milestones/fetchMilestoneById',
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/milestones/${id}`);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch milestone');
    }
  }
);

// Create new milestone
export const createMilestone = createAsyncThunk(
  'milestones/createMilestone',
  async (milestoneData: MilestoneFormData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/milestones', milestoneData);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create milestone');
    }
  }
);

// Update milestone
export const updateMilestone = createAsyncThunk(
  'milestones/updateMilestone',
  async ({ id, milestoneData }: { id: string; milestoneData: Partial<MilestoneFormData> }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/milestones/${id}`, milestoneData);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update milestone');
    }
  }
);

// Delete milestone
export const deleteMilestone = createAsyncThunk(
  'milestones/deleteMilestone',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/milestones/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete milestone');
    }
  }
);

// Get milestones assigned to the current user
export const fetchUserMilestones = createAsyncThunk(
  'milestones/fetchUserMilestones',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/milestones/user');
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch assigned milestones');
    }
  }
);

const milestoneSlice = createSlice({
  name: 'milestones',
  initialState,
  reducers: {
    resetMilestoneState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearSelectedMilestone: (state) => {
      state.selectedMilestone = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all milestones for a project
      .addCase(fetchProjectMilestones.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectMilestones.fulfilled, (state, action: PayloadAction<Milestone[]>) => {
        state.loading = false;
        state.projectMilestones = action.payload;
      })
      .addCase(fetchProjectMilestones.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch milestone by id
      .addCase(fetchMilestoneById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMilestoneById.fulfilled, (state, action: PayloadAction<Milestone>) => {
        state.loading = false;
        state.selectedMilestone = action.payload;
      })
      .addCase(fetchMilestoneById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create milestone
      .addCase(createMilestone.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createMilestone.fulfilled, (state, action: PayloadAction<Milestone>) => {
        state.loading = false;
        state.projectMilestones.push(action.payload);
        state.success = true;
      })
      .addCase(createMilestone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      // Update milestone
      .addCase(updateMilestone.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateMilestone.fulfilled, (state, action: PayloadAction<Milestone>) => {
        state.loading = false;
        const index = state.projectMilestones.findIndex((m) => m._id === action.payload._id);
        if (index !== -1) {
          state.projectMilestones[index] = action.payload;
        }
        state.selectedMilestone = action.payload;
        state.success = true;
      })
      .addCase(updateMilestone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      // Delete milestone
      .addCase(deleteMilestone.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteMilestone.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.projectMilestones = state.projectMilestones.filter((m) => m._id !== action.payload);
        state.success = true;
      })
      .addCase(deleteMilestone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      // Fetch user milestones
      .addCase(fetchUserMilestones.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserMilestones.fulfilled, (state, action: PayloadAction<Milestone[]>) => {
        state.loading = false;
        state.userMilestones = action.payload;
      })
      .addCase(fetchUserMilestones.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetMilestoneState, clearSelectedMilestone } = milestoneSlice.actions;
export default milestoneSlice.reducer; 