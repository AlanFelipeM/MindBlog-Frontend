import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, CheckCircle, Trash2, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { API_URL } from '../../config/api';
import './styles.css';

// Avatar padrão de silhueta de site utilizado quando o usuário não insere foto
const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23A1A1AA'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

export const Settings = () => {
  const navigate = useNavigate();
  // Obtém os dados do usuário e as funções globais do AuthContext
  const { user, login, logout } = useAuth();

  // Estados locais para controlar os campos do formulário de configurações do perfil
  const [name, setName] = useState(user?.name || 'John Doe');
  const [email, setEmail] = useState(user?.email || 'example@email.com');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bio, setBio] = useState('Desenvolvedor Full Stack apaixonado por tecnologia e inovação.');

  // Estado para controlar a mensagem de feedback de sucesso ao salvar
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Estados de confirmação e exclusão permanente de conta
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const currentToken = localStorage.getItem('@MindBlog:token') || 'fake-jwt-token';
    const url = `${API_URL}/users/me`;

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentToken}`,
        },
        body: JSON.stringify({
          name,
          avatar: avatar.trim() === '' ? null : avatar,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Atualiza o contexto com o usuário retornado pelo backend
        login(currentToken, data.user);
        
        // Exibe notificação de sucesso por 4 segundos
        setShowSuccessToast(true);
        setTimeout(() => {
          setShowSuccessToast(false);
        }, 4000);
      } else {
        console.error("Erro ao salvar perfil no backend");
      }
    } catch (error) {
      console.error("Erro de conexão ao salvar perfil:", error);
    }
  };

  // Função para excluir a conta do usuário no backend e deslogar
  const handleDeleteAccount = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsDeleting(true);

    try {
      const token = localStorage.getItem('@MindBlog:token');
      const targetEmail = email.trim() || user?.email?.trim();
      
      if (targetEmail) {
        // Envia requisição via POST e DELETE simultâneos garantindo que o backend processe a instrução em qualquer cenário
        await Promise.allSettled([
          fetch(`${API_URL}/users/delete?email=${encodeURIComponent(targetEmail)}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ email: targetEmail }),
          }),
          fetch(`${API_URL}/users/me`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ email: targetEmail }),
          }),
        ]);
      }
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
    } finally {
      setIsDeleting(false);
      logout();
      window.location.href = '/login?deleted=true';
    }
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
                value={avatar.startsWith('data:') ? 'Imagem carregada do seu computador' : avatar}
                readOnly={avatar.startsWith('data:')}
                onChange={(e) => {
                  if (!avatar.startsWith('data:')) {
                    setAvatar(e.target.value);
                    setAvatarFile(null);
                  }
                }}
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
                      setAvatarFile(file);
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
                <span className="info-item-value">Autor / Leitor</span>
              </div>

              <div className="account-info-item">
                <span className="info-item-label">Membro desde</span>
                <span className="info-item-value">
                  {user?.createdAt || new Date().toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          </div>

          {/* Ações do formulário: Salvar Alterações e Excluir Conta de forma sutil */}
          <div className="settings-actions-group">
            <button type="submit" className="btn-save-settings">
              Salvar Alterações
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="btn-delete-account-subtle"
            >
              <Trash2 size={16} /> Excluir Conta
            </button>
          </div>
        </form>
      </div>

      {/* Modal Popup Fixo no Centro da Tela para Confirmação de Exclusão */}
      {showDeleteModal && (
        <div className="settings-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="settings-delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-header">
              <h3>Excluir Conta Permanentemente</h3>
              <button onClick={() => setShowDeleteModal(false)} className="close-modal-icon-btn">
                <X size={18} />
              </button>
            </div>
            
            <div className="delete-modal-body">
              <p>Tem certeza absoluta de que deseja excluir sua conta do <strong>MindBlog</strong>?</p>
              <p className="delete-warning-subtext">
                Esta ação é irreversível. Todos os seus dados de perfil e artigos cadastrados serão apagados.
              </p>
            </div>

            <div className="delete-modal-footer">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="btn-cancel-delete-modal"
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="btn-confirm-delete-modal"
                disabled={isDeleting}
              >
                {isDeleting ? 'Excluindo...' : 'Sim, Excluir Minha Conta'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
