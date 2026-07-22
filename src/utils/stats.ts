import { DEFAULT_BANNER } from '../config/api';

// Função utilitária que calcula métricas 100% reais para qualquer artigo
export function getRealArticleStats(art: any) {
  // 1. Tempo de Leitura Real: Calculado a partir do total de palavras (média de 200 palavras por minuto)
  const wordCount = art.content ? art.content.trim().split(/\s+/).filter(Boolean).length : 0;
  const readMinutes = Math.max(1, Math.ceil(wordCount / 200));

  // 2. Visualizações Reais: Registradas dinamicamente no localStorage ao abrir o artigo (inicia em 0 para novos artigos)
  const storedViews = localStorage.getItem(`@MindBlog:views_${art.id}`);
  const viewsCount = storedViews !== null ? parseInt(storedViews, 10) : (art.views || 0);

  // 3. Curtidas Reais: Armazenadas dinamicamente na lista de curtidas por usuário (inicia em 0 para novos artigos)
  const storedLikes = localStorage.getItem(`@MindBlog:liked_by_${art.id}`);
  let likesCount = 0;
  if (storedLikes) {
    try {
      const arr = JSON.parse(storedLikes);
      likesCount = Array.isArray(arr) ? arr.length : (art.likes || 0);
    } catch {
      likesCount = art.likes || 0;
    }
  } else {
    likesCount = art.likes || 0;
  }

  // 4. Imagem do Banner: Se não houver banner customizado, utiliza o banner padrão de tecnologia de alta qualidade
  const bannerImage = art.bannerImage || DEFAULT_BANNER;

  return {
    readTime: `${readMinutes}min`,
    views: viewsCount,
    likes: likesCount,
    bannerImage,
  };
}
