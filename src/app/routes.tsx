import { createBrowserRouter, Navigate } from 'react-router';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import HomeSetup from './pages/HomeSetup';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Mockups from './pages/Mockups';

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

// Dashboard Router - redirects to correct dashboard based on role
function DashboardRouter() {
  const { user, isAdmin } = useAuth();
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  return isAdmin ? <AdminDashboard /> : <UserDashboard />;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/home-setup',
    element: <HomeSetup />,
  },
  {
    path: '/mockups',
    element: <Mockups />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardRouter />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);