import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/theme/ThemeContext";
import LanguageDropdown from "@/components/LanguageSwitcher";

export default function TopControls() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const baseIconClass =
    "w-5 h-5 absolute transition-all duration-300 ease-in-out";

  return (
    <div className="flex items-center gap-3">
      {/* Language Selector */}
      <LanguageDropdown />

      {/* Theme Toggle Button */}
      <button
        onClick={(e) => {
          const btn = e.currentTarget;
          toggleTheme();
          setTimeout(() => btn?.blur(), 150);
        }}
        aria-label={isDark ? "Enable light mode" : "Enable dark mode"}
        className="relative flex items-center gap-2 px-4 py-3 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-600 hover:shadow transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-primary-500"
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {/* Icons (Animated Transition) */}
        <div className="relative w-5 h-5">
          <Sun
            className={`${baseIconClass} text-yellow-400 group-hover:scale-110 ${
              isDark
                ? "opacity-0 -rotate-90 scale-75"
                : "opacity-100 rotate-0 scale-100"
            }`}
          />
          <Moon
            className={`${baseIconClass} text-gray-700 dark:text-gray-100 group-hover:scale-110 ${
              isDark
                ? "opacity-100 rotate-0 scale-100"
                : "opacity-0 rotate-90 scale-75"
            }`}
          />
        </div>

        {/* Label */}
        <span className="hidden sm:inline text-sm font-medium text-zinc-700 dark:text-zinc-200 select-none">
          {isDark ? "Dark" : "Light"}
        </span>
      </button>
    </div>
  );
}

// Extend global Window interface
declare global {
  interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{
      outcome: "accepted" | "dismissed";
      platform: string;
    }>;
  }
}
