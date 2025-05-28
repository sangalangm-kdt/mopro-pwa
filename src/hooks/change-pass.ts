import { useState } from "react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation("common");

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
      newErrors.currentPassword = t("change_pass.error_current_required");
    if (!password) newErrors.password = t("change_pass.error_new_required");
    if (!passwordConfirmation)
      newErrors.passwordConfirmation = t("change_pass.error_confirm_required");
    if (password && passwordConfirmation && password !== passwordConfirmation) {
      newErrors.passwordConfirmation = t("change_pass.error_mismatch");
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
  };
}
