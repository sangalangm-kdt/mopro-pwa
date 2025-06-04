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
        onClick={toggleTheme}
        aria-label={isDark ? "Enable light mode" : "Enable dark mode"}
        className="relative flex items-center justify-center rounded-full p-5 border border-primary-600 text-primary-800 hover:bg-primary-100 dark:border-zinc-600 dark:text-white dark:hover:bg-zinc-800 transition-all duration-300 w-10 h-10"
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        <Moon
          className={`${baseIconClass} ${
            isDark
              ? "opacity-0 rotate-90 scale-75"
              : "opacity-100 rotate-0 scale-100"
          }`}
        />
        <Sun
          className={`${baseIconClass} text-amber-300 ${
            isDark
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 -rotate-90 scale-75"
          }`}
        />
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
