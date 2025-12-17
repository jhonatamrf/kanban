// src/components/Dashboard/StatCard.tsx
import React from 'react';
import styled from 'styled-components';
import { Icon } from '../UI/Icon';

const CardContainer = styled.div`
  background: ${({ theme }) => theme.colors.background.paper};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.small};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.3s ease;
  height: 100%;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.medium};
    transform: translateY(-2px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const IconContainer = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${({ $color }) => $color}20;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: ${({ $color }) => $color};
`;

const ValueContainer = styled.div`
  margin-bottom: 0.5rem;
`;

const Value = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1;
`;

const Title = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Subtitle = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 0.5rem;
`;

const ChangeIndicator = styled.div<{ $positive: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ $positive, theme }) => 
    $positive ? theme.colors.success : theme.colors.error};
  margin-top: 0.5rem;
`;

const TrendIcon = styled.span<{ $positive: boolean }>`
  font-size: 0.75rem;
`;

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  change?: string;
  iconName?: string;
  color?: string;
  positiveChange?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  change,
  iconName = 'chartBar',
  color = '#4F46E5',
  positiveChange = true,
}) => {
  const getTrendIcon = () => positiveChange ? '↗' : '↘';

  return (
    <CardContainer>
      <CardHeader>
        <IconContainer $color={color}>
          <Icon name={iconName as any} />
        </IconContainer>
      </CardHeader>
      
      <ValueContainer>
        <Value>{value}</Value>
        <Title>{title}</Title>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
      </ValueContainer>
      
      {change && (
        <ChangeIndicator $positive={positiveChange}>
          <Icon name={positiveChange ? 'arrowUp' : 'arrowDown'} />
          {change}
        </ChangeIndicator>
      )}
    </CardContainer>
  );
};