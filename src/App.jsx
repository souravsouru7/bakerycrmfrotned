import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import { validateToken } from './redux/slices/authSlice';
import Navbar from './components/layout/Navbar';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';  
import Products from './components/products/Products';
import PrivateRoute from './components/PrivateRoute';
import BillGenerator from './components/billing/BillGenerator';
import BillList from './components/billing/BillList';
import BillDetail from './components/billing/BillDetail';
import InventoryDashboard from './components/products/InventoryDashboard';

function AppContent() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      dispatch(validateToken(token));
    }
  }, [dispatch, token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/inventory-dashboard" /> : <Login />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/inventory-dashboard" /> : <Signup />} />
        <Route
          path="/inventory-dashboard"
          element={
            <PrivateRoute>
              <InventoryDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/products"
          element={
            <PrivateRoute>
              <Products />
            </PrivateRoute>
          }
        />
        <Route
          path="/bills"
          element={
            <PrivateRoute>
              <BillList />
            </PrivateRoute>
          }
        />
        <Route
          path="/bills/:id"
          element={
            <PrivateRoute>
              <BillDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/generate-bill"
          element={
            <PrivateRoute>
              <BillGenerator />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/inventory-dashboard" />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </Provider>
  );
}

export default App;