// src/layouts/MinimalLayout.tsx
import { ReactNode } from "react";
import ThemeToggle from "@/components/ThemeToggle";

export default function MinimalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-bg-color">
      <main className="flex-grow flex flex-col">{children}</main>
      <footer className="py-4 text-center border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-center items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Theme
          </span>
          <ThemeToggle />
        </div>
      </footer>
    </div>
  );
}
