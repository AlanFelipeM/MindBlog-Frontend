import { Link } from 'react-router-dom';
import { Moon, User } from 'lucide-react';
import './styles.css';

export const Header = () => {
  // Temporary mock for auth state until context is ready
  const isAuthenticated = false;

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

          {isAuthenticated && (
            <div className="user-menu">
              <button className="user-menu-btn">
                <User size={20} />
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};
