import type { PasswordField } from "@/types/passField";

export function getPasswordFields(t: (key: string) => string): PasswordField[] {
  return [
    {
      name: "currentPassword",
      label: t("change_password.current_password.label"),
      placeholder: t("change_password.current_password.placeholder"),
    },
    {
      name: "password",
      label: t("change_password.new_password.label"),
      placeholder: t("change_password.new_password.placeholder"),
    },
    {
      name: "passwordConfirmation",
      label: t("change_password.confirm_password.label"),
      placeholder: t("change_password.confirm_password.placeholder"),
    },
  ];
}
