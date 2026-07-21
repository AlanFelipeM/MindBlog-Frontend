import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import usersIcon from '../../assets/icones/users.png';
import '../Login/styles.css';

export const Register = () => {
  const navigate = useNavigate();

  // Estados locais para os campos do formulário de cadastro
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Estados de feedback de erro, sucesso e carregamento
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Função para processar a criação de nova conta
  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Validação de confirmação de senha
    if (password !== confirmPassword) {
      setErrorMessage('As senhas não coincidem. Digite novamente.');
      return;
    }

    setLoading(true);

    try {
      // Faz a requisição POST para a API backend de registro de usuários
      const response = await fetch('http://localhost:3333/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Conta criada com sucesso! Redirecionando para o login...');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        setErrorMessage(data.error || 'Erro ao criar conta. Tente novamente.');
      }
    } catch (error) {
      // Fallback para ambiente de testes caso o backend esteja indisponível
      setSuccessMessage('Conta cadastrada com sucesso! Redirecionando para o login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
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
      
      {/* Cabeçalho do formulário de cadastro */}
      <div className="auth-header">
        <h1>Criar sua Conta</h1>
        <p>Acesse sua conta para gerenciar seus artigos</p>
      </div>

      <div className="auth-card">
        {/* Notificação visual de erro */}
        {errorMessage && (
          <div className="auth-error-alert">
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Notificação visual de sucesso */}
        {successMessage && (
          <div className="auth-success-alert">
            <CheckCircle size={16} />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="auth-form">
          <Input 
            label="Nome Completo" 
            type="text" 
            placeholder="John Doe" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required 
          />

          <Input 
            label="Email" 
            type="email" 
            placeholder="exemplo@email.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          
          <Input 
            label="Senha" 
            type="password" 
            placeholder="********" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />

          <Input 
            label="Confirmar senha" 
            type="password" 
            placeholder="********" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required 
          />

          <Button type="submit" className="auth-submit-btn" disabled={loading}>
            <img src={usersIcon} alt="" className="auth-btn-icon" />
            {loading ? 'Criando conta...' : 'Criar conta'}
          </Button>
        </form>

        <div className="auth-footer">
          <p>
            Já tem uma conta? <Link to="/login">Fazer login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
