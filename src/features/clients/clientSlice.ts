import { createSlice } from '@reduxjs/toolkit';
import {
  fetchClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  Client as ClientType
} from './clientActions';

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
  password?: string;
  phone?: string;
  companyName?: string;
  website?: string;
  address?: Address;
  notes?: string[];
  painPoints?: string[];
}

// Define client state interface
export interface ClientState {
  clients: ClientType[];
  selectedClient: ClientType | null;
  isLoading: boolean;
  error: string | null;
  message: string | null;
}

// Initial state
const initialState: ClientState = {
  clients: [],
  selectedClient: null,
  isLoading: false,
  error: null,
  message: null,
};

// Create slice
const clientSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    clearClientError: (state) => {
      state.error = null;
    },
    clearClientMessage: (state) => {
      state.message = null;
    },
    clearSelectedClient: (state) => {
      state.selectedClient = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch clients cases
      .addCase(fetchClients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.clients = action.payload;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Get client by ID cases
      .addCase(getClientById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getClientById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedClient = action.payload;
      })
      .addCase(getClientById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Create client cases
      .addCase(createClient.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createClient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.clients.push(action.payload);
        state.message = 'Client created successfully';
      })
      .addCase(createClient.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Update client cases
      .addCase(updateClient.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateClient.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.clients.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.clients[index] = action.payload;
        }
        
        // Update selectedClient if it's the same client
        if (state.selectedClient && state.selectedClient._id === action.payload._id) {
          state.selectedClient = action.payload;
        }
        
        state.message = 'Client updated successfully';
      })
      .addCase(updateClient.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Delete client cases
      .addCase(deleteClient.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.clients = state.clients.filter(client => client._id !== action.payload.clientId);
        
        // Clear selectedClient if it's the deleted client
        if (state.selectedClient && state.selectedClient._id === action.payload.clientId) {
          state.selectedClient = null;
        }
        
        state.message = 'Client deleted successfully';
      })
      .addCase(deleteClient.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearClientError, clearClientMessage, clearSelectedClient } = clientSlice.actions;
export default clientSlice.reducer; 