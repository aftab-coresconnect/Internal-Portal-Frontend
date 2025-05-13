import React from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import HomePage from './pages/HomePage';
import { LoginPage, RegisterPage } from './pages/auth';
import { AdminDashboard } from './pages/admin';
import { UserDashboard } from './pages/user';
import ProtectedRoute from './components/ProtectedRoute';
import { useAppSelector } from './hooks/reduxHooks';

const App: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle redirects based on user authentication status
  React.useEffect(() => {
    const pathname = location.pathname;

    // Authenticated users redirects
    if (user) {
      if (['/login', '/register', '/', '/home'].includes(pathname)) {
        navigate(user.role === 'admin' ? '/admin-dashboard' : '/user-dashboard');
      }
    } 
    // Non-authenticated users redirects
    else {
      if (['/admin-dashboard', '/user-dashboard'].includes(pathname)) {
        navigate('/login');
      } else if (pathname === '/') {
        navigate('/login');
      }
    }
  }, [user, location.pathname, navigate]);

  return (
    <Box>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />
        
        {/* Protected routes */}
        <Route 
          path="/admin-dashboard" 
          element={<ProtectedRoute component={AdminDashboard} requiredRole="admin" />} 
        />
        
        <Route 
          path="/user-dashboard" 
          element={<ProtectedRoute component={UserDashboard} requiredRole={['developer', 'teamLead']} />} 
        />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Box>
  );
};

export default App; 