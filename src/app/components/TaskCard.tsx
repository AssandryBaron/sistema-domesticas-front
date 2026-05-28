import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Task, TaskPriority, TaskStatus } from "../contexts/TaskContext";
import { useAuth } from "../contexts/AuthContext";
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
  onAssign?: (taskId: string, userId: string, userName?: string) => void;
  onStatusChange?: (id: string, status: TaskStatus) => void;
  isAdmin?: boolean;
  members?: any[]; // Usamos any[] para recibir la lista del Back tal cual venga sin romper tipos
}

const priorityConfig: Record<string, { label: string; className: string }> = {
  LOW: { label: "Baja", className: "bg-blue-100 text-blue-800" },
  MEDIUM: { label: "Media", className: "bg-yellow-100 text-yellow-800" },
  HIGH: { label: "Alta", className: "bg-red-100 text-red-800" },
  BAJA: { label: "Baja", className: "bg-blue-100 text-blue-800" },
  MEDIA: { label: "Media", className: "bg-yellow-100 text-yellow-800" },
  ALTA: { label: "Alta", className: "bg-red-100 text-red-800" },
};

const statusConfig: Record<
  string,
  { label: string; className: string; icon: React.ReactNode }
> = {
  pending: {
    label: "Pendiente",
    className: "bg-gray-100 text-gray-800",
    icon: <Clock className="w-3 h-3" />,
  },
  "in-progress": {
    label: "En Proceso",
    className: "bg-blue-100 text-blue-800",
    icon: <Play className="w-3 h-3" />,
  },
  completed: {
    label: "Completada",
    className: "bg-green-100 text-green-800",
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
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
  members = [],
}: TaskCardProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const priority = priorityConfig[task.priority] || priorityConfig.MEDIUM;
  const status = statusConfig[task.status] || statusConfig.pending;
  const nameUser = (task as any).usuarioAsignadoNombre;
  const currentStatus = String(task.status).toLowerCase();

  // Si no se inyectan miembros desde el dashboard, generamos una lista segura por defecto
  const selectMembers =
    members && members.length > 0
      ? members
      : [
          {
            id: user?.id || "1",
            name: user?.name || (user as any)?.nombre || "tenya",
          },
        ];

  const handleSelect = (member: any) => {
    if (onAssign) {
      const mId = String(member.id || member.usuarioId || "1");
      // Extraemos el nombre de cualquier propiedad posible de forma segura
      const mName =
        member.name || member.nombre || member.username || "Asignado";
      onAssign(task.id, mId, mName);
    }
    setIsOpen(false);
  };

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
        <p className="text-sm text-gray-600 line-clamp-2 min-h-[40px]">
          {task.description || "Sin descripción adicional"}
        </p>

        <div className="flex flex-wrap gap-3 text-sm">
          <div className="flex items-center gap-1.5 text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>
              {task.dueDate
                ? new Date(task.dueDate).toLocaleDateString("es-ES")
                : "Sin fecha"}
            </span>
          </div>

          {nameUser && (
            <div className="flex items-center gap-1.5 text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded-md">
              <UserIcon className="w-4 h-4" />
              <span className="truncate max-w-[150px]">{nameUser}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={`${status.className} flex items-center gap-1 py-1 px-2 border-none font-medium`}
          >
            {status.icon} {status.label}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-3 border-t mt-auto relative">
          {onStatusChange &&
            currentStatus !== "completed" &&
            currentStatus !== "completada" && (
              <>
                {(currentStatus === "pending" ||
                  currentStatus === "pendiente") && (
                  <Button
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                    onClick={() => onStatusChange(task.id, "in-progress")}
                  >
                    <Play className="w-3 h-3 mr-1 fill-current" /> Iniciar
                  </Button>
                )}
                {(currentStatus === "in-progress" ||
                  currentStatus === "en_proceso") && (
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white shadow-sm"
                    onClick={() => onStatusChange(task.id, "completed")}
                  >
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Completar
                  </Button>
                )}
              </>
            )}

          {isAdmin && (
            <div className="relative">
              {onAssign && (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <UserPlus className="w-4 h-4 mr-1" /> Asignar
                </Button>
              )}

              {/* Lista flotante limpia y compatible con cualquier propiedad del objeto */}
              {isOpen && (
                <div className="absolute left-0 bottom-full mb-2 z-50 w-44 bg-white border border-gray-200 rounded-md shadow-xl py-1">
                  {selectMembers.map((member: any, index: number) => (
                    <button
                      key={member.id || index}
                      type="button"
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors block truncate"
                      onClick={() => handleSelect(member)}
                    >
                      {member.name ||
                        member.nombre ||
                        member.username ||
                        "Miembro"}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {isAdmin && onDelete && (
            <Button
              size="sm"
              variant="ghost"
              className="text-red-500 hover:text-red-700 hover:bg-red-50 ml-auto"
              onClick={() => onDelete(task.id)}
            >
              <Trash2 className="w-4 h-4 mr-1" /> Eliminar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
