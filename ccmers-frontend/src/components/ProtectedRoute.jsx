import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AccessDenied from '../pages/AccessDenied';

const ProtectedRoute = ({ allowedRoles }) => {
  const { currentUser } = useAuth();

  if (!currentUser || !currentUser.role) {
    // If not logged in, redirect to login page for target role or student login
    const targetRole = allowedRoles?.[0] || 'student';
    return <Navigate to={`/${targetRole}/login`} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <AccessDenied />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
