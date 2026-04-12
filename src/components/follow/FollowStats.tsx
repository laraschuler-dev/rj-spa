import React from 'react';
import Typography from '../ui/Typography';

interface FollowStatsProps {
  followersCount: number;
  followingCount: number;
  onFollowersClick?: () => void;
  onFollowingClick?: () => void;
  className?: string;
}

const FollowStats: React.FC<FollowStatsProps> = ({
  followersCount,
  followingCount,
  onFollowersClick,
  onFollowingClick,
  className = '',
}) => {
  return (
    <div className={`flex justify-center gap-8 ${className}`}>
      {/* Seguidores */}
      <button
        onClick={onFollowersClick}
        className="text-center transition-transform hover:scale-105 active:scale-95 focus:outline-none"
      >
        <Typography variant="h3" className="text-lg font-bold text-primary">
          {followersCount}
        </Typography>
        <Typography variant="p" className="text-sm text-gray-600">
          Seguidores
        </Typography>
      </button>

      {/* Seguindo */}
      <button
        onClick={onFollowingClick}
        className="text-center transition-transform hover:scale-105 active:scale-95 focus:outline-none"
      >
        <Typography variant="h3" className="text-lg font-bold text-primary">
          {followingCount}
        </Typography>
        <Typography variant="p" className="text-sm text-gray-600">
          Seguindo
        </Typography>
      </button>
    </div>
  );
};

export default FollowStats;
