import React from "react";
import clsx from "clsx";

interface TypographyProps {
  variant?: "h1" | "h2" | "h3" | "p" | "small";
  children: React.ReactNode;
  className?: string;
}

const Typography: React.FC<TypographyProps> = ({ variant = "p", children, className }) => {
  const baseStyles = {
    h1: "text-4xl font-heading font-bold",
    h2: "text-3xl font-heading font-semibold",
    h3: "text-2xl font-heading font-medium",
    p: "text-lg font-body",
    small: "text-sm font-body text-gray-600",
  };

  const Component = variant as keyof JSX.IntrinsicElements;

  return <Component className={clsx(baseStyles[variant], className)}>{children}</Component>;
};

export default Typography;
