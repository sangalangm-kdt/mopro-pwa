import { useTranslation } from "react-i18next";

export function useLocalizedText<T extends Record<string, string>>(
  namespace: string,
  keyMap: T
): { [K in keyof T]: string } {
  const { t } = useTranslation(namespace);
  const localized: Partial<{ [K in keyof T]: string }> = {};

  for (const key in keyMap) {
    localized[key] = t(keyMap[key]);
  }

  return localized as { [K in keyof T]: string };
}
