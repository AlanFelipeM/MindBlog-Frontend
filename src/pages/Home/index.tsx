import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Clock, Eye, Heart, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { API_URL } from '../../config/api';
import { getRealArticleStats } from '../../utils/stats';
import { ArticleBanner } from '../../components/ArticleBanner';
import './styles.css';

interface Article {
  id: number;
  title: string;
  content: string;
  bannerImage: string | null;
  publishedAt: string;
  author: {
    name: string;
    email: string;
  };
  category: string;
  readTime?: string;
  views?: number;
  likes?: number;
}

const MOCK_ARTICLES: Article[] = [
  {
    id: 1,
    title: 'Desvendando a Arquitetura Serverless e Bancos Distribuídos em 2026',
    content: 'Descubra como a arquitetura serverless em conjunto com bancos de dados relacionais distribuídos como o TiDB Cloud está revolucionando a escalabilidade de aplicações web modernas...',
    bannerImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    publishedAt: '2026-07-20T12:00:00.000Z',
    author: { name: 'Lucas Silva', email: 'lucas@mindblog.com' },
    category: 'Desenvolvimento web',
    readTime: '5min',
    views: 342,
    likes: 89
  },
  {
    id: 2,
    title: 'Boas Práticas de Desenvolvimento com TypeScript, Node.js e Express',
    content: 'Entenda os princípios essenciais para estruturar rotas limpas, middlewares de autenticação JWT e validação de dados em APIs RESTful de alta performance...',
    bannerImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    publishedAt: '2026-07-19T11:00:00.000Z',
    author: { name: 'Mariana Costa', email: 'mariana@mindblog.com' },
    category: 'Desenvolvimento web',
    readTime: '6min',
    views: 512,
    likes: 142
  },
  {
    id: 3,
    title: 'Como Construir Interfaces Reativas e Performáticas com React 19',
    content: 'Explore as novidades do React 19, componentes assíncronos e como gerenciamos estados locais e globais sem comprometer a fluidez da aplicação...',
    bannerImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    publishedAt: '2026-07-18T10:00:00.000Z',
    author: { name: 'Rafael Mendes', email: 'rafael@mindblog.com' },
    category: 'Desenvolvimento web',
    readTime: '4min',
    views: 280,
    likes: 64
  },
  {
    id: 4,
    title: 'Automação de Deploy Contínuo com Vercel, Render e GitHub Actions',
    content: 'Um passo a passo completo sobre como integrar repositórios desacoplados de Frontend e Backend com ambientes de homologação e produção automáticos...',
    bannerImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    publishedAt: '2026-07-17T09:00:00.000Z',
    author: { name: 'Camila Rocha', email: 'camila@mindblog.com' },
    category: 'DevOps',
    readTime: '7min',
    views: 410,
    likes: 98
  },
  {
    id: 5,
    title: 'Segurança em Aplicações Web: Hashing com Bcrypt e Tokens JWT',
    content: 'Aprenda como implementar mecanismos robustos de segurança, evitando o armazenamento de senhas em texto puro e protegendo rotas privadas...',
    bannerImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    publishedAt: '2026-07-16T08:00:00.000Z',
    author: { name: 'Diego Oliveira', email: 'diego@mindblog.com' },
    category: 'DevOps',
    readTime: '5min',
    views: 195,
    likes: 47
  },
  {
    id: 6,
    title: 'O Impacto da Inteligência Artificial na Produtividade de Desenvolvedores',
    content: 'Análise detalhada sobre como assistentes de código com IA estão transformando a rotina de engenharia de software e acelerando a entrega de projetos...',
    bannerImage: 'https://images.unsplash.com/photo-1516116211223-4c7141326c65?auto=format&fit=crop&w=800&q=80',
    publishedAt: '2026-07-15T07:00:00.000Z',
    author: { name: 'Beatriz Lima', email: 'beatriz@mindblog.com' },
    category: 'Inteligência Artificial',
    readTime: '8min',
    views: 630,
    likes: 185
  }
];

const CATEGORIES = ['Todos', 'Desenvolvimento web', 'DevOps', 'Inteligência Artificial', 'Mobile', 'Design'];

export const Home = () => {
  const { isAuthenticated } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  // Referência para rolagem suave até a seção de artigos
  const articlesSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`${API_URL}/articles`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // Processa os artigos reais calculando métricas reais de tempo, views e likes
          const enriched = data.map((art: any) => {
            const stats = getRealArticleStats(art);
            return {
              ...art,
              category: art.category || ['Desenvolvimento web', 'DevOps', 'Inteligência Artificial'][(art.id * 3) % 3],
              readTime: stats.readTime,
              views: stats.views,
              likes: stats.likes,
              bannerImage: stats.bannerImage,
            };
          });
          setArticles(enriched);
        } else {
          setArticles(MOCK_ARTICLES);
        }
      })
      .catch(() => {
        setArticles(MOCK_ARTICLES);
      });
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSuccess(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSuccess(false), 5000);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  // Lógica de filtragem dos artigos baseada na categoria selecionada
  const filteredArticles = selectedCategory === 'Todos'
    ? articles
    : articles.filter(art => art.category === selectedCategory);

  // Ordenações e limites
  // Artigos em Destaque: Ordenados por curtidas e limitados a 6 itens
  const highlightedArticles = [...filteredArticles]
    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
    .slice(0, 6);

  // Artigos Recentes: Ordenados pela data de publicação decrescente (máximo 9)
  const recentArticles = [...filteredArticles]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 9);

  return (
    <div className="home-page">
      {/* Seção de Destaque (Hero) da Página Inicial */}
      <section className="hero-section">
        <div className="hero-container">
          <h1 className="hero-title">
            Explore o Futuro da <span className="highlight-text">Tecnologia</span>
          </h1>
          <p className="hero-subtitle">
            Artigos sobre IA, desenvolvimento, DevOps e as últimas tendências tecnológicas
          </p>
          <div className="hero-buttons">
            <Link to="/artigos" className="btn-hero-primary">
              Explorar Artigos
            </Link>
            <Link to={isAuthenticated ? '/artigos/novo' : '/register'} className="btn-hero-outline">
              Começar a Escrever
            </Link>
          </div>
        </div>
      </section>

      {/* Barra Horizontal de Filtros por Categoria */}
      <div className="category-filter-container" ref={articlesSectionRef}>
        <div className="category-filter-bar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Seção de Artigos em Destaque */}
      <section className="articles-section">
        <div className="section-container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Artigos em Destaque</h2>
              <p className="section-subtitle">Os melhores conteúdos selecionados para você</p>
            </div>
            <Link to="/artigos" className="ver-todos-link">
              Ver todos <ArrowRight size={16} />
            </Link>
          </div>

          <div className="articles-grid featured-grid">
            {highlightedArticles.map((art) => (
              <article key={art.id} className="article-card featured-card">
                <ArticleBanner src={art.bannerImage} alt={art.title} className="card-image" />
                
                <div className="card-content">
                  <div className="card-meta-top">
                    <span className="card-category">{art.category}</span>
                    <span className="card-date">{formatDate(art.publishedAt)}</span>
                  </div>

                  <h3 className="card-title">
                    <Link to={`/artigos/${art.id}`}>{art.title}</Link>
                  </h3>
                  
                  <p className="card-description">
                    {art.content.length > 120 ? `${art.content.substring(0, 120)}...` : art.content}
                  </p>

                  <div className="card-footer">
                    <span className="card-author">{art.author.name}</span>
                    <div className="card-metrics">
                      <span className="metric-item"><Clock size={14} /> {art.readTime}</span>
                      <span className="metric-item"><Eye size={14} /> {art.views}</span>
                      <span className="metric-item"><Heart size={14} /> {art.likes}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Seção de Artigos Recentes */}
      <section className="articles-section recent-section">
        <div className="section-container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Artigos Recentes</h2>
              <p className="section-subtitle">Conteúdo recente da comunidade</p>
            </div>
          </div>

          <div className="articles-grid recent-grid">
            {recentArticles.map((art) => (
              <article key={art.id} className="article-card recent-card">
                <div className="card-content">
                  <div className="card-meta-top">
                    <span className="card-category">{art.category}</span>
                    <span className="card-date">{formatDate(art.publishedAt)}</span>
                  </div>

                  <h3 className="card-title">
                    <Link to={`/artigos/${art.id}`}>{art.title}</Link>
                  </h3>

                  <p className="card-description">
                    {art.content.length > 150 ? `${art.content.substring(0, 150)}...` : art.content}
                  </p>

                  <div className="card-footer">
                    <span className="card-author">{art.author.name}</span>
                    <span className="card-date-footer">{formatDate(art.publishedAt)}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Seção da Newsletter Semanal */}
      <section className="newsletter-section">
        <div className="newsletter-container">
          <div className="newsletter-icon-box">
            <Mail size={32} />
          </div>
          <h2 className="newsletter-title">Newsletter Semanal</h2>
          <p className="newsletter-subtitle">
            Receba os melhores artigos de tecnologia diretamente no seu email. Sem spam, apenas conteúdo de qualidade.
          </p>
          
          <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
            <input
              type="email"
              placeholder="exemplo@email.com"
              className="newsletter-input"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              required
            />
            <button type="submit" className="newsletter-btn">
              Inscrever
            </button>
          </form>

          {newsletterSuccess && (
            <p className="newsletter-success-msg">Inscrição realizada com sucesso! 🚀</p>
          )}

          <p className="newsletter-footer-text">
            Mais de 10.000 desenvolvedores já recebem nossa newsletter
          </p>
        </div>
      </section>

      {/* Seção de Chamada para Ação (CTA) Final */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">Compartilhe Seu Conhecimento</h2>
          <p className="cta-subtitle">
            Junte-se à nossa comunidade de escritores e compartilhe suas experiências e conhecimentos em tecnologia
          </p>
          <Link to="/register" className="btn-cta">
            Criar Conta Gratuita
          </Link>
        </div>
      </section>
    </div>
  );
};
