import { useEffect, useState } from "react";
import { NavigateFunction } from "react-router-dom";
import { REQUEST_ACCOUNT_TEXT_KEYS, ROUTES } from "@/constants";
import { useTranslation } from "react-i18next";
import { isAxiosError } from "axios";
import {
  checkUserRequestEmailAvailability,
  createUserRequest,
} from "@/api/user-request";
import { toast } from "sonner";

interface FormData {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  roleId: number;
  manufacturerId: string;
}

type FormErrors = Omit<FormData, "roleId">;

type LaravelValidationErrors = Record<string, string[] | string | undefined>;

const firstErrorMessage = (value: string[] | string | undefined) =>
  Array.isArray(value) ? value[0] : value;

const fieldMap: Record<string, keyof FormErrors> = {
  employee_id: "employeeId",
  employeeId: "employeeId",
  first_name: "firstName",
  firstName: "firstName",
  last_name: "lastName",
  lastName: "lastName",
  email: "email",
  password: "password",
  password_confirmation: "confirmPassword",
  passwordConfirmation: "confirmPassword",
  confirmPassword: "confirmPassword",
  manufacturer_id: "manufacturerId",
  manufacturerId: "manufacturerId",
};

const fieldStepMap: Record<keyof FormErrors, number> = {
  employeeId: 1,
  firstName: 1,
  lastName: 1,
  manufacturerId: 2,
  email: 3,
  password: 4,
  confirmPassword: 4,
};

export function useRequestAccountForm(
  navigate: NavigateFunction,
  steps: string[],
  options: { manufacturerLoadFailed?: boolean } = {},
) {
  const { t } = useTranslation("common");
  const TEXT = REQUEST_ACCOUNT_TEXT_KEYS;
  const totalSteps = steps.length;
  const [step, setStep] = useState<number>(1);
  const [direction, setDirection] = useState<string>("animate-fade-slide-left");
  const [loading, setLoading] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [hasEmailValidationEndpoint, setHasEmailValidationEndpoint] =
    useState<boolean>(true);

  const [form, setForm] = useState<FormData>({
    employeeId: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    roleId: 3,
    manufacturerId: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    employeeId: "",
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

  const checkEmailAvailability = async (
    email: string,
    signal?: AbortSignal,
  ) => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail.includes("@") || !hasEmailValidationEndpoint) return;

    try {
      const result = await checkUserRequestEmailAvailability(
        trimmedEmail,
        signal,
      );
      setHasEmailValidationEndpoint(result.endpointAvailable);

      if (signal?.aborted) return;

      setErrors((prev) => ({
        ...prev,
        email: result.available ? "" : t(TEXT.ERROR.EMAIL_REGISTERED),
      }));
    } catch {
      // Submit-time Laravel 422 handling remains the fallback.
    }
  };

  useEffect(() => {
    if (step !== 3 || !form.email.includes("@") || !hasEmailValidationEndpoint) {
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => {
      void checkEmailAvailability(form.email, controller.signal);
    }, 500);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [
    form.email,
    hasEmailValidationEndpoint,
    step,
    t,
    TEXT.ERROR.EMAIL_REGISTERED,
  ]);

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSubmitError("");

    setErrors((prev) => {
      const newErrors = { ...prev };

      if (field === "firstName" && step === 1) {
        newErrors.firstName = value.trim()
          ? ""
          : t(TEXT.ERROR.FIRST_NAME_REQUIRED);
      }
      if (field === "employeeId" && step === 1) {
        newErrors.employeeId = value.trim()
          ? ""
          : t(TEXT.ERROR.EMPLOYEE_ID_REQUIRED);
      }
      if (field === "lastName" && step === 1) {
        newErrors.lastName = value.trim()
          ? ""
          : t(TEXT.ERROR.LAST_NAME_REQUIRED);
      }

      if (field === "manufacturerId" && step === 2) {
        newErrors.manufacturerId = value.trim()
          ? ""
          : t(TEXT.ERROR.MANUFACTURER_REQUIRED);
      }

      if (field === "email" && step === 3) {
        newErrors.email = value.includes("@")
          ? ""
          : t(TEXT.ERROR.EMAIL_INVALID);
      }

      if (field === "password" && step === 4) {
        newErrors.password =
          value.length >= 6 ? "" : t(TEXT.ERROR.PASSWORD_MIN);
        newErrors.confirmPassword =
          value === form.confirmPassword ? "" : t(TEXT.ERROR.PASSWORD_MISMATCH);
      }

      if (field === "confirmPassword" && step === 4) {
        newErrors.confirmPassword =
          value === form.password ? "" : t(TEXT.ERROR.PASSWORD_MISMATCH);
      }

      return newErrors;
    });
  };

  const handleEmailBlur = () => {
    void checkEmailAvailability(form.email);
  };

  const validateStep = (): boolean => {
    const newErrors = { ...errors };
    let isValid = true;

    if (step === 1) {
      if (!form.employeeId.trim()) {
        newErrors.employeeId = t(TEXT.ERROR.EMPLOYEE_ID_REQUIRED);
        isValid = false;
      }
      if (!form.firstName.trim()) {
        newErrors.firstName = t(TEXT.ERROR.FIRST_NAME_REQUIRED);
        isValid = false;
      }
      if (!form.lastName.trim()) {
        newErrors.lastName = t(TEXT.ERROR.LAST_NAME_REQUIRED);
        isValid = false;
      }
    } else if (step === 2) {
      if (options.manufacturerLoadFailed) {
        newErrors.manufacturerId = t(TEXT.ERROR.MANUFACTURER_LOAD_FAILED);
        isValid = false;
      } else if (!form.manufacturerId.trim()) {
        newErrors.manufacturerId = t(TEXT.ERROR.MANUFACTURER_REQUIRED);
        isValid = false;
      }
    } else if (step === 3) {
      if (!form.email.includes("@")) {
        newErrors.email = t(TEXT.ERROR.EMAIL_INVALID);
        isValid = false;
      } else if (errors.email) {
        isValid = false;
      }
    } else if (step === 4) {
      if (form.password.length < 6) {
        newErrors.password = t(TEXT.ERROR.PASSWORD_MIN);
        isValid = false;
      }
      if (form.password !== form.confirmPassword) {
        newErrors.confirmPassword = t(TEXT.ERROR.PASSWORD_MISMATCH);
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const applyValidationErrors = (validationErrors: LaravelValidationErrors) => {
    const fieldErrors: Partial<FormErrors> = {};
    const formLevelMessages: string[] = [];

    Object.entries(validationErrors).forEach(([field, value]) => {
      const message = firstErrorMessage(value);
      if (!message) return;

      const mappedField = fieldMap[field];
      if (mappedField) {
        fieldErrors[mappedField] =
          mappedField === "email" ? t(TEXT.ERROR.EMAIL_REGISTERED) : message;
        return;
      }

      formLevelMessages.push(message);
    });

    setErrors((prev) => ({ ...prev, ...fieldErrors }));
    const firstInvalidField = Object.keys(fieldErrors)[0] as
      | keyof FormErrors
      | undefined;
    if (firstInvalidField) {
      setStep(fieldStepMap[firstInvalidField]);
    }
    setSubmitError(formLevelMessages[0] || t(TEXT.ERROR.SUBMIT_FAILED));
  };

  const submitUserRequest = async () => {
    if (loading) return false;

    setSubmitError("");
    setLoading(true);

    const manufacturerId = Number(form.manufacturerId);
    const payload = {
      employeeId: form.employeeId.trim(),
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      password: form.password,
      passwordConfirmation: form.confirmPassword,
      roleId: form.roleId,
      manufacturerId: Number.isNaN(manufacturerId) ? null : manufacturerId,
      projectId: null,
    };

    try {
      await createUserRequest(payload);
      return true;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 422) {
        applyValidationErrors(error.response.data?.errors ?? {});
        toast.error(t(TEXT.ERROR.VALIDATION_FAILED));
        return false;
      }

      setSubmitError(t(TEXT.ERROR.SUBMIT_FAILED));
      toast.error(t(TEXT.ERROR.SUBMIT_FAILED));
      return false;
    } finally {
      setLoading(false);
    }
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
    submitError,
    setLoading,
    handleChange,
    handleEmailBlur,
    handleNext,
    handleBack,
    validateStep,
    submitUserRequest,
    totalSteps,
  };
}
