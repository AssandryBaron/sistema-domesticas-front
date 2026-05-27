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
  usuarioAsignadoId?: number;
  usuarioAsignadoNombre?: string;
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

// ALIAS corregido para que use el ID del hogar dinámico que le pida tu Context/Componente
export const obtenerTareas = (hogarId: number) => getTareasPorHogar(hogarId); 

/**
 * HU-10: Eliminar una tarea (Solo Administrador)
 * Corregido: Ahora envía el usuarioId por parámetro de consulta (?usuarioId=X) como pide Natalia
 */
export const eliminarTarea = async (taskId: number, usuarioId: number): Promise<void> => {
  await axios.delete(`${API_URL}/${taskId}`, {
    params: {
      usuarioId: usuarioId // Mapea con @RequestParam Long usuarioId del Back
    }
  });
};

/**
 * HU-11: Cambiar el estado de una tarea
 * Añadido: Envía un PATCH con el objeto JSON que procesará el Map<String, Object> de Java
 */
export const cambiarEstadoTarea = async (taskId: number, usuarioId: number, nuevoEstado: string): Promise<TareaResponse> => {
  const response = await axios.patch<TareaResponse>(`${API_URL}/${taskId}/estado`, {
    usuarioId: usuarioId, // Clave "usuarioId" requerida por body.get()
    estado: nuevoEstado   // Clave "estado" requerida por body.get()
  });
  return response.data;
};

/**
 * HU-Extra: Asignar tarea a un usuario (Mantenemos tu función intacta por si la usan)
 */
export const asignarTareaAUser = async (taskId: number, usuarioId: number): Promise<TareaResponse> => {
  const response = await axios.put<TareaResponse>(`${API_URL}/${taskId}/asignar/${usuarioId}`);
  return response.data;
};

// ALIAS para asignarTarea
export const asignarTarea = asignarTareaAUser;