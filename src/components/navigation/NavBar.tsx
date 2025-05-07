import { useState } from "react";
import Logo from "@assets/logo/logo v2.svg?react";
import Sidebar from "@/components/navigation/SideBar";
import { Menu } from "lucide-react";
import { useAuthContext } from "@/context/auth/useAuth";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuthContext();
  const firstName = user?.firstName?.split(" ")[0] || "User";

  console.log(user);
  console.log(firstName);
  return (
    <>
      <header className="w-full px-4 sm:px-6 py-4 grid grid-cols-3 items-center bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-700 shadow-sm fixed top-0 left-0 right-0 z-30">
        {/* Left */}
        <div className="flex justify-start">
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open Sidebar"
            className="text-primary-800 dark:text-white"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Center */}
        <div className="flex justify-center text-base sm:text-sm font-medium text-gray-700 dark:text-white truncate">
          Hello,&nbsp;
          <span className="text-primary-800 font-semibold">{firstName}</span>
        </div>

        {/* Right */}
        <div className="flex justify-end">
          <Logo className="h-8 sm:h-10 w-auto" aria-label="MoPro logo" />
        </div>
      </header>

      {/* Sidebar */}
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
