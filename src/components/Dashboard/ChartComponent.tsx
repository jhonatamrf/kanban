// src/components/Dashboard/ChartComponent.tsx
import React from 'react';
import styled from 'styled-components';

const ChartContainer = styled.div`
  background: ${({ theme }) => theme.colors.background.paper};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.small};
  border: 1px solid ${({ theme }) => theme.colors.border};
  height: 100%;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ChartTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const ChartContent = styled.div`
  height: 300px;
  // display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 1rem 0;
  position: relative;
`;

const BarChartContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  width: 100%;
  height: 250px;
  padding: 0 1rem;
  gap: 0.5rem;
`;

const Bar = styled.div<{ $height: number; $color: string }>`
  width: 40px;
  height: ${({ $height }) => $height}%;
  background: ${({ $color }) => $color};
  border-radius: 6px 6px 0 0;
  position: relative;
  transition: height 0.3s ease;
  
  &:hover {
    opacity: 0.9;
    transform: scale(1.05);
  }
`;

const BarLabel = styled.div`
  position: absolute;
  bottom: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  white-space: nowrap;
`;

const BarValue = styled.div`
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const PieChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 250px;
`;

const PieChartVisual = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: conic-gradient(
    ${({ theme }) => theme.colors.primary.main} 0% 37.5%,
    ${({ theme }) => theme.colors.secondary.main} 37.5% 62.5%,
    ${({ theme }) => theme.colors.warning} 62.5% 87.5%,
    ${({ theme }) => theme.colors.error} 87.5% 100%
  );
  margin-bottom: 1rem;
`;

const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin-top: 0.5rem;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
`;

const LegendColor = styled.div<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 3px;
  background: ${({ $color }) => $color};
`;

interface ChartData {
  label?: string;
  value?: number;
  day?: string;
  status?: string;
  count?: number;
  color?: string;
}

interface ChartComponentProps {
  title: string;
  type: 'bar' | 'pie';
  data: ChartData[];
}

export const ChartComponent: React.FC<ChartComponentProps> = ({
  title,
  type,
  data,
}) => {
  const renderBarChart = () => {
    const maxValue = Math.max(...data.map(item => item.value || item.count || 0));
    
    return (
      <BarChartContainer>
        {data.map((item, index) => {
          const value = item.value || item.count || 0;
          const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
          const color = item.color || 
            (index % 3 === 0 ? '#4F46E5' : 
             index % 3 === 1 ? '#10B981' : '#F59E0B');
          
          return (
            <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Bar 
                $height={height} 
                $color={color}
              >
                <BarValue>{value}</BarValue>
              </Bar>
              <BarLabel>{item.label || item.day || `Item ${index + 1}`}</BarLabel>
            </div>
          );
        })}
      </BarChartContainer>
    );
  };

  const renderPieChart = () => {
    const total = data.reduce((sum, item) => sum + (item.count || item.value || 0), 0);
    
    return (
      <>
        <PieChartContainer>
          <PieChartVisual />
          <div style={{ fontSize: '1.5rem', fontWeight: 600, color: '#111827' }}>
            {total} Tarefas
          </div>
        </PieChartContainer>
        
        <Legend>
          {data.map((item, index) => (
            <LegendItem key={index}>
              <LegendColor $color={item.color || 
                (index % 4 === 0 ? '#4F46E5' : 
                 index % 4 === 1 ? '#10B981' : 
                 index % 4 === 2 ? '#F59E0B' : '#EF4444')} 
              />
              <span>{item.label || item.status || `Categoria ${index + 1}`}</span>
              <span style={{ color: '#6B7280', fontWeight: 600 }}>
                ({item.count || item.value || 0})
              </span>
            </LegendItem>
          ))}
        </Legend>
      </>
    );
  };

  return (
    <ChartContainer>
      <ChartHeader>
        <ChartTitle>{title}</ChartTitle>
      </ChartHeader>
      
      <ChartContent>
        {type === 'bar' ? renderBarChart() : renderPieChart()}
      </ChartContent>
    </ChartContainer>
  );
};