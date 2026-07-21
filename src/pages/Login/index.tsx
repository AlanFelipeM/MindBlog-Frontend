import { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import './styles.css';

export const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    // API Call will go here later
    console.log('Login attempt');
    navigate('/dashboard');
  };

  return (
    <div className="auth-container">
      <div className="auth-logo">
        &lt;M/&gt;
      </div>
      
      <div className="auth-header">
        <h1>Entrar na Plataforma</h1>
        <p>Acesse sua conta para gerenciar seus artigos</p>
      </div>

      <div className="auth-card">
        <form onSubmit={handleLogin} className="auth-form">
          <Input 
            label="Email" 
            type="email" 
            placeholder="exemplo@email.com" 
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
              label="" /* Label removed because we use custom header above */
              type="password" 
              placeholder="********" 
              required 
            />
          </div>

          <Button type="submit" className="auth-submit-btn">
            <LogIn size={18} />
            Entrar
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
