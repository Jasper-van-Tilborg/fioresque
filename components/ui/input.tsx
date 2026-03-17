import * as React from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s/g, "-");
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-1 block text-sm font-medium text-primary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full rounded-lg border border-primary/20 bg-secondary px-3 py-2 text-primary placeholder:text-primary/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent ${error ? "border-red-500" : ""} ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
