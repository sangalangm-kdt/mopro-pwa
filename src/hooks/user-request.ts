import { useEffect, useState } from "react";
import { NavigateFunction } from "react-router-dom";
import { ROUTES } from "@/constants";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  roleId: number;
  manufacturerId: string;
}

type FormErrors = Omit<FormData, "roleId">;

export function useRequestAccountForm(
  navigate: NavigateFunction,
  steps: string[]
) {
  const totalSteps = steps.length;
  const [step, setStep] = useState<number>(1);
  const [direction, setDirection] = useState<string>("animate-fade-slide-left");
  const [loading, setLoading] = useState<boolean>(false);

  const [form, setForm] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    roleId: 3,
    manufacturerId: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    manufacturerId: "",
  });

  useEffect(() => {
    const saved = sessionStorage.getItem("transitionDirection");
    setDirection(
      saved === "right" ? "animate-fade-slide-right" : "animate-fade-slide-left"
    );
  }, []);

  const checkEmailExists = async (email: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const existing = ["test@example.com", "user@email.com"];
        resolve(existing.includes(email.toLowerCase()));
      }, 600);
    });
  };

  useEffect(() => {
    if (step !== 3 || !form.email.includes("@")) return;
    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      const exists = await checkEmailExists(form.email);
      if (!controller.signal.aborted) {
        setErrors((prev) => ({
          ...prev,
          email: exists ? "This email is already registered" : "",
        }));
      }
    }, 800);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [form.email, step]);

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    setErrors((prev) => {
      const newErrors = { ...prev };

      if (field === "firstName" && step === 1) {
        newErrors.firstName = value.trim() ? "" : "First name is required";
      }
      if (field === "lastName" && step === 1) {
        newErrors.lastName = value.trim() ? "" : "Last name is required";
      }

      if (field === "manufacturerId" && step === 2) {
        newErrors.manufacturerId = value.trim()
          ? ""
          : "Company name is required";
      }

      if (field === "email" && step === 3) {
        newErrors.email = value.includes("@")
          ? ""
          : "Please enter a valid email";
      }

      if (field === "password" && step === 4) {
        newErrors.password =
          value.length >= 6 ? "" : "Password must be at least 6 characters";
        newErrors.confirmPassword =
          value === form.confirmPassword ? "" : "Passwords do not match";
      }

      if (field === "confirmPassword" && step === 4) {
        newErrors.confirmPassword =
          value === form.password ? "" : "Passwords do not match";
      }

      return newErrors;
    });
  };

  const validateStep = (): boolean => {
    const newErrors = { ...errors };
    let isValid = true;

    if (step === 1) {
      if (!form.firstName.trim()) {
        newErrors.firstName = "First name is required";
        isValid = false;
      }
      if (!form.lastName.trim()) {
        newErrors.lastName = "Last name is required";
        isValid = false;
      }
    } else if (step === 2) {
      if (!form.manufacturerId.trim()) {
        newErrors.manufacturerId = "Company name is required";
        isValid = false;
      }
    } else if (step === 3) {
      if (!form.email.includes("@")) {
        newErrors.email = "Please enter a valid email";
        isValid = false;
      }
    } else if (step === 4) {
      if (form.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
        isValid = false;
      }
      if (form.password !== form.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    if (step === 1) {
      sessionStorage.setItem("transitionDirection", "right");
      navigate(ROUTES.LOGIN);
    } else {
      setStep((prev) => Math.max(prev - 1, 1));
    }
  };

  return {
    step,
    setStep,
    direction,
    form,
    errors,
    loading,
    setLoading,
    handleChange,
    handleNext,
    handleBack,
    validateStep,
    totalSteps,
  };
}
