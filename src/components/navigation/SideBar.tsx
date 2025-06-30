import { LogOut, X } from "lucide-react";
import { useRef } from "react";
// import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MenuLinks from "@/components/navigation/MenuLinks";
import PreferencesSection from "@/components/navigation/PreferencesSection";
import { useAuthContext } from "@/context/auth/useAuth";
// import { ROUTES } from "@/constants";
// import { SIDEBAR_MENU_BUTTON_CLASSES } from "@/constants/classes";
import { useSidebarControls } from "@/utils/sidebar-controls";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { user, logout } = useAuthContext();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  // const navigate = useNavigate();
  const { t } = useTranslation("account");

  const handleLogout = () => {
    logout();
    onClose();
  };

  useSidebarControls(open, onClose, sidebarRef, closeButtonRef);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/5 z-40"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <div
        ref={sidebarRef}
        role="dialog"
        aria-modal="true"
        aria-label={t("main_menu")}
        tabIndex={-1}
        className={`fixed top-0 left-0 w-64 h-full bg-white dark:bg-zinc-800 z-50 shadow-lg transition-transform duration-300 flex flex-col ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-[22px] xs:py-[18px] border-b border-gray-200 dark:border-zinc-700">
          <span className="text-lg font-semibold text-primary-800 dark:text-white">
            {t("menu")}
          </span>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label={t("close_sidebar")}
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
          >
            <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto scrollbar p-4 text-sm text-gray-800 dark:text-white space-y-6">
          {/* User Info */}
          <div className="flex items-center gap-4 px-1">
            <div
              className="flex items-center justify-center w-10 h-10 text-[12px] rounded-full text-gray-600 dark:text-white shadow-md ring-2 ring-primary-700 dark:ring-primary-800
"
            >
              {(user?.firstName?.charAt(0) ?? "") +
                (user?.lastName?.charAt(0) ?? "") || "U"}
            </div>

            <div className="flex flex-col min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight truncate">
                {user?.firstName ?? "Unknown"} {user?.lastName ?? ""}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {user?.email?.split("@")[0]}
              </p>
            </div>
          </div>

          {/* Profile Settings */}
          <div className="text-gray-800 dark:text-white">
            {/* <button
              onClick={() => {
                onClose();
                navigate(ROUTES.PROFILE);
              }}
              className={SIDEBAR_MENU_BUTTON_CLASSES}
            >
              <span className="flex items-center gap-2 text-sm">
                <Settings className="w-4 h-4" />
                {t("profile_settings")}
              </span>
            </button> */}
          </div>

          <MenuLinks onClose={onClose} />
          <PreferencesSection />
        </div>

        {/* Footer: Account Section */}
        <div className="px-4 pb-4 space-y-3">
          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-base text-red-600 border border-red-200 dark:border-zinc-700 rounded-md hover:bg-red-50 dark:hover:bg-zinc-700 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
          >
            <LogOut className="h-4 w-4" />
            {t("log_out")}
          </button>

          {/* Footer Text */}
          <p className="text-xs text-gray-500 border-t pt-4 lg:hidden border-gray-200 dark:border-zinc-700">
            © {new Date().getFullYear()} {t("footer_copyright")}
          </p>
        </div>
      </div>
    </>
  );
}
