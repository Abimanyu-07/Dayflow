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
import EmployeeProfilePage from '@/pages/employee/Profile';
import AdminEmployeeProfilePage from '@/pages/admin/EmployeeProfile';
import EmployeeAttendancePage from '@/pages/employee/Attendance';
import AdminAttendancePage from '@/pages/admin/Attendance';
import AdminEmployeesPage from '@/pages/admin/Employees';
import EmployeeLeavePage from '@/pages/employee/Leave';
import AdminLeavesPage from '@/pages/admin/Leaves';
import EmployeePayrollPage from '@/pages/employee/Payroll';
import AdminPayrollPage from '@/pages/admin/Payroll';
import AdminReportsPage from '@/pages/admin/Reports';
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
                <EmployeeProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/attendance"
            element={
              <ProtectedRoute allowedRoles={['EMPLOYEE', 'HR']}>
                <EmployeeAttendancePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/leave"
            element={
              <ProtectedRoute allowedRoles={['EMPLOYEE', 'HR']}>
                <EmployeeLeavePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/payroll"
            element={
              <ProtectedRoute allowedRoles={['EMPLOYEE', 'HR']}>
                <EmployeePayrollPage />
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
            path="/admin/employees/:employeeId"
            element={
              <ProtectedRoute allowedRoles={['HR']}>
                <AdminEmployeeProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/employees"
            element={
              <ProtectedRoute allowedRoles={['HR']}>
                <AdminEmployeesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/attendance"
            element={
              <ProtectedRoute allowedRoles={['HR']}>
                <AdminAttendancePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/leaves"
            element={
              <ProtectedRoute allowedRoles={['HR']}>
                <AdminLeavesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/payroll"
            element={
              <ProtectedRoute allowedRoles={['HR']}>
                <AdminPayrollPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedRoles={['HR']}>
                <AdminReportsPage />
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
