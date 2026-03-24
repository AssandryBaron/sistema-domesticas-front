import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../contexts/TaskContext';
import { TaskCard } from '../components/TaskCard';
import { TaskCalendar } from '../components/TaskCalendar';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { LogOut, CheckCircle2, Clock, AlertCircle, Calendar as CalendarIcon, List } from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const { tasks, updateTask } = useTasks();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const myTasks = tasks.filter(task => task.assignedTo === user?.id);
  const pendingTasks = myTasks.filter(t => t.status === 'pending');
  const inProgressTasks = myTasks.filter(t => t.status === 'in-progress');
  const completedTasks = myTasks.filter(t => t.status === 'completed');

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Sesión cerrada exitosamente');
  };

  const handleStatusChange = (taskId: string, status: 'pending' | 'in-progress' | 'completed') => {
    updateTask(taskId, { status });
    
    if (status === 'in-progress') {
      toast.success('Tarea iniciada');
    } else if (status === 'completed') {
      toast.success('¡Tarea completada! Buen trabajo');
    }
  };

  const handleTaskClick = (task: any) => {
    toast.info(`Tarea: ${task.title}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mis Tareas</h1>
              <p className="text-sm text-gray-600">Bienvenido, {user?.name}</p>
            </div>
            <div className="flex gap-2">
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
        {/* Stats */}
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

        {/* Calendar View */}
        {viewMode === 'calendar' && (
          <TaskCalendar tasks={myTasks} onTaskClick={handleTaskClick} />
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <>
            {/* Tasks */}
            {myTasks.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-gray-500">No tienes tareas asignadas</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Pending Tasks */}
                {pendingTasks.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <h2 className="text-xl font-semibold">Pendientes</h2>
                      <Badge variant="secondary">{pendingTasks.length}</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {pendingTasks.map(task => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onStatusChange={handleStatusChange}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* In Progress Tasks */}
                {inProgressTasks.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <h2 className="text-xl font-semibold">En Proceso</h2>
                      <Badge variant="secondary">{inProgressTasks.length}</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {inProgressTasks.map(task => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onStatusChange={handleStatusChange}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Completed Tasks */}
                {completedTasks.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <h2 className="text-xl font-semibold">Completadas</h2>
                      <Badge variant="secondary">{completedTasks.length}</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {completedTasks.map(task => (
                        <TaskCard key={task.id} task={task} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}