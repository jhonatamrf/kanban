// types/task.ts
export type TaskStatus = 'todo' | 'in_progress' | 'overdue' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  responsible: {
    name: string;
    email: string;
  };
  createdAt: Date;
  completedAt?: Date;
  lastManualStatusChange?: Date;
  dueDate: Date;
  updatedAt: Date;
}

export interface Column {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  wipLimit?: number;
  color: string;
}