import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <>
      <Navbar />
      <div className="pt-16">
        {children}
      </div>
    </>
  );
};

export default ProtectedRoute; 