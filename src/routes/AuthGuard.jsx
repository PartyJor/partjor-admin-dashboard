import React from 'react';
import { Navigate } from 'react-router';

const isAuthenticated = () => {
  return !!localStorage.getItem('authToken');
};

const AuthGuard = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" />;
};

export default AuthGuard;
