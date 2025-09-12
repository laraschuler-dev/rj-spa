import React, { useState } from 'react';
import { CgProfile } from 'react-icons/cg';
import Typography from '../ui/Typography';
import { resolveImageUrl } from '../../utils/resolveImageUrl';
import { useAuth } from '../../hooks/useAuth';
import { formatTimeAgo } from '../../utils/formatTimeAgo';
import { PostComment } from '../../types/Comment';

interface CommentItemProps {
  comment: PostComment; // <-- ajuste aqui
  // eslint-disable-next-line no-unused-vars
  onUpdate: (commentId: number, newContent: string) => Promise<void>;
  // eslint-disable-next-line no-unused-vars
  onDelete: (commentId: number) => Promise<void>;
  isDeleting?: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onUpdate,
  onDelete,
  isDeleting = false,
}) => {
  const { user } = useAuth();
  const isAuthor = comment.author.id === user?.id;

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  const handleEdit = async () => {
    if (editedContent.trim()) {
      await onUpdate(comment.id, editedContent.trim());
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    await onDelete(comment.id);
  };

  return (
    <div className="bg-gray-100 p-3 rounded-xl flex items-start gap-3">
      {/* Avatar */}
      {comment.author.avatarUrl ? (
        <img
          src={resolveImageUrl(comment.author.avatarUrl)}
          alt="Avatar"
          className="w-8 h-8 rounded-full object-cover border"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center border">
          <CgProfile className="text-gray-500" size={16} />
        </div>
      )}

      {/* Conteúdo */}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <Typography variant="h3" className="text-sm font-medium">
            <strong>{comment.author.name}</strong>
          </Typography>
          <Typography variant="p" className="text-xs text-gray-500">
            {formatTimeAgo(comment.createdAt)}
          </Typography>
        </div>

        {isEditing ? (
          <>
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full text-sm p-2 border rounded-md mt-1"
            />
            <div className="flex gap-2 mt-1">
              <button
                onClick={handleEdit}
                className="text-sm text-blue-500 hover:underline"
              >
                Salvar
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedContent(comment.content);
                }}
                className="text-sm text-gray-500 hover:underline"
              >
                Cancelar
              </button>
            </div>
          </>
        ) : (
          <Typography variant="p" className="text-sm mt-1">
            {comment.content}
          </Typography>
        )}
      </div>

      {/* Botões de ação */}
      {isAuthor && !isEditing && (
        <div className="flex flex-col items-end gap-1 text-gray-500 text-sm">
          <button
            onClick={() => setIsEditing(true)}
            className="hover:text-blue-500"
          >
            Editar
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="hover:text-red-500 disabled:opacity-50"
          >
            {isDeleting ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentItem;
