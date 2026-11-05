import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
        role="status"
        aria-label="Checking authorization"
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(214, 51, 38, 0.2)',
            borderTopColor: '#D63326',
            borderRadius: '50%',
            animation: 'pulseDot 1s infinite linear',
          }}
        />
        <span className="sr-only">Checking authorization...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
