import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { 
  login, 
  register, 
  logout, 
  fetchUsers, 
  getUserFromToken, 
  updateProfile,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getUsersByRole
} from './authActions';

// Define user interface
export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  title?: string;
  department?: string;
  skills?: Array<{ name: string; level: number }>;
  joinedAt?: Date;
  isActive?: boolean;
  effectiveness?: {
    progressScore: number;
    disciplineScore: number;
    communicationScore?: number;
    overall: number;
    notes?: string;
    lastEvaluated?: Date;
  };
}

// Define auth state interface
export interface AuthState {
  user: User | null;
  users: User[];
  usersByRole: Record<string, User[]>;
  selectedUser: User | null;
  isLoading: boolean;
  error: string | null;
  message: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  users: [],
  usersByRole: {},
  selectedUser: null,
  isLoading: false,
  error: null,
  message: null,
};

// Create slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        // Handle both formats: {user, token} or {user: userObject, token}
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Register cases
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Logout case
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })
      
      // GetUserFromToken cases
      .addCase(getUserFromToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserFromToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(getUserFromToken.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.error = action.payload as string;
      })
      
      // Fetch users cases (for project management)
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Update profile cases
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Create user cases
      .addCase(createUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users.push(action.payload.user);
        state.message = 'User created successfully';
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Get user by ID cases
      .addCase(getUserById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedUser = action.payload;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Update user cases
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Update in users array
        const index = state.users.findIndex(u => u._id === action.payload.user._id);
        if (index !== -1) {
          state.users[index] = action.payload.user;
        }
        
        // Update in usersByRole if present
        const role = action.payload.user.role;
        if (state.usersByRole[role]) {
          const roleIndex = state.usersByRole[role].findIndex(u => u._id === action.payload.user._id);
          if (roleIndex !== -1) {
            state.usersByRole[role][roleIndex] = action.payload.user;
          }
        }
        
        // Update selectedUser if it's the same user
        if (state.selectedUser && state.selectedUser._id === action.payload.user._id) {
          state.selectedUser = action.payload.user;
        }
        
        state.message = 'User updated successfully';
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Delete user cases
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Remove from users array
        state.users = state.users.filter(user => user._id !== action.payload.userId);
        
        // Remove from usersByRole if present
        Object.keys(state.usersByRole).forEach(role => {
          state.usersByRole[role] = state.usersByRole[role].filter(
            user => user._id !== action.payload.userId
          );
        });
        
        // Clear selectedUser if it's the deleted user
        if (state.selectedUser && state.selectedUser._id === action.payload.userId) {
          state.selectedUser = null;
        }
        
        state.message = 'User deleted successfully';
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Get users by role cases
      .addCase(getUsersByRole.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUsersByRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.usersByRole[action.payload.role] = action.payload.users;
      })
      .addCase(getUsersByRole.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearMessage, clearSelectedUser } = authSlice.actions;
export default authSlice.reducer; 