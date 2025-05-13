import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/reduxHooks';

interface ProtectedRouteProps {
  component: React.ComponentType;
  requiredRole?: string | string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  component: Component, 
  requiredRole
}) => {
  const { user } = useAppSelector((state) => state.auth);

  // If user is not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If there's a required role
  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    
    // Check if user has the required role
    if (!roles.includes(user.role)) {
      // Redirect non-admin users to user dashboard
      return <Navigate to={user.role === 'admin' ? '/admin-dashboard' : '/user-dashboard'} />;
    }
  }

  // If all checks pass, render the component
  return <Component />;
};

export default ProtectedRoute; 