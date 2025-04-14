import LanguageDropdown from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";
import PWAButton from "@/components/PWAButton";
import {
  SIDEBAR_PREFERENCES_CONTAINER_CLASSES,
  SIDEBAR_SECTION_HEADING_CLASSES,
} from "@/constants/classes";

export default function PreferencesSection() {
  return (
    <div className={SIDEBAR_PREFERENCES_CONTAINER_CLASSES}>
      <h2 className={SIDEBAR_SECTION_HEADING_CLASSES}>Preferences</h2>
      <div>
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
          Language
        </label>
        <LanguageDropdown />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
          Theme
        </label>
        <div className="flex items-center justify-between">
          Light Mode <ThemeToggle />
        </div>
      </div>

      <PWAButton />
    </div>
  );
}
