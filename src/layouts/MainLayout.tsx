import { Outlet } from "react-router-dom";
import Navbar from "@/components/navigation/NavBar";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20 px-4 sm:px-6">
        <Outlet />
      </main>

      {/* Footer visible on desktop and above */}
      <footer className="hidden sm:block text-center text-sm text-gray-500 py-4 border-t border-gray-200 dark:border-zinc-700">
        © {new Date().getFullYear()} MoPro. All rights reserved.
      </footer>
    </div>
  );
}
