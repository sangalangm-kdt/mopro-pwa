import { useState } from "react";
import { ChevronDown, ChevronUp, Globe, Sun, Moon } from "lucide-react";
import { useTranslation } from "react-i18next";
import ThemeToggle from "@/components/ThemeToggle";
import PWAButton from "@/components/PWAButton";

import {
  SIDEBAR_PREFERENCES_CONTAINER_CLASSES,
  SIDEBAR_SECTION_HEADING_CLASSES,
} from "@/constants/classes";

import { useTheme } from "@/context/theme/ThemeContext";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "ja", label: "日本語" },
];

export default function PreferencesSection() {
  const { theme } = useTheme();
  const { i18n, t } = useTranslation("preferences");
  const [langOpen, setLangOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("i18nextLng", lng);
    setLangOpen(false);
  };

  const current =
    LANGUAGES.find((lang) => lang.code === i18n.language) || LANGUAGES[0];

  return (
    <div className={SIDEBAR_PREFERENCES_CONTAINER_CLASSES}>
      {/* Section Title */}
      <h2 className={SIDEBAR_SECTION_HEADING_CLASSES}>{t("title")}</h2>

      {/* Language Accordion */}
      <div>
        <button
          onClick={() => setLangOpen((prev) => !prev)}
          className="w-full flex justify-between items-center text-sm font-medium px-3 py-1 bg-transparent text-gray-800 dark:text-gray-100"
        >
          <span className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            {current.label}
          </span>
          {langOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {langOpen && (
          <div className="mt-2 space-y-1">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`w-full text-left px-3 py-1 rounded hover:bg-primary-100 dark:hover:bg-primary-700 transition text-sm ${
                  lang.code === current.code
                    ? "font-semibold text-primary-700 dark:text-primary-300"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Theme Toggle */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
          {t("theme")}
        </label>
        <div className="flex items-center justify-between px-3 py-1">
          <span
            className={`flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 transition-all duration-300 ${
              theme === "dark"
                ? "opacity-100 translate-y-0"
                : "opacity-90 translate-y-[1px]"
            }`}
          >
            {theme === "dark" ? (
              <>
                <Moon className="w-4 h-4 text-primary-400" />
                {t("current", { theme: t("themeModes.dark") })}
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-yellow-500" />
                {t("current", { theme: t("themeModes.light") })}
              </>
            )}
          </span>
          <div className="ml-4">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* PWA Install Button */}
      <PWAButton />
    </div>
  );
}
