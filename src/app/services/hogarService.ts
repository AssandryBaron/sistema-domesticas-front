import axios from 'axios';

// Estructura para capturar la respuesta del Back al crear
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
  // Pasamos las variables estructuradas en el cuerpo, justo como CreateHogarRequest espera en Java
  const response = await axios.post<HogarResponse>(`${API_BASE_URL}/crear`, {
    usuarioId,
    nombre
  });
  return response.data;
};

/**
 * HU-04: Unirse a un hogar enviando un objeto JSON en el Body (@RequestBody)
 */
export const unirseAHogar = async (usuarioId: number, codigoInvitacion: string): Promise<string> => {
  // Pasamos un objeto con las propiedades exactas de UnirseHogarRequest en Java: 'codigo' y 'usuarioId'
  const response = await axios.post<string>(`${API_BASE_URL}/unirse`, {
    codigo: codigoInvitacion, // Mapea con request.getCodigo()
    usuarioId: usuarioId      // Mapea con request.getUsuarioId()
  });
  
  return response.data; // Retorna el texto de éxito ("Te has unido al hogar exitosamente")
};