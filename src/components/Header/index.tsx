import { Link } from 'react-router-dom';
import { Moon } from 'lucide-react';
import './styles.css';

import { useAuth } from '../../contexts/AuthContext';

export const Header = () => {
  // Conecta o cabeçalho ao estado global de autenticação
  const { isAuthenticated } = useAuth();

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          &lt;M/&gt;
        </Link>

        <nav className="header-nav">
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/artigos" className="nav-link">Artigos</Link>
          </div>
          
          <div className="header-divider" />

          <button className="theme-toggle" aria-label="Toggle theme">
            <Moon size={20} />
          </button>

          {isAuthenticated ? (
            <div className="user-menu">
              <button className="user-menu-btn">
                <img 
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80" 
                  alt="Avatar do Usuário" 
                  className="user-avatar-img-header" 
                />
              </button>
            </div>
          ) : (
            <div className="auth-actions">
              <Link to="/login" className="nav-link">Entrar</Link>
              <Link to="/register" className="nav-register">Cadastrar</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};
