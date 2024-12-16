import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProtectedRoute, adminLogin } from './Pages/AdminRouteProtection';

// Import your components
import Home from './Pages/TourPackagesHome';

import CreatePackage from './Pages/CreatePackage';
import TourPackagesHome from './Pages/TourPackagesHome';
import BookingPage from './Pages/Booking';
import Invoice from './Pages/Invoice';
import AdminDashboard from "./Pages/Admin";
import DeleteTourPackages from './Pages/DeleteTourPackages';
import UpdateTourPackages from './Pages/UpdateTourPackages';
import ViewBookings from './Pages/ViewBookings';

function App() {
  useEffect(() => {
    // Automatically log in admin (for demonstration)
    
    adminLogin();
  }, []);

  return (
   
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        
        <Route path="/packages" element={<TourPackagesHome />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/invoice" element={<Invoice />} />

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/create" element={<CreatePackage />} />
          <Route path="/admin/update" element={<UpdateTourPackages />} />
          <Route path="/admin/delete" element={<DeleteTourPackages />} />
          <Route path="/admin/bookings" element={<ViewBookings />} />
        </Route>
      </Routes>
   
  );
}

export default App;