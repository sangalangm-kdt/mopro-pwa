import { Outlet, useLocation, matchPath } from "react-router-dom";
import Navbar from "@/components/navigation/NavBar";
import { ROUTES } from "@/constants";

// Route patterns (mga walang header to)
const HIDDEN_LAYOUT_PATTERNS = [
  ROUTES.SCANNER,
  ROUTES.EDIT_PROGRESS,
  ROUTES.PROFILE,
  ROUTES.HELP_AND_SUPPORT,
  ROUTES.USER_GUIDELINES,
];

export default function MainLayout() {
  const location = useLocation();

  const hideLayout = HIDDEN_LAYOUT_PATTERNS.some((pattern) =>
    matchPath({ path: pattern, end: true }, location.pathname)
  );

  return (
    <div className="min-h-screen flex flex-col ">
      {!hideLayout && <Navbar />}
      <main
        className={`${
          hideLayout
            ? "min-h-screen bg-white dark:bg-zinc-800"
            : "flex-1 pt-20 px-4 sm:px-6"
        }`}
      >
        <Outlet />
      </main>

      {!hideLayout && (
        <footer className="hidden sm:block text-center text-sm text-gray-500 py-4 border-t border-gray-200 dark:border-zinc-700">
          © {new Date().getFullYear()} MoPro. All rights reserved.
        </footer>
      )}
    </div>
  );
}
