// components/ui/EngagementCounters.tsx
import React from 'react';

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
  // Não mostra nada se não há contadores
  if (!likesCount && !commentsCount && !sharesCount && !attendanceCount) {
    return null;
  }

  return (
    <div className="flex items-center gap-4 text-xs text-gray-500 border-t pt-3 mt-3">
      {/* Curtidas */}
      {likesCount !== undefined && likesCount > 0 && (
        <span>
          {likesCount} curtida{likesCount !== 1 ? 's' : ''}
        </span>
      )}

      {/* Comentários */}
      {commentsCount !== undefined && commentsCount > 0 && (
        <span>
          {commentsCount} comentário{commentsCount !== 1 ? 's' : ''}
        </span>
      )}

      {/* Compartilhamentos */}
      {sharesCount !== undefined && sharesCount > 0 && (
        <span>
          {sharesCount} compartilhamento{sharesCount !== 1 ? 's' : ''}
        </span>
      )}

      {/* Presenças (apenas para eventos) */}
      {categoryId === 8 &&
        attendanceCount !== undefined &&
        attendanceCount > 0 && (
          <span>
            {attendanceCount} confirmado{attendanceCount !== 1 ? 's' : ''}
          </span>
        )}
    </div>
  );
};
