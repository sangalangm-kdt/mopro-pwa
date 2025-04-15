import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useAuth } from "@/context/auth/useAuth";

export default function UserProfileDropdown() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm text-primary-900 dark:text-white"
      >
        {user?.firstName?.charAt(0) || "U"}
        <ChevronDown className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-800 rounded-md shadow-md border border-gray-200 dark:border-zinc-700 z-50 p-3">
          <p className="text-sm mb-2 font-semibold">{user?.firstName}</p>
          <button
            className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-100 dark:hover:bg-zinc-700 rounded"
            onClick={() => {
              /* navigate to change password */
            }}
          >
            Change Password
          </button>
          <button
            className="block w-full text-left px-2 py-1 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-zinc-700 rounded"
            onClick={logout}
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}
