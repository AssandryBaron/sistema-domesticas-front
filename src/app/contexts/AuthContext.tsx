import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

export interface User {
  id: string | number;
  nombre: string;
  email: string;
  rol?: string;
  avatar?: string;
  familiaId?: number | null;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Recupera la sesión al cargar la app para evitar cierres inesperados
  useEffect(() => {
    const savedUser = localStorage.getItem("usuario_sesion");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("usuario_sesion");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("http://localhost:8080/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const usuarioReal = await response.json();
        setUser(usuarioReal);
        // Guardamos en storage para persistencia
        localStorage.setItem("usuario_sesion", JSON.stringify(usuarioReal));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error de conexión:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("usuario_sesion");
  };

  /**
   * CORRECCIÓN CLAVE:
   * Tu consola muestra que el rol llega como 'ADMINISTRADOR'.
   * Esta lógica asegura que entres al AdminDashboard correcto.
   */
  const isAdmin =
    user?.rol?.toUpperCase() === "ADMINISTRADOR" ||
    user?.rol?.toUpperCase() === "ADMIN" ||
    (user as any)?.role?.toUpperCase() === "ADMIN";

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook principal de autenticación
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Este error es el que viste en pantalla si el Provider no envuelve a la App
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

/**
 * IMPORTANTE:
 * Exportamos useUsers para evitar el error de "requested module does not provide an export"
 * que aparece en tu consola de Vite.
 */
export function useUsers() {
  const { user } = useAuth();
  // Retorna una lista vacía o lógica de miembros si la tienes
  return [];
}
