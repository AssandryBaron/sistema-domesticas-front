import { RouterProvider } from "react-router";
import { AuthProvider } from "./contexts/AuthContext";
import { TaskProvider } from "./contexts/TaskContext";
import { HomeProvider } from "./contexts/HomeContext";
import { Toaster } from "./components/ui/sonner";
import { router } from "./routes";

export default function App() {
  return (
    <AuthProvider>
      <HomeProvider>
        <TaskProvider>
          {/* IMPORTANTE: El RouterProvider DEBE ser el último hijo. 
            Esto garantiza que cualquier componente dentro de 'router' 
            tenga acceso a Auth, Home y Tasks.
          */}
          <RouterProvider router={router} />

          {/* El Toaster fuera del router para que sea global */}
          <Toaster position="top-right" richColors closeButton />
        </TaskProvider>
      </HomeProvider>
    </AuthProvider>
  );
}
