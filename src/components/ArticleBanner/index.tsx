import React from 'react';
import { FileText } from 'lucide-react';
import './styles.css';

interface ArticleBannerProps {
  src?: string | null;
  alt: string;
  className?: string;
}

// Componente de Banner Minimalista para Artigos sem foto enviada
export const ArticleBanner: React.FC<ArticleBannerProps> = ({ src, alt, className = 'article-card-img' }) => {
  if (src && src.trim() !== '') {
    return <img src={src} alt={alt} className={className} />;
  }

  return (
    <div className={`article-banner-minimalist ${className}`}>
      <FileText size={34} className="minimalist-banner-icon" />
      <span className="minimalist-banner-text">MindBlog</span>
    </div>
  );
};
