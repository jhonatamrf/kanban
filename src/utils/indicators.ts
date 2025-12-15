// src/utils/indicators.ts
import { Task } from '../types/task';
import { isSameDay, getStartOfWeek } from './taskUtils';

export const calculateCompletionRate = (tasks: Task[]) => {
  const today = new Date();
  const startOfWeek = getStartOfWeek(today);
  
  const completedToday = tasks.filter(task => 
    task.status === 'completed' && 
    task.completedAt && 
    isSameDay(task.completedAt, today)
  ).length;
  
  const completedThisWeek = tasks.filter(task => 
    task.status === 'completed' && 
    task.completedAt && 
    task.completedAt >= startOfWeek
  ).length;
  
  const totalCompleted = tasks.filter(task => task.status === 'completed').length;
  
  return {
    today: tasks.length > 0 ? Math.round((completedToday / tasks.length) * 100) : 0,
    week: tasks.length > 0 ? Math.round((completedThisWeek / tasks.length) * 100) : 0,
    total: tasks.length > 0 ? Math.round((totalCompleted / tasks.length) * 100) : 0,
  };
};

export const calculateAverageCompletionTime = (tasks: Task[]): number => {
  const completedTasks = tasks.filter(task => 
    task.status === 'completed' && task.completedAt
  );
  
  if (completedTasks.length === 0) return 0;
  
  const totalDays = completedTasks.reduce((sum, task) => {
    const completionTime = task.completedAt!.getTime() - task.createdAt.getTime();
    return sum + Math.ceil(completionTime / (1000 * 60 * 60 * 24));
  }, 0);
  
  return Math.round(totalDays / completedTasks.length);
};

export const getOverdueRate = (tasks: Task[]): number => {
  const overdueTasks = tasks.filter(task => task.status === 'overdue').length;
  return tasks.length > 0 ? Math.round((overdueTasks / tasks.length) * 100) : 0;
};

export const getInProgressRate = (tasks: Task[]): number => {
  const inProgressTasks = tasks.filter(task => task.status === 'in_progress').length;
  return tasks.length > 0 ? Math.round((inProgressTasks / tasks.length) * 100) : 0;
};

export const getTasksByDayOfWeek = (tasks: Task[]) => {
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const result = days.map(day => ({ day, value: 0 }));
  
  tasks.forEach(task => {
    if (task.completedAt) {
      const dayIndex = task.completedAt.getDay();
      result[dayIndex].value++;
    }
  });
  
  return result;
};

export const getProductivityMetrics = (tasks: Task[]) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const overdueTasks = tasks.filter(t => t.status === 'overdue').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
  
  return {
    completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
    overdueRate: totalTasks > 0 ? (overdueTasks / totalTasks) * 100 : 0,
    efficiency: completedTasks > 0 ? (completedTasks / (completedTasks + overdueTasks)) * 100 : 0,
    workload: inProgressTasks,
  };
};