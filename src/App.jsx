import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ConfigProvider, useConfig } from './contexts/ConfigContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import Layout from './components/Layout';
import './App.css';

// Protected Route component
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const { isModuleEnabled } = useConfig();

  // If user management is disabled, don't require authentication
  if (!isModuleEnabled('user-management')) {
    return children;
  }

  return user ? children : <Navigate to="/login" />;
}

// Public Route component (redirect to dashboard if already logged in)
function PublicRoute({ children }) {
  const { user } = useAuth();
  const { isModuleEnabled } = useConfig();

  // If user management is disabled, redirect to dashboard
  if (!isModuleEnabled('user-management')) {
    return <Navigate to="/dashboard" />;
  }

  return !user ? children : <Navigate to="/dashboard" />;
}

// App Routes component
function AppRoutes() {
  const { isModuleEnabled } = useConfig();

  return (
    <Routes>
      {/* User Management Routes - Only render if module is enabled */}
      {isModuleEnabled('user-management') && (
        <>
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/signup" element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          } />
          <Route path="/forgot-password" element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          } />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/users" element={
            <ProtectedRoute>
              <Layout>
                <UserManagement />
              </Layout>
            </ProtectedRoute>
          } />
        </>
      )}

      {/* Dashboard Route - Always available */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />

      {/* Default Route */}
      <Route path="/" element={<Navigate to="/dashboard" />} />

      {/* Fallback for disabled user management */}
      {!isModuleEnabled('user-management') && (
        <>
          <Route path="/login" element={<Navigate to="/dashboard" />} />
          <Route path="/signup" element={<Navigate to="/dashboard" />} />
          <Route path="/forgot-password" element={<Navigate to="/dashboard" />} />
          <Route path="/users" element={<Navigate to="/dashboard" />} />
        </>
      )}
    </Routes>
  );
}

function App() {
  return (
    <ConfigProvider>
      <AuthProvider>
        <Router>
          <div className="app">
            <AppRoutes />
          </div>
        </Router>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;