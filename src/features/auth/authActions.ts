import { Dispatch } from 'redux';
import * as authService from '../../api/authService';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout as logoutAction,
} from './authSlice';

// Login user
export const loginUser = (email: string, password: string) => async (dispatch: Dispatch) => {
  try {
    dispatch(loginStart());
    const userData = await authService.login(email, password);
    dispatch(loginSuccess({
      id: userData._id,
      name: `${userData.firstName} ${userData.lastName}`,
      email: userData.email,
      role: userData.role,
      token: userData.token,
    }));
    return userData;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Login failed';
    dispatch(loginFailure(message));
    throw error;
  }
};

// Register user
export const registerUser = (userData: any) => async (dispatch: Dispatch) => {
  try {
    dispatch(registerStart());
    const user = await authService.register(userData);
    dispatch(registerSuccess({
      id: user._id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role,
      token: user.token,
    }));
    return user;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Registration failed';
    dispatch(registerFailure(message));
    throw error;
  }
};

// Logout user
export const logout = () => (dispatch: Dispatch) => {
  authService.logout();
  dispatch(logoutAction());
}; 