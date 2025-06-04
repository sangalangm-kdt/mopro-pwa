import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import {
  SIDEBAR_MENU_LINK_CONTAINER_CLASSES,
  SIDEBAR_MENU_BUTTON_CLASSES,
  SIDEBAR_SECTION_HEADING_CLASSES,
} from "@/constants/classes";
import { BookText, HelpCircle, Settings } from "lucide-react";
import { ROUTES } from "@/constants";

export default function MenuLinks({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation("navigation");
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const getButtonClass = (path: string) =>
    `${SIDEBAR_MENU_BUTTON_CLASSES} ${
      isActive(path)
        ? "bg-primary-100 text-primary-800 dark:bg-primary-100 dark:text-white"
        : ""
    }`;

  return (
    <div className={SIDEBAR_MENU_LINK_CONTAINER_CLASSES}>
      <h2 className={SIDEBAR_SECTION_HEADING_CLASSES}>{t("title")}</h2>
      <nav className="space-y-2">
        {/* <button
          onClick={() => {
            navigate(ROUTES.HOME);
            onClose();
          }}
          className={getButtonClass(ROUTES.HOME)}
        >
          <span className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            {t("home")}
          </span>
          
        </button> */}
        <button
          onClick={() => {
            onClose();
            navigate(ROUTES.PROFILE);
          }}
          className={SIDEBAR_MENU_BUTTON_CLASSES}
        >
          <span className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            {t("profile_settings")}
          </span>
        </button>
        <button
          onClick={() => {
            navigate(ROUTES.USER_GUIDELINES);
            onClose();
          }}
          className={getButtonClass(ROUTES.USER_GUIDELINES)}
        >
          <span className="flex items-center gap-2">
            <BookText className="w-4 h-4" />
            {t("userGuidelines")}
          </span>
        </button>

        <button
          onClick={() => {
            navigate(ROUTES.HELP_AND_SUPPORT);
            onClose();
          }}
          className={getButtonClass(ROUTES.HELP_AND_SUPPORT)}
        >
          <span className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4" />
            {t("helpSupport")}
          </span>
        </button>
      </nav>
    </div>
  );
}
