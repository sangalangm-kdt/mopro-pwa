import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { LOGIN_FIELDS } from "@constants/variables/fieldNames";
import { REGEX, ROUTES } from "@constants/index";
import { TOAST_MESSAGES } from "@constants/messages";
import { toast } from "sonner";
import { useAuthContext } from "@/context/auth/useAuth";

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

    const { login, user } = useAuthContext();

    useEffect(() => {
        if (user) {
            navigate(from, { replace: true });
        }
    }, [from, user, navigate]);

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
        const success = await login({ email, password });
        if (!success) {
            toast.error(TOAST_MESSAGES.NO_RECORD_FOUND);
            setLoading(false);
            return;
        }

        toast.success(TOAST_MESSAGES.LOGIN_SUCCESS);

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
