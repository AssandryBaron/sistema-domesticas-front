import React, { createContext, useContext, useState, useEffect } from "react";
import * as tareaService from "../services/tareaService";
import { useAuth } from "./AuthContext";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";
export type TaskStatus = "PENDIENTE" | "EN_PROCESO" | "COMPLETADA";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  assignedTo: string | null;
  usuarioAsignadoNombre?: string | null;
  createdBy: string;
}

interface TaskContextType {
  tasks: Task[];
  addTask: (taskData: Omit<Task, "id">) => Promise<boolean>;
  deleteTask: (id: string) => Promise<void>;
  assignTask: (taskId: string, userId: string) => Promise<void>;
  updateTaskStatus: (taskId: string, nuevoEstado: string) => Promise<void>; // Añadido para HU-11
  refreshTasks: () => Promise<void>;
  isLoading: boolean;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const refreshTasks = async () => {
    // Si no hay usuario o no pertenece a ninguna familia/hogar, limpiamos las tareas
    const hogarId = user?.familiaId || (user as any)?.hogarId;

    if (!user || !hogarId) {
      setTasks([]);
      return;
    }

    setIsLoading(true);
    try {
      // Sincronizado dinámicamente con el hogar del usuario actual
      const data = await tareaService.getTareasPorHogar(Number(hogarId));

      const normalizedTasks = data.map((t: any) => {
        let mappedStatus: TaskStatus = "PENDIENTE";
        const rawStatus = (t.estado || "").toUpperCase();

        if (rawStatus === "PENDIENTE") mappedStatus = "PENDIENTE";
        else if (rawStatus === "EN_PROCESO" || rawStatus === "IN_PROGRESS")
          mappedStatus = "EN_PROCESO";
        else if (rawStatus === "COMPLETADA" || rawStatus === "COMPLETED")
          mappedStatus = "COMPLETADA";

        return {
          id: (t.id || "").toString(),
          title: t.nombre || "Sin título",
          description: t.descripcion || "",
          priority: (t.prioridad || "MEDIUM").toUpperCase() as TaskPriority,
          status: mappedStatus,
          dueDate: t.fechaLimite || "",
          assignedTo: t.usuarioAsignadoId
            ? t.usuarioAsignadoId.toString()
            : null,
          usuarioAsignadoNombre: t.usuarioAsignadoNombre || null,
          createdBy: user?.id?.toString() || "1",
        };
      });

      setTasks(normalizedTasks);
    } catch (error) {
      console.error("Error al obtener tareas:", error);
      setTasks([]); // Limpieza en caso de error
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = async (taskData: Omit<Task, "id">) => {
    const hogarId = user?.familiaId || (user as any)?.hogarId;
    if (!hogarId) return false;

    try {
      const payload = {
        usuarioId: Number(user?.id) || 1,
        nombre: taskData.title,
        descripcion: taskData.description,
        prioridad: taskData.priority,
        fechaLimite: taskData.dueDate,
        hogarId: Number(hogarId), // Dinámico
      };

      const response = await tareaService.registrarTarea(payload);
      if (response) {
        await refreshTasks();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error en addTask:", error);
      return false;
    }
  };

  /**
   * HU-10: Eliminar una tarea mandando de forma segura el ID del usuario actual
   */
  const deleteTask = async (id: string) => {
    if (!user?.id) {
      console.error("No se puede eliminar la tarea: Usuario no autenticado");
      return;
    }
    try {
      // Pasamos el ID de la tarea y recuperamos dinámicamente el ID del usuario logueado
      await tareaService.eliminarTarea(Number(id), Number(user.id));
      await refreshTasks(); // Recarga la lista automáticamente en la pantalla
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const assignTask = async (taskId: string, userId: string) => {
    try {
      await tareaService.asignarTareaAUser(Number(taskId), Number(userId));
      await refreshTasks();
    } catch (error) {
      console.error("Error al asignar:", error);
    }
  };

  /**
   * HU-11: Cambiar el estado de una tarea vinculando el usuario autenticado
   */
  const updateTaskStatus = async (taskId: string, nuevoEstado: string) => {
    if (!user?.id) {
      console.error("No se puede actualizar el estado: Usuario no autenticado");
      return;
    }
    try {
      // Convierte los estados del Front ("EN_PROCESO") a los esperados por el Back si hiciera falta
      await tareaService.cambiarEstadoTarea(
        Number(taskId),
        Number(user.id),
        nuevoEstado,
      );
      await refreshTasks(); // Sincroniza el panel visual al instante
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    }
  };

  // Escucha cuando el usuario inicia o cierra sesión para recargar o limpiar
  useEffect(() => {
    refreshTasks();
  }, [user]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        deleteTask,
        assignTask,
        updateTaskStatus, // Expuesto para tus componentes
        refreshTasks,
        isLoading,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTasks debe usarse dentro de TaskProvider");
  return context;
};
