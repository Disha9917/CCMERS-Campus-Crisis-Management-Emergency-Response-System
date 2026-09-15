import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

// Student Pages
import Login from './pages/student/Login';
import StudentDashboard from './pages/student/Dashboard';
import ReportIncident from './pages/student/ReportIncident';
import MyIncidents from './pages/student/MyIncidents';
import IncidentDetails from './pages/student/IncidentDetails';
import Profile from './pages/student/Profile';

// Response Team Pages
import ResponseLogin from './pages/response/Login';
import ResponseDashboard from './pages/response/Dashboard';
import AssignedIncidents from './pages/response/AssignedIncidents';
import ResponseIncidentDetails from './pages/response/IncidentDetails';
import UpdateStatus from './pages/response/UpdateStatus';

// Admin Portal Pages
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AllIncidents from './pages/admin/AllIncidents';
import AdminIncidentDetails from './pages/admin/IncidentDetails';
import AssignIncident from './pages/admin/AssignIncident';
import DepartmentManagement from './pages/admin/DepartmentManagement';
import Analytics from './pages/admin/Analytics';

import NotFound from './pages/NotFound';
import AccessDenied from './pages/AccessDenied';

import { IncidentProvider } from './context/IncidentContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const RootRedirect = () => {
  const { currentUser } = useAuth();
  const role = currentUser?.role || 'student';
  return <Navigate to={`/${role}/dashboard`} replace />;
};

function App() {
  return (
    <AuthProvider>
      <IncidentProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Login Routes */}
            <Route path="/student/login" element={<Login />} />
            <Route path="/response/login" element={<ResponseLogin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/access-denied" element={<AccessDenied />} />
            
            <Route path="/" element={<MainLayout />}>
              <Route index element={<RootRedirect />} />
              
              {/* Protected Student Routes */}
              <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                <Route path="student">
                  <Route index element={<Navigate to="/student/dashboard" replace />} />
                  <Route path="dashboard" element={<StudentDashboard />} />
                  <Route path="report-incident" element={<ReportIncident />} />
                  <Route path="my-incidents" element={<MyIncidents />} />
                  <Route path="incident-details/:id" element={<IncidentDetails />} />
                  <Route path="profile" element={<Profile />} />
                </Route>
              </Route>

              {/* Protected Response Team Routes */}
              <Route element={<ProtectedRoute allowedRoles={['response']} />}>
                <Route path="response">
                  <Route index element={<Navigate to="/response/dashboard" replace />} />
                  <Route path="dashboard" element={<ResponseDashboard />} />
                  <Route path="assigned-incidents" element={<AssignedIncidents />} />
                  <Route path="incident-details/:id" element={<ResponseIncidentDetails />} />
                  <Route path="update-status" element={<UpdateStatus />} />
                  <Route path="update-status/:id" element={<UpdateStatus />} />
                </Route>
              </Route>

              {/* Protected Admin Portal Routes */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="admin">
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="all-incidents" element={<AllIncidents />} />
                  <Route path="incident-details/:id" element={<AdminIncidentDetails />} />
                  <Route path="assign-incident" element={<AssignIncident />} />
                  <Route path="assign-incident/:id" element={<AssignIncident />} />
                  <Route path="department-management" element={<DepartmentManagement />} />
                  <Route path="analytics" element={<Analytics />} />
                </Route>
              </Route>

              {/* Catch All Route */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </IncidentProvider>
    </AuthProvider>
  );
}

export default App;
