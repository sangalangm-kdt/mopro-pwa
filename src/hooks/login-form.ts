import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth/useAuth";
import { useToast } from "@/components/toast/useToast"; // <-- ADD THIS
import { LOGIN_FIELDS } from "@constants/variables/fieldNames";
import { REGEX, ROUTES } from "@constants/index";
import { TOAST_MESSAGES } from "@constants/messages";

export function useLoginForm() {
  const { t } = useTranslation("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof LOGIN_FIELDS, string>>
  >({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || ROUTES.HOME;

  const { login, isAuthenticated } = useAuth();
  const { showToast } = useToast(); // <-- ADD THIS

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [from, isAuthenticated, navigate]);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = t(`error.${LOGIN_FIELDS.email}.required`);
    else if (!REGEX.EMAIL.test(email))
      newErrors.email = t(`error.${LOGIN_FIELDS.email}.invalid`);
    if (!password)
      newErrors.password = t(`error.${LOGIN_FIELDS.password}.required`);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const success = await login(email, password);
    if (!success) {
      showToast(TOAST_MESSAGES.INVALID_CREDENTIALS, "error");
      setLoading(false);
      return;
    }

    showToast(TOAST_MESSAGES.LOGIN_SUCCESS, "success");

    // Delay navigation by 500ms
    setTimeout(() => {
      navigate(from, { replace: true });
      setLoading(false);
    }, 500);
  };

  return {
    t,
    email,
    setEmail,
    password,
    setPassword,
    errors,
    loading,
    handleLogin,
    navigate,
  };
}
