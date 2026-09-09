import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner text="Checking authorization..." size="large" />;
  }

  // 1. If not authenticated at all, redirect to /login with an informative alert message
  if (!isAuthenticated) {
    const alertMessage = adminOnly
      ? 'Administrator privileges required. Please log in to continue.'
      : 'Please log in or create an account to book your appointment.';

    return (
      <Navigate
        to="/login"
        state={{ from: location, message: alertMessage, isError: true }}
        replace
      />
    );
  }

  // 2. If route requires Admin, but user is regular patient, redirect to /login with access denied alert
  if (adminOnly && !isAdmin) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location,
          message: 'Access Denied: You do not have Administrator permissions to access that page.',
          isError: true,
        }}
        replace
      />
    );
  }

  return children;
}
