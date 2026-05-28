import axios from 'axios';

export interface CreateTareaRequest {
  usuarioId: number;
  nombre: string;
  descripcion: string;
  prioridad: string;
  fechaLimite: string;
  hogarId?: number;
}

export interface TareaResponse {
  id: number;
  nombre: string;
  descripcion: string;
  prioridad: string;
  fechaLimite: string;
  estado: string;
  hogarId: number;
  usuarioAsignadoId?: number | null;
  usuarioAsignadoNombre?: string | null;
}

const API_URL = 'http://localhost:8080/api/tareas';

/**
 * HU-06: Registrar o crear una nueva tarea
 */
export const registrarTarea = async (data: CreateTareaRequest): Promise<TareaResponse> => {
  const response = await axios.post<TareaResponse>(`${API_URL}/crear`, data);
  return response.data;
};

/**
 * HU-07: Listar tareas del hogar dinámicamente
 */
export const getTareasPorHogar = async (hogarId: number): Promise<TareaResponse[]> => {
  try {
    const response = await axios.get<TareaResponse[]>(`${API_URL}/hogar/${hogarId}`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error en getTareasPorHogar:", error);
    return [];
  }
};

export const obtenerTareas = (hogarId: number) => getTareasPorHogar(hogarId); 

/**
 * HU-10: Eliminar una tarea (Solo Administrador)
 */
export const eliminarTarea = async (taskId: number, usuarioId: number): Promise<void> => {
  await axios.delete(`${API_URL}/${taskId}`, {
    params: { usuarioId }
  });
};

/**
 * HU-11: Cambiar el estado de una tarea
 */
export const cambiarEstadoTarea = async (taskId: number, usuarioId: number, nuevoEstado: string): Promise<any> => {
  const response = await axios.patch(`${API_URL}/${taskId}/estado`, null, {
    params: {
      usuarioId: usuarioId,
      nuevoEstado: nuevoEstado   
    }
  });
  return response.data;
};

/**
 * HU-13: Asignar tarea a un usuario
 * CORRECCIÓN: Se cambió de "/assignar/" a "/asignar/" con una sola 's' 
 * para que coincida exactamente con tu Java.
 */
export const asignarTareaAUser = async (taskId: number, usuarioId: number): Promise<any> => {
  const response = await axios.put(`${API_URL}/${taskId}/asignar/${usuarioId}`);
  return response.data;
};

export const asignarTarea = asignarTareaAUser;
export const assignTask = asignarTareaAUser; 

/**
 * HU-14: Historial de tareas completadas
 */
export const getHistorialPorHogar = async (hogarId: number): Promise<TareaResponse[]> => {
  try {
    const response = await axios.get<TareaResponse[]>(`${API_URL}/hogar/${hogarId}/historial`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error en getHistorialPorHogar:", error);
    return [];
  }
};

export const tareaService = {
  registrarTarea,
  getTareasPorHogar,
  obtenerTareas,
  eliminarTarea,
  cambiarEstadoTarea,
  asignarTareaAUser,
  asignarTarea,
  assignTask,
  getHistorialPorHogar
};