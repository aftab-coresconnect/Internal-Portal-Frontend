import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import HomePage from './pages/HomePage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminDashboard from './pages/admin/Dashboard';
import UserDashboard from './pages/user/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { useAppSelector, useAppDispatch } from './hooks/reduxHooks';
import { getUserFromToken } from './features/auth/authActions';

// Project Management
import ProjectList from './pages/admin/projects/ProjectList';
import ProjectForm from './pages/admin/projects/ProjectForm';
import ProjectDetails from './pages/admin/projects/ProjectDetails';

// Client Management
import ClientList from './pages/admin/clients/ClientList';
import ClientForm from './pages/admin/clients/ClientForm';
import ClientDetails from './pages/admin/clients/ClientDetails';

const App: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // Check for existing token on app load
  useEffect(() => {
    // If user isn't loaded but we have a token, try to get the user data
    if (!user && localStorage.getItem('token')) {
      console.log('Token found, loading user data...');
      dispatch(getUserFromToken());
    }
  }, [dispatch, user]);

  // Handle redirects based on user authentication status
  useEffect(() => {
    const pathname = location.pathname;

    // Authenticated users redirects
    if (user) {
      if (['/login', '/register', '/', '/home'].includes(pathname)) {
        navigate(user.role === 'admin' ? '/admin-dashboard' : '/user-dashboard');
      }
    } 
    // Non-authenticated users redirects
    else {
      // Only redirect if we're sure there's no token or the token fetch has failed
      if (!localStorage.getItem('token')) {
        if (['/admin-dashboard', '/user-dashboard'].includes(pathname) || 
            pathname.startsWith('/admin-dashboard/') || 
            pathname.startsWith('/user-dashboard/')) {
          navigate('/login');
        } else if (pathname === '/') {
          navigate('/login');
        }
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
        
        {/* Client Management Routes */}
        <Route 
          path="/admin-dashboard/clients" 
          element={<ProtectedRoute component={ClientList} requiredRole="admin" />} 
        />
        <Route 
          path="/admin-dashboard/clients/add" 
          element={<ProtectedRoute component={ClientForm} requiredRole="admin" />} 
        />
        <Route 
          path="/admin-dashboard/clients/edit/:id" 
          element={<ProtectedRoute component={ClientForm} requiredRole="admin" />} 
        />
        <Route 
          path="/admin-dashboard/clients/:id" 
          element={<ProtectedRoute component={ClientDetails} requiredRole="admin" />} 
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