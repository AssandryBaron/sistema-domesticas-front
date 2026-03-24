import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Task } from '../contexts/TaskContext';
import { useUsers } from '../contexts/AuthContext';
import { Users } from 'lucide-react';

interface TaskDistributionReportProps {
  tasks: Task[];
}

export function TaskDistributionReport({ tasks }: TaskDistributionReportProps) {
  const users = useUsers();

  // Calcular estadísticas por usuario
  const getUserStats = (userId: string) => {
    const userTasks = tasks.filter(task => task.assignedTo === userId);
    return {
      total: userTasks.length,
      pending: userTasks.filter(t => t.status === 'pending').length,
      inProgress: userTasks.filter(t => t.status === 'in-progress').length,
      completed: userTasks.filter(t => t.status === 'completed').length,
    };
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Filtrar solo usuarios que tienen tareas asignadas
  const usersWithTasks = users.filter(user => {
    const stats = getUserStats(user.id);
    return stats.total > 0;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-600" />
          Distribución de Tareas
        </CardTitle>
        <CardDescription>
          Cantidad de tareas asignadas a cada miembro
        </CardDescription>
      </CardHeader>
      <CardContent>
        {usersWithTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No hay tareas asignadas a ningún usuario</p>
          </div>
        ) : (
          <div className="space-y-3">
            {usersWithTasks.map(user => {
              const stats = getUserStats(user.id);
              return (
                <div key={user.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-medium">
                        {getInitials(user.name)}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-indigo-600">
                        {stats.total}
                      </p>
                      <p className="text-xs text-gray-600">
                        {stats.total === 1 ? 'tarea' : 'tareas'}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {stats.pending > 0 && (
                      <Badge variant="secondary">
                        {stats.pending} Pendiente{stats.pending !== 1 ? 's' : ''}
                      </Badge>
                    )}
                    {stats.inProgress > 0 && (
                      <Badge className="bg-blue-100 text-blue-800">
                        {stats.inProgress} En proceso
                      </Badge>
                    )}
                    {stats.completed > 0 && (
                      <Badge className="bg-green-100 text-green-800">
                        {stats.completed} Completada{stats.completed !== 1 ? 's' : ''}
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
