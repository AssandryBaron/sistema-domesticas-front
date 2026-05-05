import React, { createContext, useContext, useState, ReactNode } from "react";
import { HogarResponse } from "../services/hogarService";

// Actualizamos la interfaz para que coincida con el Backend y el Frontend
export interface Home {
  id: string;
  name: string;
  address?: string; // Opcional, ya que el back solo devuelve id, nombre y codigo
  inviteCode?: string;
}

interface HomeContextType {
  currentHome: Home | null;
  createHome: (name: string, address: string, userId: string) => void;
  // Esta es la función que te faltaba y causaba el error ts(2339)
  setHomeData: (data: HogarResponse | null) => void;
}

export const HomeContext = createContext<HomeContextType | undefined>(
  undefined,
);

export function HomeProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [currentHome, setCurrentHome] = useState<Home | null>(null);

  // Función para establecer los datos del hogar directamente (usada en Login y Join)
  const setHomeData = (data: HogarResponse | null) => {
    if (!data) {
      setCurrentHome(null);
      return;
    }

    // Mapeamos lo que viene del Back (HogarResponse) a nuestra interfaz Home
    setCurrentHome({
      id: data.id.toString(),
      name: data.nombre,
      inviteCode: data.codigoInvitacion,
    });
  };

  const createHome = (name: string, address: string, userId: string) => {
    const newHome: Home = {
      id: Date.now().toString(),
      name,
      address,
      inviteCode: "", // Se llenará con la respuesta real del back en el componente
    };
    setCurrentHome(newHome);
  };

  return (
    <HomeContext.Provider value={{ currentHome, createHome, setHomeData }}>
      {children}
    </HomeContext.Provider>
  );
}

export function useHome() {
  const context = useContext(HomeContext);
  if (context === undefined) {
    throw new Error("useHome must be used within a HomeProvider");
  }
  return context;
}
