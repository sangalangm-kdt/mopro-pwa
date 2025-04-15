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
} from "lucide-react";

interface HeaderRightElementProps {
  page: string;
  onClick?: () => void;
}

export default function HeaderRightElement({
  page,
  onClick,
}: HeaderRightElementProps) {
  const iconProps = {
    className: "text-gray-700 dark:text-gray-200 cursor-pointer",
    size: 22,
    onClick,
  };

  switch (page) {
    case "home":
      return <Settings {...iconProps} />;
    case "scanner":
      return <Flashlight {...iconProps} />;
    case "inspection":
      return <FileText {...iconProps} />;
    case "profile":
      return <Edit {...iconProps} />;
    case "settings":
      return <Save {...iconProps} />;
    case "support":
      return <HelpCircle {...iconProps} />;
    case "report":
      return <FileText {...iconProps} />;
    case "login":
      return <X {...iconProps} />;
    case "dashboard":
      return <Bell {...iconProps} />;
    case "logout":
      return <LogOut {...iconProps} />;
    default:
      return null;
  }
}
