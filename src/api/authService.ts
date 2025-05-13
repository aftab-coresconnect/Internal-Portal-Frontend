import axios from 'axios';

// API URL
const API_URL = 'http://localhost:5000/api/auth';

// Register user
export const register = async (userData: any) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

// Login user
export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data;
};

// Get user profile
export const getUserProfile = async (token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`${API_URL}/profile`, config);
  return response.data;
};

// Logout user - client side only (clears localStorage)
export const logout = () => {
  localStorage.removeItem('user');
}; 