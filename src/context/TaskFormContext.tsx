import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Task } from '../types/task';
import { TaskFormModal } from '../components/TaskForm/TaskFormModal';

interface TaskFormContextType {
  openTaskForm: (task?: Task) => void;
  closeTaskForm: () => void;
  isOpen: boolean;
  task?: Task | null;
}

const TaskFormContext = createContext<TaskFormContextType | undefined>(undefined);

export const useTaskForm = () => {
  const ctx = useContext(TaskFormContext);
  if (!ctx) throw new Error('useTaskForm must be used within TaskFormProvider');
  return ctx;
};

export const TaskFormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [task, setTask] = useState<Task | null>(null);

  const openTaskForm = (t?: Task) => {
    setTask(t || null);
    setIsOpen(true);
  };

  const closeTaskForm = () => {
    setIsOpen(false);
    setTask(null);
  };

  return (
    <TaskFormContext.Provider value={{ openTaskForm, closeTaskForm, isOpen, task }}>
      {children}
      <TaskFormModal isOpen={isOpen} onClose={closeTaskForm} task={task ?? undefined} />
    </TaskFormContext.Provider>
  );
};

export default TaskFormContext;
