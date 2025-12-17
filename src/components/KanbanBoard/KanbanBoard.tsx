// src/components/KanbanBoard/KanbanBoard.tsx
import React, { useState } from 'react';
import { 
  DndContext, 
  DragEndEvent, 
  DragOverlay, 
  DragStartEvent,
  DragOverEvent,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { 
  SortableContext, 
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { useTasks } from '../../hooks/useTasks';
import { Column } from './Column';
import { TaskCard } from './TaskCard';
import { Task } from '../../types/task';
import styled from 'styled-components';
import { Icon } from '../UI/Icon';

const BoardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 1.5rem;
  min-height: calc(100vh - 200px);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: ${({ theme }) => theme.colors.background.paper};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 200px;
  padding: 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 0.95rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.main};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary.light}40;
  }

  @media (max-width: 768px) {
    display: none; /* hide inline search on small screens */
  }
`;

const SelectFilter = styled.select`
  padding: 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background: white;
  font-size: 0.95rem;
  min-width: 150px;
  cursor: pointer;

  @media (max-width: 768px) {
    display: none; /* hide inline selects on small screens */
  }
`;

const SortButton = styled.button<{ $active: boolean }>`
  padding: 0.75rem 1rem;
  border: 1px solid ${({ theme, $active }) => 
    $active ? theme.colors.primary.main : theme.colors.border};
  border-radius: 8px;
  background: ${({ theme, $active }) => 
    $active ? theme.colors.primary.light + '20' : 'white'};
  color: ${({ theme, $active }) => 
    $active ? theme.colors.primary.main : theme.colors.text.primary};
  font-size: 0.95rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary.main};
  }

  @media (max-width: 768px) {
    display: none; /* hide inline sort buttons on small screens */
  }
`;

const MobileFilterButton = styled.button`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.6rem 0.9rem;
    width: 100%;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    background: ${({ theme }) => theme.colors.background.default};
    cursor: pointer;
    font-size: 0.95rem;
  }
`;

const MobileSearchInput = styled(SearchInput)`
  @media (max-width: 768px) {
    display: block; /* override hidden inline SearchInput */
  }
`;

const MobileSelectFilter = styled(SelectFilter)`
  @media (max-width: 768px) {
    display: block; /* override hidden inline SelectFilter */
  }
`;

const MobileSortButton = styled(SortButton)`
  @media (max-width: 768px) {
    display: inline-flex; /* override hidden inline SortButton */
  }
`;

const MobileFiltersInline = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;
    padding: 0.75rem;
    background: ${({ theme }) => theme.colors.background.paper};
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    box-shadow: ${({ theme }) => theme.shadows.small};
  }
`;

const MobileFiltersInlineHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  h3 { margin: 0; font-size: 0.95rem; }
  button { background: none; border: none; font-size: 1.25rem; cursor: pointer; }
`;

export const KanbanBoard: React.FC = () => {
  const { tasks, columns, updateTaskStatus, updateTaskOrder } = useTasks();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [responsibleFilter, setResponsibleFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'createdAt' | 'dueDate'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const taskId = event.active.id as string;
    const task = tasks.find(t => t.id === taskId);
    setActiveTask(task || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === 'Task';
    const isOverAColumn = over.data.current?.type === 'Column';
    const isOverATask = over.data.current?.type === 'Task';

    if (isActiveATask && isOverAColumn) {
      updateTaskStatus(activeId, overId as any);
    }

    if (isActiveATask && isOverATask) {
      const overTask = tasks.find(t => t.id === overId);
      if (overTask) {
        updateTaskStatus(activeId, overTask.status);
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveTask(null);
      return;
    }

    const taskId = active.id as string;
    const overId = over.id as string;

    if (active.data.current?.type === 'Task' && over.data.current?.type === 'Task') {
      const activeTask = tasks.find(t => t.id === taskId);
      const overTask = tasks.find(t => t.id === overId);
      
      if (activeTask && overTask && activeTask.status === overTask.status) {
        // Reordenar dentro da mesma coluna
        const columnTasks = tasks.filter(t => t.status === activeTask.status);
        const oldIndex = columnTasks.findIndex(t => t.id === taskId);
        const newIndex = columnTasks.findIndex(t => t.id === overId);
        
        if (oldIndex !== newIndex) {
          updateTaskOrder(taskId, newIndex, activeTask.status);
        }
      }
    }

    setActiveTask(null);
  };

  const filteredTasks = tasks.filter(task => {
    if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !task.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (statusFilter !== 'all' && task.status !== statusFilter) return false;
    if (responsibleFilter !== 'all' && task.responsible.name !== responsibleFilter) return false;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const dateA = sortBy === 'createdAt' ? a.createdAt : a.dueDate;
    const dateB = sortBy === 'createdAt' ? b.createdAt : b.dueDate;
    
    if (sortOrder === 'asc') {
      return dateA.getTime() - dateB.getTime();
    } else {
      return dateB.getTime() - dateA.getTime();
    }
  });

  const uniqueResponsibles = Array.from(
    new Set(tasks.map(task => task.responsible.name))
  );
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const closeMobileFilters = () => setShowMobileFilters(false);

  return (
    <>
      <FiltersContainer>
        <MobileFilterButton onClick={() => setShowMobileFilters(true)}>
          ⚙️ Opções de filtro
        </MobileFilterButton>

        <SearchInput
          type="text"
          placeholder="Buscar por título ou descrição..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <SelectFilter
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Todos os Status</option>
          <option value="todo">A Fazer</option>
          <option value="in_progress">Em Progresso</option>
          <option value="overdue">Atrasado</option>
          <option value="completed">Concluído</option>
        </SelectFilter>

        <SelectFilter
          value={responsibleFilter}
          onChange={(e) => setResponsibleFilter(e.target.value)}
        >
          <option value="all">Todos os Responsáveis</option>
          {uniqueResponsibles.map(responsible => (
            <option key={responsible} value={responsible}>
              {responsible}
            </option>
          ))}
        </SelectFilter>

        <SortButton
          $active={sortBy === 'createdAt'}
          onClick={() => {
            setSortBy('createdAt');
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
          }}
        >
          {sortOrder === 'asc' ? '↑' : '↓'} Data Criação
        </SortButton>

        <SortButton
          $active={sortBy === 'dueDate'}
          onClick={() => {
            setSortBy('dueDate');
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
          }}
        >
          {sortOrder === 'asc' ? '↑' : '↓'} Data Limite
        </SortButton>

        {showMobileFilters && (
          <MobileFiltersInline>
            <MobileFiltersInlineHeader>
              <h3>Opções de filtro</h3>
              <button onClick={closeMobileFilters}>×</button>
            </MobileFiltersInlineHeader>

            <MobileSearchInput
              type="text"
              placeholder="Buscar por título ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <MobileSelectFilter
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos os Status</option>
              <option value="todo">A Fazer</option>
              <option value="in_progress">Em Progresso</option>
              <option value="overdue">Atrasado</option>
              <option value="completed">Concluído</option>
            </MobileSelectFilter>

            <MobileSelectFilter
              value={responsibleFilter}
              onChange={(e) => setResponsibleFilter(e.target.value)}
            >
              <option value="all">Todos os Responsáveis</option>
              {uniqueResponsibles.map(responsible => (
                <option key={responsible} value={responsible}>
                  {responsible}
                </option>
              ))}
            </MobileSelectFilter>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <MobileSortButton
                $active={sortBy === 'createdAt'}
                onClick={() => {
                  setSortBy('createdAt');
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                }}
              >
                {sortOrder === 'asc' ? '↑' : '↓'} Data Criação
              </MobileSortButton>

              <MobileSortButton
                $active={sortBy === 'dueDate'}
                onClick={() => {
                  setSortBy('dueDate');
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                }}
              >
                {sortOrder === 'asc' ? '↑' : '↓'} Data Limite
              </MobileSortButton>
+            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.25rem' }}>
              <SortButton $active={false} onClick={() => { setSearchTerm(''); setStatusFilter('all'); setResponsibleFilter('all'); }}>
                Limpar
              </SortButton>
              <SortButton $active={true} onClick={closeMobileFilters}>
                Aplicar
              </SortButton>
            </div>
          </MobileFiltersInline>
        )}
      </FiltersContainer>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <BoardContainer>
          {columns.map(column => {
            const columnTasks = sortedTasks.filter(task => task.status === column.id);
            return (
              <Column
                key={column.id}
                column={column}
                tasks={columnTasks}
              />
            );
          })}
        </BoardContainer>

        <DragOverlay>
          {activeTask && (
            <TaskCard
              task={activeTask}
              isDragging
            />
          )}
        </DragOverlay>
      </DndContext>
    </>
  );
};