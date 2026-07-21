import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './styles.css';

// Importação dos ícones em PNG disponibilizados no projeto
import dashboardIcon from '../../assets/icones/layout-dashboard.png';
import settingsIcon from '../../assets/icones/settings.png';
import logoutIcon from '../../assets/icones/log-out.png';

// Avatar padrão de usuário em formato SVG (silhueta clássica de sites) utilizado quando o perfil não possui foto
const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23A1A1AA'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

export const Header = () => {
  const navigate = useNavigate();
  // Conecta o cabeçalho ao estado global de autenticação
  const { isAuthenticated, user, logout } = useAuth();

  // Estado para controlar a abertura/fechamento do menu dropdown do usuário
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Estado do tema visual (escuro/claro) com salvamento no localStorage
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('@MindBlog:theme') as 'dark' | 'light') || 'dark';
  });

  // Atualiza o atributo data-theme na tag <html> para alterar todas as variáveis CSS do site
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('@MindBlog:theme', theme);
  }, [theme]);

  // Alterna o tema entre escuro e claro
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Referência para detectar cliques fora do menu e fechar o dropdown automaticamente
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Efeito que fecha o dropdown ao clicar em qualquer área externa da tela
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Função para realizar o logout do usuário e redirecioná-lo para a tela de login
  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
    navigate('/login');
  };

  // Função para navegar e fechar o menu dropdown
  const handleNavigate = (path: string) => {
    setIsDropdownOpen(false);
    navigate(path);
  };

  // Define a foto de perfil: usa o avatar do usuário se existir, ou o avatar padrão de site
  const userAvatarSrc = user?.avatar || DEFAULT_AVATAR;

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo do blog */}
        <Link to="/" className="header-logo">
          &lt;M/&gt;
        </Link>

        <nav className="header-nav">
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/artigos" className="nav-link">Artigos</Link>
          </div>
          
          <div className="header-divider" />

          {/* Botão de alternância de tema */}
          <button 
            className="theme-toggle" 
            onClick={toggleTheme}
            aria-label="Alternar Tema Escuro e Claro"
            title={theme === 'dark' ? "Mudar para Tema Claro" : "Mudar para Tema Escuro"}
          >
            {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} color="#EAB308" />}
          </button>

          {/* Renderização condicional do perfil quando logado ou botões de entrar/cadastrar */}
          {isAuthenticated ? (
            <div className="user-menu-wrapper" ref={dropdownRef}>
              {/* Botão de foto de perfil que ativa o dropdown */}
              <button
                className="user-menu-btn"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-label="Menu do usuário"
              >
                <img 
                  src={userAvatarSrc} 
                  alt={user?.name || 'Avatar do Usuário'} 
                  className="user-avatar-img-header" 
                />
              </button>

              {/* Menu Dropdown do usuário logado conforme mockup do Figma */}
              {isDropdownOpen && (
                <div className="user-dropdown-menu">
                  {/* Cabeçalho do dropdown com avatar, nome e e-mail */}
                  <div className="dropdown-header-info">
                    <div className="dropdown-avatar-box">
                      <img
                        src={userAvatarSrc}
                        alt={user?.name || 'Perfil'}
                        className="dropdown-avatar-img"
                      />
                    </div>
                    <div className="dropdown-user-details">
                      <span className="dropdown-user-name">{user?.name || 'John Doe'}</span>
                      <span className="dropdown-user-email">{user?.email || 'johndoe@email.com'}</span>
                    </div>
                  </div>

                  {/* Divisória superior */}
                  <div className="dropdown-divider" />

                  {/* Links de navegação interna */}
                  <div className="dropdown-nav-items">
                    <button
                      className="dropdown-item-btn"
                      onClick={() => handleNavigate('/dashboard')}
                    >
                      <img src={dashboardIcon} alt="Dashboard" className="dropdown-item-icon" />
                      <span>Dashboard</span>
                    </button>

                    <button
                      className="dropdown-item-btn"
                      onClick={() => handleNavigate('/configuracoes')}
                    >
                      <img src={settingsIcon} alt="Configurações" className="dropdown-item-icon" />
                      <span>Configurações</span>
                    </button>
                  </div>

                  {/* Divisória inferior */}
                  <div className="dropdown-divider" />

                  {/* Botão de encerramento da sessão */}
                  <div className="dropdown-footer">
                    <button
                      className="dropdown-item-btn logout-btn"
                      onClick={handleLogout}
                    >
                      <img src={logoutIcon} alt="Sair" className="dropdown-item-icon" />
                      <span>Sair</span>
                    </button>
                  </div>
                </div>
              )}
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
