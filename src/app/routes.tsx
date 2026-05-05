import { createBrowserRouter, Navigate, Outlet } from "react-router";
import { useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HomeSetup from "./pages/HomeSetup";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";

// 1. Componente de Diseño Protegido: Envuelve las rutas privadas
function ProtectedLayout() {
  const { user, loading } = useAuth();

  // Mientras carga la sesión de Michael Ruiz
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <p className="text-sm text-gray-500 font-medium">
            Sincronizando datos...
          </p>
        </div>
      </div>
    );
  }

  // Si no hay usuario, redirige al login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Si todo está bien, renderiza las rutas hijas (children)
  return <Outlet />;
}

// 2. Selector de Dashboard (Michael Ruiz es ADMINISTRADOR)
function DashboardSelector() {
  const { isAdmin } = useAuth();
  return isAdmin ? <AdminDashboard /> : <UserDashboard />;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    // Rutas protegidas que dependen de Auth, Home y Task Providers
    element: <ProtectedLayout />,
    children: [
      {
        path: "/home-setup",
        element: <HomeSetup />,
      },
      {
        path: "/dashboard",
        element: <DashboardSelector />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
