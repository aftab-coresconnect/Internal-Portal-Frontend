import React from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import HomePage from './pages/HomePage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminDashboard from './pages/admin/Dashboard';
import UserDashboard from './pages/user/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { useAppSelector } from './hooks/reduxHooks';

// Project Management
import ProjectList from './pages/admin/projects/ProjectList';
import ProjectForm from './pages/admin/projects/ProjectForm';
import ProjectDetails from './pages/admin/projects/ProjectDetails';

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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<HomePage />} />
        
        {/* Protected routes */}
        <Route 
          path="/admin-dashboard" 
          element={<ProtectedRoute component={AdminDashboard} requiredRole="admin" />} 
        />
        
        {/* Project Management Routes */}
        <Route 
          path="/admin-dashboard/projects" 
          element={<ProtectedRoute component={ProjectList} requiredRole="admin" />} 
        />
        <Route 
          path="/admin-dashboard/projects/add" 
          element={<ProtectedRoute component={ProjectForm} requiredRole="admin" />} 
        />
        <Route 
          path="/admin-dashboard/projects/edit/:id" 
          element={<ProtectedRoute component={ProjectForm} requiredRole="admin" />} 
        />
        <Route 
          path="/admin-dashboard/projects/:id" 
          element={<ProtectedRoute component={ProjectDetails} requiredRole="admin" />} 
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