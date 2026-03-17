import * as React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
};

const variants = {
  primary:
    "bg-accent text-secondary hover:bg-accent/90 focus:ring-accent border-transparent",
  secondary:
    "bg-primary text-secondary hover:bg-primary/90 focus:ring-primary border-transparent",
  outline:
    "border border-primary text-primary bg-transparent hover:bg-primary/5 focus:ring-primary",
  ghost: "text-primary hover:bg-primary/5 focus:ring-primary border-transparent",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-secondary disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

type ButtonLinkProps = {
  href: string;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
  children: React.ReactNode;
};

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
}: ButtonLinkProps) {
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-secondary ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </a>
  );
}
