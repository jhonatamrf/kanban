// src/components/Login/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styled from 'styled-components';

const LoginContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background.default};

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LeftPanel = styled.div`
  flex: 1;
  background: ${({ theme }) => theme.colors.primary.main};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary.main} 0%, ${({ theme }) => theme.colors.primary.dark} 100%);
  color: white;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 2rem;
    min-height: 40vh;
  }
`;

const RightPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  background: ${({ theme }) => theme.colors.background.paper};

  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  font-weight: 600;

  span {
    background: white;
    color: ${({ theme }) => theme.colors.primary.main};
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const LoginForm = styled.form`
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.5rem;
`;

const FormSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 2rem;
  font-size: 0.95rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Input = styled.input<{ $hasError?: boolean }>`
  padding: 0.875rem 1rem;
  border: 1px solid ${({ theme, $hasError }) => 
    $hasError ? theme.colors.error : theme.colors.border};
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
  background: ${({ theme }) => theme.colors.background.default};

  &:focus {
    outline: none;
    border-color: ${({ theme, $hasError }) => 
      $hasError ? theme.colors.error : theme.colors.primary.main};
    box-shadow: 0 0 0 3px ${({ theme, $hasError }) => 
      $hasError ? theme.colors.error + '40' : theme.colors.primary.light + '40'};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.background.default};
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const ErrorText = styled.span`
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.5rem 0;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
`;

const SubmitButton = styled.button<{ $loading: boolean }>`
  padding: 1rem;
  background: ${({ theme, $loading }) => 
    $loading ? theme.colors.primary.light : theme.colors.primary.main};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: ${({ $loading }) => $loading ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primary.dark};
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.colors.border};
  }
`;

const DemoButton = styled.button`
  padding: 0.875rem;
  background: ${({ theme }) => theme.colors.background.default};
  color: ${({ theme }) => theme.colors.text.primary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: ${({ theme }) => theme.colors.background.paper};
    border-color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const LinkText = styled.p`
  text-align: center;
  margin-top: 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;
`;

const LinkButton = styled.a`
  color: ${({ theme }) => theme.colors.primary.main};
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.primary.dark};
    text-decoration: underline;
  }
`;

const FeatureList = styled.div`
  max-width: 500px;
  margin-top: 3rem;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  color: rgba(255, 255, 255, 0.9);
`;

const FeatureIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
`;

const FeatureContent = styled.div`
  flex: 1;
`;

const FeatureTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const FeatureDescription = styled.p`
  font-size: 0.875rem;
  opacity: 0.8;
  line-height: 1.4;
`;

const BackgroundPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  pointer-events: none;
`;

const WelcomeText = styled.div`
  text-align: center;
  max-width: 500px;
  margin-bottom: 3rem;
`;

const WelcomeTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;
`;

const WelcomeSubtitle = styled.p`
  font-size: 1.125rem;
  opacity: 0.9;
  line-height: 1.4;
`;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.email.trim()) {
      errors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email inválido';
    }

    if (!formData.password) {
      errors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      errors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    setValidationErrors(errors);
    setError('');
    return Object.keys(errors).length === 0;
  };

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      await login(formData.email, formData.password);
      navigate('/kanban');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (type: 'admin' | 'user') => {
    const credentials = type === 'admin' 
      ? { email: 'admin@kanban.com', password: '123456' }
      : { email: 'user@kanban.com', password: '123456' };
    
    setFormData(prev => ({ ...prev, ...credentials }));
    
    // Auto-submit after setting credentials
    setTimeout(() => {
      const form = document.getElementById('login-form') as HTMLFormElement;
      if (form) form.requestSubmit();
    }, 100);
  };

  return (
    <LoginContainer>
      <LeftPanel>
        <BackgroundPattern />
        <WelcomeText>
          <WelcomeTitle>
            <Logo>
                <span>K</span>
                Kanban Board
            </Logo>            
          </WelcomeTitle>
          <WelcomeSubtitle>
            Gerencie suas tarefas de forma visual e eficiente com nosso sistema Kanban completo
          </WelcomeSubtitle>
        </WelcomeText>
        
        <FeatureList>
          <FeatureItem>
            <FeatureIcon>📋</FeatureIcon>
            <FeatureContent>
              <FeatureTitle>Quadro Kanban Intuitivo</FeatureTitle>
              <FeatureDescription>
                Organize tarefas com drag-and-drop em colunas personalizáveis
              </FeatureDescription>
            </FeatureContent>
          </FeatureItem>
          
          <FeatureItem>
            <FeatureIcon>📊</FeatureIcon>
            <FeatureContent>
              <FeatureTitle>Dashboard em Tempo Real</FeatureTitle>
              <FeatureDescription>
                Acompanhe métricas de produtividade e desempenho da equipe
              </FeatureDescription>
            </FeatureContent>
          </FeatureItem>
          
          <FeatureItem>
            <FeatureIcon>👥</FeatureIcon>
            <FeatureContent>
              <FeatureTitle>Colaboração em Equipe</FeatureTitle>
              <FeatureDescription>
                Atribua tarefas, comente e acompanhe o progresso colaborativamente
              </FeatureDescription>
            </FeatureContent>
          </FeatureItem>
          
          <FeatureItem>
            <FeatureIcon>📱</FeatureIcon>
            <FeatureContent>
              <FeatureTitle>Totalmente Responsivo</FeatureTitle>
              <FeatureDescription>
                Acesse de qualquer dispositivo com nossa interface adaptativa
              </FeatureDescription>
            </FeatureContent>
          </FeatureItem>
        </FeatureList>
      </LeftPanel>

      <RightPanel>
        
        <LoginForm id="login-form" onSubmit={handleSubmit}>
          <div>
            <FormTitle>Entrar</FormTitle>
            <FormSubtitle>
              Use suas credenciais para acessar o sistema Kanban
            </FormSubtitle>
          </div>

          <InputGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              $hasError={!!validationErrors.email}
              disabled={isLoading}
              autoComplete="email"
            />
            {validationErrors.email && <ErrorText>{validationErrors.email}</ErrorText>}
          </InputGroup>

          <InputGroup>
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              $hasError={!!validationErrors.password}
              disabled={isLoading}
              autoComplete="current-password"
            />
            {validationErrors.password && <ErrorText>{validationErrors.password}</ErrorText>}
          </InputGroup>

          <CheckboxGroup>
            <Checkbox
              type="checkbox"
              id="rememberMe"
              checked={formData.rememberMe}
              onChange={(e) => setFormData(prev => ({ ...prev, rememberMe: e.target.checked }))}
              disabled={isLoading}
            />
            <CheckboxLabel htmlFor="rememberMe">
              Lembrar de mim
            </CheckboxLabel>
          </CheckboxGroup>

          {error && (
            <div style={{
              padding: '0.75rem',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '6px',
              color: '#EF4444',
              fontSize: '0.875rem',
            }}>
              ⚠️ {error}
            </div>
          )}

          <SubmitButton 
            type="submit" 
            disabled={isLoading}
            $loading={isLoading}
          >
            {isLoading ? (
              <>
                <span style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: 'white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </SubmitButton>

          <LinkText>
            <LinkButton onClick={() => alert('Funcionalidade de recuperação de senha em desenvolvimento')}>
              🔒 Esqueceu sua senha?
            </LinkButton>
          </LinkText>

          <LinkText>
            Não tem uma conta?{' '}
            <LinkButton onClick={() => alert('Funcionalidade de cadastro em desenvolvimento')}>
              Solicitar acesso
            </LinkButton>
          </LinkText>
        </LoginForm>
        
        <div style={{
          marginTop: '3rem',
          padding: '1rem',
          background: '#F9FAFB',
          borderRadius: '8px',
          border: '1px solid #E5E7EB',
          fontSize: '0.75rem',
          color: '#6B7280',
          maxWidth: '400px',
          textAlign: 'center'
        }}>
          <strong>Credenciais de demonstração:</strong><br />
          Admin: admin@kanban.com / 123456<br />
          Usuário: user@kanban.com / 123456
        </div>
      </RightPanel>
    </LoginContainer>
  );
};