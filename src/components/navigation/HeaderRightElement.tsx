import {
  Settings,
  Flashlight,
  FileText,
  Edit,
  HelpCircle,
  Save,
  X,
  LogOut,
  Bell,
  type LucideIcon,
} from "lucide-react";

interface HeaderRightElementProps {
  page: string;
  onClick?: () => void;
}

const iconMap: Record<string, LucideIcon> = {
  home: Settings,
  scanner: Flashlight,
  inspection: FileText,
  profile: Edit,
  settings: Save,
  support: HelpCircle,
  report: FileText,
  login: X,
  dashboard: Bell,
  logout: LogOut,
};

export default function HeaderRightElement({
  page,
  onClick,
}: HeaderRightElementProps) {
  const IconComponent = iconMap[page] ?? HelpCircle;

  return (
    <IconComponent
      className={`text-gray-700 dark:text-gray-200 cursor-pointer ${
        !iconMap[page] ? "opacity-50" : ""
      }`}
      size={22}
      onClick={onClick}
      aria-label={iconMap[page] ? page : "Unknown Page"}
    />
  );
}
