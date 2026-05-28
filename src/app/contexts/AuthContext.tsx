import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

// Mapeo adaptado exactamente a las columnas de tu Base de Datos
export interface User {
  id: string | number;
  name: string; // Cambiado de 'nombre' a 'name' para coincidir con tu BD
  email: string;
  rol?: string;
  avatar?: string;
  familiaId?: number | null;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserHome: (familiaId: number) => void; // NUEVA FUNCIÓN AGREGADA
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
   * ACTUALIZACIÓN REACTIVA (SOLUCIÓN):
   * Permite inyectar el familiaId al usuario actual sin perder la sesión.
   */
  const updateUserHome = (familiaId: number) => {
    if (user) {
      const updatedUser = { ...user, familiaId };
      setUser(updatedUser);
      localStorage.setItem("usuario_sesion", JSON.stringify(updatedUser));
    }
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
    <AuthContext.Provider
      value={{ user, login, logout, updateUserHome, isAdmin, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook principal de autenticación
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

/**
 * SOLUCIÓN AL SELECTOR VACÍO:
 * Ahora useUsers va a buscar dinámicamente los miembros del hogar de la API
 */
export function useUsers() {
  const { user } = useAuth();
  const [members, setMembers] = useState<User[]>([]);

  // Extraemos el ID del hogar de forma flexible
  const hogarId = user?.familiaId || (user as any)?.hogarId;

  useEffect(() => {
    if (!hogarId) return;

    const fetchMiembros = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/hogares/${hogarId}/miembros`,
        );
        if (response.ok) {
          const data = await response.json();
          setMembers(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Error cargando usuarios en useUsers:", error);
      }
    };

    fetchMiembros();
  }, [hogarId]);

  return members;
}
