// src/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import loginEN from "@locales/en/login/en.json";
import loginJA from "@locales/ja/login/ja.json";
import navigationEN from "@/locales/en/navigation/sidebar.navigation.json";
import preferencesEN from "@/locales/en/navigation/sidebar.preferences.json";
import appEN from "@/locales/en/navigation/sidebar.app.json";
import accountEN from "@/locales/en/navigation/sidebar.account.json";
import navigationJA from "@/locales/ja/navigation/sidebar.navigation.json";
import preferencesJA from "@/locales/ja/navigation/sidebar.preferences.json";
import appJA from "@/locales/ja/navigation/sidebar.app.json";
import accountJA from "@/locales/ja/navigation/sidebar.account.json";
import pwaEN from "@/locales/en/pwa.json";
import pwaJA from "@/locales/ja/pwa.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // ✅ Missing `.init({` previously
    resources: {
      en: {
        translation: {},
        login: loginEN,
        navigation: navigationEN,
        preferences: preferencesEN,
        app: appEN,
        account: accountEN,
        pwa: pwaEN, // <-- ADD THIS
      },
      ja: {
        translation: {},
        login: loginJA,
        navigation: navigationJA,
        preferences: preferencesJA,
        app: appJA,
        account: accountJA,
        pwa: pwaJA, // <-- ADD THIS
      },
    },

    ns: ["login", "navigation", "preferences", "app", "account", "pwa"],
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
