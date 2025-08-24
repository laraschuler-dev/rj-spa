import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { X } from 'lucide-react';
import Typography from './ui/Typography';

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

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-50 inset-0 overflow-y-auto"
        onClose={onClose}
      >
        <div className="flex items-center justify-center min-h-screen p-4">
          <Transition.Child
            as={Fragment}
            enter="transition-opacity duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-30" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="transition-transform duration-200"
            enterFrom="scale-95 opacity-0"
            enterTo="scale-100 opacity-100"
            leave="transition-transform duration-150"
            leaveFrom="scale-100 opacity-100"
            leaveTo="scale-95 opacity-0"
          >
            <Dialog.Panel className="relative bg-white rounded-2xl shadow-xl p-6 max-w-md w-full z-10">
              <button
                onClick={onClose}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              >
                <X size={20} />
              </button>

              <Typography variant="h2" className="text-lg font-semibold mb-3">
                Compartilhar post
              </Typography>

              <Typography variant="p" className="text-sm text-gray-700 mb-1">
                <strong>{postSummary.author}</strong>: {postSummary.title}
              </Typography>
              <Typography
                variant="p"
                className="text-sm text-gray-500 mb-4 line-clamp-2"
              >
                {postSummary.content}
              </Typography>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escreva uma mensagem (opcional)"
                className="w-full p-2 border rounded-xl text-sm resize-none mb-4"
                rows={4}
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-1 text-sm text-gray-600 hover:underline"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleShare}
                  className="px-4 py-1 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                >
                  Compartilhar
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ShareModal;
