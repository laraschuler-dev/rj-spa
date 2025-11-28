import { useState } from 'react';
import Typography from '../ui/Typography';
import SubmitButton from '../ui/SubmitButton';
import CancelButton from '../ui/CancelButton';
import { FiX } from 'react-icons/fi';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (message?: string) => void;
  postSummary: {
    title: string;
    content: string;
    author: string;
  };
  onSave?: (updatedPost: any) => void;
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  onShare,
  postSummary,
  onSave,
}) => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleShare = async () => {
    // Impede múltiplos cliques
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      await onShare(message);
      setMessage('');

      // Se quiser usar onSave após compartilhar
      if (onSave) {
        onSave({ message }); // exemplo de payload
      }

      onClose();
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex justify-center items-start pt-20 overflow-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-[95vw] sm:max-w-[400px] md:max-w-[500px] p-6 relative my-8 mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 font-bold text-xl focus:outline-none"
        >
          <FiX size={18} className="text-gray-500" />
        </button>

        {/* Título no padrão dos outros modais */}
        <Typography variant="h2" className="text-primary text-center mb-6">
          Compartilhar post
        </Typography>

        {/* Prévia resumida do post */}
        <Typography variant="p" className="text-sm text-gray-700 mb-1">
          <strong>{postSummary.author}</strong>: {postSummary.title}
        </Typography>
        <Typography
          variant="p"
          className="text-sm text-gray-500 mb-4 line-clamp-2"
        >
          {postSummary.content}
        </Typography>

        {/* Mensagem opcional */}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escreva uma mensagem (opcional)"
          className="w-full p-3 border rounded-lg text-sm resize-none mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
          rows={4}
        />

        {/* Botões no mesmo padrão */}
        <div className="flex flex-col items-center gap-2 mt-2">
          <SubmitButton onClick={handleShare} loading={isSubmitting}>
            Compartilhar
          </SubmitButton>
          <CancelButton mode="edit" onCloseModal={onClose} />
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
