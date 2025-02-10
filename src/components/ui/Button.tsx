import React from "react";
import clsx from "clsx";

/**
 * Propriedades do componente Button
 * 
 * @property {React.ReactNode} children - O conteúdo do botão.
 * @property {"primary" | "secondary" | "outline"} [variant="primary"] - A variante do botão.
 * @property {() => void} [onClick] - A função a ser chamada quando o botão é clicado.
 * @property {boolean} [disabled=false] - Indica se o botão está desativado.
 */
interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  onClick?: () => void;
  disabled?: boolean;
}

/**
 * Componente Button
 * 
 * Este componente representa um botão reutilizável com diferentes variantes.
 * 
 * @param {ButtonProps} props - As propriedades do componente.
 * @returns {JSX.Element} O botão renderizado.
 */
const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  onClick,
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "px-4 py-2 rounded-lg font-body transition-all",
        {
          "bg-primary text-white hover:bg-blue-700": variant === "primary",
          "bg-secondary text-white hover:bg-orange-700": variant === "secondary",
          "border border-primary text-primary hover:bg-primary hover:text-white":
            variant === "outline",
          "opacity-50 cursor-not-allowed": disabled,
        }
      )}
    >
      {children}
    </button>
  );
};

export default Button;