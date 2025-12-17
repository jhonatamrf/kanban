// src/components/KanbanBoard/Column.tsx
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Column as ColumnType, Task } from '../../types/task';
import { TaskCard } from './TaskCard';
import styled from 'styled-components';
import { Icon } from '../UI/Icon';

// Utility to choose readable text color based on background
const getContrastingColor = (hex: string) => {
  if (!hex) return '#111827';
  const sanitized = hex.replace('#', '');
  const bigint = parseInt(sanitized.length === 3 ? sanitized.split('').map(c => c + c).join('') : sanitized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? '#111827' : '#ffffff';
};

const ColumnContainer = styled.div<{ $color: string }>`
  background: ${({ theme }) => theme.colors.background.paper};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 300px);
  overflow: hidden;
`;

const ColumnHeader = styled.div<{ $color?: string }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 52px;
  margin: -1.5rem -1.5rem 1.5rem -1.5rem;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ $color }) => $color || 'transparent'};
  /* When header has a custom color, force white text for better contrast */
  color: ${({ $color }) => ($color ? '#ffffff' : 'inherit')};
  border-top-left-radius: ${({ theme }) => theme.borderRadius.large};
  border-top-right-radius: ${({ theme }) => theme.borderRadius.large};
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
`;

const ColumnTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: inherit;
  margin: 0;
`;

const TaskCount = styled.div<{ $onHeader?: boolean }>`
  background: ${({ $onHeader, theme }) => $onHeader ? 'rgba(255,255,255,0.12)' : theme.colors.background.default};
  color: ${({ $onHeader }) => $onHeader ? 'inherit' : undefined};
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
`;

const WipLimit = styled.div<{ $exceeded: boolean; $inHeader?: boolean }>`
  font-size: 0.75rem;
  color: #ffffff;
  margin: 0 0 0 0.5rem;
`;

const TasksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  padding-right: 0.5rem;
  flex: 1;

  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background.default};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.text.secondary};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-style: italic;
  background: ${({ theme }) => theme.colors.background.default};
  border-radius: 8px;
  border: 2px dashed ${({ theme }) => theme.colors.border};
`;

const WarningIcon = styled.span`
  margin-left: 4px;
  display: inline-flex;
  align-items: center;
`;

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
}

export const Column: React.FC<ColumnProps> = ({ column, tasks }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
  });

  const isWipExceeded = typeof column.wipLimit === 'number' && tasks.length > column.wipLimit;

  return (
    <ColumnContainer
      ref={setNodeRef}
      $color={column.color}
      style={{
        backgroundColor: isOver ? 'rgba(0, 0, 0, 0.02)' : undefined,
      }}
    >
      <ColumnHeader $color={column.color}>
        <HeaderLeft>
          <ColumnTitle>{column.title}</ColumnTitle>
          {column.wipLimit && (
            <WipLimit $exceeded={isWipExceeded} $inHeader={!!column.color}>
              WIP: {tasks.length}/{column.wipLimit}
              {isWipExceeded && (
                <WarningIcon>
                  <Icon name="warning" />
                </WarningIcon>
              )}
            </WipLimit>
          )}
        </HeaderLeft>
        <TaskCount $onHeader={!!column.color}>{tasks.length}</TaskCount>
      </ColumnHeader>
      
      <SortableContext
        items={tasks.map(task => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <TasksContainer>
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
            />
          ))}
          {tasks.length === 0 && (
            <EmptyState>
              Arraste tarefas para cá
            </EmptyState>
          )}
        </TasksContainer>
      </SortableContext>
    </ColumnContainer>
  );
};