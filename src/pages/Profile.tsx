import Header from "@/components/navigation/Header";
import { APP_CONFIG, ROUTES } from "@/constants";
import { KeySquare, UserPen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/context/auth/useAuth";
import { useTranslation } from "react-i18next";

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { t } = useTranslation("common");

  const getInitials = (): string => {
    const first = user?.firstName?.[0] || "";
    const last = user?.lastName?.[0] || "";
    return (first + last).toUpperCase();
  };

  const getFullName = (): string =>
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    t("profile.no_name");

  // const getRoleLabel = (roleId?: number): string => {
  //   const roles: Record<number, string> = {
  //     1: t("profile.role.operator"),
  //     2: t("profile.role.vendor"),
  //     3: t("profile.role.admin"),
  //   };
  //   return roles[roleId ?? 0] || t("profile.role.unknown");
  // };

  const handleCopyEmail = () => {
    if (user?.email) {
      navigator.clipboard.writeText(user.email);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-900 text-gray-800 dark:text-gray-100">
      <Header
        title={t("profile.title")}
        textColorClass="text-gray-800 dark:text-white"
      />

      {/* Static Profile Info (always at top) */}
      <section className="flex flex-col items-center px-6 pt-3 pb-6">
        <div className="py-2">
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary-800 via-primary-700 to-primary-600 p-[4px] shadow-lg shadow-primary-50 hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full rounded-full dark:text-white bg-white dark:bg-zinc-900 flex items-center justify-center text-xl font-semibold text-primary-700 ">
              {getInitials()}
            </div>
          </div>
        </div>

        <h1 className="text-xl font-semibold mb-1">{getFullName()}</h1>
        <p
          onClick={handleCopyEmail}
          className="text-gray-600 dark:text-gray-400 text-sm cursor-pointer hover:underline"
          title="Tap to copy email"
        >
          {user?.email || t("profile.no_email")}
        </p>
        <p className="text-gray-500 dark:text-gray-400 text-sm italic">
          {user?.employeeId}
        </p>
      </section>

      {/* Scrollable Account Settings */}
      <main className="flex-1 w-full flex flex-col items-center overflow-y-auto px-4 space-y-6">
        <div className="w-full max-w-md border-t border-gray-200 dark:border-gray-700" />

        <section className="w-full max-w-md px-2 pb-6">
          <h2 className="text-sm font-semibold uppercase text-gray-800 dark:text-white mb-4">
            {t("profile.account_settings")}
          </h2>
          <div className="w-full border rounded-xl border-gray-300 dark:border-gray-700 bg-white dark:bg-zinc-900">
            {user?.roleId !== 1 ? (
              <>
                <div
                  role="button"
                  onClick={() => navigate(ROUTES.EDIT_PROFILE)}
                  className="flex items-center w-full gap-3 px-4 py-4 rounded-t-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700 transition focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[48px]"
                  aria-label="Edit Profile"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === "Enter" && navigate(ROUTES.EDIT_PROFILE)
                  }
                >
                  <UserPen className="text-gray-700 dark:text-gray-200" />
                  <span className="text-gray-800 dark:text-gray-100 font-medium">
                    {t("profile.edit_profile_button")}
                  </span>
                </div>

                <div
                  role="button"
                  onClick={() => navigate(ROUTES.CHANGE_PASSWORD)}
                  className="flex items-center w-full gap-3 px-4 py-4 rounded-b-xl border-t border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700 transition focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[48px]"
                  aria-label="Change Password"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === "Enter" && navigate(ROUTES.CHANGE_PASSWORD)
                  }
                >
                  <KeySquare className="text-gray-700 dark:text-gray-200" />
                  <span className="text-gray-800 dark:text-gray-100 font-medium">
                    {t("profile.change_password")}
                  </span>
                </div>
              </>
            ) : (
              <div
                role="button"
                onClick={() => navigate(ROUTES.CHANGE_PASSWORD)}
                className="flex items-center w-full gap-3 px-4 py-4 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700 transition focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[48px]"
                aria-label="Change Password"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" && navigate(ROUTES.CHANGE_PASSWORD)
                }
              >
                <KeySquare className="text-gray-700 dark:text-gray-200" />
                <span className="text-gray-800 dark:text-gray-100 font-medium">
                  {t("profile.change_password")}
                </span>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer pinned to bottom */}
      <footer className="text-center text-xs text-gray-400 dark:text-gray-600 py-3">
        {APP_CONFIG.APP_NAME} v{APP_CONFIG.VERSION}
      </footer>
    </div>
  );
};

export default Profile;
