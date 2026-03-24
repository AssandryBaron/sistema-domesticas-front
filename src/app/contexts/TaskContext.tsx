import React, { createContext, useContext, useState, ReactNode } from 'react';

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string | null; // user ID
  assignedToName?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  createdAt: string;
  createdBy: string;
}

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  assignTask: (taskId: string, userId: string, userName: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Tareas mock iniciales
const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Limpiar la cocina',
    description: 'Limpiar mesadas, lavar platos y barrer el piso',
    assignedTo: '2',
    assignedToName: 'Carlos Rodríguez',
    priority: 'high',
    status: 'pending',
    dueDate: '2026-03-18',
    createdAt: '2026-03-15',
    createdBy: '1',
  },
  {
    id: '2',
    title: 'Sacar la basura',
    description: 'Sacar todas las bolsas de basura y reciclaje',
    assignedTo: '3',
    assignedToName: 'María López',
    priority: 'medium',
    status: 'in-progress',
    dueDate: '2026-03-17',
    createdAt: '2026-03-15',
    createdBy: '1',
  },
  {
    id: '3',
    title: 'Limpiar baño',
    description: 'Limpiar inodoro, lavabo y ducha',
    assignedTo: '4',
    assignedToName: 'Juan Martínez',
    priority: 'high',
    status: 'completed',
    dueDate: '2026-03-16',
    createdAt: '2026-03-14',
    createdBy: '1',
  },
  {
    id: '4',
    title: 'Aspirar alfombras',
    description: 'Aspirar todas las alfombras de la sala y dormitorios',
    assignedTo: null,
    priority: 'low',
    status: 'pending',
    dueDate: '2026-03-20',
    createdAt: '2026-03-16',
    createdBy: '1',
  },
];

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev =>
      prev.map(task => (task.id === id ? { ...task, ...updates } : task))
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const assignTask = (taskId: string, userId: string, userName: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { ...task, assignedTo: userId, assignedToName: userName }
          : task
      )
    );
  };

  return (
    <TaskContext.Provider
      value={{ tasks, addTask, updateTask, deleteTask, assignTask }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
