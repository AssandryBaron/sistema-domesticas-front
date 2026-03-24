import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Task } from '../contexts/TaskContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TaskCalendarProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export function TaskCalendar({ tasks, onTaskClick }: TaskCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 16)); // March 16, 2026

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of month and total days
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Generate calendar days
  const calendarDays: (number | null)[] = [];
  
  // Previous month days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    calendarDays.push(-(daysInPrevMonth - i));
  }
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }
  
  // Next month days to complete the grid
  const remainingDays = 42 - calendarDays.length;
  for (let i = 1; i <= remainingDays; i++) {
    calendarDays.push(-(i + 100)); // negative with offset to distinguish from prev month
  }

  // Get tasks for a specific date
  const getTasksForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return tasks.filter(task => task.dueDate === dateStr);
  };

  // Navigation
  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date(2026, 2, 16));
  };

  const isToday = (day: number) => {
    const today = new Date(2026, 2, 16);
    return day === today.getDate() && 
           month === today.getMonth() && 
           year === today.getFullYear();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Calendario de Tareas</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToToday}>
              Hoy
            </Button>
            <Button variant="outline" size="icon" onClick={goToPrevMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium min-w-[140px] text-center">
              {MONTHS[month]} {year}
            </span>
            <Button variant="outline" size="icon" onClick={goToNextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* Days header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map(day => (
              <div
                key={day}
                className="text-center text-sm font-medium text-gray-600 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              const isCurrentMonth = day !== null && day > 0;
              const actualDay = Math.abs(day || 0) % 100;
              const dayTasks = isCurrentMonth ? getTasksForDate(day) : [];
              const isCurrentDay = isCurrentMonth && isToday(day);

              return (
                <div
                  key={index}
                  className={`
                    min-h-[100px] p-2 border rounded-md
                    ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
                    ${isCurrentDay ? 'ring-2 ring-indigo-500 bg-indigo-50' : ''}
                    hover:shadow-md transition-shadow
                  `}
                >
                  <div className={`
                    text-sm font-medium mb-1
                    ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                    ${isCurrentDay ? 'text-indigo-700' : ''}
                  `}>
                    {actualDay}
                  </div>
                  
                  {isCurrentMonth && dayTasks.length > 0 && (
                    <div className="space-y-1">
                      {dayTasks.slice(0, 2).map(task => (
                        <div
                          key={task.id}
                          onClick={() => onTaskClick?.(task)}
                          className="cursor-pointer"
                        >
                          <div
                            className={`
                              text-xs p-1 rounded truncate
                              ${task.priority === 'high' ? 'bg-red-100 text-red-800' : ''}
                              ${task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : ''}
                              ${task.priority === 'low' ? 'bg-blue-100 text-blue-800' : ''}
                              ${task.status === 'completed' ? 'opacity-60 line-through' : ''}
                            `}
                            title={task.title}
                          >
                            {task.title}
                          </div>
                        </div>
                      ))}
                      {dayTasks.length > 2 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{dayTasks.length - 2} más
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 pt-4 border-t mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-100"></div>
              <span className="text-xs text-gray-600">Alta prioridad</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-yellow-100"></div>
              <span className="text-xs text-gray-600">Media prioridad</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-100"></div>
              <span className="text-xs text-gray-600">Baja prioridad</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
