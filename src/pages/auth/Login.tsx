import { Trans } from "react-i18next";
import TextInput from "@/components/Input";
import BoardingScreen from "@/components/BoardingScreen";
import LargeHeader from "@/components/Header";
import Button from "@/components/Button";
import RememberMeCheckbox from "@/components/Checkbox";
import Icon from "@/components/icons/Icons";
import LanguageDropdown from "@/components/LanguageSwitcher";
import PWAButton from "@/components/PWAButton";
import Logo from "@assets/logo/logo v2.svg?react";
import {
  ROUTES,
  LOGIN_FIELDS,
  PLACEHOLDERS,
  BUTTON_TEXT,
} from "@constants/index";
import CurvedLine from "@assets/curved-line.svg?react";
import { useLoginForm } from "@/hooks/login-form";

export default function Login() {
  const {
    t,
    email,
    setEmail,
    password,
    setPassword,
    errors,
    loading,
    handleLogin,
    navigate,
  } = useLoginForm();

  return (
    <div className="flex min-h-screen relative">
      <div className="absolute inset-0 z-10 pointer-events-none left-0 top-34 overflow-hidden">
        <CurvedLine className="w-[250%] sm:w-[150%] md:w-full h-auto" />
      </div>

      <div className="relative w-full md:w-[45%] lg:w-[40%] xl:w-[35%] flex items-center justify-center p-6 dark:bg-bg-color">
        <div className="w-full max-w-sm animate-fade-in-up pt-28">
          {/* Logo + Controls */}
          <div className="absolute top-6 left-0 right-0 px-6 flex items-center justify-between">
            <Logo className="h-20 w-auto" />
            <div className="flex flex-col sm:flex-row xs:flex-row md items-center gap-2 sm:gap-3">
              <LanguageDropdown />
              <PWAButton />
            </div>
          </div>

          <div className="w-full max-w-sm animate-fade-in-up">
            <LargeHeader
              header={t("title")}
              subheader={
                <Trans
                  i18nKey="subheader"
                  ns="login"
                  components={[
                    <strong key={0} className="text-secondary-1 font-bold" />,
                  ]}
                />
              }
              subheading={
                <Trans
                  i18nKey="subheading"
                  ns="login"
                  components={[
                    <strong
                      key={0}
                      className="text-primary-900 text-sm font-display font-extrabold"
                    />,
                  ]}
                />
              }
            />

            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <TextInput
                label={t(LOGIN_FIELDS.email)}
                type="text"
                name={LOGIN_FIELDS.email}
                placeholder={t(PLACEHOLDERS.email)}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                icon={
                  <Icon name="email" className="w-5 h-5 text-primary-700 " />
                }
              />

              <TextInput
                label={t(LOGIN_FIELDS.password)}
                type="password"
                name={LOGIN_FIELDS.password}
                placeholder={t(PLACEHOLDERS.password)}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                icon={<Icon name="lock" className="w-5 h-5 text-primary-700" />}
              />

              <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
                <RememberMeCheckbox label={t("rememberMe")} />
                <button
                  type="button"
                  className="text-gray-600 dark:text-gray-400 hover:underline transition"
                >
                  {t("forgotPassword")}
                </button>
              </div>

              <Button
                type="submit"
                fullWidth
                variant="primary"
                loading={loading}
              >
                {loading ? t("loading") : t("submit")}
              </Button>
            </form>

            <div className="flex items-center my-4 py-4">
              <hr className="flex-grow border-t border-gray-300 dark:border-gray-600" />
              <span className="mx-2 text-sm text-gray-500 dark:text-gray-400">
                or
              </span>
              <hr className="flex-grow border-t border-gray-300 dark:border-gray-600" />
            </div>

            <Button
              type="button"
              fullWidth
              variant="secondary"
              className="mt-2"
              onClick={() => navigate(ROUTES.REQUEST_ACCOUNT)}
            >
              {t("requestAccount", {
                defaultValue: BUTTON_TEXT.REQUEST_ACCOUNT,
              })}
            </Button>
          </div>
        </div>
      </div>

      {/* Right: Visual */}
      <div className="hidden md:flex flex-1 bg-gradient-to-tl from-lime-800 to-lime-950 items-center justify-center p-4">
        <BoardingScreen />
      </div>
    </div>
  );
}
