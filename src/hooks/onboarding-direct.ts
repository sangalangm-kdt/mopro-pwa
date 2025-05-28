// src/hooks/useOnboardingRedirect.ts
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ONBOARDING_KEY = "seenOnboarding";

// ✅ Mobile detection
const isMobile = () => /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

export const useOnboardingRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem(ONBOARDING_KEY) === "true";
    const isOnboardingPage = location.pathname === "/onboarding";

    if (isMobile() && !hasSeenOnboarding && !isOnboardingPage) {
      navigate("/onboarding");
    }
  }, [navigate, location]);
};

export const markOnboardingComplete = () => {
  localStorage.setItem(ONBOARDING_KEY, "true");
};
