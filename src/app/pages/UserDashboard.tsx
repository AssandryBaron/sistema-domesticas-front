import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTasks } from "../contexts/TaskContext";
import { TaskCard } from "../components/TaskCard";
import { TaskCalendar } from "../components/TaskCalendar";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  LogOut,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar as CalendarIcon,
  List,
  Home,
} from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const { tasks, updateTask, refreshTasks } = useTasks();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  useEffect(() => {
    if (refreshTasks) {
      refreshTasks();
    }
  }, []);

  const safeTasks = Array.isArray(tasks) ? tasks : [];

  // ======================================================================
  // 🕵️‍♂️ LOG PARA VER LAS PROPIEDADES INTERNAS DE LAS TAREAS QUE LLEGARON
  // ======================================================================
  useEffect(() => {
    if (safeTasks.length > 0) {
      console.log(
        "%c--- INSPECCIÓN DE TAREAS EN EL DASHBOARD ---",
        "color: #ff9900; font-weight: bold;",
      );
      safeTasks.forEach((task, index) => {
        console.log(`Tarea #${index + 1} (${task.title || task.nombre}):`, {
          id: task.id,
          assignedTo: task.assignedTo,
          usuarioAsignadoId: task.usuarioAsignadoId,
          status: task.status,
          estado: task.estado,
        });
      });
      console.log(
        "%c-------------------------------------------",
        "color: #ff9900; font-weight: bold;",
      );
    }
  }, [safeTasks]);
  // ======================================================================

  /**
   * 1. MIS TAREAS: Asignadas al ID del usuario actual (Toya)
   */
  const myTasks = safeTasks.filter((task) => {
    if (!user?.id || !task) return false;
    const assignedId = task.assignedTo || task.usuarioAsignadoId;
    return assignedId !== null && String(assignedId) === String(user.id);
  });

  /**
   * 2. TAREAS DEL HOGAR: Tareas que pertenecen al hogar pero NO están asignadas al usuario actual
   */
  const householdTasks = safeTasks.filter((task) => {
    if (!user?.id || !task) return false;
    const assignedId = task.assignedTo || task.usuarioAsignadoId;
    return !assignedId || String(assignedId) !== String(user.id);
  });

  // SOLUCIÓN DEFINITIVA AL ERROR ts(2367): Evaluamos únicamente los tipos válidos admitidos por TaskStatus
  const pendingTasks = myTasks.filter((t) => t.status === "pending");
  const inProgressTasks = myTasks.filter((t) => t.status === "in-progress");
  const completedTasks = myTasks.filter((t) => t.status === "completed");

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("Sesión cerrada exitosamente");
  };

  const handleStatusChange = (taskId: string, status: any) => {
    if (updateTask) {
      updateTask(taskId, { status });
    }

    const upperStatus = String(status).toUpperCase();
    if (upperStatus.includes("PROCESO") || upperStatus.includes("PROGRESS")) {
      toast.success("Tarea iniciada");
    } else if (
      upperStatus.includes("COMPLET") ||
      upperStatus.includes("TERMINA")
    ) {
      toast.success("¡Tarea completada! Buen trabajo");
    }
  };

  const handleTaskClick = (task: any) => {
    toast.info(`Tarea: ${task.title || task.nombre || "Sin título"}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mis Tareas</h1>
              <p className="text-sm text-gray-600">
                Bienvenido, {user?.name || (user as any)?.nombre || "Usuario"}
              </p>
            </div>
            <div className="flex gap-2">
              <div className="flex bg-gray-100 rounded-md p-1">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4 mr-2" />
                  Lista
                </Button>
                <Button
                  variant={viewMode === "calendar" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("calendar")}
                >
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Calendario
                </Button>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Contadores de mis tareas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <AlertCircle className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingTasks.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Proceso</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inProgressTasks.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completadas</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedTasks.length}</div>
            </CardContent>
          </Card>
        </div>

        {viewMode === "calendar" && (
          <TaskCalendar tasks={myTasks} onTaskClick={handleTaskClick} />
        )}

        {viewMode === "list" && (
          <div className="space-y-8">
            {/* SECCIÓN 1: MIS TAREAS ASIGNADAS */}
            <div>
              {myTasks.length === 0 ? (
                <Card className="border-dashed border-2">
                  <CardContent className="py-8 text-center">
                    <p className="text-gray-500">
                      No tienes tareas asignadas directamente a ti.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {pendingTasks.length > 0 && (
                    <div>
                      <h2 className="text-lg font-semibold text-gray-700 mb-3">
                        Mis Pendientes
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pendingTasks.map((task) => (
                          <TaskCard
                            key={task.id}
                            task={task}
                            onStatusChange={handleStatusChange}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {inProgressTasks.length > 0 && (
                    <div>
                      <h2 className="text-lg font-semibold text-blue-700 mb-3">
                        Mis Tareas en Proceso
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {inProgressTasks.map((task) => (
                          <TaskCard
                            key={task.id}
                            task={task}
                            onStatusChange={handleStatusChange}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {completedTasks.length > 0 && (
                    <div>
                      <h2 className="text-lg font-semibold text-green-700 mb-3">
                        Mis Completadas
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {completedTasks.map((task) => (
                          <TaskCard
                            key={task.id}
                            task={task}
                            onStatusChange={handleStatusChange}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* SECCIÓN 2: OTRAS TAREAS DEL HOGAR */}
            {householdTasks.length > 0 && (
              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-4 text-gray-700">
                  <Home className="w-5 h-5 text-indigo-500" />
                  <h2 className="text-xl font-bold">Otras tareas del Hogar</h2>
                  <Badge
                    variant="outline"
                    className="bg-indigo-50 text-indigo-700 border-indigo-200"
                  >
                    {householdTasks.length} disponibles
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {householdTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
