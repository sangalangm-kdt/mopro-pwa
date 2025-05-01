import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightElement?: React.ReactNode;
  textColorClass?: string; // ✅ NEW: Customizable text color
}

export default function Header({
  title,
  showBack = true,
  rightElement,
  textColorClass = "text-white", // ✅ Default still white
}: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header
      className={`flex items-center justify-between px-4 py-6 bg-transparent backdrop-blur-sm ${textColorClass}`}
    >
      {/* Back button */}
      <div className="w-1/5">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center space-x-1 ${textColorClass} hover:text-primary-300 transition-colors duration-200 group`}
          >
            <ArrowLeft
              size={24}
              className="group-hover:-translate-x-1 transition-transform duration-200"
            />
            {/* <span className="text-sm font-medium">Back</span> */}
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
