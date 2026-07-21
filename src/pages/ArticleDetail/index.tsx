import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Heart, Bookmark, Share2, Clock, Eye, MessageSquare, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './styles.css';

// Interface que descreve a estrutura de um comentário
interface Comment {
  id: number;
  authorName: string;
  authorAvatar: string | null;
  date: string;
  content: string;
  likes: number;
}

// Interface que descreve a estrutura de um artigo completo
interface Article {
  id: number;
  title: string;
  content: string;
  bannerImage: string | null;
  publishedAt: string;
  author: {
    name: string;
    email: string;
    avatar?: string | null;
  };
  category: string;
  readTime: string;
  views: number;
  likes: number;
  tags?: string[];
  commentsList: Comment[];
}

// Artigo simulado do Figma para exibição caso o banco esteja vazio ou o ID corresponda a ele
const FIGMA_MOCK_ARTICLE: Article = {
  id: 1,
  title: 'O Futuro da Inteligência Artificial em 2025',
  content: `O Futuro da Inteligência Artificial em 2025

A inteligência artificial continua a evoluir em um ritmo acelerado. Neste artigo, vamos explorar as principais tendências e inovações que estão moldando o futuro da IA.

Modelos de Linguagem Avançados

Os modelos de linguagem como GPT-4 e além estão se tornando cada vez mais sofisticados, capazes de entender e gerar texto com precisão impressionante.

Automação Inteligente

A automação está alcançando novos patamares com sistemas de IA que podem tomar decisões complexas e adaptar-se a novas situações.

Ética e Responsabilidade

Com o avanço da IA, questões éticas se tornam cada vez mais importantes. É crucial desenvolver sistemas responsáveis e transparentes.`,
  bannerImage: null,
  publishedAt: '2026-01-20T12:00:00.000Z',
  author: {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80' // Imagem de exemplo quadrada
  },
  category: 'Desenvolvimento web',
  readTime: '6min',
  views: 122,
  likes: 1,
  tags: ['Desenvolvimento web', 'Inteligência Artificial', 'Desenvolvimento backend'],
  commentsList: [
    {
      id: 1,
      authorName: 'John Doe',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80',
      date: '2026-01-20T12:00:00.000Z',
      content: 'Excelente artigo! Muito bem explicado sobre as tendências de IA.',
      likes: 1
    },
    {
      id: 2,
      authorName: 'Marie Smith',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
      date: '2026-01-20T12:00:00.000Z',
      content: 'Artigo muito interessante, mostra claramente como a IA está deixando de ser tendência para se tornar parte essencial das soluções do dia a dia.',
      likes: 4
    }
  ]
};

// Avatar padrão de usuário em formato SVG (silhueta clássica de sites) utilizado quando o perfil não possui foto
const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23A1A1AA'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

export const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  // Estados locais para controle do artigo, carregamento e comentários novos
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentContent, setNewCommentContent] = useState('');

  useEffect(() => {
    // Carrega comentários salvos previamente para este artigo no localStorage
    const storedCommentsStr = localStorage.getItem(`@MindBlog:comments_${id}`);

    // Tenta carregar o artigo a partir da API do backend
    fetch(`http://localhost:3333/api/articles/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Artigo não encontrado');
        return res.json();
      })
      .then((data) => {
        // Mapeia os campos da API adicionando os dados necessários do Figma
        const wordCount = data.content ? data.content.split(/\s+/).length : 0;
        const readMinutes = Math.max(1, Math.ceil(wordCount / 200));
        
        const enriched: Article = {
          ...data,
          category: data.category || 'Desenvolvimento web',
          readTime: `${readMinutes}min`,
          views: data.views || (data.id * 143) % 1000,
          likes: data.likes || (data.id * 7) % 89,
          tags: data.tags || ['Desenvolvimento web', 'Inteligência Artificial', 'Desenvolvimento backend'],
          commentsList: []
        };
        setArticle(enriched);

        if (storedCommentsStr) {
          try {
            setComments(JSON.parse(storedCommentsStr));
          } catch {
            setComments([]);
          }
        } else {
          setComments([]);
        }
      })
      .catch(() => {
        // Fallback caso a API falhe ou o ID seja 1 (ID simulado do Figma)
        if (id === '1' || !id) {
          setArticle(FIGMA_MOCK_ARTICLE);
          if (storedCommentsStr) {
            try {
              setComments(JSON.parse(storedCommentsStr));
            } catch {
              setComments(FIGMA_MOCK_ARTICLE.commentsList);
            }
          } else {
            setComments(FIGMA_MOCK_ARTICLE.commentsList);
          }
        } else {
          // Se for outro ID inexistente, redireciona de volta para a Home
          navigate('/');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, navigate]);

  // Função para lidar com o envio de um novo comentário
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentContent.trim()) return;

    // Utiliza o nome e avatar reais do usuário autenticado no sistema (ou o avatar padrão de silhueta)
    const authorName = user?.name || 'Usuário';
    const authorAvatar = user?.avatar || DEFAULT_AVATAR;

    const newComment: Comment = {
      id: Date.now(),
      authorName,
      authorAvatar,
      date: new Date().toISOString(),
      content: newCommentContent,
      likes: 0
    };

    const updatedComments = [...comments, newComment];
    setComments(updatedComments);

    // Persiste os comentários no localStorage para garantir que não sumam no F5
    if (id) {
      localStorage.setItem(`@MindBlog:comments_${id}`, JSON.stringify(updatedComments));
    }

    setNewCommentContent('');
  };

  // Função para incrementar curtidas no comentário selecionado
  const handleLikeComment = (commentId: number) => {
    setComments(prev => {
      const next = prev.map(c => (c.id === commentId ? { ...c, likes: c.likes + 1 } : c));
      if (id) {
        localStorage.setItem(`@MindBlog:comments_${id}`, JSON.stringify(next));
      }
      return next;
    });
  };

  // Função auxiliar para formatação de data no padrão DD/MM/YYYY
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Renderiza tela de carregamento caso a chamada de rede esteja pendente
  if (loading) {
    return (
      <div className="article-loading-container">
        <p>Carregando artigo...</p>
      </div>
    );
  }

  // Se por alguma razão o artigo for nulo, não exibe nada
  if (!article) return null;

  return (
    <div className="article-detail-page">
      {/* Botão de navegação para retornar ao feed principal de artigos */}
      <div className="article-back-nav">
        <button onClick={() => navigate('/')} className="back-btn">
          <ArrowLeft size={16} /> Voltar aos Artigos
        </button>
      </div>

      <article className="article-main-container">
        {/* Categoria do artigo no topo */}
        <div className="article-top-meta">
          <span className="article-category-tag">{article.category}</span>
        </div>

        {/* Título principal do artigo */}
        <h1 className="article-main-title">{article.title}</h1>

        {/* Subtítulo ou resumo explicativo */}
        <p className="article-main-subtitle">
          Explorando as tendências e inovações que moldarão o futuro da IA nos próximos anos.
        </p>

        {/* Seção com dados do Autor e Ações Rápidas (Curtir, Salvar, Compartilhar) */}
        <div className="article-author-section">
          <div className="author-info-box">
            {article.author.avatar ? (
              <img src={article.author.avatar} alt={article.author.name} className="author-avatar-img" />
            ) : (
              <div className="author-avatar-placeholder">
                <User size={20} />
              </div>
            )}
            <div className="author-text-meta">
              <span className="author-name-text">{article.author.name}</span>
              <div className="author-sub-meta">
                <span className="publish-date-text">{formatDate(article.publishedAt)}</span>
                <span className="dot-divider">•</span>
                <span className="read-time-box"><Clock size={12} /> {article.readTime}</span>
              </div>
            </div>
          </div>

          <div className="article-quick-actions">
            <button className="action-btn" aria-label="Curtir artigo">
              <Heart size={18} />
            </button>
            <button className="action-btn" aria-label="Salvar artigo">
              <Bookmark size={18} />
            </button>
            <button className="action-btn" aria-label="Compartilhar artigo">
              <Share2 size={18} />
            </button>
          </div>
        </div>

        {/* Métricas secundárias abaixo da caixa do autor */}
        <div className="article-stats-row">
          <span className="stat-item"><Heart size={14} /> {article.likes} curtidas</span>
          <span className="stat-item"><Eye size={14} /> {article.views} visualizações</span>
          <span className="stat-item"><MessageSquare size={14} /> {comments.length} comentários</span>
        </div>

        {/* Imagem de banner principal ou placeholder retangular */}
        <div className="article-banner-wrapper">
          {article.bannerImage ? (
            <img src={article.bannerImage} alt={article.title} className="article-banner-img" />
          ) : (
            <div className="article-banner-placeholder">
              <span>Lorem ipsum</span>
            </div>
          )}
        </div>

        {/* Conteúdo dinâmico do artigo contendo os textos e seções */}
        <div className="article-body-content">
          <h3 className="content-bold-title">{article.title}</h3>
          {article.content.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className="content-paragraph">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Tags rodando ao final do artigo */}
        {article.tags && article.tags.length > 0 && (
          <div className="article-tags-footer">
            {article.tags.map((tag) => (
              <span key={tag} className="article-tag-item">
                {tag}
              </span>
            ))}
          </div>
        )}

        <hr className="article-divider" />

        {/* Seção Geral de Comentários */}
        <div className="comments-section-container">
          <h3 className="comments-header-title">Comentário ({comments.length})</h3>

          {/* Área de interação de novos comentários condicional ao login */}
          {!isAuthenticated ? (
            <div className="login-prompt-card">
              <span className="prompt-text">Faça login para comentar</span>
              <Link to="/login" className="prompt-login-btn">
                Fazer login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleCommentSubmit} className="comment-create-form">
              <textarea
                className="comment-textarea"
                placeholder="Ótimo artigo. Esperando pelo próximo!"
                value={newCommentContent}
                onChange={(e) => setNewCommentContent(e.target.value)}
                required
              />
              <button type="submit" className="comment-publish-btn">
                Publicar Comentário
              </button>
            </form>
          )}

          {/* Listagem dos comentários publicados */}
          <div className="comments-list-box">
            {comments.map((comment) => (
              <div key={comment.id} className="comment-card-wrapper">
                <div className="comment-header-row">
                  <div className="commenter-info">
                    {comment.authorAvatar ? (
                      <img src={comment.authorAvatar} alt={comment.authorName} className="commenter-avatar-img" />
                    ) : (
                      <div className="commenter-avatar-placeholder">
                        <User size={16} />
                      </div>
                    )}
                    <div className="commenter-meta">
                      <span className="commenter-name">{comment.authorName}</span>
                      <span className="comment-date-text">{formatDate(comment.date)}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleLikeComment(comment.id)} 
                    className="comment-like-btn"
                    aria-label="Curtir comentário"
                  >
                    <Heart size={14} /> {comment.likes}
                  </button>
                </div>
                <p className="comment-body-text">{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
};
