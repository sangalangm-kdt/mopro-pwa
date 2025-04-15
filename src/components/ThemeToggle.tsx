import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/theme/ThemeContext";
import clsx from "clsx";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className={clsx(
        "relative xs:w-12 lg:w-14 h-6 rounded-full flex items-center p-2 transition-colors duration-300",
        isDark ? "bg-primary-700" : "bg-gray-300"
      )}
      aria-label="Toggle theme"
    >
      <span
        className={clsx(
          "absolute left-1 flex items-center justify-center w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-300",
          isDark ? "lg:translate-x-8 xs:translate-x-6" : "translate-x-0"
        )}
      >
        {isDark ? (
          <Moon className="w-3 h-3 text-primary-700" />
        ) : (
          <Sun className="w-3 h-3 text-yellow-500" />
        )}
      </span>
    </button>
  );
}
