import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './styles.css';

// Avatar padrão de silhueta de site utilizado quando o usuário não insere foto
const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23A1A1AA'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

export const Settings = () => {
  const navigate = useNavigate();
  // Obtém os dados do usuário e a função de atualização de estado global do AuthContext
  const { user, login } = useAuth();

  // Estados locais para controlar os campos do formulário de configurações do perfil
  const [name, setName] = useState(user?.name || 'John Doe');
  const [email, setEmail] = useState(user?.email || 'example@email.com');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [bio, setBio] = useState('Desenvolvedor Full Stack apaixonado por tecnologia e inovação.');

  // Estado para controlar a mensagem de feedback de sucesso ao salvar
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Sincroniza os estados locais caso o contexto global de usuário mude
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      if (user.avatar) {
        setAvatar(user.avatar);
      }
    }
  }, [user]);

  // Função para salvar as alterações do formulário de perfil
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Atualiza as informações do usuário no estado global e localStorage
    const updatedUser = {
      name,
      email,
      avatar: avatar.trim() === '' ? null : avatar.trim(),
    };

    // Mantém o token atual ativo e atualiza os dados do usuário logado
    const currentToken = localStorage.getItem('@MindBlog:token') || 'fake-jwt-token';
    login(currentToken, updatedUser);

    // Exibe notificação de sucesso por 4 segundos
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 4000);
  };

  // Determina a imagem a ser pré-visualizada no perfil (usa o avatar inserido ou o padrão de site)
  const avatarPreviewSrc = avatar.trim() !== '' ? avatar : DEFAULT_AVATAR;

  return (
    <div className="settings-page-container">
      {/* Botão de retorno ao Dashboard */}
      <div className="settings-back-nav">
        <button onClick={() => navigate('/dashboard')} className="settings-back-btn">
          <ArrowLeft size={16} /> Voltar ao Dashboard
        </button>
      </div>

      {/* Cabeçalho da página com título e descrição */}
      <div className="settings-header-section">
        <h1 className="settings-page-title">Configurações do Perfil</h1>
        <p className="settings-page-subtitle">Gerencie suas informações pessoais</p>
      </div>

      {/* Container principal do formulário de configurações */}
      <div className="settings-form-card">
        {/* Notificação de sucesso ao salvar alterações */}
        {showSuccessToast && (
          <div className="settings-success-alert">
            <CheckCircle size={18} />
            <span>Perfil atualizado com sucesso!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="settings-form">
          {/* Seção de foto de perfil (Foto no topo, rótulo, input de URL e upload de arquivo do PC abaixo) */}
          <div className="avatar-upload-section">
            <div className="avatar-preview-box">
              <img
                src={avatarPreviewSrc}
                alt="Foto de perfil"
                className="avatar-preview-img"
                onError={(e) => {
                  // Caso a URL inserida seja inválida ou quebre, usamos a imagem padrão de site
                  (e.target as HTMLImageElement).src = DEFAULT_AVATAR;
                }}
              />
            </div>
            
            <div className="avatar-input-group">
              <label htmlFor="avatarUrl" className="form-label text-center">
                Foto de Perfil
              </label>
              
              {/* Campo para colar URL da imagem */}
              <input
                id="avatarUrl"
                type="text"
                className="form-input"
                placeholder="https://images.unsplash.com/photo-..."
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
              />

              {/* Botão / Input para escolher arquivo de foto do computador */}
              <div className="file-upload-wrapper">
                <label htmlFor="fileInput" className="file-upload-btn">
                  Escolher arquivo do computador
                </label>
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setAvatar(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden-file-input"
                />
              </div>

              <span className="form-helper-text text-center">
                Adicione uma imagem ou deixe em branco
              </span>
            </div>
          </div>

          {/* Campo de Nome Completo com ícone ao lado do rótulo */}
          <div className="form-group">
            <label htmlFor="fullName" className="form-label label-with-icon">
              <User size={16} className="label-icon" /> Nome Completo
            </label>
            <input
              id="fullName"
              type="text"
              className="form-input"
              placeholder="Seu nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Campo de E-mail com ícone ao lado do rótulo */}
          <div className="form-group">
            <label htmlFor="userEmail" className="form-label label-with-icon">
              <Mail size={16} className="label-icon" /> Email
            </label>
            <input
              id="userEmail"
              type="email"
              className="form-input"
              placeholder="exemplo@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Campo de Biografia com contador de caracteres */}
          <div className="form-group">
            <label htmlFor="userBio" className="form-label">
              Bio
            </label>
            <textarea
              id="userBio"
              className="form-textarea"
              rows={4}
              maxLength={500}
              placeholder="Escreva uma breve biografia sobre você..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
            <span className="char-counter">{bio.length}/500 caracteres</span>
          </div>

          {/* Linha horizontal divisória */}
          <hr className="settings-divider" />

          {/* Seção de Informações da Conta */}
          <div className="account-info-section">
            <h3 className="account-info-title">Informações da conta</h3>
            
            <div className="account-info-grid">
              <div className="account-info-item">
                <span className="info-item-label">Tipo de conta</span>
                <span className="info-item-value">Admin</span>
              </div>

              <div className="account-info-item">
                <span className="info-item-label">Membro desde</span>
                <span className="info-item-value">20/01/2026</span>
              </div>
            </div>
          </div>

          {/* Botão de confirmação e salvamento de alterações */}
          <button type="submit" className="btn-save-settings">
            Salvar Alterações
          </button>
        </form>
      </div>
    </div>
  );
};
