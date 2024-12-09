import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

const PrivateRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Check for token in localStorage
    const token = localStorage.getItem('token');
    if (token && !isAuthenticated) {
      // Dispatch an action to validate token and set authentication state
      dispatch({ type: 'auth/validateToken', payload: token });
      // Note: You'll need to create this action in your auth slice
    }
  }, [dispatch, isAuthenticated]);

  if (loading) {
    return <div>Loading...</div>; // Or use a proper loading spinner
  }

  if (!isAuthenticated && !token) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute; 