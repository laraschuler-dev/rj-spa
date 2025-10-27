// components/ui/AvatarInitials.tsx
import React, { useEffect, useState, useRef } from 'react';

interface AvatarInitialsProps {
  name?: string;
  className?: string;
  fallback?: string;
  fontScale?: number; // novo: escala da fonte em relação ao container
  minFontSize?: number; // novo: tamanho mínimo da fonte em px
}

const AvatarInitials: React.FC<AvatarInitialsProps> = ({
  name,
  className = '',
  fallback = 'U',
  fontScale = 0.5, // padrão: 50% do container
  minFontSize = 12, // tamanho mínimo da fonte
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState('1rem');

  const initials = name
    ? name
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('')
    : fallback;

  useEffect(() => {
    if (containerRef.current) {
      const size = containerRef.current.offsetWidth;
      const calculated = Math.max(size * fontScale, minFontSize);
      setFontSize(`${calculated}px`);
    }
  }, [name, fontScale, minFontSize]);

  return (
    <div
      ref={containerRef}
      className={`flex items-center justify-center rounded-full bg-accent text-white font-bold ${className}`}
      style={{ fontSize }}
    >
      {initials}
    </div>
  );
};

export default AvatarInitials;
