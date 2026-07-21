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
  Trash2,
  CheckCircle 
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
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  // Estado para toast de mensagem de sucesso ao publicar/editar artigo
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Nome exibido na saudação inicial do dashboard
  const userName = user?.name || 'Usuário';

  // Verifica se há mensagem de sucesso pendente no localStorage
  useEffect(() => {
    const msg = localStorage.getItem('@MindBlog:toastMessage');
    if (msg) {
      setToastMessage(msg);
      localStorage.removeItem('@MindBlog:toastMessage');
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Função utilitária para formatar tempo decorrido de comentários
  const formatTimeAgo = (dateStr: string) => {
    if (!dateStr) return 'recente';
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'agora mesmo';
    if (diffMins < 60) return `${diffMins} min atrás`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h atrás`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d atrás`;
  };

  // Busca artigos reais do banco de dados/API para o usuário logado e processa comentários/curtidas reais
  useEffect(() => {
    // Resgata a lista de IDs de artigos previamente excluídos no navegador
    const deletedIds: number[] = JSON.parse(localStorage.getItem('@MindBlog:deletedArticles') || '[]');

    fetch('http://localhost:3333/api/articles')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const allActivitiesList: ActivityItem[] = [];

          // Função auxiliar que valida se o artigo foi criado pelo usuário atualmente autenticado
          const isMyArticle = (art: any) => {
            if (!user) return false;
            if (art.authorId && user.id && Number(art.authorId) === Number(user.id)) return true;
            if (art.author?.id && user.id && Number(art.author.id) === Number(user.id)) return true;
            if (art.author?.name && user.name && art.author.name.trim().toLowerCase() === user.name.trim().toLowerCase()) return true;
            return false;
          };

          const userArticles = data
            .filter((art: any) => !deletedIds.includes(art.id) && isMyArticle(art))
            .map((art: any) => {
              // Resgata os comentários dinâmicos salvos para este artigo
              const storedComments: any[] = JSON.parse(localStorage.getItem(`@MindBlog:comments_${art.id}`) || '[]');

              // Alimenta a lista de Atividades Recentes com os comentários reais do artigo
              storedComments.forEach((c) => {
                allActivitiesList.push({
                  id: c.id,
                  userName: c.authorName,
                  userAvatar: c.authorAvatar || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23A1A1AA'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E",
                  articleTitle: art.title,
                  timeAgo: formatTimeAgo(c.date),
                });
              });

              // Resgata as curtidas do próprio artigo e dos comentários
              const likedByUsers: string[] = JSON.parse(localStorage.getItem(`@MindBlog:article_liked_by_${art.id}`) || '[]');
              const articleLikes = (art.likes || 0) + likedByUsers.length;
              const commentLikes = storedComments.reduce((sum, c) => sum + (c.likes || 0), 0);
              const totalArticleLikes = articleLikes + commentLikes;

              // Calcula o tempo estimado de leitura com base nas palavras do conteúdo
              const wordCount = art.content ? art.content.split(/\s+/).length : 0;
              const readMinutes = Math.max(1, Math.ceil(wordCount / 200));

              return {
                id: art.id,
                title: art.title,
                excerpt: art.content ? art.content.substring(0, 80) + '...' : '',
                publishedAt: new Date(art.publishedAt || Date.now()).toLocaleDateString('pt-BR'),
                commentsCount: storedComments.length + (art.commentsCount || 0),
                likesCount: totalArticleLikes,
                bannerImage: art.bannerImage || null,
                readMinutes,
              };
            });

          setMyArticles(userArticles);

          // Também verifica se há comentários em artigos simulados (ID 1)
          const mockComments: any[] = JSON.parse(localStorage.getItem('@MindBlog:comments_1') || '[]');
          mockComments.forEach((c) => {
            if (!allActivitiesList.some((item) => item.id === c.id)) {
              allActivitiesList.push({
                id: c.id,
                userName: c.authorName,
                userAvatar: c.authorAvatar || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23A1A1AA'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E",
                articleTitle: 'O Futuro da Inteligência Artificial em 2025',
                timeAgo: formatTimeAgo(c.date),
              });
            }
          });

          setActivities(allActivitiesList);
        }
      })
      .catch(() => {
        setMyArticles([]);
      });
  }, [user]);

  // Estado para controlar o modal de confirmação de exclusão do artigo
  const [articleToDelete, setArticleToDelete] = useState<number | null>(null);

  // Função para abrir o modal de confirmação de exclusão
  const handleOpenDeleteModal = (articleId: number) => {
    setArticleToDelete(articleId);
  };

  // Função para confirmar e efetuar a exclusão real do artigo selecionado
  const handleConfirmDelete = async () => {
    if (!articleToDelete) return;

    // Salva o ID do artigo no localStorage de excluídos para persistência garantida
    const deletedIds: number[] = JSON.parse(localStorage.getItem('@MindBlog:deletedArticles') || '[]');
    if (!deletedIds.includes(articleToDelete)) {
      deletedIds.push(articleToDelete);
      localStorage.setItem('@MindBlog:deletedArticles', JSON.stringify(deletedIds));
    }

    try {
      const token = localStorage.getItem('@MindBlog:token');
      await fetch(`http://localhost:3333/api/articles/${articleToDelete}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error('Erro ao excluir artigo na API:', err);
    }

    // Remove o artigo da lista local para atualização imediata na interface
    setMyArticles((prev) => prev.filter((art) => art.id !== articleToDelete));
    setArticleToDelete(null);
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
      {/* Alerta toast de confirmação de publicação/edição */}
      {toastMessage && (
        <div className="dashboard-toast-success">
          <CheckCircle size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

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
                      onClick={() => handleOpenDeleteModal(art.id)}
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

      {/* Modal de confirmação visual para exclusão de artigo (Fiel ao Figma Excluir Artigo.png) */}
      {articleToDelete !== null && (
        <div className="delete-modal-overlay">
          <div className="delete-modal-card" style={{ backgroundColor: '#0B0E13' }}>
            <h2 className="delete-modal-title">Excluir Artigo</h2>
            <p className="delete-modal-description">
              Tem certeza que deseja excluir este artigo? Esta ação não pode ser desfeita.
            </p>

            <div className="delete-modal-actions">
              <button
                onClick={() => setArticleToDelete(null)}
                className="btn-modal-cancel"
              >
                Cancelar
              </button>

              <button
                onClick={handleConfirmDelete}
                className="btn-modal-confirm-delete"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
