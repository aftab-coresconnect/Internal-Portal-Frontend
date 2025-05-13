import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import authReducer from '../features/auth/authSlice';
import projectReducer from '../features/projects/projectSlice';
import milestoneReducer from '../features/milestones/milestoneSlice';

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  projects: projectReducer,
  milestones: milestoneReducer,
  // Add more reducers here as needed
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

const store = configureStore({
  reducer: rootReducer,
});

export default store; 