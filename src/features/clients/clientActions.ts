import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export interface Client {
  _id: string;
  name: string;
  email: string;
  password?: string;
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
      // First create a user with role='client'
      if (clientData.password) {
        await api.post('/auth/users', {
          name: clientData.name,
          email: clientData.email,
          password: clientData.password,
          role: 'client',
          title: clientData.companyName // Use title instead of companyName
        });
      }
      
      // Then create the client record
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
      // Get the client to find the corresponding user
      const clientResponse = await api.get(`/clients/${clientId}`);
      const client = clientResponse.data;
      
      // Update the user record if there is a password or email/name change
      if (clientData.password || clientData.email || clientData.name) {
        // Find user by email
        const usersResponse = await api.get('/auth/users/role/client');
        const clientUsers = usersResponse.data;
        const matchingUser = clientUsers.find((user: any) => user.email === client.email);
        
        if (matchingUser) {
          const updateData: any = {};
          if (clientData.password) updateData.password = clientData.password;
          if (clientData.name) updateData.name = clientData.name;
          if (clientData.email) updateData.email = clientData.email;
          if (clientData.companyName) updateData.title = clientData.companyName; // Use title instead of companyName
          
          await api.put(`/auth/users/${matchingUser._id}`, updateData);
        }
      }
      
      // Update the client record
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
      // Get the client to find the corresponding user
      const clientResponse = await api.get(`/clients/${clientId}`);
      const client = clientResponse.data;
      
      // Find and delete the user record
      const usersResponse = await api.get('/auth/users/role/client');
      const clientUsers = usersResponse.data;
      const matchingUser = clientUsers.find((user: any) => user.email === client.email);
      
      if (matchingUser) {
        await api.delete(`/auth/users/${matchingUser._id}`);
      }
      
      // Delete the client record
      const { data } = await api.delete(`/clients/${clientId}`);
      return { clientId, ...data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete client');
    }
  }
); 