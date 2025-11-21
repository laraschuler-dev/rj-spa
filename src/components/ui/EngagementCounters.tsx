// components/ui/EngagementCounters.tsx
import React from 'react';
import { FaHeart, FaComment, FaShare, FaUserCheck } from 'react-icons/fa';

interface EngagementCountersProps {
  likesCount?: number;
  commentsCount?: number;
  sharesCount?: number;
  attendanceCount?: number;
  categoryId: number;
}

export const EngagementCounters: React.FC<EngagementCountersProps> = ({
  likesCount,
  commentsCount,
  sharesCount,
  attendanceCount,
  categoryId,
}) => {
  if (!likesCount && !commentsCount && !sharesCount && !attendanceCount) {
    return null;
  }

  return (
    <div className="flex items-center gap-4 text-xs text-gray-500 border-t pt-2 mt-2">
      {/* Curtidas */}
      {likesCount !== undefined && likesCount > 0 && (
        <div
          className="flex items-center gap-1.5"
          title={`${likesCount} curtidas`}
        >
          <FaHeart className="w-3.5 h-3.5" />
          <span>{likesCount}</span>
        </div>
      )}

      {/* Comentários */}
      {commentsCount !== undefined && commentsCount > 0 && (
        <div
          className="flex items-center gap-1.5"
          title={`${commentsCount} comentários`}
        >
          <FaComment className="w-3.5 h-3.5" />
          <span>{commentsCount}</span>
        </div>
      )}

      {/* Compartilhamentos */}
      {sharesCount !== undefined && sharesCount > 0 && (
        <div
          className="flex items-center gap-1.5"
          title={`${sharesCount} compartilhamentos`}
        >
          <FaShare className="w-3.5 h-3.5" />
          <span>{sharesCount}</span>
        </div>
      )}

      {/* Presenças */}
      {categoryId === 8 &&
        attendanceCount !== undefined &&
        attendanceCount > 0 && (
          <div
            className="flex items-center gap-1.5"
            title={`${attendanceCount} confirmados`}
          >
            <FaUserCheck className="w-3.5 h-3.5" />
            <span>{attendanceCount}</span>
          </div>
        )}
    </div>
  );
};
