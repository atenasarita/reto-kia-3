import React from 'react';
import { Routes, Route } from 'react-router-dom';

import AdminRoute from './components/AdminRoute';
import ProtectedRoute from './components/ProtectedRoute';

import ForgotPassword from './pages/ForgotPassword';
import Login from './pages/LogIn';
import MainPage from './pages/MainPage';
import PendingRequests from './pages/PendingRequests';
import ResetPassword from './pages/ResetPassword';
import SessionStarted from './pages/SessionStarted';
import SignUp from './pages/SignUp';
import WasteDashboard from './pages/WasteDashboard';
import WasteHistory from './pages/WasteHistory';
import WasteRegistry from './pages/WasteRegistry';
import WasteReferrals from './pages/WasteReferrals'; 
import Manifiestos from './pages/Manifiestos'; 


const App = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<MainPage />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/manifiestos" element={<Manifiestos />} />

      {/* Rutas protegidas (usuario autenticado) */}
      <Route
        path="/session-started"
        element={
          <ProtectedRoute>
            <SessionStarted />
          </ProtectedRoute>
        }
      />
      <Route
        path="/waste-dashboard"
        element={
          <ProtectedRoute>
            <WasteDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/waste-history"
        element={
          <ProtectedRoute>
            <WasteHistory />
          </ProtectedRoute>
        }
      />

      <Route path="/waste-registry" 
      element={
        <ProtectedRoute>
          <WasteRegistry />
      </ProtectedRoute> } 
      />

      <Route path="/waste-registry/:id"
      element={
        <ProtectedRoute>
          <WasteRegistry /> 
        </ProtectedRoute>} 
      />

      {/* Ruta exclusiva para admin */}
      <Route
        path="/pending-requests"
        element={
          <AdminRoute>
            <PendingRequests />
          </AdminRoute>
        }
      />
      {/* Ruta exclusiva para admin - WasteReferrals */}
      <Route
        path="/waste-referrals"
        element={
          <AdminRoute>
            <WasteReferrals />
          </AdminRoute>
        }
      />

        <Route
        path="/manifiestos"
        element={
          <AdminRoute>
            <Manifiestos />
          </AdminRoute>
        }
        />
    </Routes>
  );
};

export default App;