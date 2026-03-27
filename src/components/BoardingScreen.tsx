import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { markOnboardingComplete } from "@/hooks/onboarding-direct";
import Button from "@/components/buttons/Button";

import scanImg from "@/assets/imgs/scan.png";
import enterImg from "@/assets/imgs/enter.png";
import trackImg from "@/assets/imgs/track.png";

interface Step {
  title: string;
  description: string;
  image: string;
}

export default function BoardingScreen() {
  const { t } = useTranslation("onboarding");
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [autoSlide, setAutoSlide] = useState(true);

  // ✅ animation control
  const [animKey, setAnimKey] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);

  const steps: Step[] = useMemo(
    () => [
      {
        title: t("scan_title"),
        description: t("scan_description"),
        image: scanImg,
      },
      {
        title: t("enter_title"),
        description: t("enter_description"),
        image: enterImg,
      },
      {
        title: t("track_title"),
        description: t("track_description"),
        image: trackImg,
      },
    ],
    [t],
  );

  const step = steps[index];

  useEffect(() => {
    if (!autoSlide) return;
    const interval = setInterval(() => {
      setDir(1);
      setIndex((prev) => (prev + 1) % steps.length);
      setAnimKey((k) => k + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, [autoSlide, steps.length]);

  const next = () => {
    setAutoSlide(false);
    setDir(1);
    setIndex((prev) => (prev + 1) % steps.length);
    setAnimKey((k) => k + 1);
  };

  const handleFinish = () => {
    markOnboardingComplete();
    navigate("/login", { replace: true });
  };

  const handleSkip = () => {
    markOnboardingComplete();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex flex-col justify-center text-left px-6 sm:px-10 lg:px-20 py-10 h-full w-full max-w-xl mx-auto">
      {/* ✅ Slide wrapper: fade + slide */}
      <div
        key={animKey}
        className={`transition-all duration-500 ease-out ${
          dir === 1 ? "animate-fade-slide-left" : "animate-fade-slide-right"
        }`}
      >
        {/* Image */}
        <img
          src={step.image}
          alt={step.title}
          className="w-50 h-auto mb-6 self-start transition-all duration-500"
          draggable={false}
        />

        {/* Text Content */}
        <div className="transition-all duration-500 ease-in-out">
          <h2 className="text-2xl font-display font-semibold mb-2 text-primary-100 dark:text-primary-600">
            {step.title}
          </h2>
          <p className="max-w-md text-sm text-primary-200 dark:text-white mb-6">
            {step.description}
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="w-full flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        {index === steps.length - 1 ? (
          <Button onClick={handleFinish} fullWidth>
            {t("get_started")}
          </Button>
        ) : (
          <>
            <Button onClick={next} fullWidth>
              {t("next")}
            </Button>
            <Button variant="outlined" onClick={handleSkip} fullWidth>
              {t("skip")}
            </Button>
          </>
        )}
      </div>

      {/* ✅ removed duplicate prev/next buttons */}

      {/* Step Indicators */}
      <div className="flex justify-center gap-2 mt-2">
        {steps.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setAutoSlide(false);
              setDir(i > index ? 1 : -1);
              setIndex(i);
              setAnimKey((k) => k + 1);
            }}
            aria-label={`Go to step ${i + 1}`}
            className={`w-2 h-2 rounded-full transition ${
              i === index
                ? "bg-primary-700 dark:bg-primary-200"
                : "bg-primary-300 dark:bg-primary-700"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
