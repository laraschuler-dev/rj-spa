import React from "react";
import clsx from "clsx";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  onClick?: () => void;
  disabled?: boolean;
}

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
