import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// Simple admin authentication check function
export const isAdminAuthenticated = () => {
  // Simple hardcoded credentials check
  const username = localStorage.getItem('adminUsername');
  const password = localStorage.getItem('adminPassword');
  
  return username === 'admin' && password === 'admin';
};

// Protected Route Component
export const ProtectedRoute = () => {
  // Check if admin is authenticated
  const isAuthenticated = isAdminAuthenticated();

  // If not authenticated, redirect to home page
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

// Admin Login Function (can be called from anywhere to set credentials)
export const adminLogin = () => {
  localStorage.setItem('adminUsername', 'admin');
  localStorage.setItem('adminPassword', 'admin');
};

// Admin Logout Function
export const adminLogout = () => {
  localStorage.removeItem('adminUsername');
  localStorage.removeItem('adminPassword');
};