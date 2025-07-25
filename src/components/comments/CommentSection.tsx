import React, { useEffect, useState } from 'react';
import { useComments } from '../../hooks/useComments';
import CommentItem from './CommentItem';
import { toast } from 'react-toastify';

interface CommentSectionProps {
  postId: number;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const {
    comments,
    loading,
    fetchComments,
    createComment,
    editComment,
    deleteComment,
  } = useComments(postId);

  const [newComment, setNewComment] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

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
          onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
        />
        <button
          onClick={handleCreate}
          disabled={isCreating}
          className="bg-blue-500 text-white px-3 py-1 rounded-xl text-sm hover:bg-blue-600 disabled:opacity-50"
        >
          {isCreating ? 'Enviando...' : 'Comentar'}
        </button>
      </div>

      {/* Lista de comentários */}
      {loading && comments.length === 0 ? (
        <p>Carregando comentários...</p>
      ) : (
        comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onUpdate={handleEdit}
            onDelete={handleDelete}
            isDeleting={isDeleting === comment.id}
          />
        ))
      )}
    </div>
  );
};

export default CommentSection;
