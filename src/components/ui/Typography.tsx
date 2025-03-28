import React from 'react';
import clsx from 'clsx';

/**
 * Propriedades do componente Typography
 *
 * @property {"h1" | "h2" | "h3" | "p" | "small"} [variant="p"] - A variante de tipografia.
 * @property {React.ReactNode} children - O conteúdo de texto.
 * @property {string} [className] - Classes CSS adicionais.
 */
interface TypographyProps {
  variant?: 'h1' | 'h2' | 'h3' | 'p' | 'small';
  children: React.ReactNode;
  className?: string;
}

/**
 * Componente Typography
 *
 * Este componente representa um elemento de tipografia reutilizável com diferentes variantes.
 *
 * @param {TypographyProps} props - As propriedades do componente.
 * @returns {JSX.Element} O elemento de tipografia renderizado.
 */
const Typography: React.FC<TypographyProps> = ({
  variant = 'p',
  children,
  className,
}) => {
  const baseStyles = {
    h1: 'text-4xl font-heading font-bold',
    h2: 'text-3xl font-heading font-semibold',
    h3: 'text-2xl font-heading font-medium',
    p: 'text-lg font-body',
    small: 'text-sm font-body text-gray-600',
  };

  const Component = variant as keyof JSX.IntrinsicElements;

  return (
    <Component className={clsx(baseStyles[variant], className)}>
      {children}
    </Component>
  );
};

export default Typography;
