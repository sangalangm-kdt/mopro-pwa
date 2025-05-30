import { useUser } from "@/api/user";
import Button from "@/components/buttons/Button";
import Header from "@/components/navigation/Header";
import { useAuthContext } from "@/context/auth/useAuth";
import { Home } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";

const EditProfile = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const { t } = useTranslation("common");
    const { user } = useAuthContext();
    const { updateUser } = useUser();
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState(user?.firstName || "");
    const [lastName, setLastName] = useState(user?.lastName || "");
    const [email, setEmail] = useState(user?.email || "");

    const getInitials = (): string => {
        const first = firstName[0] || "";
        const last = lastName[0] || "";
        return (first + last).toUpperCase();
    };

    const getRoleLabel = (roleId?: number): string => {
        const roles: Record<number, string> = {
            1: t("profile.role.operator"),
            2: t("profile.role.vendor"),
            3: t("profile.role.admin"),
        };
        return roles[roleId ?? 0] || t("profile.role.unknown");
    };

    const handleSubmit = () => {
        console.log("Saving changes...", {
            firstName,
            lastName,
            email,
        });
    };
    const handleSubmit = () => {
        console.log("Saving changes...", {
            firstName,
            lastName,
            email,
            role: getRoleLabel(roleId),
        });
        updateUser({
            firstName,
            lastName,
            email,
            roleId: roleId,
            isEnable: 1,
        });
    };

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-900 text-gray-800 dark:text-gray-100">
            <Header
                title={t("profile.edit_button")}
                textColorClass="text-gray-800 dark:text-white"
                rightElement={
                    <button
                        onClick={() => navigate("/")}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                        aria-label={t("routes.home")}
                    >
                        <Home className="w-5 h-5 text-gray-700 dark:text-white" />
                    </button>
                }
            />

            <div className="flex flex-col items-center justify-center px-6 py-10">
                {/* Avatar */}
                <div className="py-10">
                    <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary-800 via-primary-700 to-primary-600 p-[4px] shadow-lg shadow-primary-50 hover:scale-105 transition-transform duration-300">
                        <div className="w-full h-full rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center text-xl font-semibold text-primary-700 dark:text-primary-300">
                            {getInitials()}
                        </div>
                    </div>
                </div>

                {/* Form Card */}
                <div className="flex flex-col items-center w-full max-w-md bg-white dark:bg-zinc-800 rounded-xl shadow p-6 space-y-6">
                    <div className="w-full space-y-4">
                        {/* First Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t("profile.first_name")}
                            </label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
                            />
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t("profile.last_name")}
                            </label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t("profile.email")}
                            </label>
                            {user?.roleId === 3 ? (
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
                                />
                            ) : (
                                <input
                                    type="email"
                                    value={email}
                                    disabled
                                    className="w-full px-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-zinc-700 text-sm text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                />
                            )}
                        </div>

                        {/* Role */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t("profile.role.label")}
                            </label>
                            <input
                                type="text"
                                value={getRoleLabel(user?.roleId)}
                                disabled
                                className="w-full px-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-zinc-700 text-sm text-gray-500 dark:text-gray-400 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button fullWidth variant="primary" onClick={handleSubmit}>
                        {t("button.save_changes")}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
