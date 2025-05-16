import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Box, ChakraProvider } from '@chakra-ui/react';
import HomePage from './pages/HomePage';
import Login from './pages/auth/Login';
import AdminDashboard from './pages/admin/Dashboard';
import UserDashboard from './pages/user/Dashboard';
import EditProfile from './pages/user/EditProfile';
import TaskList from './pages/user/TaskList';
import Projects from './pages/user/Projects';
import ClientDashboard from './pages/user/clients/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { useAppSelector, useAppDispatch } from './hooks/reduxHooks';
import { getUserFromToken } from './features/auth/authActions';
import { AnimatePresence } from 'framer-motion';
import theme from './utils/theme';
import PageTransition from './components/layout/PageTransition';

// Project Management
import ProjectList from './pages/admin/projects/ProjectList';
import ProjectForm from './pages/admin/projects/ProjectForm';
import ProjectDetails from './pages/admin/projects/ProjectDetails';

// Client Management
import ClientList from './pages/admin/clients/ClientList';
import ClientForm from './pages/admin/clients/ClientForm';
import ClientDetails from './pages/admin/clients/ClientDetails';

// User Management
import UserManagement from './pages/admin/UserManagement';

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
      if (['/login', '/', '/home'].includes(pathname)) {
        if (user.role === 'admin') {
          navigate('/admin-dashboard');
        } else if (user.role === 'client') {
          navigate('/user-dashboard/clients');
        } else {
          navigate('/user-dashboard');
        }
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
    <ChakraProvider theme={theme}>
      <Box minH="100vh">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            
            <Route 
              path="/admin-dashboard" 
              element={
                <PageTransition>
                  <ProtectedRoute component={AdminDashboard} requiredRole="admin" />
                </PageTransition>
              } 
            />
            
            {/* Project Management Routes */}
            <Route 
              path="/admin-dashboard/projects" 
              element={
                <PageTransition>
                  <ProtectedRoute component={ProjectList} requiredRole="admin" />
                </PageTransition>
              } 
            />
            <Route 
              path="/admin-dashboard/projects/add" 
              element={
                <PageTransition>
                  <ProtectedRoute component={ProjectForm} requiredRole="admin" />
                </PageTransition>
              } 
            />
            <Route 
              path="/admin-dashboard/projects/edit/:id" 
              element={
                <PageTransition>
                  <ProtectedRoute component={ProjectForm} requiredRole="admin" />
                </PageTransition>
              } 
            />
            <Route 
              path="/admin-dashboard/projects/:id" 
              element={
                <PageTransition>
                  <ProtectedRoute component={ProjectDetails} requiredRole="admin" />
                </PageTransition>
              } 
            />
            
            {/* Client Management Routes */}
            <Route 
              path="/admin-dashboard/clients" 
              element={
                <PageTransition>
                  <ProtectedRoute component={ClientList} requiredRole="admin" />
                </PageTransition>
              } 
            />
            <Route 
              path="/admin-dashboard/clients/add" 
              element={
                <PageTransition>
                  <ProtectedRoute component={ClientForm} requiredRole="admin" />
                </PageTransition>
              } 
            />
            <Route 
              path="/admin-dashboard/clients/edit/:id" 
              element={
                <PageTransition>
                  <ProtectedRoute component={ClientForm} requiredRole="admin" />
                </PageTransition>
              } 
            />
            <Route 
              path="/admin-dashboard/clients/:id" 
              element={
                <PageTransition>
                  <ProtectedRoute component={ClientDetails} requiredRole="admin" />
                </PageTransition>
              } 
            />
            
            {/* User Management Route */}
            <Route 
              path="/admin-dashboard/users" 
              element={
                <PageTransition>
                  <ProtectedRoute component={UserManagement} requiredRole="admin" />
                </PageTransition>
              } 
            />
            
            <Route 
              path="/user-dashboard" 
              element={
                <PageTransition>
                  <ProtectedRoute component={UserDashboard} requiredRole={['developer', 'teamLead']} />
                </PageTransition>
              } 
            />
            
            <Route 
              path="/user-dashboard/edit-profile" 
              element={
                <PageTransition>
                  <ProtectedRoute component={EditProfile} requiredRole={['developer', 'teamLead', 'client']} />
                </PageTransition>
              } 
            />
            
            <Route 
              path="/user-dashboard/tasks" 
              element={
                <PageTransition>
                  <ProtectedRoute component={TaskList} requiredRole={['developer', 'teamLead']} />
                </PageTransition>
              } 
            />
            
            <Route 
              path="/user-dashboard/projects" 
              element={
                <PageTransition>
                  <ProtectedRoute component={Projects} requiredRole={['developer', 'teamLead']} />
                </PageTransition>
              } 
            />
            
            {/* Client Dashboard Route */}
            <Route 
              path="/user-dashboard/clients" 
              element={
                <PageTransition>
                  <ProtectedRoute component={ClientDashboard} requiredRole="client" />
                </PageTransition>
              } 
            />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </AnimatePresence>
      </Box>
    </ChakraProvider>
  );
};

export default App; 