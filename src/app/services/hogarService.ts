import axios from 'axios';

// Definimos la respuesta que nos da tu Spring Boot (HogarResponse)
export interface HogarResponse {
  id: number;
  nombre: string;
  codigoInvitacion: string;
}

// Base URL para centralizar las peticiones
const API_BASE_URL = 'http://localhost:8080/api/hogares';

/**
 * HU-02: Función para crear un hogar en el backend
 * @param usuarioId ID del usuario que crea el hogar
 * @param nombre Nombre del nuevo hogar
 */
export const crearHogar = async (usuarioId: number, nombre: string): Promise<HogarResponse> => {
  const response = await axios.post<HogarResponse>(`${API_BASE_URL}/crear`, {
    usuarioId,
    nombre
  });
  return response.data;
};

/**
 * HU-04: Función para unirse a un hogar existente mediante código
 * @param usuarioId ID del usuario que desea unirse
 * @param codigoInvitacion Código de 8 caracteres proporcionado por el administrador
 */
export const unirseAHogar = async (usuarioId: number, codigoInvitacion: string): Promise<HogarResponse> => {
  // Usamos params porque el backend espera @RequestParam
  const response = await axios.post<HogarResponse>(`${API_BASE_URL}/unirse`, null, {
    params: {
      usuarioId,
      codigoInvitacion
    }
  });
  return response.data;
};