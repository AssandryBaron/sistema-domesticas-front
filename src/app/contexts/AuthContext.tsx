import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User { 
  id: string | number;
  name: string;
  email: string;
  role?: 'admin' | 'user';
  avatar?: string;
  familiaId?: number|null
}

interface AuthContextType {  
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>; //Metodo
  logout: () => void; //metodo
  isAdmin: boolean; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined); //Creamos un contexto por el cual
                                                    //solo pasan "objetos" estructura AuthContextType, o undefined

// Usuarios mock para demo
const MOCK_USERS: User[] = [ //Datos quemados
  {
    id: '1',
    name: 'Ana García',
    email: 'admin@casa.com',
    role: 'admin',
  },
  {
    id: '2',
    name: 'Carlos Rodríguez',
    email: 'carlos@casa.com',
    role: 'user',
  },
  {
    id: '3',
    name: 'María López',
    email: 'maria@casa.com',
    role: 'user',
  },
  {
    id: '4',
    name: 'Juan Martínez',
    email: 'juan@casa.com',
    role: 'user',
  },
];

export function AuthProvider({ children }: { children: ReactNode }) { //Funcion a la que se le pasan todos los componentes del react como parametro
  const [user, setUser] = useState<User | null>(null); //Definimos un estado de un usuario (el que utiliza la app), en principio null porque no se ha loggeado

  
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:8080/api/usuarios/login', { //Peticion post 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }), //Enviamos en formato plano el email y la contrasena
      });

      if (response.ok) { //Si el servidor responde exitosamente
        const usuarioReal = await response.json(); //Convertimos en objeto el json que nos envio el servidor (el usuario loggeado)

        // Aquí le decimos al "altavoz" global quién es el usuario
        setUser(usuarioReal); //Guardamos el usuario loggeado
        return true;  //Login: true
      }
      return false; //No se pudo loggear
    } catch (error) {
      console.error("No se pudo conectar con Java:", error); //Error en servidor o respuesta no exitosa
      return false; //No se pudo loggear
    }
  };
  

  const logout = () => {
    setUser(null); 
  };

  const isAdmin = user?.role === 'admin'; //Si no es undefined el user, se compara el rol de admin y se pone el boolean correspondiente

  return ( //A los hijos que haya dentro de las etiquetas Authprovider en app.tsx, tendran acceso a la info dentro de value (user loggeado)
    <AuthContext.Provider value={{ user, login, logout, isAdmin }}>  
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { 
  const context = useContext(AuthContext); //Si queremos que se
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook para obtener todos los usuarios (para asignación de tareas)
export function useUsers() {
  return MOCK_USERS;
}
