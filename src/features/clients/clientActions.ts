import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export interface Client {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  website?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  linkedProjects?: string[]; // IDs of related projects
  notes?: string[];
  painPoints?: string[];
  createdAt: string;
  updatedAt: string;
}

// Fetch all clients
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
export const getClientById = createAsyncThunk(
  'clients/getClientById',
  async (clientId: string, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/clients/${clientId}`);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch client');
    }
  }
);

// Create new client
export const createClient = createAsyncThunk(
  'clients/createClient',
  async (clientData: Partial<Client>, { rejectWithValue }) => {
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
  async ({ clientId, clientData }: { clientId: string; clientData: Partial<Client> }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/clients/${clientId}`, clientData);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update client');
    }
  }
);

// Delete client
export const deleteClient = createAsyncThunk(
  'clients/deleteClient',
  async (clientId: string, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/clients/${clientId}`);
      return { clientId, ...data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete client');
    }
  }
); 