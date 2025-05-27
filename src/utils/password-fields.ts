import type { PasswordField } from "@/types/passField";
export function getPasswordFields(): PasswordField[] {
    return [
        {
            name: "currentPassword",
            label: "Current Password",
            placeholder: "Enter current password",
        },
        {
            name: "password",
            label: "New Password",
            placeholder: "Enter new password",
        },
        {
            name: "passwordConfirmation",
            label: "Confirm New Password",
            placeholder: "Re-enter new password",
        },
    ];
}
