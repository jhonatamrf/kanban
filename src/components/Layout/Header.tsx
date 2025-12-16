// src/components/Layout/Header.tsx
import React from 'react';
import { useTaskForm } from '../../context/TaskFormContext';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: ${({ theme }) => theme.colors.background.paper};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  z-index: 1000;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.primary};
  padding: 0.5rem;
  border-radius: 4px;
  
  &:hover {
    background: ${({ theme }) => theme.colors.background.default};
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary.main};

  span {
    color: white;
    width: 32px;
    height: 32px;
    border-radius: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .logo {
    background: ${({ theme }) => theme.colors.primary.main};
    border-radius: 5px
  }

  .label {
    margin-left: 0.5rem;
    font-size: 1rem;
    color: inherit;
    line-height: 1;
  }

  @media (max-width: 768px) {
    .label { display: none; }
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ViewToggle = styled.div`
  display: flex;
  background: ${({ theme }) => theme.colors.background.default};
  border-radius: 8px;
  padding: 4px;
`;

const ViewButton = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  background: ${({ $active, theme }) => 
    $active ? theme.colors.primary.main : 'transparent'};
  color: ${({ $active, theme }) => 
    $active ? 'white' : theme.colors.text.primary};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ $active, theme }) => 
      $active ? theme.colors.primary.dark : theme.colors.border};
  }
`;

const AddButton = styled.button`
  background: ${({ theme }) => theme.colors.primary.main};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.primary.dark};
  }

  @media (max-width: 768px) {
    .label {
      display: none;
    }
    /* Square icon-only button on mobile */
    padding: 0;
    width: 36px;
    height: 36px;
    gap: 0;
    border-radius: 6px;
    justify-content: center;

    .icon {
      font-size: 1.25rem;
      line-height: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
    }
  }
`;

const LogoutButton = styled.button`
  background: ${({ theme }) => theme.colors.text.disabled};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.text.secondary};
  }

  @media (max-width: 768px) {
    .label {
      display: none;
    }
    /* Square icon-only button on mobile */
    padding: 0;
    width: 36px;
    height: 36px;
    gap: 0;
    border-radius: 6px;
    justify-content: center;

    .icon {
      font-size: 1.25rem;
      line-height: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
    }
  }
`;

const handleLogout = () => {
  if (window.confirm('Deseja sair do sistema?')) {
    window.location.href = '/';
  }
};

interface HeaderProps {
  onMenuClick: () => void;
  currentView: 'kanban' | 'dashboard';
  onViewChange: (view: 'kanban' | 'dashboard') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  currentView,
  onViewChange,
}) => {
  const { openTaskForm } = useTaskForm();
  return (
    <HeaderContainer>
      <LeftSection>
        <MenuButton onClick={onMenuClick}>
          ☰
        </MenuButton>
        <Logo>
          <span className='logo'>KB</span>
          <span className="label">Kanban Board</span>
        </Logo>
      </LeftSection>

      <RightSection>
        <ViewToggle>
          <ViewButton
            $active={currentView === 'kanban'}
            onClick={() => onViewChange('kanban')}
          >
            📋 Kanban
          </ViewButton>
          <ViewButton
            $active={currentView === 'dashboard'}
            onClick={() => onViewChange('dashboard')}
          >
            📊 Dashboard
          </ViewButton>
        </ViewToggle>

        <AddButton onClick={() => openTaskForm()}>
          <span className="icon">+</span>
          <span className="label">Nova Tarefa</span>
        </AddButton>

        <LogoutButton onClick={handleLogout}>
          <span className="icon">🚪</span>
          <span className="label">Sair</span>
        </LogoutButton>

      </RightSection>
    </HeaderContainer>
  );
};