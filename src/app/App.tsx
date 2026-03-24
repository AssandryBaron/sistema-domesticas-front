import { RouterProvider } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import { TaskProvider } from './contexts/TaskContext';
import { HomeProvider } from './contexts/HomeContext';
import { Toaster } from './components/ui/sonner';
import { router } from './routes';

export default function App() {
  return (
    <AuthProvider>
      <HomeProvider>
        <TaskProvider>
          <RouterProvider router={router} />
          <Toaster position="top-right" />
        </TaskProvider>
      </HomeProvider>
    </AuthProvider>
  );
}