import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../contexts/TaskContext';
import { TaskCard } from '../components/TaskCard';
import { TaskCalendar } from '../components/TaskCalendar';
import { CreateTaskDialog } from '../components/CreateTaskDialog';
import { AssignTaskDialog } from '../components/AssignTaskDialog';
import { OverdueTasksReport } from '../components/OverdueTasksReport';
import { TaskDistributionReport } from '../components/TaskDistributionReport';
// HU-05: importar el panel de miembros
import { MembersPanel } from '../components/MembersPanel';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  LogOut,
  Plus,
  Clock,
  AlertCircle,
  Users,
  Calendar as CalendarIcon,
  List,
  BarChart3,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { tasks, addTask, deleteTask, assignTask } = useTasks();
  const navigate = useNavigate();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedTaskForAssign, setSelectedTaskForAssign] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [activeTab, setActiveTab] = useState<'tasks' | 'members' | 'reports'>(
    'tasks'
  );

  const pendingTasks = tasks.filter((t) => t.status === 'pending');
  const inProgressTasks = tasks.filter((t) => t.status === 'in-progress');
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const unassignedTasks = tasks.filter((t) => !t.assignedTo);

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Sesión cerrada exitosamente');
  };

  const handleCreateTask = (taskData: any) => {
    addTask(taskData);
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
    toast.success('Tarea eliminada exitosamente');
  };

  const handleAssignClick = (taskId: string, taskTitle: string) => {
    setSelectedTaskForAssign({ id: taskId, title: taskTitle });
    setIsAssignDialogOpen(true);
  };

  const handleAssignTask = (userId: string, userName: string) => {
    if (selectedTaskForAssign) {
      assignTask(selectedTaskForAssign.id, userId, userName);
    }
  };

  const handleTaskClick = (task: any) => {
    toast.info(`Tarea: ${task.title}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Panel de Administración
              </h1>
              <p className="text-sm text-gray-600">
                Bienvenido, {user?.name}
              </p>
            </div>
            <div className="flex gap-2">
              {/* Botón Nueva Tarea solo visible en pestaña de tareas */}
              {activeTab === 'tasks' && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Tarea
                </Button>
              )}
              {activeTab === 'tasks' && (
                <div className="flex bg-gray-100 rounded-md p-1">
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4 mr-2" />
                    Lista
                  </Button>
                  <Button
                    variant={viewMode === 'calendar' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('calendar')}
                  >
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    Calendario
                  </Button>
                </div>
              )}
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
        <Tabs
          value={activeTab}
          onValueChange={(v) =>
            setActiveTab(v as 'tasks' | 'members' | 'reports')
          }
          className="space-y-6"
        >
          <TabsList>
            <TabsTrigger value="tasks">
              <List className="w-4 h-4 mr-2" />
              Tareas
            </TabsTrigger>

            {/* HU-05: Nueva pestaña de Miembros */}
            <TabsTrigger value="members">
              <Users className="w-4 h-4 mr-2" />
              Miembros
            </TabsTrigger>

            <TabsTrigger value="reports">
              <BarChart3 className="w-4 h-4 mr-2" />
              Reportes
            </TabsTrigger>
          </TabsList>

          {/* ── PESTAÑA TAREAS ── */}
          <TabsContent value="tasks" className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Tareas
                  </CardTitle>
                  <AlertCircle className="h-4 w-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{tasks.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pendientes
                  </CardTitle>
                  <Clock className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {pendingTasks.length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    En Proceso
                  </CardTitle>
                  <Clock className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {inProgressTasks.length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Sin Asignar
                  </CardTitle>
                  <Users className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {unassignedTasks.length}
                  </div>
                </CardContent>
              </Card>
            </div>

            {viewMode === 'calendar' && (
              <TaskCalendar tasks={tasks} onTaskClick={handleTaskClick} />
            )}

            {viewMode === 'list' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasks.length === 0 ? (
                  <Card className="col-span-full">
                    <CardContent className="py-12 text-center">
                      <p className="text-gray-500 mb-4">
                        No hay tareas creadas
                      </p>
                      <Button onClick={() => setIsCreateDialogOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Crear primera tarea
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onDelete={handleDeleteTask}
                      onAssign={(id) => handleAssignClick(id, task.title)}
                      isAdmin
                    />
                  ))
                )}
              </div>
            )}
          </TabsContent>

          {/* ── PESTAÑA MIEMBROS (HU-05) ── */}
          <TabsContent value="members" className="space-y-6">
            <MembersPanel />
          </TabsContent>

          {/* ── PESTAÑA REPORTES ── */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <OverdueTasksReport tasks={tasks} />
              <TaskDistributionReport tasks={tasks} />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Dialogs */}
      <CreateTaskDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateTask={handleCreateTask}
        userId={user?.id || ''}
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
