// PostActions.tsx
import React, { useState } from 'react';
import {
  FaHeart,
  FaRegHeart,
  FaRegCommentDots,
  FaShare,
  FaRegCalendarCheck,
} from 'react-icons/fa';

interface PostActionsProps {
  isLiked?: boolean;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onAttend?: () => void;
  isEvent?: boolean; // Nome mais claro
}

const PostActions: React.FC<PostActionsProps> = ({
  isLiked = false,
  onLike,
  onComment,
  onShare,
  onAttend,
  isEvent = false,
}) => {
  const [liked, setLiked] = useState(isLiked);

  const handleLike = async () => {
    try {
      setLiked((prev) => !prev);

      if (onLike) await onLike();
    } catch (error) {
      console.error('Erro ao curtir post:', error);
      setLiked((prev) => !prev);
    }
  };

  return (
    <div className="flex justify-between text-gray-600 text-sm border-t pt-3">
      <button
        onClick={handleLike}
        className="flex items-center gap-1 hover:text-blue-500 transition"
      >
        {liked ? <FaHeart className="text-red-500" /> : <FaRegHeart />} Curtir
      </button>

      <button
        onClick={onComment}
        className="flex items-center gap-1 hover:text-blue-500 transition"
      >
        <FaRegCommentDots /> Comentar
      </button>

      <button
        onClick={onShare}
        className="flex items-center gap-1 hover:text-blue-500 transition"
      >
        <FaShare /> Compartilhar
      </button>

      {isEvent && ( // Verificação simplificada
        <button
          onClick={onAttend}
          className="flex items-center gap-1 hover:text-blue-500 transition"
        >
          <FaRegCalendarCheck /> Participar
        </button>
      )}
    </div>
  );
};

export default PostActions;
