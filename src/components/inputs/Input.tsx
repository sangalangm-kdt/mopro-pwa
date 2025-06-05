import { useState } from "react";
import Icon from "@components/icons/Icons";

interface TextInputProps {
  label?: string;
  type?: string;
  name?: string;
  value?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoComplete?: string;
  icon?: React.ReactNode;
  error?: string;
}

export default function TextInput({
  label,
  type = "text",
  name = "input",
  value,
  placeholder,
  onChange,
  autoComplete = "off",
  icon,
  error,
}: TextInputProps) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && !showPassword ? "password" : "text";

  return (
    <div className="w-full animate-fade-in transition-opacity duration-500">
      {label && (
        <label
          htmlFor={name}
          className="block text-base sm:text-base font-medium text-gray-700 dark:text-gray-200 mb-1"
        >
          {label}
        </label>
      )}

      <div className="relative group">
        {icon && (
          <div
            className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200 group-focus-within:text-primary-700 ${
              focused || value
                ? "text-primary-700 dark:text-primary-400"
                : "text-gray-300 dark:text-gray-500"
            }`}
          >
            {icon}
          </div>
        )}

        <input
          id={name}
          type={inputType}
          name={name}
          value={value ?? ""}
          placeholder={placeholder}
          onChange={onChange}
          autoComplete={autoComplete}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`w-full text-base sm:text-base px-3 py-2 sm:py-3 border ${
            error
              ? "border-red-500 dark:border-red-400"
              : "border-gray-300 dark:border-gray-600"
          } bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-md shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-600/30 focus:border-primary-700 ${
            icon ? "pl-10" : ""
          } ${isPassword ? "pr-10" : ""}`}
        />

        {/* Password Toggle */}
        {isPassword && (
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary-700 dark:hover:text-primary-400 transition-transform duration-300 ease-in-out"
          >
            <Icon
              name={showPassword ? "eyeOff" : "eyeOn"}
              className={`w-5 h-5 transition-transform duration-300 ${
                showPassword ? "rotate-180 scale-110" : "scale-100"
              }`}
            />
          </button>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
