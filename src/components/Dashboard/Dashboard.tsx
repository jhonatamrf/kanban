// src/components/Dashboard/Dashboard.tsx
import React from 'react';
import { useTaskContext } from '../../context/TaskContext';
import { StatCard } from './StatCard';
import { ChartComponent } from './ChartComponent';
import { calculateCompletionRate, calculateAverageCompletionTime } from '../../utils/indicators';
import styled from 'styled-components';
import { Icon } from '../UI/Icon';

const DashboardContainer = styled.div`
  padding: 2rem;
  background: ${({ theme }) => theme.colors.background.default};
  min-height: calc(100vh - 64px);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 1.5rem;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

export const Dashboard: React.FC = () => {
  const { tasks } = useTaskContext();

  const tasksByStatus = [
    { status: 'A Fazer', count: tasks.filter(t => t.status === 'todo').length, color: '#3B82F6' },
    { status: 'Em Progresso', count: tasks.filter(t => t.status === 'in_progress').length, color: '#F59E0B' },
    { status: 'Atrasado', count: tasks.filter(t => t.status === 'overdue').length, color: '#EF4444' },
    { status: 'Concluído', count: tasks.filter(t => t.status === 'completed').length, color: '#10B981' },
  ];

  const completionRate = calculateCompletionRate(tasks);
  const averageCompletionTime = calculateAverageCompletionTime(tasks);
  
  const overdueTasks = tasks.filter(t => t.status === 'overdue').length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 ? Math.round((tasks.filter(t => t.status === 'completed').length / totalTasks) * 100) : 0;

  // Dados para o gráfico de conclusões por dia
  const completionByDay = [
    { day: 'Seg', value: 12 },
    { day: 'Ter', value: 19 },
    { day: 'Qua', value: 8 },
    { day: 'Qui', value: 15 },
    { day: 'Sex', value: 10 },
  ];

  // Dados para o gráfico de responsáveis
  const tasksByResponsible = Array.from(
    new Map(
      tasks.map(task => [
        task.responsible.name,
        {
          label: task.responsible.name,
          count: tasks.filter(t => t.responsible.name === task.responsible.name).length,
          color: getColorForResponsible(task.responsible.name)
        }
      ])
    ).values()
  ).slice(0, 4); // Pegar apenas os 4 primeiros

  function getColorForResponsible(name: string): string {
    const colors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  }

  return (
    <DashboardContainer>
      <Section>
        <SectionTitle>Dashboard - Visão Geral</SectionTitle>
        
        <StatsGrid>
          <StatCard
            title="Total de Tarefas"
            value={totalTasks.toString()}
            subtitle="Todas as colunas"
            change="+12% vs último mês"
            iconName="dashboard"
            color="#4F46E5"
            positiveChange={true}
          />
          
          <StatCard
            title="Concluídas"
            value={`${completionPercentage}%`}
            subtitle={`${tasks.filter(t => t.status === 'completed').length} de ${totalTasks}`}
            change={`${completionRate.today}% concluídas hoje`}
            iconName="check"
            color="#10B981"
            positiveChange={true}
          />
          
          <StatCard
            title="Tempo Médio"
            value={`${averageCompletionTime}d`}
            subtitle="Até conclusão"
            change="-2 dias vs semana passada"
            iconName="clock"
            color="#F59E0B"
            positiveChange={true}
          />
          
          <StatCard
            title="Em Atraso"
            value={overdueTasks.toString()}
            subtitle="Precisam de atenção"
            change={overdueTasks > 0 ? "+3 vs ontem" : "Nenhum atraso"}
            iconName="warning"
            color="#EF4444"
            positiveChange={overdueTasks === 0}
          />
        </StatsGrid>
      </Section>

      <Section>
        <SectionTitle>Distribuição e Métricas</SectionTitle>
        
        <ChartsGrid>
          <ChartComponent
            title="Distribuição por Status"
            type="pie"
            data={tasksByStatus}
          />
          
          {/* <ChartComponent
            title="Conclusões por Dia da Semana"
            type="bar"
            data={completionByDay}
          /> */}
       {/*  </ChartsGrid>
      </Section>

      <Section>
        {/* <SectionTitle>Desempenho por Responsável</SectionTitle> */}
        
        {/* <<ChartsGrid>
          ChartComponent
            title="Tarefas por Responsável"
            type="bar"
            data={tasksByResponsible}
          /> */}
          
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #E5E7EB'
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>
              Métricas Detalhadas
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                <span style={{ color: '#6B7280' }}>Taxa de conclusão diária:</span>
                <span style={{ fontWeight: 600 }}>{completionRate.today}%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                <span style={{ color: '#6B7280' }}>Taxa de conclusão semanal:</span>
                <span style={{ fontWeight: 600 }}>{completionRate.week}%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                <span style={{ color: '#6B7280' }}>Tarefas em progresso:</span>
                <span style={{ fontWeight: 600 }}>{tasks.filter(t => t.status === 'in_progress').length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                <span style={{ color: '#6B7280' }}>Tarefas pendentes:</span>
                <span style={{ fontWeight: 600 }}>{tasks.filter(t => t.status === 'todo').length}</span>
              </div>
            </div>
          </div>
        </ChartsGrid>
      </Section>
    </DashboardContainer>
  );
};