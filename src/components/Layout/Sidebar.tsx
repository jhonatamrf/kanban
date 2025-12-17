// src/components/Layout/Sidebar.tsx
import React from 'react';
import styled from 'styled-components';
import { Icon } from '../UI/Icon';

const SidebarContainer = styled.aside<{ $isOpen: boolean }>`
  position: fixed;
  top: 64px;
  left: 0;
  bottom: 0;
  width: 250px;
  background: ${({ theme }) => theme.colors.background.paper};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  transform: translateX(${({ $isOpen }) => $isOpen ? '0' : '-100%'});
  transition: transform 0.3s ease, width 0.3s ease;
  z-index: 900;
  padding: 1.5rem;
  overflow-y: auto;

  @media (min-width: 1024px) {
    /* On desktop, keep visible but allow collapsing width */
    transform: translateX(0);
    width: ${({ $isOpen }) => $isOpen ? '250px' : '64px'};
    padding: ${({ $isOpen }) => $isOpen ? '1.5rem' : '0.5rem'};
  }
`;

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 800;
  opacity: ${({ $isOpen }) => $isOpen ? 1 : 0};
  visibility: ${({ $isOpen }) => $isOpen ? 'visible' : 'hidden'};
  transition: all 0.3s ease;

  @media (min-width: 1024px) {
    display: none;
  }
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3<{ $isOpen?: boolean }>`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;

  @media (min-width: 1024px) {
    font-size: ${({ $isOpen }) => $isOpen ? '0.875rem' : '0.75rem'};
  }
`;

const MenuItem = styled.button<{ $active: boolean; $isOpen?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  background: ${({ $active, theme }) => 
    $active ? theme.colors.primary.light + '20' : 'transparent'};
  color: ${({ $active, theme }) => 
    $active ? theme.colors.primary.main : theme.colors.text.primary};
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  font-size: 0.95rem;
  overflow: hidden;

  .icon { display: inline-flex; font-size: 1rem; }
  .label { display: inline-block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  &:hover {
    background: ${({ theme }) => theme.colors.background.default};
  }

  @media (min-width: 1024px) {
    justify-content: ${({ $isOpen }) => $isOpen ? 'flex-start' : 'center'};
    padding: ${({ $isOpen }) => $isOpen ? '0.75rem' : '0.5rem'};
    .label { display: ${({ $isOpen }) => $isOpen ? 'inline-block' : 'none'}; }
    .icon { font-size: ${({ $isOpen }) => $isOpen ? '1rem' : '1.25rem'}; }
  }
`;

const StatusItem = styled.div<{ $color: string; $isOpen?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ $isOpen }) => $isOpen ? '0.75rem' : '0.4rem'};
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border-radius: 6px;
  font-size: 0.9rem;

  &::before {
    content: '';
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${({ $color }) => $color};
  }

  .label { display: inline-block; }
  .count { margin-left: auto; color: #6B7280; }

  @media (min-width: 1024px) {
    padding: ${({ $isOpen }) => $isOpen ? '0.5rem' : '0.25rem'};
    font-size: ${({ $isOpen }) => $isOpen ? '0.9rem' : '0.78rem'};
    .label { display: ${({ $isOpen }) => $isOpen ? 'inline-block' : 'none'}; }
    .count { margin-left: ${({ $isOpen }) => $isOpen ? 'auto' : '0.25rem'}; }
  }
`;

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onViewChange: (view: 'kanban' | 'dashboard') => void;
  currentView: 'kanban' | 'dashboard';
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  onViewChange,
  currentView,
}) => {
  const statusItems = [
    { id: 'todo', label: 'A Fazer', color: '#3B82F6', count: 1 },
    { id: 'in_progress', label: 'Em Progresso', color: '#F59E0B', count: 1 },
    { id: 'overdue', label: 'Atrasado', color: '#EF4444', count: 4 },
    { id: 'completed', label: 'Concluído', color: '#10B981', count: 2 },
  ];

  const handleViewClick = (view: 'kanban' | 'dashboard') => {
    onViewChange(view);
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      onClose();
    }
  };

  const handleCloseIfMobile = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      <SidebarContainer $isOpen={isOpen}>
        <Section>
          <SectionTitle>Visões</SectionTitle>
          <MenuItem 
            $active={currentView === 'kanban'}
            $isOpen={isOpen}
            onClick={() => handleViewClick('kanban')}
          >
            <span className="icon"><Icon name="kanban" /></span>
            <span className="label">Quadro Kanban</span>
          </MenuItem>
          <MenuItem 
            $active={currentView === 'dashboard'}
            $isOpen={isOpen}
            onClick={() => handleViewClick('dashboard')}
          >
            <span className="icon"><Icon name="dashboard" /></span>
            <span className="label">Dashboard</span>
          </MenuItem>
        </Section>

        <Section>
          <SectionTitle $isOpen={isOpen}>{isOpen ? 'Filtros Rápidos' : 'Filtros'}</SectionTitle>
          <MenuItem $active={false} $isOpen={isOpen} onClick={handleCloseIfMobile}>
            <span className="icon"><Icon name="calendar" /></span>
            <span className="label">Hoje</span>
          </MenuItem>
          <MenuItem $active={false} $isOpen={isOpen} onClick={handleCloseIfMobile}>
            <span className="icon"><Icon name="warning" /></span>
            <span className="label">Atrasadas</span>
          </MenuItem>
          <MenuItem $active={false} $isOpen={isOpen} onClick={handleCloseIfMobile}>
            <span className="icon"><Icon name="user" /></span>
            <span className="label">Minhas Tarefas</span>
          </MenuItem>
        </Section>

        <Section>
          <SectionTitle $isOpen={isOpen}>{isOpen ? 'Status das Tarefas' : 'Tarefas'}</SectionTitle>
          {statusItems.map(item => (
            <StatusItem key={item.id} $color={item.color} $isOpen={isOpen}>
              <span className="label">{item.label}</span>
              <span className="count">{item.count}</span>
            </StatusItem>
          ))}
        </Section>
      </SidebarContainer>

      <Overlay 
        $isOpen={isOpen}
        onClick={onClose}
      />
    </>
  );
};