import { useState, useEffect } from "react";
import TextInput from "@/components/inputs/Input";
import BoardingScreen from "@/components/BoardingScreen";
import LargeHeader from "@/components/Header";
import Button from "@/components/buttons/Button";
import RememberMeCheckbox from "@/components/Checkbox";
import Icon from "@/components/icons/Icons";
import Logo from "@assets/logo/logo.svg?react";

import { useLoginForm } from "@/hooks/login-form";
import { ROUTES, LOGIN_TEXT_KEYS } from "@constants/index";
import { useLocalizedText } from "@/utils/localized-text";
import TopControls from "@/components/TopControls";
import { isInStandaloneMode } from "@/utils/standalone-mode";
import PwaPrompt from "@/components/PwaPrompt";

export default function Login() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    errors,
    loading,
    handleLogin,
    navigate,
  } = useLoginForm();

  const TEXT = useLocalizedText("common", LOGIN_TEXT_KEYS);

  const [showPwaPrompt, setShowPwaPrompt] = useState(() => {
    const isHidden = localStorage.getItem("hidePwaPrompt") === "true";
    return !isInStandaloneMode() && !isHidden;
  });
  const [direction, setDirection] = useState("animate-slide-left");

  useEffect(() => {
    const saved = sessionStorage.getItem("transitionDirection");
    setDirection(
      saved === "right" ? "animate-slide-right" : "animate-slide-left"
    );
  }, []);

  // Auto-dismiss after 10 seconds
  useEffect(() => {
    if (showPwaPrompt) {
      const timer = setTimeout(() => {
        localStorage.setItem("hidePwaPrompt", "true");
        setShowPwaPrompt(false);
      }, 10000); // 10 seconds
      return () => clearTimeout(timer);
    }
  }, [showPwaPrompt]);

  const handleDismissPwaPrompt = () => {
    localStorage.setItem("hidePwaPrompt", "true");
    setShowPwaPrompt(false);
  };

  return (
    <div className="flex min-h-screen relative">
      {/* Left: Form */}
      <div className="relative w-full md:w-[45%] lg:w-[40%] xl:w-[35%] flex items-center justify-center p-6 dark:bg-bg-color">
        {/* ✅ PWA Prompt Banner */}
        {showPwaPrompt && (
          <PwaPrompt
            text={{
              PWA_BANNER_TITLE: TEXT.PWA_BANNER_TITLE,
              PWA_BANNER_DESCRIPTION: TEXT.PWA_BANNER_DESCRIPTION,
            }}
            onDismiss={handleDismissPwaPrompt}
          />
        )}

        {/* Content Block */}
        <div className="w-full max-w-sm animate-fade-in-up pt-28">
          {/* Logo + Controls */}
          <div className="absolute top-10 left-0 right-0 px-6 flex items-start justify-between">
            <Logo className="h-20 w-auto" />
            <div className="flex items-center gap-2">
              <TopControls />
            </div>
          </div>

          <div className={direction}>
            <LargeHeader
              header={LOGIN_TEXT_KEYS.TITLE}
              subheader={LOGIN_TEXT_KEYS.SUBHEADER}
              subheading={LOGIN_TEXT_KEYS.SUBHEADING}
            />

            {/* Form */}
            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <TextInput
                label={TEXT.EMAIL}
                type="text"
                name="email"
                placeholder={TEXT.PLACEHOLDER_EMAIL}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                icon={
                  <Icon name="email" className="w-5 h-5 text-primary-700" />
                }
              />

              <TextInput
                label={TEXT.PASSWORD}
                type="password"
                name="password"
                placeholder={TEXT.PLACEHOLDER_PASSWORD}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                icon={<Icon name="lock" className="w-5 h-5 text-primary-700" />}
              />

              <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
                <RememberMeCheckbox label={TEXT.REMEMBER_ME} />
                <button
                  type="button"
                  className="text-gray-600 text-right dark:text-gray-400 hover:underline transition"
                  onClick={() => navigate(ROUTES.FORGOT_PASSWORD)}
                >
                  {TEXT.FORGOT_PASSWORD}
                </button>
              </div>

              <Button
                type="submit"
                fullWidth
                variant="primary"
                loading={loading}
              >
                {loading ? TEXT.LOADING : TEXT.SUBMIT}
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-4 py-4">
              <hr className="flex-grow border-t border-gray-300 dark:border-gray-600" />
              <span className="mx-2 text-sm text-gray-500 dark:text-gray-400">
                or
              </span>
              <hr className="flex-grow border-t border-gray-300 dark:border-gray-600" />
            </div>

            {/* Request Account */}
            <Button
              type="button"
              fullWidth
              variant="secondary"
              className="mt-2"
              onClick={() => {
                sessionStorage.setItem("transitionDirection", "left");
                navigate(ROUTES.REQUEST_ACCOUNT);
              }}
            >
              {TEXT.REQUEST_ACCOUNT}
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
