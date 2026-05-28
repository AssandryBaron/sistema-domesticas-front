import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTasks } from "../contexts/TaskContext";
import { TaskCard } from "../components/TaskCard";
import { CreateTaskDialog } from "../components/CreateTaskDialog";
import { AssignTaskDialog } from "../components/AssignTaskDialog";
import { OverdueTasksReport } from "../components/OverdueTasksReport";
import { TaskDistributionReport } from "../components/TaskDistributionReport";
import { MembersPanel } from "../components/MembersPanel";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  LogOut,
  Plus,
  Clock,
  AlertCircle,
  Users,
  List,
  BarChart3,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { hogarService } from "../services/hogarService";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const {
    tasks,
    deleteTask,
    assignTask,
    updateTaskStatus,
    refreshTasks,
    isLoading,
  } = useTasks();
  const navigate = useNavigate();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedTaskForAssign, setSelectedTaskForAssign] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<"tasks" | "members" | "reports">(
    "tasks",
  );

  // Estado local para los miembros de la familia
  const [familyMembers, setFamilyMembers] = useState<any[]>([]);

  // --- SINCRONIZACIÓN INICIAL ---
  useEffect(() => {
    refreshTasks();
  }, []);

  // Sincronizar miembros cuando el usuario esté cargado
  useEffect(() => {
    if (user && (user as any).id) {
      cargarMiembrosHogar(Number((user as any).id));
    }
  }, [user]);

  const cargarMiembrosHogar = async (uid: number) => {
    try {
      const response = await hogarService.obtenerMiembros(uid);
      if (response && Array.isArray(response)) {
        setFamilyMembers(response);
      } else if (response && response.data && Array.isArray(response.data)) {
        setFamilyMembers(response.data);
      }
    } catch (error) {
      console.log("Cargando lista alternativa de miembros...");
      if (user) {
        setFamilyMembers([user]);
      }
    }
  };

  // --- LÓGICA DE NORMALIZACIÓN Y FILTRADO ---
  const normalizedTasks = tasks.map((t: any) => {
    const rawStatus = String(t.status || t.estado || "pending").toLowerCase();
    let cleanStatus: "pending" | "in-progress" | "completed" = "pending";

    if (rawStatus.includes("proceso") || rawStatus.includes("progress")) {
      cleanStatus = "in-progress";
    } else if (rawStatus.includes("complet") || rawStatus.includes("termina")) {
      cleanStatus = "completed";
    }

    return {
      ...t,
      title: t.title || t.nombre || "Sin título",
      displayTitle: t.title || t.nombre || "Sin título",
      status: cleanStatus,
      isUnassigned: !t.assignedTo && !t.usuarioAsignadoId,
    };
  });

  const pendingTasks = normalizedTasks.filter((t) => t.status === "pending");
  const inProgressTasks = normalizedTasks.filter(
    (t) => t.status === "in-progress",
  );
  const unassignedTasks = normalizedTasks.filter((t) => t.isUnassigned);

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("Sesión cerrada exitosamente");
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId);
    toast.success("Tarea eliminada exitosamente");
  };

  const handleStatusChange = async (taskId: string, nuevoEstado: string) => {
    try {
      await updateTaskStatus(taskId, nuevoEstado);
      toast.success(`Estado de la tarea actualizado exitosamente`);
    } catch (error) {
      toast.error("No tienes permisos para modificar el estado de esta tarea");
    }
  };

  const handleAssignClick = (taskId: string, taskTitle: string) => {
    setSelectedTaskForAssign({ id: taskId, title: taskTitle });
    setIsAssignDialogOpen(true);
  };

  // Asignación rápida desde el dropdown estético de la tarjeta
  const handleDirectAssign = async (
    taskId: string,
    userId: string,
    userName?: string,
  ) => {
    try {
      await assignTask(taskId, userId);
      toast.success(`Tarea asignada a ${userName || "Miembro"}`);
      refreshTasks();
    } catch (error) {
      toast.error("Error al asignar el miembro");
    }
  };

  const handleAssignTask = async (userId: string, userName: string) => {
    if (selectedTaskForAssign) {
      await assignTask(selectedTaskForAssign.id, userId);
      setIsAssignDialogOpen(false);
      toast.success(`Tarea asignada a ${userName}`);
      refreshTasks();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Panel de Administración
              </h1>
              <p className="text-sm text-slate-500">
                Bienvenido,{" "}
                <span className="font-semibold text-indigo-600">
                  {(user as any)?.nombre ||
                    (user as any)?.name ||
                    "Administrador"}
                </span>
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nueva Tarea
              </Button>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-slate-600"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as any)}
          className="space-y-6"
        >
          <TabsList className="bg-white border border-slate-200">
            <TabsTrigger
              value="tasks"
              className="data-[state=active]:bg-slate-100"
            >
              <List className="w-4 h-4 mr-2" /> Tareas
            </TabsTrigger>
            <TabsTrigger
              value="members"
              className="data-[state=active]:bg-slate-100"
            >
              <Users className="w-4 h-4 mr-2" /> Miembros
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="data-[state=active]:bg-slate-100"
            >
              <BarChart3 className="w-4 h-4 mr-2" /> Reportes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-none shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-slate-500 text-xs font-bold uppercase">
                    Total
                  </CardTitle>
                  <AlertCircle className="text-slate-400 h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black">
                    {normalizedTasks.length}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs font-bold uppercase text-yellow-600">
                    Pendientes
                  </CardTitle>
                  <Clock className="text-yellow-500 h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black">
                    {pendingTasks.length}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs font-bold uppercase text-blue-600">
                    En Proceso
                  </CardTitle>
                  <Loader2
                    className={`h-4 w-4 text-blue-500 ${isLoading ? "animate-spin" : ""}`}
                  />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black">
                    {inProgressTasks.length}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs font-bold uppercase text-orange-600">
                    Sin Asignar
                  </CardTitle>
                  <Users className="text-orange-500 h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black">
                    {unassignedTasks.length}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Listado de Tareas */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="text-indigo-600 w-8 h-8 animate-spin mb-2" />
                <p className="text-slate-500 text-sm">Cargando tareas...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {normalizedTasks.length === 0 ? (
                  <Card className="col-span-full border-slate-300 border-dashed bg-transparent py-20 text-center">
                    <p className="text-slate-400">
                      No se encontraron tareas en el hogar.
                    </p>
                    <Button
                      variant="link"
                      onClick={() => refreshTasks()}
                      className="text-indigo-600 mt-2"
                    >
                      Reintentar conexión
                    </Button>
                  </Card>
                ) : (
                  normalizedTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onDelete={handleDeleteTask}
                      onStatusChange={handleStatusChange}
                      onAssign={handleDirectAssign}
                      members={familyMembers}
                      isAdmin
                    />
                  ))
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="members">
            <MembersPanel />
          </TabsContent>

          <TabsContent value="reports">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <OverdueTasksReport tasks={tasks} />
              <TaskDistributionReport tasks={tasks} />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* DIÁLOGOS */}
      <CreateTaskDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />

      {selectedTaskForAssign && (
        <AssignTaskDialog
          open={isAssignDialogOpen}
          onOpenChange={setIsAssignDialogOpen}
          onAssignTask={handleAssignTask}
          taskTitle={selectedTaskForAssign.title}
        />
      )}
    </div>
  );
}
