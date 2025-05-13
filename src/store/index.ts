import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import authReducer from '../features/auth/authSlice';

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  // Add more reducers here as needed
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

const store = configureStore({
  reducer: rootReducer,
});

export default store; 