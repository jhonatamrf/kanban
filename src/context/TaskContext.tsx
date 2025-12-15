// src/context/TaskContext.tsx
import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Task, TaskStatus } from '../types/task';
import { mockTasks, mockColumns } from '../services/mockData';
import { checkOverdueTasks } from '../utils/taskUtils';

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  filterTasks: (filters: { status?: TaskStatus; responsible?: string; search?: string }) => Task[];
  getTaskById: (id: string) => Task | undefined;
  getTasksByStatus: (status: TaskStatus) => Task[];
  getOverdueTasks: () => Task[];
  searchTasks: (query: string) => Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    // Carregar tarefas do localStorage se existir
    const savedTasks = localStorage.getItem('kanban-tasks');
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        // Converter strings de data de volta para objetos Date
        return parsedTasks.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          dueDate: new Date(task.dueDate),
          updatedAt: new Date(task.updatedAt),
          completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
        }));
      } catch (error) {
        console.error('Erro ao carregar tarefas do localStorage:', error);
        return mockTasks;
      }
    }
    return mockTasks;
  });

  // Salvar tarefas no localStorage sempre que mudarem
  useEffect(() => {
    localStorage.setItem('kanban-tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Verificar tarefas atrasadas periodicamente
  useEffect(() => {
    const checkOverdue = () => {
      setTasks(prev => checkOverdueTasks(prev));
    };

    checkOverdue(); // Verificar imediatamente
    const interval = setInterval(checkOverdue, 60000); // Verificar a cada minuto

    return () => clearInterval(interval);
  }, []);

  const addTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTasks(prev => [...prev, newTask]);
    // Keep mock data in sync for runtime imports/tests
    try {
      mockTasks.push(newTask);
      // Recalculate mockColumns tasks
      mockColumns.forEach(col => {
        col.tasks = mockTasks.filter(task => task.status === col.id);
      });
    } catch (e) {
      // ignore if mock mutation is not allowed in some environments
    }
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, ...updates, updatedAt: new Date() }
        : task
    ));
    try {
      const idx = mockTasks.findIndex(t => t.id === id);
      if (idx >= 0) {
        mockTasks[idx] = { ...mockTasks[idx], ...updates, updatedAt: new Date() } as Task;
        mockColumns.forEach(col => {
          col.tasks = mockTasks.filter(task => task.status === col.id);
        });
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    try {
      const idx = mockTasks.findIndex(t => t.id === id);
      if (idx >= 0) mockTasks.splice(idx, 1);
      mockColumns.forEach(col => {
        col.tasks = mockTasks.filter(task => task.status === col.id);
      });
    } catch (e) {
      // ignore
    }
  }, []);

  const updateTaskStatus = useCallback((id: string, status: TaskStatus) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        const completedAt = status === 'completed' ? new Date() : task.completedAt;
        return { 
          ...task, 
          status, 
          completedAt,
          updatedAt: new Date() 
        };
      }
      return task;
    }));
    try {
      const idx = mockTasks.findIndex(t => t.id === id);
      if (idx >= 0) {
        mockTasks[idx] = {
          ...mockTasks[idx],
          status,
          completedAt: status === 'completed' ? new Date() : mockTasks[idx].completedAt,
          updatedAt: new Date(),
        } as Task;
        mockColumns.forEach(col => {
          col.tasks = mockTasks.filter(task => task.status === col.id);
        });
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const filterTasks = useCallback((filters: { status?: TaskStatus; responsible?: string; search?: string }) => {
    return tasks.filter(task => {
      if (filters.status && task.status !== filters.status) return false;
      if (filters.responsible && !task.responsible.name.toLowerCase().includes(filters.responsible.toLowerCase())) {
        return false;
      }
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

  const getTaskById = useCallback((id: string) => {
    return tasks.find(task => task.id === id);
  }, [tasks]);

  const getTasksByStatus = useCallback((status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  }, [tasks]);

  const getOverdueTasks = useCallback(() => {
    return tasks.filter(task => task.status === 'overdue');
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

  const value = {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    filterTasks,
    getTaskById,
    getTasksByStatus,
    getOverdueTasks,
    searchTasks,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};