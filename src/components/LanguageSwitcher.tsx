import { useState } from "react";
import { useTranslation } from "react-i18next";
import Icon from "./icons/Icons";

const LANGUAGES = [
  { code: "ja", label: "日本語", short: "JA" },
  { code: "en", label: "English", short: "EN" },
];

export default function LanguageDropdown() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setOpen(false);
    localStorage.setItem("i18nextLng", lng);
  };

  const currentLang =
    LANGUAGES.find((lang) => lang.code === i18n.language) || LANGUAGES[0];

  return (
    <div className="relative inline-block w-full max-w-[10rem]">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center justify-between gap-2 px-3 py-3 border text-gray-800 dark:text-gray-50 border-gray-300 dark:border-gray-600 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-zinc-700 transition w-full"
      >
        <Icon name="languages" className="w-4 h-4 text-primary-800" />
        <span className="block sm:hidden">{currentLang.short}</span>
        <span className="hidden sm:block">{currentLang.label}</span>
        <svg
          className="ml-1 h-4 w-4"
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
        <div className="absolute left-0 mt-1 w-full dark:text-gray-50 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className="block w-full text-left px-4 py-2 text-sm  hover:bg-gray-100 dark:hover:bg-zinc-700"
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
