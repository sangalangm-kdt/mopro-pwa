import { useAuth } from "@/api/auth";
import Button from "@/components/buttons/Button";
import Header from "@/components/navigation/Header";
import type { PasswordField } from "@/types/passField";
import { getPasswordFields } from "@/utils/password-fields";
import { Eye, EyeOff, Home } from "lucide-react";
import { useState } from "react";

const ChangePass = () => {
    const navigate = useNavigate();
    const { changePassword } = useAuth();

    const [form, setForm] = useState({
        currentPassword: "12345678",
        password: "87654321",
        passwordConfirmation: "87654321",
    });

    const [formErrors, setFormErrors] = useState({
        currentPassword: "",
        password: "",
        passwordConfirmation: "",
    });

    const [showPassword, setShowPassword] = useState({
        currentPassword: false,
        password: false,
        passwordConfirmation: false,
    });

    const fields: PasswordField[] = getPasswordFields();

    const handleChange = (field: keyof typeof form, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        // setFormErrors((prev) => ({ ...prev, [field]: "" })); // clear error on typing
    };

    const toggleVisibility = (field: keyof typeof showPassword) => {
        setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handleChangePassword = () => {
        const errors: Record<string, string> = {};
        // const { currentPassword, password, passwordConfirmation } = form;

        // if (!currentPassword)
        //     errors.currentPassword = "Current password is required.";
        // if (!password) errors.password = "New password is required.";
        // if (!passwordConfirmation)
        //     errors.confirmPassword = "Please confirm your new password.";
        // if (
        //     password &&
        //     passwordConfirmation &&
        //     password !== passwordConfirmation
        // )
        //     errors.confirmPassword = "New passwords do not match.";

        setFormErrors(errors as typeof formErrors);

        if (Object.keys(errors).length === 0) {
            console.log("Changing password...", form);
            changePassword(form);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-900 text-gray-800 dark:text-gray-100">
            <Header
                title="Change Password"
                textColorClass="text-gray-800 dark:text-white"
                rightElement={
                    <button
                        onClick={() => navigate("/")}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                        aria-label="Go to home"
                    >
                        <Home className="w-5 h-5 text-gray-700 dark:text-white" />
                    </button>
                }
            />

            <div className="flex flex-col items-center justify-center px-6 py-10">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-justify">
                    For your account's security, please enter your current
                    password and choose a new one.
                </p>

                <div className="w-full max-w-md bg-white dark:bg-zinc-800 rounded-xl space-y-6 ">
                    {fields.map(({ name, label, placeholder }) => (
                        <div key={name}>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {label}
                            </label>
                            <div className="relative">
                                <input
                                    type={
                                        showPassword[name] ? "text" : "password"
                                    }
                                    value={form[name]}
                                    onChange={(e) =>
                                        handleChange(name, e.target.value)
                                    }
                                    placeholder={placeholder}
                                    className={`w-full px-4 py-2 rounded-md border text-sm focus:outline-none focus:ring-2 ${
                                        formErrors[name]
                                            ? "border-red-500 focus:ring-red-500"
                                            : "border-gray-300 dark:border-gray-600 focus:ring-primary-600"
                                    } bg-white dark:bg-zinc-900`}
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleVisibility(name)}
                                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                >
                                    {showPassword[name] ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                            {formErrors[name] && (
                                <p className="text-xs text-red-500 mt-1">
                                    {formErrors[name]}
                                </p>
                            )}
                        </div>
                    ))}

                    <Button fullWidth onClick={handleChangePassword}>
                        Update Password
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ChangePass;
