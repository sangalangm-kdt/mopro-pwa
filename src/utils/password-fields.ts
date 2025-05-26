import type { PasswordField } from "@/types/passField";
export function getPasswordFields(): PasswordField[] {
  return [
    {
      name: "currentPassword",
      label: "Current Password",
      placeholder: "Enter current password",
    },
    {
      name: "newPassword",
      label: "New Password",
      placeholder: "Enter new password",
    },
    {
      name: "confirmPassword",
      label: "Confirm New Password",
      placeholder: "Re-enter new password",
    },
  ];
}
