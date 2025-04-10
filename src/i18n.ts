// src/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import loginEN from "@locales/en/login/en.json";
import loginJA from "@locales/ja/login/ja.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // ✅ Missing `.init({` previously
    resources: {
      en: {
        translation: {},
        login: loginEN,
      },
      ja: {
        translation: {},
        login: loginJA,
      },
    },
    ns: ["login"],
    defaultNS: "translation", // ✅ Optional, but recommended
    fallbackLng: "ja",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;
