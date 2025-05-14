import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/axios';

// Client types
export interface Address {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface Client {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  website?: string;
  address?: Address;
  linkedProjects?: any[]; // Will be populated with project details
  notes?: string[];
  painPoints?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ClientFormData {
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  website?: string;
  address?: Address;
  notes?: string[];
  painPoints?: string[];
}

interface ClientState {
  clients: Client[];
  selectedClient: Client | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: ClientState = {
  clients: [],
  selectedClient: null,
  loading: false,
  error: null,
  success: false,
};

// Get all clients
export const fetchClients = createAsyncThunk(
  'clients/fetchClients',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/clients');
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch clients');
    }
  }
);

// Get client by ID
export const fetchClientById = createAsyncThunk(
  'clients/fetchClientById',
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/clients/${id}`);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch client');
    }
  }
);

// Create new client
export const createClient = createAsyncThunk(
  'clients/createClient',
  async (clientData: ClientFormData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/clients', clientData);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create client');
    }
  }
);

// Update client
export const updateClient = createAsyncThunk(
  'clients/updateClient',
  async ({ id, clientData }: { id: string; clientData: ClientFormData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/clients/${id}`, clientData);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update client');
    }
  }
);

// Delete client
export const deleteClient = createAsyncThunk(
  'clients/deleteClient',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/clients/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete client');
    }
  }
);

// Link project to client
export const linkProject = createAsyncThunk(
  'clients/linkProject',
  async ({ clientId, projectId }: { clientId: string; projectId: string }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/clients/${clientId}/link-project/${projectId}`);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to link project');
    }
  }
);

// Unlink project from client
export const unlinkProject = createAsyncThunk(
  'clients/unlinkProject',
  async ({ clientId, projectId }: { clientId: string; projectId: string }, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/clients/${clientId}/unlink-project/${projectId}`);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to unlink project');
    }
  }
);

const clientSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    resetClientState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearSelectedClient: (state) => {
      state.selectedClient = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all clients
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action: PayloadAction<Client[]>) => {
        state.loading = false;
        state.clients = action.payload;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch client by id
      .addCase(fetchClientById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClientById.fulfilled, (state, action: PayloadAction<Client>) => {
        state.loading = false;
        state.selectedClient = action.payload;
      })
      .addCase(fetchClientById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create client
      .addCase(createClient.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createClient.fulfilled, (state, action: PayloadAction<Client>) => {
        state.loading = false;
        state.clients.push(action.payload);
        state.success = true;
      })
      .addCase(createClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      // Update client
      .addCase(updateClient.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateClient.fulfilled, (state, action: PayloadAction<Client>) => {
        state.loading = false;
        const index = state.clients.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) {
          state.clients[index] = action.payload;
        }
        state.selectedClient = action.payload;
        state.success = true;
      })
      .addCase(updateClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      // Delete client
      .addCase(deleteClient.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteClient.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.clients = state.clients.filter((c) => c._id !== action.payload);
        state.success = true;
      })
      .addCase(deleteClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      // Link project
      .addCase(linkProject.fulfilled, (state, action: PayloadAction<Client>) => {
        state.selectedClient = action.payload;
        const index = state.clients.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) {
          state.clients[index] = action.payload;
        }
      })
      // Unlink project
      .addCase(unlinkProject.fulfilled, (state, action: PayloadAction<Client>) => {
        state.selectedClient = action.payload;
        const index = state.clients.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) {
          state.clients[index] = action.payload;
        }
      });
  },
});

export const { resetClientState, clearSelectedClient } = clientSlice.actions;
export default clientSlice.reducer; 