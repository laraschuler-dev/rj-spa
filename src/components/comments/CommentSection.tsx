import React, { useEffect, useState } from 'react';
import { useComments } from '../../hooks/useComments';
import CommentItem from './CommentItem';
import { toast } from 'react-toastify';

interface CommentSectionProps {
  postId: number;
  shareId?: number;
  highlightedCommentId?: number | null;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  shareId,
  highlightedCommentId,
}) => {
  const {
    comments,
    loading,
    fetchComments,
    createComment,
    editComment,
    deleteComment,
  } = useComments(postId, shareId);

  const [newComment, setNewComment] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  useEffect(() => {
    fetchComments();
  }, [postId, shareId]);

  // SCROLLAR E DESTACAR COMENTÁRIO
  useEffect(() => {
    if (highlightedCommentId && comments.length > 0) {
      const timer = setTimeout(() => {
        const commentElement = document.getElementById(
          `comment-${highlightedCommentId}`
        );
        if (commentElement) {
          commentElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });

          // Destaca o comentário
          commentElement.classList.add(
            'bg-yellow-50',
            'border-l-4',
            'border-yellow-400',
            'transition-all',
            'duration-300'
          );

          // Remove o destaque depois de 4 segundos
          setTimeout(() => {
            commentElement.classList.remove(
              'bg-yellow-50',
              'border-l-4',
              'border-yellow-400'
            );
          }, 10000);
        } else {
          console.warn(
            '❌ Elemento do comentário não encontrado:',
            highlightedCommentId
          );
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [highlightedCommentId, comments.length]);

  async function handleCreate() {
    if (!newComment.trim() || isCreating) return;
    setIsCreating(true);
    try {
      await createComment(newComment.trim());
      setNewComment('');
      toast.success('Comentário adicionado!');
    } catch {
      toast.error('Erro ao adicionar comentário');
    } finally {
      setIsCreating(false);
    }
  }

  const handleEdit = async (commentId: number, content: string) => {
    try {
      await editComment(commentId, content);
      toast.success('Comentário atualizado!');
    } catch {
      toast.error('Erro ao atualizar comentário');
    }
  };

  const handleDelete = async (commentId: number) => {
    setIsDeleting(commentId);
    try {
      await deleteComment(commentId);
      toast.success('Comentário excluído!');
    } catch {
      toast.error('Erro ao excluir comentário');
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Campo de novo comentário */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Escreva um comentário..."
          className="flex-1 p-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
        />
        <button
          onClick={handleCreate}
          disabled={isCreating}
          className="bg-blue-500 text-white px-3 py-1 rounded-xl text-sm hover:bg-blue-600 disabled:opacity-50 focus:outline-none"
        >
          {isCreating ? 'Enviando...' : 'Comentar'}
        </button>
      </div>

      {loading ? (
        <p>Carregando comentários...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-500 text-sm">Nenhum comentário ainda</p>
      ) : (
        comments.map((comment) =>
          comment ? (
            <CommentItem
              key={`post-${postId}-comment-${comment.id}`}
              comment={comment}
              onUpdate={handleEdit}
              onDelete={handleDelete}
              isDeleting={isDeleting === comment.id}
              isHighlighted={highlightedCommentId === comment.id}
            />
          ) : null
        )
      )}
    </div>
  );
};

export default CommentSection;
