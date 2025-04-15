import { useTranslation } from "react-i18next";
import {
  SIDEBAR_MENU_LINK_CONTAINER_CLASSES,
  SIDEBAR_MENU_BUTTON_CLASSES,
  SIDEBAR_SECTION_HEADING_CLASSES,
} from "@/constants/classes";
import { BookText, HelpCircle } from "lucide-react";

export default function MenuLinks({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation("navigation");

  return (
    <div className={SIDEBAR_MENU_LINK_CONTAINER_CLASSES}>
      <h2 className={SIDEBAR_SECTION_HEADING_CLASSES}>{t("title")}</h2>
      <nav className="space-y-2">
        <button onClick={onClose} className={SIDEBAR_MENU_BUTTON_CLASSES}>
          <span className="flex items-center gap-2">
            <BookText className="w-4 h-4" />
            {t("userGuidelines")}
          </span>
        </button>
        <button onClick={onClose} className={SIDEBAR_MENU_BUTTON_CLASSES}>
          <span className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4" />
            {t("helpSupport")}
          </span>
        </button>
      </nav>
    </div>
  );
}
