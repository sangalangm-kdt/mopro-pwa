import Header from "@/components/navigation/Header";
import { ROUTES } from "@/constants";
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

  const getRoleLabel = (roleId?: number): string => {
    const roles: Record<number, string> = {
      1: t("profile.role.operator"),
      2: t("profile.role.vendor"),
      3: t("profile.role.admin"),
    };
    return roles[roleId ?? 0] || t("profile.role.unknown");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-gray-800 dark:text-gray-100">
      <Header
        title={t("profile.title")}
        textColorClass="text-gray-800 dark:text-white"
      />

      <div className="flex flex-col items-center justify-center py-4 px-4 space-y-6">
        {/* Profile Info */}
        <section className="flex flex-col items-center px-6 py-6">
          {/* Avatar */}
          <div className="py-2">
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary-800 via-primary-700 to-primary-600 p-[4px] shadow-lg shadow-primary-50 hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center text-xl font-semibold text-primary-700 dark:text-primary-300">
                {getInitials()}
              </div>
            </div>
          </div>

          <h1 className="text-xl font-semibold mb-1">{getFullName()}</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {user?.email || t("profile.no_email")}
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm italic">
            {getRoleLabel(user?.roleId)}
          </p>
        </section>

        {/* Account Settings */}
        <section className="w-full max-w-md px-2">
          <h2 className="text-sm font-semibold uppercase text-gray-800 dark:text-white mb-4">
            {t("profile.account_settings")}
          </h2>
          <div className="w-full border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-gray-700">
            {user?.roleId !== 1 && (
              <button
                onClick={() => navigate(ROUTES.EDIT_PROFILE)}
                className="flex items-center w-full gap-3 px-4 py-4 hover:bg-gray-100 dark:hover:bg-zinc-700 transition"
              >
                <span className="text-gray-700 dark:text-gray-200">
                  <UserPen />
                </span>
                <span className="text-gray-800 dark:text-gray-100 font-medium">
                  {t("profile.edit_profile_button")}
                </span>
              </button>
            )}
            <button
              onClick={() => navigate(ROUTES.CHANGE_PASSWORD)}
              className="flex items-center w-full gap-3 px-4 py-4 hover:bg-gray-100 dark:hover:bg-zinc-700 transition"
            >
              <span className="text-gray-700 dark:text-gray-200">
                <KeySquare />
              </span>
              <span className="text-gray-800 dark:text-gray-100 font-medium">
                {t("profile.change_password")}
              </span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;
