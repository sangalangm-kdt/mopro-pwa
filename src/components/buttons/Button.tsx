import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary" | "ghost" | "outlined";
}

const VARIANT_CLASSES = {
  primary:
    "text-white bg-primary-700 dark:bg-primary-800 hover:bg-primary-600 focus:ring-primary-600",
  secondary:
    "text-primary-700 bg-white border-2 border-primary-700 hover:text-primary-900 hover:bg-gray-100 dark:bg-transparent dark:border-primary-400 dark:text-primary-300 dark:hover:bg-primary-900/10",
  ghost:
    "text-primary-700 bg-transparent hover:bg-primary-50 dark:text-primary-300 dark:hover:bg-primary-900/10",
  outlined:
    "border-2 border-primary-800  text-primary-800  hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800/30",
} as const;

export default function Button({
  children,
  fullWidth = false,
  loading = false,
  variant = "primary",
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={`  
        inline-flex items-center justify-center px-4 py-3 rounded-md text-base sm:text-[15px] font-semibold transition-colors duration-200 ease-in-out
        whitespace-nowrap min-w-fit
        ${fullWidth ? "w-full" : ""}
        ${isDisabled ? "opacity-60 cursor-not-allowed" : ""}
        ${VARIANT_CLASSES[variant]}
        ${className}
      `}
    >
      {loading && (
        <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></span>
      )}
      {children}
    </button>
  );
}
