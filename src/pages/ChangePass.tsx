import { useNavigate } from "react-router-dom";
import { useAuth } from "@/api/auth";
import Header from "@/components/navigation/Header";
import Button from "@/components/buttons/Button";
import { getPasswordFields } from "@/utils/password-fields";
import { Eye, EyeOff, Home } from "lucide-react";
import { toast } from "sonner";
import { CHANGE_PASSWORD_KEYS, ROUTES } from "@/constants";
import { useTranslation } from "react-i18next";
import { useLocalizedText } from "@/utils/localized-text";
import { useChangePassForm } from "@/hooks/change-pass";

const ChangePass = () => {
  const navigate = useNavigate();
  const { changePassword, logout } = useAuth();
  const { t } = useTranslation("common");

  const {
    form,
    errors,
    visibility,
    handleChange,
    toggleVisibility,
    validateForm,
  } = useChangePassForm();

  const CHANGE_PASS_LABEL = useLocalizedText("common", CHANGE_PASSWORD_KEYS);
  const fields = getPasswordFields(t);

  const handleChangePassword = async () => {
    if (!validateForm()) return;

    try {
      await changePassword(form);
      toast.success(t("change_pass.success"));

      setTimeout(() => {
        logout();
        window.location.href = ROUTES.LOGIN;
      }, 2000);
    } catch (error) {
      console.error("Change password error:", error);
      toast.error(t("change_pass.error_generic"));
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-gray-800 dark:text-gray-100">
      <Header
        title={CHANGE_PASS_LABEL.CHANGE_PASS}
        textColorClass="text-gray-800 dark:text-white"
        rightElement={
          <button
            onClick={() => navigate(ROUTES.HOME)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
            aria-label="Go to home"
          >
            <Home className="w-5 h-5 text-gray-700 dark:text-white" />
          </button>
        }
      />

      <div className="flex flex-col items-center justify-center px-6 py-10">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-justify">
          {CHANGE_PASS_LABEL.PASSWORD_INSTRUCTIONS}
        </p>

        <div className="w-full px-4 py-6 max-w-md bg-white dark:bg-zinc-800 rounded-xl space-y-6">
          {fields.map(({ name, label, placeholder }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {label}
              </label>
              <div className="relative">
                <input
                  type={visibility[name] ? "text" : "password"}
                  value={form[name]}
                  onChange={(e) => handleChange(name, e.target.value)}
                  placeholder={placeholder}
                  className={`w-full px-2 py-2 rounded-md border text-sm focus:outline-none focus:ring-2 ${
                    errors[name]
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:ring-primary-600"
                  } bg-white dark:bg-zinc-900`}
                />
                <button
                  type="button"
                  onClick={() => toggleVisibility(name)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  {visibility[name] ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors[name] && (
                <p className="text-xs text-red-500 mt-1">{errors[name]}</p>
              )}
            </div>
          ))}

          <Button fullWidth onClick={handleChangePassword}>
            {CHANGE_PASS_LABEL.BUTTON}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChangePass;
