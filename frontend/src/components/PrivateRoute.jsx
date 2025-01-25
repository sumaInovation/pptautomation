import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("auth_token");  // Check if user is authenticated

  // If user is not authenticated, redirect to login page
  if (!isAuthenticated) {
    alert("Please login frist ")
    return <Navigate to="/login" />
  }

  // If authenticated, render the children components (i.e., the protected page)
  return children;
};

export default PrivateRoute;
