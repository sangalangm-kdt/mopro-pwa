import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightElement?: React.ReactNode;
}

export default function Header({
  title,
  showBack = true,
  rightElement,
}: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-transparent backdrop-blur-sm text-white">
      {/* Back button */}
      <div className="w-1/5">
        {showBack && (
          <button onClick={() => navigate(-1)}>
            <ArrowLeft size={24} /> Back
          </button>
        )}
      </div>

      {/* Title */}
      <div className="w-3/5 text-center">
        <h1 className="text-lg font-semibold truncate">{title}</h1>
      </div>

      {/* Right side */}
      <div className="w-1/5 flex justify-end items-center">{rightElement}</div>
    </header>
  );
}
