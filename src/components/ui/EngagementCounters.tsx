// components/ui/EngagementCounters.tsx
import React from 'react';

interface EngagementCountersProps {
  likesCount?: number;
  commentsCount?: number;
  sharesCount?: number;
  attendanceCount?: number;
  categoryId: number;
  compact?: boolean;
}

export const EngagementCounters: React.FC<EngagementCountersProps> = ({
  likesCount,
  commentsCount,
  sharesCount,
  attendanceCount,
  categoryId,
  compact = false,
}) => {
  if (!likesCount && !commentsCount && !sharesCount && !attendanceCount) {
    return null;
  }

  // ✅ VERSÃO COMPACTA COM TEXTO PURO - Sem ícones
  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
        {/* Curtidas */}
        {likesCount !== undefined && likesCount > 0 && (
          <span className="whitespace-nowrap">
            <strong>{likesCount}</strong>{' '}
            {likesCount === 1 ? 'curtida' : 'curtidas'}
          </span>
        )}

        {/* Comentários */}
        {commentsCount !== undefined && commentsCount > 0 && (
          <span className="whitespace-nowrap">
            <strong>{commentsCount}</strong>{' '}
            {commentsCount === 1 ? 'comentário' : 'comentários'}
          </span>
        )}

        {/* Compartilhamentos */}
        {sharesCount !== undefined && sharesCount > 0 && (
          <span className="whitespace-nowrap">
            <strong>{sharesCount}</strong>{' '}
            {sharesCount === 1 ? 'compart.' : 'compart.'}
          </span>
        )}

        {/* Presenças */}
        {categoryId === 8 &&
          attendanceCount !== undefined &&
          attendanceCount > 0 && (
            <span className="whitespace-nowrap">
              <strong>{attendanceCount}</strong>{' '}
              {attendanceCount === 1 ? 'confirmado' : 'confirmados'}
            </span>
          )}
      </div>
    );
  }

  // ✅ VERSÃO ORIGINAL (como fallback para outros usos)
  return (
    <div className="flex items-center gap-4 text-xs text-gray-500 border-t pt-2 mt-2">
      {/* Curtidas */}
      {likesCount !== undefined && likesCount > 0 && (
        <div className="flex items-center gap-1.5">
          <span>
            <strong>{likesCount}</strong> curtidas
          </span>
        </div>
      )}

      {/* Comentários */}
      {commentsCount !== undefined && commentsCount > 0 && (
        <div className="flex items-center gap-1.5">
          <span>
            <strong>{commentsCount}</strong> comentários
          </span>
        </div>
      )}

      {/* Compartilhamentos */}
      {sharesCount !== undefined && sharesCount > 0 && (
        <div className="flex items-center gap-1.5">
          <span>
            <strong>{sharesCount}</strong> compart.
          </span>
        </div>
      )}

      {/* Presenças */}
      {categoryId === 8 &&
        attendanceCount !== undefined &&
        attendanceCount > 0 && (
          <div className="flex items-center gap-1.5">
            <span>
              <strong>{attendanceCount}</strong> confirmados
            </span>
          </div>
        )}
    </div>
  );
};
