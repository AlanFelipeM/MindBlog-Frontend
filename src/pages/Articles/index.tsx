import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, LayoutGrid, List, Clock, Heart, Eye } from 'lucide-react';
import './styles.css';

// Interface que descreve a estrutura de cada artigo na listagem
interface ArticleItem {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  readTime: string;
  views: number;
  likes: number;
  bannerImage: string;
  author: {
    name: string;
    avatar: string;
  };
}

// Lista de artigos mockados para alimentar a página de listagem completa
const MOCK_ARTICLES: ArticleItem[] = [
  {
    id: 1,
    title: 'O Futuro da Inteligência Artificial em 2025',
    excerpt: 'Explorando as tendências e inovações que moldarão o futuro da inteligência artificial nos próximos anos.',
    category: 'Desenvolvimento web',
    publishedAt: '2025-10-04',
    readTime: '6min',
    views: 122,
    likes: 1,
    bannerImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    author: {
      name: 'John Doe',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    },
  },
  {
    id: 2,
    title: 'Guia Completo de Clean Code no Frontend',
    excerpt: 'Aprenda as melhores práticas para manter seu código React legível, testável e fácil de dar manutenção.',
    category: 'Desenvolvimento web',
    publishedAt: '2025-10-02',
    readTime: '8min',
    views: 95,
    likes: 4,
    bannerImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    author: {
      name: 'Maria Souza',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    },
  },
  {
    id: 3,
    title: 'Arquitetura de Micro-Frontends com Module Federation',
    excerpt: 'Como escalar aplicações de grande porte dividindo o frontend em partes independentes e reutilizáveis.',
    category: 'Desenvolvimento web',
    publishedAt: '2025-09-28',
    readTime: '10min',
    views: 210,
    likes: 12,
    bannerImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    author: {
      name: 'Carlos Oliveira',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
    },
  },
  {
    id: 4,
    title: 'Design Systems com CSS Moderno e Tailwind',
    excerpt: 'Construa uma biblioteca de componentes consistente utilizando tokens de design e classes utilitárias.',
    category: 'UX/UI Design',
    publishedAt: '2025-09-20',
    readTime: '5min',
    views: 140,
    likes: 8,
    bannerImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    author: {
      name: 'Ana Clara',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    },
  },
  {
    id: 5,
    title: 'Como Otimizar a Performance de Aplicações React',
    excerpt: 'Dicas práticas sobre memoização, lazy loading de componentes e redução do tamanho do bundle final.',
    category: 'Desenvolvimento web',
    publishedAt: '2025-09-15',
    readTime: '7min',
    views: 180,
    likes: 15,
    bannerImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    author: {
      name: 'Lucas Silva',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    },
  },
  {
    id: 6,
    title: 'Introdução ao TypeScript para Desenvolvedores JS',
    excerpt: 'Entenda os conceitos básicos de tipagem estática e como o TypeScript pode evitar bugs antes da produção.',
    category: 'Desenvolvimento web',
    publishedAt: '2025-09-10',
    readTime: '9min',
    views: 310,
    likes: 24,
    bannerImage: 'https://images.unsplash.com/photo-1516116211223-4c7141326c65?auto=format&fit=crop&w=800&q=80',
    author: {
      name: 'Gabriel Santos',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    },
  },
];

export const Articles = () => {
  const navigate = useNavigate();

  // Estado para controlar o modo de exibição atual ('grid' para cards completos ou 'list' para listagem horizontal)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Estado para armazenar o termo digitado na barra de pesquisa
  const [searchQuery, setSearchQuery] = useState('');

  // Estado para controlar a categoria selecionada no filtro
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Estado que armazena a lista de artigos a ser exibida na tela
  const [articles, setArticles] = useState<ArticleItem[]>(MOCK_ARTICLES);

  // Busca os artigos da API backend e utiliza os dados simulados caso o servidor não responda
  useEffect(() => {
    fetch('http://localhost:3333/api/articles')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const enriched = data.map((art: any) => ({
            ...art,
            excerpt: art.excerpt || art.content || '',
            category: art.category || 'Desenvolvimento web',
            readTime: art.readTime || '5min',
            views: art.views || 0,
            likes: art.likes || 0,
            author: {
              name: art.author?.name || 'John Doe',
              avatar: art.author?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
            },
          }));
          setArticles(enriched);
        }
      })
      .catch(() => {
        // Em caso de falha na requisição, mantemos os artigos simulados
        setArticles(MOCK_ARTICLES);
      });
  }, []);

  // Filtra os artigos dinamicamente de acordo com a pesquisa por texto e a categoria escolhida
  const filteredArticles = articles.filter((article) => {
    const title = (article.title || '').toLowerCase();
    const excerpt = (article.excerpt || '').toLowerCase();
    const category = (article.category || '').toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesSearch = title.includes(query) || excerpt.includes(query);
    const matchesCategory =
      selectedCategory === 'all' || category === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // Função para formatar a data de publicação no padrão "D mes YYYY" (ex: 4 out 2025)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  return (
    <div className="articles-page-container">
      {/* Seção do cabeçalho da página com título e descrição */}
      <div className="articles-header-section">
        <h1 className="articles-page-title">Todos os Artigos</h1>
        <p className="articles-page-subtitle">
          Explore nossa coleção completa de artigos técnicos
        </p>
      </div>

      {/* Barra de ferramentas: busca, filtro de categoria e alternador de visualização */}
      <div className="articles-toolbar-section">
        {/* Campo de pesquisa por texto */}
        <div className="search-input-wrapper">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Buscar artigos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Grupo com filtro de categoria e botões de alternância de exibição */}
        <div className="toolbar-controls-group">
          {/* Dropdown com ícone de funil para filtrar por categoria */}
          <div className="category-filter-wrapper">
            <Filter className="filter-icon" size={18} />
            <select
              className="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">Todas as categorias</option>
              <option value="Desenvolvimento web">Desenvolvimento web</option>
              <option value="UX/UI Design">UX/UI Design</option>
              <option value="Inteligência Artificial">Inteligência Artificial</option>
            </select>
          </div>

          {/* Botões de alternância de modo de exibição (Grid ou Lista) */}
          <div className="view-mode-toggle-box">
            <button
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Exibição em Grid (Cards)"
              aria-label="Modo Grid"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="Exibição em Lista (Linha)"
              aria-label="Modo Lista"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Mensagem exibida caso a busca ou filtro não retornem resultados */}
      {filteredArticles.length === 0 ? (
        <div className="no-articles-found">
          <p>Nenhum artigo encontrado com os filtros selecionados.</p>
        </div>
      ) : (
        /* Container de exibição dos artigos (alterna dinamicamente a classe entre grid e list) */
        <div className={`articles-list-container ${viewMode}-mode`}>
          {filteredArticles.map((article) => (
            <article
              key={article.id}
              className="article-card-item"
              onClick={() => navigate(`/artigos/${article.id}`)}
            >
              {/* Imagem de capa do artigo */}
              <div className="article-card-image-box">
                <img
                  src={article.bannerImage}
                  alt={article.title}
                  className="article-card-img"
                />
              </div>

              {/* Conteúdo textual e métricas do artigo */}
              <div className="article-card-content">
                {/* Meta-informações superiores: categoria e data */}
                <div className="card-top-meta">
                  <span className="card-category-tag">{article.category}</span>
                  <span className="card-publish-date">
                    <Clock size={12} /> {formatDate(article.publishedAt)}
                  </span>
                </div>

                {/* Título do artigo */}
                <h3 className="card-article-title">{article.title}</h3>

                {/* Resumo do conteúdo do artigo */}
                <p className="card-article-excerpt">{article.excerpt}</p>

                {/* Rodapé do card: dados do autor e estatísticas de engajamento */}
                <div className="card-footer-meta">
                  <div className="card-author-info">
                    <span className="card-author-name">{article.author.name}</span>
                  </div>

                  <div className="card-stats-info">
                    <span className="stat-badge">
                      <Clock size={12} /> {article.readTime}
                    </span>
                    <span className="stat-badge">
                      <Eye size={12} /> {article.views}
                    </span>
                    <span className="stat-badge">
                      <Heart size={12} /> {article.likes}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
