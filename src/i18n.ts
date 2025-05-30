// src/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import loginEN from "@locales/en/login.json";
import loginJA from "@locales/ja/login.json";
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
import qrScannerEN from "@locales/en/qrscanner/scan.json";
import qrScannerJA from "@locales/ja/qrscanner/scan.json";
import commonEN from "@locales/en/common.json";
import commonJA from "@locales/ja/common.json";
import scanResultEN from "@locales/en/qrscanner/scanResult.json";
import scanResultJA from "@locales/ja/qrscanner/scanResult.json";

import onboardingEN from "@locales/en/onboarding.json";
import onboardingJA from "@locales/ja/onboarding.json";

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
        pwa: pwaEN,
        scan: qrScannerEN,
        common: commonEN,
        scanResult: scanResultEN,
        onboarding: onboardingEN,
      },
      ja: {
        translation: {},
        login: loginJA,
        navigation: navigationJA,
        preferences: preferencesJA,
        app: appJA,
        account: accountJA,
        pwa: pwaJA,
        scan: qrScannerJA,
        common: commonJA,
        scanResult: scanResultJA,
        onboarding: onboardingJA,
      },
    },

    ns: [
      "login",
      "navigation",
      "preferences",
      "app",
      "account",
      "pwa",
      "scan",
      "common",
      "scanResult",
      "onboarding",
    ],
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
