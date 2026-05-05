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

export const registrarTarea = async (data: CreateTareaRequest): Promise<TareaResponse> => {
  const response = await axios.post<TareaResponse>(`${API_URL}/crear`, data);
  return response.data;
};

export const getTareasPorHogar = async (hogarId: number): Promise<TareaResponse[]> => {
  try {
    const response = await axios.get<TareaResponse[]>(`${API_URL}/hogar/${hogarId}`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error en getTareasPorHogar:", error);
    return [];
  }
};

// ALIAS para que tu TaskContext no de error de importación
export const obtenerTareas = () => getTareasPorHogar(1); 

export const eliminarTarea = async (taskId: number): Promise<void> => {
  await axios.delete(`${API_URL}/${taskId}`);
};

export const asignarTareaAUser = async (taskId: number, usuarioId: number): Promise<TareaResponse> => {
  const response = await axios.put<TareaResponse>(`${API_URL}/${taskId}/asignar/${usuarioId}`);
  return response.data;
};

// ALIAS para asignarTarea
export const asignarTarea = asignarTareaAUser;