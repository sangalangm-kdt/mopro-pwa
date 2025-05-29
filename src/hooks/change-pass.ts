import { useState } from "react";
import { useLocalizedText } from "@/utils/localized-text";
import { CHANGE_PASSWORD_KEYS } from "@/constants";

type FormState = {
  currentPassword: string;
  password: string;
  passwordConfirmation: string;
};

type ErrorState = {
  [K in keyof FormState]: string;
};

type VisibilityState = {
  [K in keyof FormState]: boolean;
};

const initialForm: FormState = {
  currentPassword: "",
  password: "",
  passwordConfirmation: "",
};

const initialErrors: ErrorState = {
  currentPassword: "",
  password: "",
  passwordConfirmation: "",
};

const initialVisibility: VisibilityState = {
  currentPassword: false,
  password: false,
  passwordConfirmation: false,
};

export function useChangePassForm() {
  const labels = useLocalizedText("common", CHANGE_PASSWORD_KEYS);

  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<ErrorState>(initialErrors);
  const [visibility, setVisibility] =
    useState<VisibilityState>(initialVisibility);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const toggleVisibility = (field: keyof VisibilityState) => {
    setVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validateForm = () => {
    const { currentPassword, password, passwordConfirmation } = form;
    const newErrors: ErrorState = { ...initialErrors };

    if (!currentPassword)
      newErrors.currentPassword = labels.ERROR_CURRENT_REQUIRED;

    if (!password) newErrors.password = labels.ERROR_NEW_REQUIRED;

    if (!passwordConfirmation)
      newErrors.passwordConfirmation = labels.ERROR_CONFIRM_REQUIRED;

    if (password && passwordConfirmation && password !== passwordConfirmation) {
      newErrors.passwordConfirmation = labels.ERROR_MISMATCH;
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  return {
    form,
    errors,
    visibility,
    handleChange,
    toggleVisibility,
    validateForm,
    labels, // expose labels for UI usage (e.g. placeholders and button text)
  };
}
