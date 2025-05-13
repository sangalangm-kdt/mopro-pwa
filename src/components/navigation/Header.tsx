import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightElement?: React.ReactNode;
  textColorClass?: string; // ✅ Customizable text color
}

export default function Header({
  title,
  showBack = true,
  rightElement,
  textColorClass = "text-white",
}: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header
      role="banner"
      className={`flex items-center justify-between px-4 py-4 bg-transparent backdrop-blur-sm shadow-md ${textColorClass}`}
    >
      {/* Back button */}
      <div className="w-1/5">
        {showBack && (
          <button
            aria-label="Go back"
            onClick={() => navigate(-1)}
            className={`p-2 rounded-full ${textColorClass} hover:bg-gray-200 dark:hover:bg-zinc-800 active:bg-gray-300 dark:active:bg-zinc-700 transition group`}
          >
            <ArrowLeft
              size={24}
              className="group-hover:-translate-x-1 transition-transform duration-200"
            />
          </button>
        )}
      </div>

      {/* Title */}
      <div className="w-3/5 text-center">
        <h1 className="text-base font-semibold truncate">{title}</h1>
      </div>

      {/* Right side */}
      <div className="w-1/5 flex justify-end items-center">{rightElement}</div>
    </header>
  );
}
