// Configuração centralizada da URL base da API (Desenvolvimento Local vs Produção no Render)
export const API_URL = import.meta.env.VITE_API_URL || 'https://mindblog-backend-6hs2.onrender.com/api';

// Imagem padrão de alta qualidade para artigos que não possuem imagem enviada
export const DEFAULT_BANNER = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80';
