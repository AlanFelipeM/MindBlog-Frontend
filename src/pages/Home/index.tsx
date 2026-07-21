import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Clock, Eye, Heart, ArrowRight } from 'lucide-react';
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
  // Métricas calculadas dinamicamente ou geradas por amostragem
  category?: string;
  readTime?: string;
  views?: number;
  likes?: number;
}

const MOCK_ARTICLES: Article[] = [
  {
    id: 1,
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam in augue ligula. Donec sed eros vel lacus condimentum sollicitudin...',
    bannerImage: null,
    publishedAt: '2025-10-04T12:00:00.000Z',
    author: { name: 'John Doe', email: 'john@example.com' },
    category: 'Desenvolvimento web',
    readTime: '6min',
    views: 122,
    likes: 80
  },
  {
    id: 2,
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam in augue ligula. Donec sed eros vel lacus condimentum sollicitudin...',
    bannerImage: null,
    publishedAt: '2025-10-04T11:00:00.000Z',
    author: { name: 'John Doe', email: 'john@example.com' },
    category: 'Desenvolvimento web',
    readTime: '6min',
    views: 122,
    likes: 95 // Artigo com maior quantidade de curtidas, utilizado para destaque ativo
  },
  {
    id: 3,
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam in augue ligula. Donec sed eros vel lacus condimentum sollicitudin...',
    bannerImage: null,
    publishedAt: '2025-10-04T10:00:00.000Z',
    author: { name: 'John Doe', email: 'john@example.com' },
    category: 'Desenvolvimento web',
    readTime: '6min',
    views: 122,
    likes: 45
  },
  {
    id: 4,
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam in augue ligula. Donec sed eros vel lacus condimentum sollicitudin...',
    bannerImage: null,
    publishedAt: '2025-10-04T09:00:00.000Z',
    author: { name: 'John Doe', email: 'john@example.com' },
    category: 'Desenvolvimento web',
    readTime: '6min',
    views: 122,
    likes: 12
  },
  {
    id: 5,
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam in augue ligula. Donec sed eros vel lacus condimentum sollicitudin...',
    bannerImage: null,
    publishedAt: '2025-10-04T08:00:00.000Z',
    author: { name: 'John Doe', email: 'john@example.com' },
    category: 'DevOps',
    readTime: '4min',
    views: 95,
    likes: 30
  },
  {
    id: 6,
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam in augue ligula. Donec sed eros vel lacus condimentum sollicitudin...',
    bannerImage: null,
    publishedAt: '2025-10-04T07:00:00.000Z',
    author: { name: 'John Doe', email: 'john@example.com' },
    category: 'Inteligência Artificial',
    readTime: '8min',
    views: 310,
    likes: 75
  }
];

const CATEGORIES = ['Todos', 'Desenvolvimento web', 'DevOps', 'Inteligência Artificial', 'Mobile', 'Design'];

export const Home = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  
  const articlesSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('http://localhost:3333/api/articles')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // Adiciona propriedades simuladas para os posts carregados da API do banco de dados
          const enriched = data.map((art: any) => {
            const wordCount = art.content ? art.content.split(/\s+/).length : 0;
            const readMinutes = Math.max(1, Math.ceil(wordCount / 200));
            return {
              ...art,
              category: art.category || ['Desenvolvimento web', 'DevOps', 'Inteligência Artificial'][(art.id * 3) % 3],
              readTime: `${readMinutes}min`,
              views: art.views || (art.id * 143) % 1000,
              likes: art.likes || (art.id * 7) % 89,
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
            <Link to="/register" className="btn-hero-outline">
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
                {art.bannerImage ? (
                  <img src={art.bannerImage} alt={art.title} className="card-image" />
                ) : (
                  <div className="card-image-placeholder">
                    <span>Lorem ipsum</span>
                  </div>
                )}
                
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
