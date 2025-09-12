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

  // Usa hook para marcar/desmarcar presença
  const {
    status,
    toggleAttendance,
    loading: attendanceLoading,
  } = useEventAttendance(postIdForAttendance, postShareIdForAttendance);

  const handleAttendance = async () => {
    if (!postIdForAttendance || attendanceLoading) return;
    try {
      await toggleAttendance();
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
  const attending = status.userStatus === 'confirmed';

  return (
    <div
      className={`flex justify-between items-center border-t pt-3 text-gray-600 ${
        isEvent ? 'text-[10px] sm:text-sm' : 'text-sm'
      }`}
    >
      <button
        onClick={handleLike}
        className="flex items-center gap-1 hover:text-blue-500 transition"
      >
        {liked ? (
          <FaHeart className="text-red-500 w-4 h-4 sm:w-5 sm:h-5" />
        ) : (
          <FaRegHeart className="w-4 h-4 sm:w-5 sm:h-5" />
        )}
        <span className={isEvent ? 'text-[10px] sm:text-sm' : ''}>Curtir</span>
      </button>

      <button
        onClick={onComment}
        className="flex items-center gap-1 hover:text-blue-500 transition"
      >
        <FaRegCommentDots className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className={isEvent ? 'text-[10px] sm:text-sm' : ''}>
          Comentar
        </span>
      </button>

      <button
        onClick={onShare}
        className="flex items-center gap-1 hover:text-blue-500 transition"
      >
        <FaShare className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className={isEvent ? 'text-[10px] sm:text-sm' : ''}>
          Compartilhar
        </span>
      </button>

      {isEvent && (
        <button
          onClick={handleAttendance}
          disabled={attendanceLoading}
          className={`flex items-center gap-1 px-2 py-1 rounded-xl font-medium transition ${
            attending
              ? 'bg-green-100 text-green-600 border border-green-500'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <FaRegCalendarCheck className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-[9px] sm:text-xs">
            {attending ? '✓ Confirmado' : 'Participar'}
          </span>
        </button>
      )}
    </div>
  );
};

export default PostActions;
