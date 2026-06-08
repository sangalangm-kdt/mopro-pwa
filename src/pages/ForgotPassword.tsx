import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "@assets/logo/logo v2.svg?react";
import LargeHeader from "@/components/Header";
import TextInput from "@/components/inputs/Input";
import Button from "@/components/buttons/Button";
import Icon from "@/components/icons/Icons";
import TopControls from "@/components/TopControls"; // ✅ Theme & language toggle
import { FORGOT_PASSWORD_TEXT_KEYS, ROUTES } from "@constants/index"; // If you have route constants
import { useTranslation } from "react-i18next";

export default function ForgotPassword() {
  const [email, setEmail] = useState<string>("");

  const navigate = useNavigate();
  const { t } = useTranslation("common");
  const TEXT = FORGOT_PASSWORD_TEXT_KEYS;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // ✅ Add your reset logic here
    console.log("Reset link sent to:", email);
  };

  return (
    <div className="flex min-h-screen relative">
      {/* Left: Form */}
      <div className="relative w-full md:w-[50%] lg:w-[45%] xl:w-[40%] flex items-center justify-center p-6 dark:bg-bg-color animate-slide-in-left">
        {/* Top Controls */}
        <div className="absolute top-10 left-0 right-0 px-6 flex items-start justify-between">
          <Logo className="h-20 w-auto" />
          <TopControls />
        </div>

        <div className="w-full max-w-sm animate-fade-in-up pt-28">
          <LargeHeader
            header={t(TEXT.TITLE)}
            subheader={t(TEXT.SUBHEADER)}
            subheading={t(TEXT.SUBHEADING)}
          />

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <TextInput
              label={t(TEXT.EMAIL)}
              type="email"
              name="email"
              placeholder={t(TEXT.PLACEHOLDER_EMAIL)}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Icon name="email" className="w-5 h-5 text-primary-700" />}
            />

            <Button type="submit" fullWidth variant="primary">
              {t(TEXT.SUBMIT)}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            {t(TEXT.REMEMBERED_PASSWORD)}{" "}
            <button
              type="button"
              onClick={() => navigate(ROUTES.LOGIN)}
              className="text-primary-700 dark:text-primary-400 hover:underline"
            >
              {t(TEXT.BACK_TO_LOGIN)}
            </button>
          </div>
        </div>
      </div>

      {/* Right: Visual */}
      <div className="hidden md:flex flex-1 bg-gradient-to-br from-lime-800 to-lime-950 items-center justify-center p-4 animate-fade-in">
        <div className="text-center text-white max-w-md">
          <h2 className="text-3xl font-bold mb-4">{t(TEXT.WELCOME_TITLE)}</h2>
          <p className="text-lg">
            {t(TEXT.WELCOME_SUBTITLE)}
          </p>
        </div>
      </div>
    </div>
  );
}
