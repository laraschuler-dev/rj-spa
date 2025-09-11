import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import Typography from './ui/Typography';
import SubmitButton from './ui/SubmitButton';
import CancelButton from './ui/CancelButton';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (message?: string) => void;
  postSummary: {
    title: string;
    content: string;
    author: string;
  };
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  onShare,
  postSummary,
}) => {
  const [message, setMessage] = useState('');

  const handleShare = () => {
    onShare(message);
    setMessage('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-20 overflow-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-[700px] p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 font-bold text-xl"
        >
          ×
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
          <SubmitButton onClick={handleShare}>Compartilhar</SubmitButton>
          <CancelButton mode="edit" onCloseModal={onClose} />
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
