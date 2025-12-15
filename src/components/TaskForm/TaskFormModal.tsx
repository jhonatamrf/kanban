// src/components/TaskForm/TaskFormModal.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Task, TaskStatus } from '../../types/task';
import { useTaskContext } from '../../context/TaskContext';

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${({ $isOpen }) => $isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.background.paper};
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: ${({ theme }) => theme.shadows.large};
`;

const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.secondary};
  padding: 0.5rem;
  border-radius: 4px;
  
  &:hover {
    background: ${({ theme }) => theme.colors.background.default};
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task;
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({ 
  isOpen, 
  onClose,
  task 
}) => {
  const { addTask, updateTask } = useTaskContext();
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || ('todo' as TaskStatus),
    responsibleName: task?.responsible?.name || '',
    responsibleEmail: task?.responsible?.email || '',
    dueDate: task?.dueDate ? new Date(task?.dueDate).toISOString().split('T')[0] : '',
  });

  useEffect(() => {
    // When modal opens or task changes, populate the form with task data (or reset for new task)
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || ('todo' as TaskStatus),
        responsibleName: task.responsible?.name || '',
        responsibleEmail: task.responsible?.email || '',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'todo' as TaskStatus,
        responsibleName: '',
        responsibleEmail: '',
        dueDate: '',
      });
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const taskData = {
      title: formData.title,
      description: formData.description,
      status: formData.status,
      responsible: {
        name: formData.responsibleName,
        email: formData.responsibleEmail,
      },
      dueDate: new Date(formData.dueDate),
    };

    if (task) {
      updateTask(task.id, taskData);
    } else {
      addTask(taskData);
    }
    
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <ModalOverlay $isOpen={isOpen}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>
            {task ? 'Editar Tarefa' : 'Nova Tarefa'}
          </ModalTitle>
          <CloseButton onClick={onClose}>
            ×
          </CloseButton>
        </ModalHeader>
        
        <ModalBody>
          <Form onSubmit={handleSubmit}>
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
                onClick={onClose}
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
          </Form>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};