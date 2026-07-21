import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import usersIcon from '../../assets/icones/users.png';
import '../Login/styles.css'; // Reutilizando os estilos globais de autenticação

export const Register = () => {
  const navigate = useNavigate();

  const handleRegister = (e: FormEvent) => {
    e.preventDefault();
    // A chamada da API para cadastro será implementada futuramente neste método
    console.log('Register attempt');
    navigate('/login');
  };

  return (
    <div className="auth-container">
      <div className="auth-logo">
        &lt;M/&gt;
      </div>
      
      <div className="auth-header">
        {/* Alterado de 'Entrar na Plataforma' para 'Criar sua Conta' com base em boas práticas de UX (Melhoria) */}
        <h1>Criar sua Conta</h1>
        <p>Acesse sua conta para gerenciar seus artigos</p>
      </div>

      <div className="auth-card">
        <form onSubmit={handleRegister} className="auth-form">
          <Input 
            label="Nome Completo" 
            type="text" 
            placeholder="John Doe" 
            required 
          />

          <Input 
            label="Email" 
            type="email" 
            placeholder="exemplo@email.com" 
            required 
          />
          
          <Input 
            label="Senha" 
            type="password" 
            placeholder="********" 
            required 
          />

          <Input 
            label="Confirmar senha" 
            type="password" 
            placeholder="********" 
            required 
          />

          <Button type="submit" className="auth-submit-btn">
            <img src={usersIcon} alt="" className="auth-btn-icon" />
            Criar conta
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
