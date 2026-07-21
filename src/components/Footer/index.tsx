import { Link } from 'react-router-dom';
import iconLinkedin from '../../assets/icones/icon-linkedin.png';
import iconGithub from '../../assets/icones/icon-github.png';
import iconX from '../../assets/icones/icon-X.png';
import './styles.css';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            &lt;M/&gt;
          </Link>
          <p className="footer-description">
            Seu portal de tecnologia com artigos, tutoriais e novidades do mundo tech.
          </p>
        </div>

        <div className="footer-nav">
          <h4 className="footer-title">Navegação</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/artigos">Artigos</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
          </ul>
        </div>

        <div className="footer-social">
          <h4 className="footer-title">Redes Sociais</h4>
          <div className="social-icons">
            <a href="#" aria-label="LinkedIn"><img src={iconLinkedin} alt="LinkedIn" className="social-icon-img" /></a>
            <a href="#" aria-label="GitHub"><img src={iconGithub} alt="GitHub" className="social-icon-img" /></a>
            <a href="#" aria-label="X"><img src={iconX} alt="X" className="social-icon-img" /></a>
          </div>
        </div>

      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} MindBlog. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};
