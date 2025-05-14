import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import projectReducer from '../features/projects/projectSlice';
import milestoneReducer from '../features/milestones/milestoneSlice';
import clientReducer from '../features/clients/clientSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    milestones: milestoneReducer,
    clients: clientReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store; 