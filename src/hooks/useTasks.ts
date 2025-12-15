// src/hooks/useTasks.ts
import { useState, useEffect, useCallback } from 'react';
import { Task, TaskStatus, Column } from '../types/task';
import { mockTasks, mockColumns } from '../services/mockData';
import { checkOverdueTasks, calculateDaysOverdue } from '../utils/taskUtils';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [columns, setColumns] = useState<Column[]>(mockColumns);
  const [loading, setLoading] = useState(false);

  // Verificar tarefas atrasadas periodicamente
  useEffect(() => {
    const checkTasks = () => {
      setTasks(prev => {
        const updatedTasks = checkOverdueTasks(prev);
        return updatedTasks;
      });
    };

    checkTasks(); // Verificar imediatamente
    const interval = setInterval(checkTasks, 60000); // Verificar a cada minuto

    return () => clearInterval(interval);
  }, []);

  // Atualizar colunas quando tarefas mudarem
  useEffect(() => {
    setColumns(prevColumns => 
      prevColumns.map(column => ({
        ...column,
        tasks: tasks.filter(task => task.status === column.id)
      }))
    );
  }, [tasks]);

  const updateTaskStatus = useCallback((taskId: string, newStatus: TaskStatus) => {
    setTasks(prev => {
      const updatedTasks = prev.map(task => {
        if (task.id === taskId) {
          const now = new Date();
          return {
            ...task,
            status: newStatus,
            completedAt: newStatus === 'completed' ? now : undefined,
            lastManualStatusChange: now,
            updatedAt: now,
          };
        }
        return task;
      });
      
      // Run overdue check but avoid overriding recently manually changed tasks
      return checkOverdueTasks(updatedTasks);
    });
  }, []);

  const updateTaskOrder = useCallback((taskId: string, newIndex: number, status: TaskStatus) => {
    setTasks(prev => {
      const task = prev.find(t => t.id === taskId);
      if (!task) return prev;

      const otherTasks = prev.filter(t => 
        t.id !== taskId && t.status === status
      );
      
      const updatedTask = { ...task, status, updatedAt: new Date() };
      
      const updatedTasks = [
        ...prev.filter(t => t.status !== status),
        ...otherTasks.slice(0, newIndex),
        updatedTask,
        ...otherTasks.slice(newIndex)
      ];
      
      return checkOverdueTasks(updatedTasks);
    });
  }, []);

  const addTask = useCallback((taskData: Partial<Task>) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: taskData.title!,
      description: taskData.description || '',
      status: taskData.status || 'todo',
      responsible: taskData.responsible!,
      createdAt: new Date(),
      dueDate: taskData.dueDate!,
      updatedAt: new Date(),
    };

    setTasks(prev => [...prev, newTask]);
    return newTask;
  }, []);

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setTasks(prev => {
      const updatedTasks = prev.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            ...updates,
            updatedAt: new Date(),
          };
        }
        return task;
      });
      
      return checkOverdueTasks(updatedTasks);
    });
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  }, []);

  const filterTasks = useCallback((filters: {
    status?: TaskStatus;
    responsible?: string;
    search?: string;
  }) => {
    return tasks.filter(task => {
      if (filters.status && task.status !== filters.status) return false;
      if (filters.responsible && !task.responsible.name.toLowerCase().includes(filters.responsible.toLowerCase())) return false;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!task.title.toLowerCase().includes(searchLower) && 
            !task.description.toLowerCase().includes(searchLower)) {
          return false;
        }
      }
      return true;
    });
  }, [tasks]);

  const sortTasks = useCallback((tasksToSort: Task[], sortBy: 'createdAt' | 'dueDate' = 'createdAt', order: 'asc' | 'desc' = 'asc') => {
    return [...tasksToSort].sort((a, b) => {
      const dateA = sortBy === 'createdAt' ? a.createdAt : a.dueDate;
      const dateB = sortBy === 'createdAt' ? b.createdAt : b.dueDate;
      
      if (order === 'asc') {
        return dateA.getTime() - dateB.getTime();
      } else {
        return dateB.getTime() - dateA.getTime();
      }
    });
  }, []);

  const getTaskById = useCallback((taskId: string) => {
    return tasks.find(task => task.id === taskId);
  }, [tasks]);

  const getTasksByStatus = useCallback((status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  }, [tasks]);

  const getOverdueTasks = useCallback(() => {
    return tasks.filter(task => task.status === 'overdue');
  }, [tasks]);

  const getTasksByResponsible = useCallback((responsibleName: string) => {
    return tasks.filter(task => 
      task.responsible.name.toLowerCase().includes(responsibleName.toLowerCase()) ||
      task.responsible.email.toLowerCase().includes(responsibleName.toLowerCase())
    );
  }, [tasks]);

  const searchTasks = useCallback((query: string) => {
    const searchLower = query.toLowerCase();
    return tasks.filter(task => 
      task.title.toLowerCase().includes(searchLower) ||
      task.description.toLowerCase().includes(searchLower) ||
      task.responsible.name.toLowerCase().includes(searchLower) ||
      task.responsible.email.toLowerCase().includes(searchLower)
    );
  }, [tasks]);

  return {
    tasks,
    columns,
    loading,
    updateTaskStatus,
    updateTaskOrder,
    addTask,
    updateTask,
    deleteTask,
    filterTasks,
    sortTasks,
    getTaskById,
    getTasksByStatus,
    getOverdueTasks,
    getTasksByResponsible,
    searchTasks,
  };
};