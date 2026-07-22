import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, X } from 'lucide-react';
import { API_URL } from '../../config/api';
import './styles.css';

export const CreateArticle = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();

  // Determina se a página está em modo de edição de artigo existente
  const isEditing = Boolean(id);

  // Estados dos campos do formulário
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('Desenvolvimento web');
  const [bannerImage, setBannerImage] = useState('');
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['Typescript', 'Backend', 'IA']);
  const [content, setContent] = useState('');

  // Estados de feedback de erro e carregamento
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [isLoaded, setIsLoaded] = useState(false);

  // Se estiver em modo de edição, busca os dados do artigo UMA ÚNICA VEZ para preencher os campos
  useEffect(() => {
    if (isEditing && id && !isLoaded) {
      fetch(`${API_URL}/articles`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            const articleToEdit = data.find((art: any) => String(art.id) === String(id));
            if (articleToEdit) {
              setTitle(articleToEdit.title || '');
              setContent(articleToEdit.content || '');
              setExcerpt(articleToEdit.content ? articleToEdit.content.substring(0, 100) : '');
              if (articleToEdit.bannerImage) {
                setBannerImage(articleToEdit.bannerImage);
              }
              if (articleToEdit.category) {
                setCategory(articleToEdit.category);
              }
              setIsLoaded(true);
            }
          }
        })
        .catch((err) => console.error('Erro ao carregar artigo para edição:', err));
    }
  }, [isEditing, id, isLoaded]);

  // Função para adicionar uma nova tag à lista
  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  // Permite adicionar tag pressionando Enter no campo de entrada
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Remove uma tag selecionada da lista
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Cálculo ao vivo de caracteres, contagem de palavras e tempo estimado de leitura
  const charCount = content.length;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const readMinutes = Math.max(1, Math.ceil(wordCount / 200));

  // Submissão do formulário para salvar o artigo no banco de dados backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!title.trim() || !content.trim()) {
      setErrorMessage('Por favor, preencha o título e o conteúdo do artigo.');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('@MindBlog:token');
      const url = isEditing
        ? `${API_URL}/articles/${id}`
        : `${API_URL}/articles`;
      const method = isEditing ? 'PUT' : 'POST';

      let response;
      if (bannerFile) {
        // Envia como FormData para que o multer processe como arquivo no backend
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('category', category);
        formData.append('bannerImage', bannerFile);
        // Opcional: enviar tags como JSON
        formData.append('tags', JSON.stringify(tags));

        response = await fetch(url, {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
      } else {
        response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            content,
            bannerImage: bannerImage || null,
            category,
            tags,
          }),
        });
      }

      if (response.ok) {
        localStorage.setItem('@MindBlog:toastMessage', isEditing ? 'Artigo alterado com sucesso!' : 'Artigo publicado com sucesso!');
        navigate('/dashboard');
      } else {
        const errorData = await response.json().catch(() => ({}));
        setErrorMessage(errorData.error || 'Erro ao salvar o artigo no servidor. Tente novamente.');
      }
    } catch (error) {
      setErrorMessage('Erro de conexão ao salvar o artigo. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-article-page">
      {/* Botão de retorno ao Dashboard */}
      <div className="create-article-back-nav">
        <button onClick={() => navigate('/dashboard')} className="btn-back-dashboard">
          <ArrowLeft size={16} /> Voltar ao Dashboard
        </button>
      </div>

      {/* Cabeçalho da página */}
      <div className="create-article-header">
        <h1 className="create-article-title">
          {isEditing ? 'Editar Artigo' : 'Criar Novo Artigo'}
        </h1>
        <p className="create-article-subtitle">
          Compartilhe seu conhecimento com a comunidade
        </p>
      </div>

      {/* Formulário principal */}
      <form onSubmit={handleSubmit} className="create-article-form-wrapper">
        <div className="create-article-card">
          {/* Alerta visual de erro caso ocorra falha */}
          {errorMessage && (
            <div className="create-article-error-alert">
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Campo 1: Título do Artigo */}
          <div className="article-form-group">
            <label htmlFor="articleTitle" className="article-form-label">
              Título do Artigo *
            </label>
            <input
              id="articleTitle"
              type="text"
              className="article-form-input"
              placeholder="O Futuro da Inteligência Artificial em 2025"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Campo 2: Resumo com contador de caracteres */}
          <div className="article-form-group">
            <label htmlFor="articleExcerpt" className="article-form-label">
              Resumo *
            </label>
            <textarea
              id="articleExcerpt"
              className="article-form-textarea short-excerpt"
              rows={3}
              maxLength={120}
              placeholder="Escreva um breve resumo chamativo sobre o artigo..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              required
            />
            <span className="field-counter">{excerpt.length}/120 caracteres</span>
          </div>

          {/* Campo 3: Categoria */}
          <div className="article-form-group">
            <label htmlFor="articleCategory" className="article-form-label">
              Categoria *
            </label>
            <select
              id="articleCategory"
              className="article-form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="Desenvolvimento web">Desenvolvimento web</option>
              <option value="Inteligência Artificial">Inteligência Artificial</option>
              <option value="Backend">Backend</option>
              <option value="Mobile">Mobile</option>
              <option value="DevOps">DevOps</option>
              <option value="Design">Design</option>
            </select>
          </div>

          {/* Campo 4: Imagem de Capa (URL + Upload de arquivo do PC + Pré-visualização) */}
          <div className="article-form-group">
            <label htmlFor="articleCover" className="article-form-label">
              Imagem de Capa *
            </label>
            <input
              id="articleCover"
              type="text"
              className="article-form-input"
              placeholder="Cole uma URL de imagem ou selecione um arquivo abaixo..."
              value={bannerImage.startsWith('data:') ? 'Imagem carregada do seu computador' : bannerImage}
              readOnly={bannerImage.startsWith('data:')}
              onChange={(e) => {
                if (!bannerImage.startsWith('data:')) {
                  setBannerImage(e.target.value);
                  setBannerFile(null);
                }
              }}
            />
            
            {/* Opção para selecionar foto do computador ou limpar */}
            <div className="article-file-upload-row">
              <label htmlFor="articleFileInput" className="btn-upload-file">
                Escolher arquivo do computador
              </label>
              <input
                id="articleFileInput"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden-file-input"
              />
              {bannerImage && (
                <button
                  type="button"
                  onClick={() => {
                    setBannerImage('');
                    setBannerFile(null);
                  }}
                  className="btn-clear-image"
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    color: '#f87171',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    marginLeft: '10px'
                  }}
                >
                  Limpar Imagem
                </button>
              )}
            </div>

            {/* Pré-visualização ao vivo da foto de capa */}
            {bannerImage && (
              <div style={{ marginTop: '12px', borderRadius: '10px', overflow: 'hidden', maxHeight: '180px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <img 
                  src={bannerImage} 
                  alt="Pré-visualização da capa" 
                  style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }}
                />
              </div>
            )}
          </div>

          {/* Campo 5: Tags interativas */}
          <div className="article-form-group">
            <label htmlFor="articleTagInput" className="article-form-label">
              Tags
            </label>
            <div className="tag-input-row">
              <input
                id="articleTagInput"
                type="text"
                className="article-form-input tag-input-field"
                placeholder="Adicionar tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="btn-add-tag"
              >
                Adicionar
              </button>
            </div>

            {/* Badges das tags selecionadas */}
            <div className="tags-badges-container">
              {tags.map((tag) => (
                <span key={tag} className="tag-badge-item">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="btn-remove-tag"
                    title="Remover tag"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Campo 6: Conteúdo do Artigo com estatísticas ao vivo */}
          <div className="article-form-group">
            <label htmlFor="articleContent" className="article-form-label">
              Conteúdo do Artigo *
            </label>
            <textarea
              id="articleContent"
              className="article-form-textarea full-body-textarea"
              rows={12}
              maxLength={8000}
              placeholder="Escreva o conteúdo do seu artigo em Markdown..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />

            {/* Contador ao vivo de caracteres, palavras e tempo de leitura */}
            <div className="live-stats-bar">
              <span>{charCount}/8000 caracteres</span>
              <span className="stats-dot">•</span>
              <span>{wordCount} palavras</span>
              <span className="stats-dot">•</span>
              <span>{readMinutes} minutos de leitura</span>
            </div>
          </div>
        </div>

        {/* Botões de Ação de Rodapé (Publicar Artigo e Cancelar) */}
        <div className="create-article-actions-bar">
          <button
            type="submit"
            className="btn-publish-article"
            disabled={loading}
          >
            {loading ? 'Publicando...' : isEditing ? 'Salvar Alterações' : 'Publicar Artigo'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="btn-cancel-article"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};
