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
  usuarioAsignadoNombre?: string | null; // Nuevo campo sincronizado con el Backend
  createdBy: string;
}

interface TaskContextType {
  tasks: Task[];
  addTask: (taskData: Omit<Task, "id">) => Promise<boolean>;
  deleteTask: (id: string) => Promise<void>;
  assignTask: (taskId: string, userId: string) => Promise<void>;
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
    setIsLoading(true);
    try {
      // Sincronizado con el ID del hogar 9 de tu base de datos
      const data = await tareaService.getTareasPorHogar(9);

      const normalizedTasks = data.map((t: any) => {
        // Normalización de estados a Mayúsculas para evitar errores ts(2367)
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
          usuarioAsignadoNombre: t.usuarioAsignadoNombre || null, // Captura el nombre de Juana o Michael
          createdBy: user?.id?.toString() || "1",
        };
      });

      setTasks(normalizedTasks);
    } catch (error) {
      console.error("Error al obtener tareas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = async (taskData: Omit<Task, "id">) => {
    try {
      const payload = {
        usuarioId: Number(user?.id) || 1,
        nombre: taskData.title,
        descripcion: taskData.description,
        prioridad: taskData.priority,
        fechaLimite: taskData.dueDate,
        hogarId: 9,
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

  const deleteTask = async (id: string) => {
    try {
      // Conversión a número para cumplir con la firma del Service
      await tareaService.eliminarTarea(Number(id));
      await refreshTasks();
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const assignTask = async (taskId: string, userId: string) => {
    try {
      // Reparación del error ts(2345) mediante conversión explícita
      await tareaService.asignarTareaAUser(Number(taskId), Number(userId));

      // Tras asignar a Juana Ruiz, refrescamos para ver su nombre en la tarjeta
      await refreshTasks();
    } catch (error) {
      console.error("Error al asignar:", error);
    }
  };

  useEffect(() => {
    refreshTasks();
  }, []);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        deleteTask,
        assignTask,
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
