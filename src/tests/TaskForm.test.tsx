// tests/TaskForm.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskForm } from '../components/TaskForm/TaskForm';

describe('TaskForm', () => {
  const mockSubmit = jest.fn();
  const mockCancel = jest.fn();

  test('renderiza o formulário corretamente', () => {
    render(<TaskForm onSubmit={mockSubmit} onCancel={mockCancel} />);
    
    expect(screen.getByLabelText(/título/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/descrição/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/responsável/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/data limite/i)).toBeInTheDocument();
  });

  test('submete o formulário com dados válidos', () => {
    render(<TaskForm onSubmit={mockSubmit} onCancel={mockCancel} />);
    
    fireEvent.change(screen.getByLabelText(/título/i), {
      target: { value: 'Nova Tarefa' }
    });
    fireEvent.change(screen.getByLabelText(/responsável/i), {
      target: { value: 'João Silva' }
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'joao@email.com' }
    });
    fireEvent.change(screen.getByLabelText(/data limite/i), {
      target: { value: '2024-12-31' }
    });
    
    fireEvent.submit(screen.getByRole('form'));
    
    expect(mockSubmit).toHaveBeenCalled();
  });

  test('valida campos obrigatórios', () => {
    render(<TaskForm onSubmit={mockSubmit} onCancel={mockCancel} />);
    
    const submitButton = screen.getByRole('button', { name: /criar tarefa/i });
    fireEvent.click(submitButton);
    
    expect(mockSubmit).not.toHaveBeenCalled();
  });
});