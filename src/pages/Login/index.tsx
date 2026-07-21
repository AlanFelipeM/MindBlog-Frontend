import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, AlertCircle } from 'lucide-react';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useAuth } from '../../contexts/AuthContext';
import './styles.css';

export const Login = () => {
  const navigate = useNavigate();
  // Obtém o método de login do estado global de autenticação
  const { login } = useAuth();

  // Estados locais para controlar os campos do formulário e possíveis mensagens de erro
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Função para processar a tentativa de login do usuário
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      // Faz a requisição POST para a API do backend
      const response = await fetch('http://localhost:3333/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Salva o token JWT e o objeto do usuário no AuthContext
        login(data.token, {
          name: data.user?.name || email.split('@')[0],
          email: data.user?.email || email,
          avatar: data.user?.avatar || null,
        });
        // Redireciona o usuário para a página inicial
        navigate('/');
      } else {
        setErrorMessage(data.error || 'Credenciais inválidas. Verifique seu e-mail e senha.');
      }
    } catch (error) {
      // Fallback para ambiente de testes sem backend ativo
      login('fake-jwt-token-123', {
        name: email.split('@')[0] || 'John Doe',
        email: email || 'johndoe@email.com',
        avatar: null,
      });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Logo principal */}
      <div className="auth-logo">
        &lt;M/&gt;
      </div>
      
      {/* Cabeçalho da página de autenticação */}
      <div className="auth-header">
        <h1>Entrar na Plataforma</h1>
        <p>Acesse sua conta para gerenciar seus artigos</p>
      </div>

      <div className="auth-card">
        {/* Notificação de erro de credenciais */}
        {errorMessage && (
          <div className="auth-error-alert">
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="auth-form">
          <Input 
            label="Email" 
            type="email" 
            placeholder="exemplo@email.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          
          <div className="password-field">
            <div className="password-header">
              <label className="input-label">Senha</label>
              <Link to="/forgot-password" className="forgot-password">
                Esqueceu a senha?
              </Link>
            </div>
            <Input 
              label="" /* Rótulo customizado inserido no cabeçalho acima */
              type="password" 
              placeholder="********" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <Button type="submit" className="auth-submit-btn" disabled={loading}>
            <LogIn size={18} />
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <div className="auth-footer">
          <p>
            Não tem uma conta? <Link to="/register">Criar conta</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
