// components/TaskForm/TaskForm.tsx
import React, { useState } from 'react';
import { Task, TaskStatus } from '../../types/task';
import styled from 'styled-components';

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 600px;
  margin: 0 auto;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.main};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary.light}40;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const Button = styled.button<{ $variant: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  ${({ $variant, theme }) => 
    $variant === 'primary'
      ? `
        background: ${theme.colors.primary.main};
        color: white;
        
        &:hover {
          background: ${theme.colors.primary.dark};
        }
      `
      : `
        background: ${theme.colors.background.paper};
        color: ${theme.colors.text.primary};
        border: 1px solid ${theme.colors.border};
        
        &:hover {
          background: ${theme.colors.background.default};
        }
      `
  }
`;

interface TaskFormProps {
  task?: Task;
  onSubmit: (taskData: Partial<Task>) => void;
  onCancel: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'todo' as TaskStatus,
    responsibleName: task?.responsible.name || '',
    responsibleEmail: task?.responsible.email || '',
    dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const taskData: Partial<Task> = {
      title: formData.title,
      description: formData.description,
      status: formData.status,
      responsible: {
        name: formData.responsibleName,
        email: formData.responsibleEmail,
      },
      dueDate: new Date(formData.dueDate),
    };

    onSubmit(taskData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormGroup>
        <Label htmlFor="title">Título *</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Digite o título da tarefa"
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="description">Descrição</Label>
        <TextArea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Descreva a tarefa..."
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="status">Status</Label>
        <Select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="todo">A Fazer</option>
          <option value="in_progress">Em Progresso</option>
          <option value="overdue">Atrasado</option>
          <option value="completed">Concluído</option>
        </Select>
      </FormGroup>

      <FormGroup>
        <Label htmlFor="responsibleName">Responsável *</Label>
        <Input
          id="responsibleName"
          name="responsibleName"
          value={formData.responsibleName}
          onChange={handleChange}
          required
          placeholder="Nome do responsável"
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="responsibleEmail">Email do Responsável *</Label>
        <Input
          id="responsibleEmail"
          name="responsibleEmail"
          type="email"
          value={formData.responsibleEmail}
          onChange={handleChange}
          required
          placeholder="email@exemplo.com"
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="dueDate">Data Limite *</Label>
        <Input
          id="dueDate"
          name="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={handleChange}
          required
        />
      </FormGroup>

      <ButtonGroup>
        <Button
          type="button"
          $variant="secondary"
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          $variant="primary"
        >
          {task ? 'Atualizar' : 'Criar'} Tarefa
        </Button>
      </ButtonGroup>
    </FormContainer>
  );
};