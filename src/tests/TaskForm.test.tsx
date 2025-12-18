// src/tests/TaskForm.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, test, expect } from 'vitest';
import { TaskForm } from '../components/TaskForm/TaskForm';
import { ThemeProvider } from 'styled-components';

// Tema mock para styled-components
const mockTheme = {
  colors: {
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
      primary: '#ffffff',
      secondary: '#f5f5f5',
    },
    primary: {
      main: '#3f51b5',
      light: '#7986cb',
      dark: '#303f9f',
    },
    border: '#cccccc',
  },
};

const renderWithTheme = (ui: React.ReactNode) => {
  return render(
    <ThemeProvider theme={mockTheme}>
      {ui}
    </ThemeProvider>
  );
};

describe('TaskForm', () => {
  const mockSubmit = vi.fn();
  const mockCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renderiza o formulário corretamente', () => {
    renderWithTheme(<TaskForm onSubmit={mockSubmit} onCancel={mockCancel} />);
    
    // Verifique todos os campos pelos labels exatos
    expect(screen.getByLabelText('Título *')).toBeInTheDocument();
    expect(screen.getByLabelText('Descrição')).toBeInTheDocument();
    expect(screen.getByLabelText('Status')).toBeInTheDocument();
    expect(screen.getByLabelText('Responsável *')).toBeInTheDocument();
    expect(screen.getByLabelText('Email do Responsável *')).toBeInTheDocument();
    expect(screen.getByLabelText('Data Limite *')).toBeInTheDocument();
    
    // Verifique botões
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /criar tarefa/i })).toBeInTheDocument();
    
    // Verifique placeholders
    expect(screen.getByPlaceholderText('Digite o título da tarefa')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nome do responsável')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('email@exemplo.com')).toBeInTheDocument();
  });

  test('renderiza com dados de tarefa existente', () => {
    const existingTask = {
      title: 'Tarefa Existente',
      description: 'Descrição da tarefa',
      status: 'in_progress' as const,
      responsible: {
        name: 'Maria Silva',
        email: 'maria@email.com',
      },
      dueDate: new Date('2024-12-31'),
    };

    renderWithTheme(
      <TaskForm 
        task={existingTask} 
        onSubmit={mockSubmit} 
        onCancel={mockCancel} 
      />
    );
    
    expect(screen.getByDisplayValue('Tarefa Existente')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Descrição da tarefa')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Maria Silva')).toBeInTheDocument();
    expect(screen.getByDisplayValue('maria@email.com')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /atualizar tarefa/i })).toBeInTheDocument();
  });

  test('submete o formulário com dados válidos', async () => {
    renderWithTheme(<TaskForm onSubmit={mockSubmit} onCancel={mockCancel} />);
    
    // Preencha todos os campos obrigatórios
    fireEvent.change(screen.getByLabelText('Título *'), {
      target: { value: 'Nova Tarefa' }
    });
    
    fireEvent.change(screen.getByLabelText('Descrição'), {
      target: { value: 'Descrição da nova tarefa' }
    });
    
    fireEvent.change(screen.getByLabelText('Status'), {
      target: { value: 'todo' }
    });
    
    fireEvent.change(screen.getByLabelText('Responsável *'), {
      target: { value: 'João Silva' }
    });
    
    fireEvent.change(screen.getByLabelText('Email do Responsável *'), {
      target: { value: 'joao@email.com' }
    });
    
    fireEvent.change(screen.getByLabelText('Data Limite *'), {
      target: { value: '2024-12-31' }
    });
    
    // Submeta o formulário clicando no botão
    fireEvent.click(screen.getByRole('button', { name: /criar tarefa/i }));
    
    // Verifique se onSubmit foi chamado com os dados corretos
    expect(mockSubmit).toHaveBeenCalledTimes(1);
    
    // A função recebe um objeto com a estrutura esperada
    const submittedData = mockSubmit.mock.calls[0][0];
    expect(submittedData.title).toBe('Nova Tarefa');
    expect(submittedData.description).toBe('Descrição da nova tarefa');
    expect(submittedData.status).toBe('todo');
    expect(submittedData.responsible.name).toBe('João Silva');
    expect(submittedData.responsible.email).toBe('joao@email.com');
    expect(submittedData.dueDate).toBeInstanceOf(Date);
  });

  test('não submete o formulário com campos obrigatórios vazios', () => {
    renderWithTheme(<TaskForm onSubmit={mockSubmit} onCancel={mockCancel} />);
    
    // Tente submeter sem preencher nada
    fireEvent.click(screen.getByRole('button', { name: /criar tarefa/i }));
    
    // A validação HTML5 deve impedir a submissão
    expect(mockSubmit).not.toHaveBeenCalled();
    
    // Verifique se os campos obrigatórios têm o atributo required
    expect(screen.getByLabelText('Título *')).toHaveAttribute('required');
    expect(screen.getByLabelText('Responsável *')).toHaveAttribute('required');
    expect(screen.getByLabelText('Email do Responsável *')).toHaveAttribute('required');
    expect(screen.getByLabelText('Data Limite *')).toHaveAttribute('required');
  });

  test('chama onCancel quando botão cancelar é clicado', () => {
    renderWithTheme(<TaskForm onSubmit={mockSubmit} onCancel={mockCancel} />);
    
    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));
    
    expect(mockCancel).toHaveBeenCalledTimes(1);
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  test('valida formato de email', () => {
    renderWithTheme(<TaskForm onSubmit={mockSubmit} onCancel={mockCancel} />);
    
    // Preencha outros campos
    fireEvent.change(screen.getByLabelText('Título *'), {
      target: { value: 'Tarefa Teste' }
    });
    
    fireEvent.change(screen.getByLabelText('Responsável *'), {
      target: { value: 'Teste Silva' }
    });
    
    // Email inválido
    fireEvent.change(screen.getByLabelText('Email do Responsável *'), {
      target: { value: 'email-invalido' }
    });
    
    fireEvent.change(screen.getByLabelText('Data Limite *'), {
      target: { value: '2024-12-31' }
    });
    
    // Tente submeter
    fireEvent.click(screen.getByRole('button', { name: /criar tarefa/i }));
    
    // O formulário HTML5 com type="email" deve bloquear a submissão
    expect(mockSubmit).not.toHaveBeenCalled();
    
    // Verifique se o campo de email tem type="email"
    expect(screen.getByLabelText('Email do Responsável *')).toHaveAttribute('type', 'email');
  });

  test('atualiza estado do formulário quando campos são alterados', () => {
    renderWithTheme(<TaskForm onSubmit={mockSubmit} onCancel={mockCancel} />);
    
    const titleInput = screen.getByLabelText('Título *') as HTMLInputElement;
    const nameInput = screen.getByLabelText('Responsável *') as HTMLInputElement;
    const emailInput = screen.getByLabelText('Email do Responsável *') as HTMLInputElement;
    
    fireEvent.change(titleInput, { target: { value: 'Novo Título' } });
    fireEvent.change(nameInput, { target: { value: 'Novo Nome' } });
    fireEvent.change(emailInput, { target: { value: 'novo@email.com' } });
    
    expect(titleInput.value).toBe('Novo Título');
    expect(nameInput.value).toBe('Novo Nome');
    expect(emailInput.value).toBe('novo@email.com');
  });
});