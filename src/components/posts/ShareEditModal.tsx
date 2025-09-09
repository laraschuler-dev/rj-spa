// src/components/posts/ShareEditModal.tsx
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Typography from '../ui/Typography';
import { usePostDetails } from '../../hooks/usePostDetails';
import PostPreviewCard from './PostPreviewCard';
import { useEditPost } from '../../hooks/useEditPost';

interface ShareEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: number;
  shareId: number;
  onSave: () => void; // 🔹 agora o Feed só precisa atualizar a lista
}

const ShareEditModal: React.FC<ShareEditModalProps> = ({
  isOpen,
  onClose,
  postId,
  shareId,
  onSave,
}) => {
  const { post, loading } = usePostDetails(postId, shareId);
  const [message, setMessage] = useState('');
  const { editPost, loading: saving } = useEditPost({ postId, shareId });

  // Inicializa a mensagem com o conteúdo atual do compartilhamento
  useEffect(() => {
    setMessage(post?.sharedBy?.message ?? '');
  }, [post]);

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('message', message);

      await editPost(formData); // 🔹 chama a API
      onSave(); // 🔹 notifica o Feed para atualizar posts
      onClose(); // 🔹 fecha o modal
    } catch (err) {
      console.error('Erro ao salvar compartilhamento:', err);
    }
  };

  if (loading || !post) {
    return null; // ou poderia mostrar um spinner leve
  }

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
                Editar Compartilhamento
              </Typography>

              {/* Card do post original */}
              <div className="mb-4">
                <PostPreviewCard
                  author={post.author}
                  createdAt={post.createdAt}
                  metadata={post.metadata}
                  content={post.content}
                  images={post.images}
                />
              </div>

              {/* Edição da mensagem do compartilhamento */}
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Edite a mensagem do compartilhamento"
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
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-1 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ShareEditModal;
