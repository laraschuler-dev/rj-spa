// PostActions.tsx
import React, { useState, useEffect } from 'react';
import {
  FaHeart,
  FaRegHeart,
  FaRegCommentDots,
  FaShare,
  FaRegCalendarCheck,
} from 'react-icons/fa';
import { useEventAttendance } from '../../hooks/useEventAttendance';

interface PostActionsProps {
  post: {
    id: number;
    categoryId: number;
    sharedBy?: { id: number } | null;
    isAttending?: boolean | null; // estado inicial do post
  };
  postIdForAttendance?: number;
  postShareIdForAttendance?: number;
  isLiked?: boolean;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
}

const PostActions: React.FC<PostActionsProps> = ({
  post,
  postIdForAttendance,
  postShareIdForAttendance,
  isLiked = false,
  onLike,
  onComment,
  onShare,
}) => {
  const [liked, setLiked] = useState(isLiked);

  // Hook para gerenciar presença
  const { status, toggleAttendance, loading } = useEventAttendance(
    postIdForAttendance,
    postShareIdForAttendance
  );

  // Estado local do botão de presença, sincronizado com o hook
  const [attending, setAttending] = useState(status.userStatus === 'confirmed');

  // Atualiza o estado local sempre que o status do hook mudar
  useEffect(() => {
    setAttending(status.userStatus === 'confirmed');
  }, [status.userStatus]);

  const handleAttendance = async () => {
    if (!postIdForAttendance || loading) return;

    try {
      await toggleAttendance(); // Hook já lida com alternar presença
    } catch (error) {
      console.error('[PostActions] Erro ao alternar presença:', error);
    }
  };

  const handleLike = async () => {
    try {
      setLiked((prev) => !prev);
      if (onLike) await onLike();
    } catch (error) {
      console.error('Erro ao curtir post:', error);
      setLiked((prev) => !prev);
    }
  };

  const isEvent = post.categoryId === 8;

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

      {isEvent && (
        <button
          onClick={handleAttendance}
          disabled={loading}
          className={`flex items-center gap-1 px-3 py-1 rounded-2xl text-sm font-medium transition ${
            attending
              ? 'bg-green-100 text-green-600 border border-green-500'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <FaRegCalendarCheck />
          {attending ? ' ✓ Confirmado' : ' Participar'}
        </button>
      )}
    </div>
  );
};

export default PostActions;
