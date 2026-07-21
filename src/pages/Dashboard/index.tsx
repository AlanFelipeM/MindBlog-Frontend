import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Settings as SettingsIcon, 
  Plus, 
  FileText, 
  MessageSquare, 
  Heart, 
  TrendingUp, 
  Edit, 
  Trash2 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './styles.css';

// Interface que representa a estrutura de um artigo exibido no painel do dashboard
interface DashboardArticle {
  id: number;
  title: string;
  excerpt: string;
  publishedAt: string;
  commentsCount: number;
  likesCount: number;
  bannerImage: string | null;
  readMinutes?: number;
}

// Interface para as atividades recentes de comentários na plataforma
interface ActivityItem {
  id: number;
  userName: string;
  userAvatar: string;
  articleTitle: string;
  timeAgo: string;
}

export const Dashboard = () => {
  const navigate = useNavigate();
  // Resgata as informações do usuário autenticado no sistema
  const { user } = useAuth();

  // Estados locais para gerenciar os artigos reais do usuário e a atividade recente
  const [myArticles, setMyArticles] = useState<DashboardArticle[]>([]);
  const [activities] = useState<ActivityItem[]>([]);

  // Nome exibido na saudação inicial do dashboard
  const userName = user?.name || 'Usuário';

  // Busca artigos reais do banco de dados/API para o usuário logado
  useEffect(() => {
    fetch('http://localhost:3333/api/articles')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const userArticles = data.map((art: any) => {
            // Calcula o tempo estimado de leitura com base nas palavras do conteúdo
            const wordCount = art.content ? art.content.split(/\s+/).length : 0;
            const readMinutes = Math.max(1, Math.ceil(wordCount / 200));

            return {
              id: art.id,
              title: art.title,
              excerpt: art.content ? art.content.substring(0, 80) + '...' : '',
              publishedAt: new Date(art.publishedAt || Date.now()).toLocaleDateString('pt-BR'),
              commentsCount: art.commentsCount || 0,
              likesCount: art.likes || 0,
              bannerImage: art.bannerImage || null,
              readMinutes,
            };
          });
          setMyArticles(userArticles);
        }
      })
      .catch(() => {
        setMyArticles([]);
      });
  }, []);

  // Função para excluir um artigo da lista real
  const handleDeleteArticle = (articleId: number) => {
    if (window.confirm('Tem certeza de que deseja excluir este artigo?')) {
      setMyArticles((prev) => prev.filter((art) => art.id !== articleId));
    }
  };

  // Cálculo dinâmico e 100% real das 4 estatísticas do topo
  const totalArticles = myArticles.length;
  const totalEngagement = myArticles.reduce((acc, curr) => acc + curr.commentsCount, 0);
  const totalLikes = myArticles.reduce((acc, curr) => acc + curr.likesCount, 0);
  
  // Cálculo do tempo médio de leitura dos artigos publicados
  const avgReadTime = totalArticles > 0 
    ? `${Math.round(myArticles.reduce((acc, curr) => acc + (curr.readMinutes || 1), 0) / totalArticles)} min`
    : '0 min';

  return (
    <div className="dashboard-page-container">
      {/* Seção superior do Dashboard: título de boas-vindas e botões de ação principal */}
      <div className="dashboard-header-row">
        <div className="dashboard-title-box">
          <h1 className="dashboard-page-title">Dashboard</h1>
          <p className="dashboard-page-subtitle">Bem-vindo de volta, {userName}!</p>
        </div>

        <div className="dashboard-actions-box">
          {/* Botão para navegar para as Configurações do Perfil */}
          <Link to="/configuracoes" className="btn-dashboard-secondary">
            <SettingsIcon size={16} /> Configurações
          </Link>

          {/* Botão principal em ciano para criar um Novo Artigo */}
          <Link to="/artigos/novo" className="btn-dashboard-primary">
            <Plus size={18} /> Novo Artigo
          </Link>
        </div>
      </div>

      {/* Grade de 4 Cards com Métricas Gerais de Desempenho */}
      <div className="dashboard-metrics-grid">
        {/* Card 1: Total de Artigos */}
        <div className="metric-card">
          <div className="metric-card-header">
            <span className="metric-card-label">Total de Artigos</span>
            <FileText size={18} className="metric-card-icon" />
          </div>
          <span className="metric-card-value">{totalArticles}</span>
        </div>

        {/* Card 2: Engajamento (Comentários) */}
        <div className="metric-card">
          <div className="metric-card-header">
            <span className="metric-card-label">Engajamento</span>
            <MessageSquare size={18} className="metric-card-icon" />
          </div>
          <span className="metric-card-value">{totalEngagement}</span>
        </div>

        {/* Card 3: Curtidas Recebidas */}
        <div className="metric-card">
          <div className="metric-card-header">
            <span className="metric-card-label">Curtidas</span>
            <Heart size={18} className="metric-card-icon" />
          </div>
          <span className="metric-card-value">{totalLikes}</span>
        </div>

        {/* Card 4: Tempo Médio de Leitura */}
        <div className="metric-card">
          <div className="metric-card-header">
            <span className="metric-card-label">Tempo médio de leitura</span>
            <TrendingUp size={18} className="metric-card-icon" />
          </div>
          <span className="metric-card-value">{avgReadTime}</span>
        </div>
      </div>

      {/* Conteúdo Principal em 2 Colunas: Meus Artigos na esquerda e Atividade Recente na direita */}
      <div className="dashboard-main-content">
        {/* Coluna Principal da Esquerda: Lista Meus Artigos */}
        <div className="dashboard-panel my-articles-panel">
          <div className="panel-header">
            <h2 className="panel-title">Meus Artigos</h2>
          </div>
          <div className="panel-title-divider" />

          <div className="my-articles-list">
            {myArticles.length === 0 ? (
              <div className="no-articles-placeholder">
                <p>Você ainda não possui artigos publicados.</p>
              </div>
            ) : (
              myArticles.map((art) => (
                <div key={art.id} className="my-article-item-card">
                  {/* Banner/Imagem miniatura do artigo */}
                  <div className="my-article-thumb-box">
                    {art.bannerImage ? (
                      <img src={art.bannerImage} alt={art.title} className="my-article-thumb-img" />
                    ) : (
                      <div className="my-article-thumb-placeholder">
                        <span>Lorem ipsum</span>
                      </div>
                    )}
                  </div>

                  {/* Informações detalhadas do artigo */}
                  <div className="my-article-details">
                    <h3 className="my-article-title">{art.title}</h3>
                    <p className="my-article-excerpt">{art.excerpt}</p>

                    <div className="my-article-meta-row">
                      <span>{art.publishedAt}</span>
                      <span className="meta-dot">•</span>
                      <span className="meta-badge"><MessageSquare size={13} /> {art.commentsCount}</span>
                      <span className="meta-dot">•</span>
                      <span className="meta-badge"><Heart size={13} /> {art.likesCount}</span>
                    </div>
                  </div>

                  {/* Botões de Ação: Editar e Excluir */}
                  <div className="my-article-actions">
                    <button
                      onClick={() => navigate(`/artigos/editar/${art.id}`)}
                      className="btn-action-edit"
                      title="Editar Artigo"
                    >
                      <Edit size={15} /> Editar
                    </button>

                    <button
                      onClick={() => handleDeleteArticle(art.id)}
                      className="btn-action-delete"
                      title="Excluir Artigo"
                    >
                      <Trash2 size={15} /> Excluir
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Coluna Secundária da Direita: Atividade Recente da Comunidade */}
        <div className="dashboard-panel recent-activity-panel">
          <div className="panel-header">
            <h2 className="panel-title">Atividade Recente</h2>
          </div>
          <div className="panel-title-divider" />

          <div className="recent-activities-list">
            {activities.length === 0 ? (
              <div className="no-activities-placeholder">
                <p>Nenhuma atividade recente no momento.</p>
              </div>
            ) : (
              activities.map((act) => (
                <div key={act.id} className="activity-item-row">
                  <div className="activity-user-avatar">
                    <img src={act.userAvatar} alt={act.userName} className="activity-avatar-img" />
                  </div>

                  <div className="activity-text-info">
                    <p className="activity-description">
                      <strong className="activity-user-name">{act.userName}</strong> comentou em{' '}
                      <span className="activity-target-article">{act.articleTitle}</span>
                    </p>
                    <span className="activity-time-stamp">
                      <MessageSquare size={12} /> {act.timeAgo}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
