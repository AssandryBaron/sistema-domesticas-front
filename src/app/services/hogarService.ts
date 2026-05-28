import axios from 'axios';

// Estructura para capturar la respuesta del Back al crear o unirse
export interface HogarResponse {
  id: number;
  nombre: string;
  codigoInvitacion: string;
}

const API_BASE_URL = 'http://localhost:8080/api/hogares';

/**
 * HU-02: Crear Hogar enviando un objeto JSON en el Body (@RequestBody)
 */
export const crearHogar = async (usuarioId: number, nombre: string): Promise<HogarResponse> => {
  const response = await axios.post<HogarResponse>(`${API_BASE_URL}/crear`, {
    usuarioId,
    nombre
  });
  return response.data;
};

/**
 * HU-04: Unirse a un hogar enviando un objeto JSON en el Body (@RequestBody)
 */
export const unirseAHogar = async (usuarioId: number, codigoInvitacion: string): Promise<HogarResponse> => {
  // Aseguramos limpiar espacios y forzar consistencia en el string
  const codigoLimpio = (codigoInvitacion || "").trim();

  const response = await axios.post<HogarResponse>(`${API_BASE_URL}/unirse`, {
    codigo: codigoLimpio, 
    usuarioId: Number(usuarioId)      
  });
  
  return response.data; 
};

/**
 * Trae todos los miembros pertenecientes al hogar del usuario actual
 */
export const obtenerMiembros = async (usuarioId: number): Promise<any> => {
  // Consúltale al endpoint que mapeaste en tu backend pasándole el id por Query Params
  const response = await axios.get(`${API_BASE_URL}/miembros`, {
    params: { usuarioId }
  });
  return response.data;
};

// Exportamos un objeto por defecto para mantener consistencia con la importación grupal
export const hogarService = {
  crearHogar,
  unirseAHogar,
  obtenerMiembros
};