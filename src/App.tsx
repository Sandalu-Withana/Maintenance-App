import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { JSX } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/Layout';

import { AuthProvider, useAuth } from './context/AuthContext';
import EquipmentSearchPage from './pages/equipmentSearch/EquipmentSearchPage';
import EquipmentCheckoutPage from './pages/equipmentSearch/EquipmentCheckoutPage';
import SettingsPage from './pages/settings/SettingsPage';
import ProfilePage from './pages/profile/ProfilePage';
import LoginPage from './pages/login/LoginPage';
import MyTasksPage from './pages/myTasks/MyTasksPage';
import { useBackButton } from './hooks/useBackButton';
import TaskDetailsPage from './pages/myTasks/TaskDetailsPage';

// Protected route component
function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  useBackButton();

  return (
    <Routes>
      {/* Root redirect */}
      <Route
        path="/"
        element={
          <Navigate to={isAuthenticated ? '/search' : '/login'} replace />
        }
      />

      {/* Login page */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/search" /> : <LoginPage />}
      />

      {/* Protected routes */}
      <Route
        path="/search"
        element={
          <ProtectedRoute>
            <Layout>
              <EquipmentSearchPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/equipment/checkout/:equipmentId"
        element={
          <ProtectedRoute>
            <Layout>
              <EquipmentCheckoutPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <ProfilePage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Layout>
              <SettingsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-tasks"
        element={
          <ProtectedRoute>
            <Layout>
              <MyTasksPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks/:taskId"
        element={
          <ProtectedRoute>
            <Layout>
              <TaskDetailsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="*"
        element={
          <Navigate to={isAuthenticated ? '/search' : '/login'} replace />
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
