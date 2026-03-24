import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Task } from '../contexts/TaskContext';
import { AlertCircle, Calendar } from 'lucide-react';

interface OverdueTasksReportProps {
  tasks: Task[];
}

export function OverdueTasksReport({ tasks }: OverdueTasksReportProps) {
  // Calcular tareas vencidas
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const overdueTasks = tasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return task.status !== 'completed' && dueDate < today;
  });

  const getDaysOverdue = (dueDate: string) => {
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    const diff = Math.floor((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          Tareas Vencidas
        </CardTitle>
        <CardDescription>
          Tareas que han pasado su fecha de vencimiento
        </CardDescription>
      </CardHeader>
      <CardContent>
        {overdueTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No hay tareas vencidas</p>
          </div>
        ) : (
          <div className="space-y-3">
            {overdueTasks.map(task => {
              const daysOverdue = getDaysOverdue(task.dueDate);
              return (
                <div
                  key={task.id}
                  className="p-4 border rounded-lg bg-red-50 border-red-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-red-900">{task.title}</h3>
                      {task.assignedToName && (
                        <p className="text-sm text-red-700 mt-1">
                          Asignado a: {task.assignedToName}
                        </p>
                      )}
                      {!task.assignedTo && (
                        <p className="text-sm text-red-700 mt-1">
                          Sin asignar
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge
                          className={
                            task.priority === 'high'
                              ? 'bg-red-100 text-red-800'
                              : task.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                          }
                        >
                          {task.priority === 'high'
                            ? 'Alta'
                            : task.priority === 'medium'
                            ? 'Media'
                            : 'Baja'}{' '}
                          prioridad
                        </Badge>
                        <span className="text-xs text-red-600">
                          Vencida hace {daysOverdue} {daysOverdue === 1 ? 'día' : 'días'}
                        </span>
                      </div>
                    </div>
                    <Calendar className="w-5 h-5 text-red-600" />
                  </div>
                </div>
              );
            })}
            <div className="mt-4 p-3 bg-gray-50 rounded-md text-center">
              <p className="text-sm text-gray-600">
                Total:{' '}
                <span className="font-bold text-red-600">
                  {overdueTasks.length} {overdueTasks.length === 1 ? 'tarea vencida' : 'tareas vencidas'}
                </span>
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
