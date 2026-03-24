import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Task, TaskPriority, TaskStatus } from '../contexts/TaskContext';
import { Calendar, User, Trash2, UserPlus, CheckCircle2, Clock } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onDelete?: (id: string) => void;
  onAssign?: (id: string) => void;
  onStatusChange?: (id: string, status: TaskStatus) => void;
  isAdmin?: boolean;
}

const priorityConfig: Record<TaskPriority, { label: string; className: string }> = {
  low: { label: 'Baja', className: 'bg-blue-100 text-blue-800' },
  medium: { label: 'Media', className: 'bg-yellow-100 text-yellow-800' },
  high: { label: 'Alta', className: 'bg-red-100 text-red-800' },
};

const statusConfig: Record<TaskStatus, { label: string; className: string; icon: React.ReactNode }> = {
  pending: { 
    label: 'Pendiente', 
    className: 'bg-gray-100 text-gray-800',
    icon: <Clock className="w-3 h-3" />
  },
  'in-progress': { 
    label: 'En Proceso', 
    className: 'bg-blue-100 text-blue-800',
    icon: <Clock className="w-3 h-3" />
  },
  completed: { 
    label: 'Completada', 
    className: 'bg-green-100 text-green-800',
    icon: <CheckCircle2 className="w-3 h-3" />
  },
};

export function TaskCard({ task, onDelete, onAssign, onStatusChange, isAdmin }: TaskCardProps) {
  const priority = priorityConfig[task.priority];
  const status = statusConfig[task.status];

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg">{task.title}</CardTitle>
          <div className="flex gap-2">
            <Badge className={priority.className}>
              {priority.label}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">{task.description}</p>
        
        <div className="flex flex-wrap gap-3 text-sm">
          <div className="flex items-center gap-1.5 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{new Date(task.dueDate).toLocaleDateString('es-ES')}</span>
          </div>
          
          {task.assignedToName && (
            <div className="flex items-center gap-1.5 text-gray-600">
              <User className="w-4 h-4" />
              <span>{task.assignedToName}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Badge className={status.className}>
            <span className="flex items-center gap-1">
              {status.icon}
              {status.label}
            </span>
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {!isAdmin && onStatusChange && task.status !== 'completed' && (
            <>
              {task.status === 'pending' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onStatusChange(task.id, 'in-progress')}
                >
                  Iniciar
                </Button>
              )}
              {task.status === 'in-progress' && (
                <Button
                  size="sm"
                  onClick={() => onStatusChange(task.id, 'completed')}
                >
                  Completar
                </Button>
              )}
            </>
          )}

          {isAdmin && (
            <>
              {!task.assignedTo && onAssign && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onAssign(task.id)}
                >
                  <UserPlus className="w-4 h-4 mr-1" />
                  Asignar
                </Button>
              )}
              {onDelete && (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => onDelete(task.id)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Eliminar
                </Button>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
