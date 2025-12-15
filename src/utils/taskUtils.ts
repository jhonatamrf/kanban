// src/utils/taskUtils.ts
import { Task } from '../types/task';

export const checkOverdueTasks = (tasks: Task[]): Task[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const now = new Date();

  return tasks.map(task => {
    if (task.status === 'completed') return task;

    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    // If task was manually moved recently, don't override its status
    if (task.lastManualStatusChange) {
      const diff = now.getTime() - new Date(task.lastManualStatusChange).getTime();
      const threshold = 5 * 60 * 1000; // 5 minutes
      if (diff < threshold) return task;
    }

    if (dueDate < today) {
      return {
        ...task,
        status: 'overdue',
        updatedAt: new Date(),
      };
    }

    return task;
  });
};

export const calculateDaysOverdue = (dueDate: Date): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays < 0 ? Math.abs(diffDays) : 0;
};

export const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear();
};

export const getStartOfWeek = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
};