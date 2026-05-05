import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Task, TaskPriority, TaskStatus } from "../contexts/TaskContext";
import {
  Calendar,
  User as UserIcon,
  Trash2,
  UserPlus,
  CheckCircle2,
  Clock,
  Play,
} from "lucide-react";

interface TaskCardProps {
  task: Task;
  onDelete?: (id: string) => void;
  onAssign?: (id: string) => void;
  onStatusChange?: (id: string, status: TaskStatus) => void;
  isAdmin?: boolean;
}

/**
 * Configuración de estilos y etiquetas por Prioridad
 * Sincronizado con los enums de Java (LOW, MEDIUM, HIGH)
 */
const priorityConfig: Record<string, { label: string; className: string }> = {
  LOW: { label: "Baja", className: "bg-blue-100 text-blue-800" },
  MEDIUM: { label: "Media", className: "bg-yellow-100 text-yellow-800" },
  HIGH: { label: "Alta", className: "bg-red-100 text-red-800" },
};

/**
 * Configuración de estilos e iconos por Estado
 * Sincronizado con los enums de Java (PENDIENTE, EN_PROCESO, COMPLETADA)
 */
const statusConfig: Record<
  string,
  { label: string; className: string; icon: React.ReactNode }
> = {
  PENDIENTE: {
    label: "Pendiente",
    className: "bg-gray-100 text-gray-800",
    icon: <Clock className="w-3 h-3" />,
  },
  EN_PROCESO: {
    label: "En Proceso",
    className: "bg-blue-100 text-blue-800",
    icon: <Play className="w-3 h-3" />,
  },
  COMPLETADA: {
    label: "Completada",
    className: "bg-green-100 text-green-800",
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
};

export function TaskCard({
  task,
  onDelete,
  onAssign,
  onStatusChange,
  isAdmin,
}: TaskCardProps) {
  // Obtenemos la configuración visual basada en los datos de la tarea
  // Usamos fallbacks (MEDIUM y PENDIENTE) por si el backend envía algo inesperado
  const priority = priorityConfig[task.priority] || priorityConfig.MEDIUM;
  const status = statusConfig[task.status] || statusConfig.PENDIENTE;

  return (
    <Card className="hover:shadow-lg transition-shadow bg-white border border-gray-100 flex flex-col h-full">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-bold text-gray-900 line-clamp-1">
            {task.title || "Tarea sin título"}
          </CardTitle>
          <Badge
            className={`${priority.className} border-none font-semibold whitespace-nowrap`}
          >
            {priority.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 flex-grow flex flex-col">
        {/* Descripción con límite de líneas para mantener uniformidad */}
        <p className="text-sm text-gray-600 line-clamp-2 min-h-[40px]">
          {task.description || "Sin descripción adicional"}
        </p>

        <div className="flex flex-wrap gap-3 text-sm">
          {/* Fecha de Vencimiento */}
          <div className="flex items-center gap-1.5 text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>
              {task.dueDate
                ? new Date(task.dueDate).toLocaleDateString("es-ES")
                : "Sin fecha"}
            </span>
          </div>

          {/* Usuario Asignado (Datos dinámicos del Backend) */}
          {(task as any).usuarioAsignadoNombre && (
            <div className="flex items-center gap-1.5 text-indigo-600 font-medium">
              <UserIcon className="w-4 h-4" />
              <span className="truncate max-w-[120px]">
                {(task as any).usuarioAsignadoNombre}
              </span>
            </div>
          )}
        </div>

        {/* Badge de Estado */}
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={`${status.className} flex items-center gap-1 py-1 px-2 border-none`}
          >
            {status.icon}
            {status.label}
          </Badge>
        </div>

        {/* Botones de Acción - Empujados al final de la tarjeta */}
        <div className="flex flex-wrap gap-2 pt-3 border-t mt-auto">
          {/* ACCIONES PARA USUARIO ESTÁNDAR (Cambio de flujo) */}
          {!isAdmin && onStatusChange && task.status !== "COMPLETADA" && (
            <>
              {task.status === "PENDIENTE" && (
                <Button
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                  onClick={() => onStatusChange(task.id, "EN_PROCESO")}
                >
                  <Play className="w-3 h-3 mr-1 fill-current" /> Iniciar
                </Button>
              )}
              {task.status === "EN_PROCESO" && (
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white shadow-sm"
                  onClick={() => onStatusChange(task.id, "COMPLETADA")}
                >
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Completar
                </Button>
              )}
            </>
          )}

          {/* ACCIONES PARA ADMINISTRADOR (Gestión) */}
          {isAdmin && (
            <>
              {!task.assignedTo && onAssign && (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                  onClick={() => onAssign(task.id)}
                >
                  <UserPlus className="w-4 h-4 mr-1" /> Asignar
                </Button>
              )}
              {onDelete && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 ml-auto"
                  onClick={() => onDelete(task.id)}
                >
                  <Trash2 className="w-4 h-4 mr-1" /> Eliminar
                </Button>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
