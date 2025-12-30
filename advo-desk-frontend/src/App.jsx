import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import AdvocateDashboard from './pages/AdvocateDashboard';
import ClientManagement from './pages/ClientManagement';
import CaseManagement from './pages/CaseManagement';
import HearingManagement from './pages/HearingManagement';
import DocumentManagement from './pages/DocumentManagement';
import AdvocateApprovals from './pages/AdvocateApprovals';
import PendingVerifications from './pages/admin/PendingVerifications';
import { ROLES } from './utils/constants';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes - Admin */}
          <Route path="/admin-dashboard" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/verifications" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <PendingVerifications />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/approvals" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <AdvocateApprovals />
            </ProtectedRoute>
          } />
          
          {/* Protected Routes - Advocate */}
          <Route path="/advocate-dashboard" element={
            <ProtectedRoute allowedRoles={[ROLES.ADVOCATE]}>
              <AdvocateDashboard />
            </ProtectedRoute>
          } />
          

          
          {/* Protected Routes - Admin & Advocate */}
          <Route path="/clients" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.ADVOCATE]}>
              <ClientManagement />
            </ProtectedRoute>
          } />
          
          <Route path="/cases" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.ADVOCATE]}>
              <CaseManagement />
            </ProtectedRoute>
          } />
          
          <Route path="/hearings" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.ADVOCATE]}>
              <HearingManagement />
            </ProtectedRoute>
          } />
          
          <Route path="/documents" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.ADVOCATE]}>
              <DocumentManagement />
            </ProtectedRoute>
          } />
          

          
          {/* Unauthorized Route */}
          <Route path="/unauthorized" element={
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
              <div className="card text-center">
                <h1 className="text-3xl font-bold text-red-600 mb-4">Unauthorized Access</h1>
                <p className="text-gray-600">You don't have permission to access this page.</p>
              </div>
            </div>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
