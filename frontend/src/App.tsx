import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'sonner';

import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import VerifyEmail from '@/pages/VerifyEmail';

import EmployeeDashboardPage from '@/pages/employee/Dashboard';
import AdminDashboardPage from '@/pages/admin/Dashboard';
import { PlaceholderModule } from '@/pages/PlaceholderModule';
import { ProtectedRoute } from '@/routes/ProtectedRoute';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" richColors closeButton />
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* Protected Employee Routes */}
          <Route
            path="/employee/dashboard"
            element={
              <ProtectedRoute allowedRoles={['EMPLOYEE', 'HR']}>
                <EmployeeDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/profile"
            element={
              <ProtectedRoute allowedRoles={['EMPLOYEE', 'HR']}>
                <PlaceholderModule moduleName="Employee Profile" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/attendance"
            element={
              <ProtectedRoute allowedRoles={['EMPLOYEE', 'HR']}>
                <PlaceholderModule moduleName="My Attendance Logs" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/leave"
            element={
              <ProtectedRoute allowedRoles={['EMPLOYEE', 'HR']}>
                <PlaceholderModule moduleName="Leave Applications" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/payroll"
            element={
              <ProtectedRoute allowedRoles={['EMPLOYEE', 'HR']}>
                <PlaceholderModule moduleName="My Salary & Payslips" />
              </ProtectedRoute>
            }
          />

          {/* Protected HR / Admin Routes (Strict HR Role Requirement) */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['HR']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/employees"
            element={
              <ProtectedRoute allowedRoles={['HR']}>
                <PlaceholderModule moduleName="Employee Directory" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/attendance"
            element={
              <ProtectedRoute allowedRoles={['HR']}>
                <PlaceholderModule moduleName="All Attendance Management" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/leaves"
            element={
              <ProtectedRoute allowedRoles={['HR']}>
                <PlaceholderModule moduleName="Leave Approvals & Requests" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/payroll"
            element={
              <ProtectedRoute allowedRoles={['HR']}>
                <PlaceholderModule moduleName="Payroll & Disbursements" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedRoles={['HR']}>
                <PlaceholderModule moduleName="Workforce Reports & Analytics" />
              </ProtectedRoute>
            }
          />

          {/* Catch-all Wildcard Redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
