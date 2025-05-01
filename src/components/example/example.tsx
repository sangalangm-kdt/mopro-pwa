import { BadgeInfo, FileText, Tag, Hash, ClipboardList } from "lucide-react";

export default function ProjectInfoCard() {
  const infoItems = [
    {
      label: "Project ID",
      value: "3762315",
      icon: <Hash className="w-5 h-5" />,
    },
    {
      label: "Project Name",
      value: "Kobe Steel Kakogawa No. 4 Reclaimer Renewal Work",
      icon: <Tag className="w-5 h-5" />,
    },
    {
      label: "Order ID",
      value: "23B10478",
      icon: <ClipboardList className="w-5 h-5" />,
    },
    {
      label: "Specification Number",
      value: "62315-F001",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      label: "Order Form Item Name",
      value: "No4 RECLAIMER",
      icon: <FileText className="w-5 h-5" />,
    },
  ];

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-lg space-y-5 border border-gray-200 dark:border-zinc-700">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
        <BadgeInfo className="w-5 h-5 text-green-600" />
        Project Information
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
        {infoItems.map((item, index) => (
          <InfoItem key={index} {...item} />
        ))}
      </div>
    </div>
  );
}

function InfoItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-green-600 dark:text-green-400 mt-1">{icon}</div>
      <div>
        <div className="text-gray-500 dark:text-zinc-400 font-medium">
          {label}
        </div>
        <div className="text-gray-800 dark:text-white">{value}</div>
      </div>
    </div>
  );
}
