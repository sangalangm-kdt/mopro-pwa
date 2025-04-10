import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary" | "ghost";
}

export default function Button({
  children,
  fullWidth = false,
  loading = false,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const variantClasses: Record<string, string> = {
    primary:
      "text-white bg-primary-800 hover:bg-primary-600 focus:ring-primary-600",
    secondary:
      "text-primary-700 bg-white border border-primary-700 hover:text-primary-900 hover:bg-gray-100 dark:bg-transparent dark:border-primary-400 dark:text-primary-300 dark:hover:bg-primary-900/10",
    ghost:
      "text-primary-700 bg-transparent hover:bg-primary-50 dark:text-primary-300 dark:hover:bg-primary-900/10",
  };

  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`
        inline-flex items-center justify-center px-4 py-3 rounded-md text-sm font-semibold sm:text-base transition-colors duration-200 ease-in-out cursor-pointer
        ${fullWidth ? "w-full" : ""}
        ${props.disabled || loading ? "opacity-60 cursor-not-allowed" : ""}
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {loading && (
        <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
      )}
      {children}
    </button>
  );
}
