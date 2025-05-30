import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { markOnboardingComplete } from "@/hooks/onboarding-direct";
import Button from "@/components/buttons/Button";

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

  const steps: Step[] = [
    {
      title: t("scan_title"),
      description: t("scan_description"),
      image: "/assets/scan.png",
    },
    {
      title: t("enter_title"),
      description: t("enter_description"),
      image: "/assets/enter.png",
    },
    {
      title: t("track_title"),
      description: t("track_description"),
      image: "/assets/track.png",
    },
  ];

  const step = steps[index];

  useEffect(() => {
    if (!autoSlide) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % steps.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [autoSlide, steps.length]);

  const next = () => {
    setAutoSlide(false);
    setIndex((prev) => (prev + 1) % steps.length);
  };

  const prev = () => {
    setAutoSlide(false);
    setIndex((prev) => (prev - 1 + steps.length) % steps.length);
  };

  const handleFinish = () => {
    markOnboardingComplete();
    navigate("/login");
  };

  const handleSkip = () => {
    markOnboardingComplete();
    navigate("/login");
  };

  return (
    <div className="flex flex-col justify-center text-left px-6 sm:px-10 lg:px-20 py-10 h-full w-full max-w-xl mx-auto">
      {/* Image */}
      <img
        src={step.image}
        alt={step.title}
        className="w-40 h-auto mb-6 self-center sm:self-start transition-all duration-500"
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

      {/* Prev/Next controls (optional) */}
      <div className="flex justify-between items-center w-full mb-4">
        <button
          onClick={prev}
          className="text-sm px-3 py-1 rounded text-primary-500 hover:text-primary-700"
          aria-label="Previous step"
        >
          {t("prev")}
        </button>
        <button
          onClick={next}
          className="text-sm px-3 py-1 rounded text-primary-500 hover:text-primary-700"
          aria-label="Next step"
        >
          {t("next")}
        </button>
      </div>

      {/* Step Indicators */}
      <div className="flex justify-center gap-2 mt-2">
        {steps.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setAutoSlide(false);
              setIndex(i);
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
