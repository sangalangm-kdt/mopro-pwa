import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Icon from "./icons/Icons";
import { useAuth } from "@/context/useAuth";

const LANGUAGES = [
  { code: "ja", label: "日本語", short: "JA" },
  { code: "en", label: "English", short: "EN" },
];

export default function LanguageDropdown() {
  const { i18n } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("i18nextLng", lng);
    setOpen(false);
  };

  const currentLang =
    LANGUAGES.find((lang) => lang.code === i18n.language) || LANGUAGES[0];

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔓 Unauthenticated: dropdown style
  if (!isAuthenticated) {
    return (
      <div
        className="relative inline-block text-primary-900  "
        ref={dropdownRef}
      >
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-zinc-700 transition"
        >
          <Icon name="languages" className="w-4 h-4 text-primary-800" />
          <span className="block sm:hidden">{currentLang.short}</span>
          <span className="hidden sm:block">{currentLang.label}</span>
          <svg
            className={`ml-1 h-4 w-4 transition-transform ${
              open ? "rotate-180" : "rotate-0"
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.187l3.71-3.958a.75.75 0 111.08 1.04l-4.25 4.53a.75.75 0 01-1.08 0l-4.25-4.53a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {open && (
          <div className="absolute left-0 mt-2 w-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-md shadow-lg z-50">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-700"
              >
                <span className="block sm:hidden">{lang.short}</span>
                <span className="hidden sm:block">{lang.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // 🔐 Authenticated: accordion style
  return (
    <div className="w-full text-primary-900">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-2 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-700 transition"
      >
        <div className="flex items-center gap-2">
          <Icon name="languages" className="w-4 h-4 text-primary-800" />
          <span className="block sm:hidden">{currentLang.short}</span>
          <span className="hidden sm:block">{currentLang.label}</span>
        </div>
        <svg
          className={`h-4 w-4 transition-transform ${
            open ? "rotate-180" : "rotate-0"
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.187l3.71-3.958a.75.75 0 111.08 1.04l-4.25 4.53a.75.75 0 01-1.08 0l-4.25-4.53a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div className="mt-2 border border-gray-200 dark:border-zinc-700 rounded-md shadow-sm overflow-hidden">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-700 ${
                i18n.language === lang.code
                  ? "font-semibold text-primary-800"
                  : ""
              }`}
            >
              <span className="block sm:hidden">{lang.short}</span>
              <span className="hidden sm:block">{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
