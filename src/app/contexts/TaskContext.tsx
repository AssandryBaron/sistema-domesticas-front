import React, { createContext, useContext, useState, useEffect } from "react";
import * as tareaService from "../services/tareaService";
import { useAuth } from "./AuthContext";

export type TaskPriority =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "BAJA"
  | "MEDIA"
  | "ALTA";

// Soportamos los estados nativos del front en minúsculas para que los contadores sumen correctamente
export type TaskStatus = "pending" | "in-progress" | "completed";

export interface Task {
  id: string;
  title: string;
  nombre: string;
  description: string;
  descripcion: string;
  priority: TaskPriority;
  prioridad: string;
  status: TaskStatus;
  estado: string;
  dueDate: string;
  fechaLimite: string;
  assignedTo: string | null;
  usuarioAsignadoId: string | null;
  usuarioAsignadoNombre?: string | null;
  createdBy: string;
}

interface TaskContextType {
  tasks: Task[];
  historyTasks: Task[];
  addTask: (
    taskData: Omit<
      Task,
      | "id"
      | "nombre"
      | "descripcion"
      | "prioridad"
      | "estado"
      | "fechaLimite"
      | "usuarioAsignadoId"
    >,
  ) => Promise<boolean>;
  deleteTask: (id: string) => Promise<void>;
  assignTask: (
    taskId: string,
    userId: string,
    userName?: string,
  ) => Promise<void>;
  updateTaskStatus: (taskId: string, nuevoEstado: string) => Promise<void>;
  updateTask: (taskId: string, data: { status: string }) => Promise<void>;
  refreshTasks: () => Promise<void>;
  refreshHistory: () => Promise<void>;
  isLoading: boolean;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [historyTasks, setHistoryTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const refreshTasks = async () => {
    const hogarId =
      user?.familiaId || (user as any)?.hogarId || (user as any)?.familyId;

    if (!user || !hogarId) {
      setTasks([]);
      return;
    }

    setIsLoading(true);
    try {
      const data = await tareaService.getTareasPorHogar(Number(hogarId));
      const listaTareas = Array.isArray(data) ? data : [];

      const normalizedTasks = listaTareas
        .map((t: any) => {
          if (!t) return null;

          const rawStatus = (t.estado || t.status || "").toUpperCase();

          // CORRECCIÓN CONTADORES: Mapeamos al formato estricto que requiere tu UI para contar
          let mappedStatus: TaskStatus = "pending";
          if (
            rawStatus === "EN_PROCESO" ||
            rawStatus === "IN_PROGRESS" ||
            rawStatus === "PROCESO"
          ) {
            mappedStatus = "in-progress";
          } else if (
            rawStatus === "COMPLETADA" ||
            rawStatus === "COMPLETED" ||
            rawStatus === "COMPLETADO"
          ) {
            mappedStatus = "completed";
          }

          // AJUSTE SEGURO: Si la tarea ya avanzó de estado (En proceso o Completada) pero el back no
          // expone la asignación en el JSON, forzamos a que le pertenezca al usuario logueado.
          const fueAsignadaOCompletada =
            mappedStatus === "in-progress" || mappedStatus === "completed";

          const dbAssignedId = t.usuarioAsignadoId || t.assignedTo || null;
          const assignedId = dbAssignedId
            ? dbAssignedId.toString()
            : fueAsignadaOCompletada && user?.id
              ? user.id.toString()
              : null;

          // Validamos el nombre asignado en base a si dedujimos la asignación o si viene del back
          let fallbackName = "Sin asignar";
          if (assignedId) {
            if (user?.id && assignedId === user.id.toString()) {
              fallbackName = user?.name || (user as any)?.nombre || "tenya";
            } else {
              fallbackName = t.usuarioAsignadoNombre || "Asignado";
            }
          }

          return {
            id: (t.id || "").toString(),
            title: t.nombre || t.title || "Sin título",
            nombre: t.nombre || t.title || "Sin título",
            description: t.descripcion || t.description || "",
            descripcion: t.descripcion || t.description || "",
            priority: (
              t.prioridad ||
              t.priority ||
              "MEDIUM"
            ).toUpperCase() as TaskPriority,
            prioridad: (t.prioridad || t.priority || "MEDIUM").toUpperCase(),
            status: mappedStatus,
            estado: rawStatus || "PENDIENTE",
            dueDate: t.fechaLimite || t.dueDate || "",
            fechaLimite: t.fechaLimite || t.dueDate || "",
            assignedTo: assignedId,
            usuarioAsignadoId: assignedId,
            usuarioAsignadoNombre: fueAsignadaOCompletada
              ? user?.name || (user as any)?.nombre || "tenya"
              : t.usuarioAsignadoNombre || fallbackName,
            createdBy: t.usuarioId?.toString() || user?.id?.toString() || "1",
          };
        })
        .filter(Boolean) as Task[];

      // Mantenemos todas las tareas para que los contadores superiores funcionen de forma nativa.
      setTasks(normalizedTasks);
    } catch (error) {
      console.error("Error al obtener tareas:", error);
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshHistory = async () => {
    const hogarId =
      user?.familiaId || (user as any)?.hogarId || (user as any)?.familyId;

    if (!user || !hogarId) {
      setHistoryTasks([]);
      return;
    }

    try {
      const data = await tareaService.getHistorialPorHogar(Number(hogarId));
      const listaHistorial = Array.isArray(data) ? data : [];

      const normalizedHistory = listaHistorial
        .map((t: any) => {
          if (!t) return null;

          const assignedId =
            t.usuarioAsignadoId || t.assignedTo || user?.id?.toString() || "1";

          let fallbackName = user?.name || (user as any)?.nombre || "tenya";
          if (t.usuarioAsignadoNombre) {
            fallbackName = t.usuarioAsignadoNombre;
          }

          return {
            id: (t.id || "").toString(),
            title: t.nombre || t.title || "Sin título",
            nombre: t.nombre || t.title || "Sin título",
            description: t.descripcion || t.description || "",
            descripcion: t.descripcion || t.description || "",
            priority: (
              t.prioridad ||
              t.priority ||
              "MEDIUM"
            ).toUpperCase() as TaskPriority,
            prioridad: (t.prioridad || t.priority || "MEDIUM").toUpperCase(),
            status: "completed" as TaskStatus,
            estado: "COMPLETADA",
            dueDate: t.fechaLimite || t.dueDate || "",
            fechaLimite: t.fechaLimite || t.dueDate || "",
            assignedTo: assignedId.toString(),
            usuarioAsignadoId: assignedId.toString(),
            usuarioAsignadoNombre: fallbackName,
            createdBy: "1",
          };
        })
        .filter(Boolean) as Task[];

      setHistoryTasks(normalizedHistory);
    } catch (error) {
      console.error("Error al obtener historial de tareas:", error);
      setHistoryTasks([]);
    }
  };

  const addTask = async (
    taskData: Omit<
      Task,
      | "id"
      | "nombre"
      | "descripcion"
      | "prioridad"
      | "estado"
      | "fechaLimite"
      | "usuarioAsignadoId"
    >,
  ) => {
    const hogarId = user?.familiaId || (user as any)?.hogarId;
    if (!hogarId) return false;

    try {
      let fechaFormateada = taskData.dueDate;
      if (fechaFormateada.includes("/")) {
        const partes = fechaFormateada.split("/");
        if (partes[0].length <= 2 && partes[2]?.length === 4) {
          fechaFormateada = `${partes[2]}-${partes[1].padStart(2, "0")}-${partes[0].padStart(2, "0")}`;
        }
      }

      const payload = {
        usuarioId: Number(user?.id) || 1,
        nombre: taskData.title,
        description: taskData.description,
        descripcion: taskData.description,
        prioridad: taskData.priority,
        fechaLimite: fechaFormateada,
        hogarId: Number(hogarId),
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
    if (!user?.id) return;
    try {
      await tareaService.eliminarTarea(Number(id), Number(user.id));
      await refreshTasks();
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const assignTask = async (
    taskId: string,
    userId: string,
    userName?: string,
  ) => {
    try {
      await tareaService.asignarTareaAUser(Number(taskId), Number(userId));
      await refreshTasks();
      await refreshHistory();
    } catch (error) {
      console.error("Error al asignar:", error);
    }
  };

  const updateTaskStatus = async (taskId: string, nuevoEstado: string) => {
    if (!user?.id) return;
    try {
      let estadoBack = nuevoEstado.toUpperCase();
      if (
        estadoBack === "IN-PROGRESS" ||
        estadoBack === "IN_PROGRESS" ||
        estadoBack === "EN-PROCESO" ||
        estadoBack === "PROCESO" ||
        estadoBack === "EN_PROCESO"
      ) {
        estadoBack = "EN_PROCESO";
      } else if (
        estadoBack === "COMPLETED" ||
        estadoBack === "COMPLETADO" ||
        estadoBack === "COMPLETADA"
      ) {
        estadoBack = "COMPLETADA";
      } else {
        estadoBack = "PENDIENTE";
      }

      await tareaService.cambiarEstadoTarea(
        Number(taskId),
        Number(user.id),
        estadoBack,
      );
      await refreshTasks();
      await refreshHistory();
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    }
  };

  const updateTask = async (taskId: string, data: { status: string }) => {
    await updateTaskStatus(taskId, data.status);
  };

  useEffect(() => {
    if (user) {
      refreshTasks();
      refreshHistory();
    }
  }, [user]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        historyTasks,
        addTask,
        deleteTask,
        assignTask,
        updateTaskStatus,
        updateTask,
        refreshTasks,
        refreshHistory,
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
