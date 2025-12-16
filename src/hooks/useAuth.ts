// src/hooks/useAuth.ts
import { useState, useCallback } from 'react';

interface User {
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('kanban-user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = useCallback(async (email: string, password: string) => {
    // Validação simples para demonstração
    const isValid = 
      (email === 'admin@kanban.com' && password === '123456') ||
      (email === 'user@kanban.com' && password === '123456');

    if (!isValid) {
      throw new Error('Credenciais inválidas');
    }

    const userData: User = {
      name: email === 'admin@kanban.com' ? 'Administrador Demo' : 'Usuário Demo',
      email,
      role: email === 'admin@kanban.com' ? 'admin' : 'user',
    };

    localStorage.setItem('kanban-user', JSON.stringify(userData));
    setUser(userData);
    
    return userData;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('kanban-user');
    setUser(null);
  }, []);

  return {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };
};