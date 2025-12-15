// src/components/Layout/Layout.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { KanbanBoard } from '../KanbanBoard/KanbanBoard';
import { Dashboard } from '../Dashboard/Dashboard';
import { TaskFormProvider } from '../../context/TaskFormContext';

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background.default};
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  padding-top: 64px; /* Altura do header */
`;

const ContentArea = styled.main<{ $sidebarOpen: boolean }>`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  transition: margin-left 0.3s ease;

  @media (max-width: 768px) {
    padding: 1rem;
  }

  @media (min-width: 1024px) {
    margin-left: ${({ $sidebarOpen }) => $sidebarOpen ? '250px' : '64px'};
  }
`;

export const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'kanban' | 'dashboard'>('kanban');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <LayoutContainer>
      <TaskFormProvider>
        <Header 
          onMenuClick={toggleSidebar}
          currentView={currentView}
          onViewChange={setCurrentView}
        />
      
      <MainContent>
        <Sidebar 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onViewChange={setCurrentView}
          currentView={currentView}
        />
        
        <ContentArea $sidebarOpen={sidebarOpen}>
          {currentView === 'kanban' ? <KanbanBoard /> : <Dashboard />}
        </ContentArea>
      </MainContent>
      </TaskFormProvider>
    </LayoutContainer>
  );
};