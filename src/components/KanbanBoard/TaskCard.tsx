// src/components/KanbanBoard/TaskCard.tsx
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task, TaskStatus } from '../../types/task';
import { formatDate, calculateDaysOverdue } from '../../utils/taskUtils';
import { useTaskForm } from '../../context/TaskFormContext';
import styled from 'styled-components';

const STATUS_COLOR: Record<TaskStatus, string> = {
  todo: '#3B82F6',
  in_progress: '#F59E0B',
  overdue: '#EF4444',
  completed: '#10B981',
};

const CardContainer = styled.div<{
  $isOverdue: boolean;
  $isDragging: boolean;
  $status: TaskStatus;
}>`
  background: ${({ theme }) => theme.colors.background.paper};
  border-radius: 8px;
  padding: 1.25rem;
  box-shadow: ${({ theme, $isDragging }) => 
    $isDragging ? theme.shadows.large : theme.shadows.small};
  /* Top, right and bottom borders use light gray from theme; left border is status color */
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  border-left: 4px solid ${({ $status, theme }) => STATUS_COLOR[$status] || theme.colors.border};
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.medium};
    transform: translateY(-2px);
  }

  opacity: ${({ $isDragging }) => $isDragging ? 0.5 : 1};
`;

const TaskHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  gap: 0.5rem;
`;

const TaskTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 0.5rem 0;
  flex: 1;
`;

const TaskDescription = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0 0 1rem 0;
  line-height: 1.4;
  word-break: break-word;
`;

const TaskMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const Badge = styled.span<{ $type: 'responsible' | 'date' | 'overdue' | 'completed' }>`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  background: ${({ theme, $type }) => {
    switch ($type) {
      case 'responsible': return theme.colors.text.disabled + '20';
      case 'date': return theme.colors.infoLight + '40';
      case 'overdue': return theme.colors.error + '20';
      case 'completed': return theme.colors.success + '20';
      default: return theme.colors.background.default;
    }
  }};
  color: ${({ theme, $type }) => {
    switch ($type) {
      case 'responsible': return theme.colors.text.secondary;
      case 'date': return theme.colors.info;
      case 'overdue': return theme.colors.error;
      case 'completed': return theme.colors.success;
      default: return theme.colors.text.primary;
    }
  }};
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const DragHandle = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  color: ${({ theme }) => theme.colors.text.secondary};
  opacity: 0.5;
  
  &:hover {
    opacity: 1;
  }
  
  &:active {
    cursor: grabbing;
  }
  
  &::before {
    content: '⋮⋮';
    font-size: 1rem;
    line-height: 0.5;
  }
`;

const EditButton = styled.button`
  background: none;
  border: none;
  font-size: 0.95rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.secondary};
  padding: 0.25rem 0.5rem;
  border-radius: 6px;

  &:hover {
    background: ${({ theme }) => theme.colors.background.default};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const StatusIndicator = styled.div<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  margin-right: 0.5rem;
`;

const DateInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.25rem;
`;

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, isDragging = false }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ 
    id: task.id,
    data: {
      type: 'Task',
      task,
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isOverdue = calculateDaysOverdue(task.dueDate) > 0 && task.status !== 'completed';
  const daysOverdue = calculateDaysOverdue(task.dueDate);
  const { openTaskForm } = useTaskForm();

  return (
    <CardContainer
      ref={setNodeRef}
      style={style}
      $isOverdue={isOverdue}
      $isDragging={isDragging}
      $status={task.status}
    >
      <TaskHeader>
        <div style={{ flex: 1 }}>
          <TaskTitle>{task.title}</TaskTitle>
          {isOverdue && (
            <Badge $type="overdue">
              ⚠️ {daysOverdue} dia{daysOverdue > 1 ? 's' : ''} de atraso
            </Badge>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <EditButton onClick={() => openTaskForm(task)} title="Editar tarefa">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </EditButton>
          <DragHandle {...attributes} {...listeners} />
        </div>
      </TaskHeader>
      
      <TaskDescription>
        {task.description.length > 100 
          ? `${task.description.substring(0, 100)}...` 
          : task.description}
      </TaskDescription>
      
      <TaskMeta>
        <Badge $type="responsible">
          👤 {task.responsible.name}
        </Badge>
        
        <Badge $type="date">
          📅 Vence: {formatDate(task.dueDate)}
        </Badge>
        
        {task.completedAt && (
          <Badge $type="completed">
            ✅ Concluída: {formatDate(task.completedAt)}
          </Badge>
        )}
        
        <DateInfo>
          <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>
            Criada: {formatDate(task.createdAt)}
          </span>
        </DateInfo>
      </TaskMeta>
    </CardContainer>
  );
};