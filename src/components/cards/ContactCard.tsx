import { Briefcase, Building2, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

export const ContactCard = ({
  email,
  position,
  company,
}: {
  email: string;
  position: string;
  company: string;
}) => {
  const { t } = useTranslation("common");

  return (
    <div className="rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 p-4 space-y-3 shadow-sm text-sm text-gray-700 dark:text-gray-300">
      <div className="flex items-center gap-2">
        <Mail className="w-4 h-4 text-primary-600 dark:text-primary-400" />
        <a
          href={`mailto:${email}`}
          className="hover:underline break-all font-semibold"
        >
          {email}
        </a>
      </div>
      <div className="flex items-center gap-2">
        <Briefcase className="w-4 h-4 text-primary-600 dark:text-primary-400" />
        <span>{t(position)}</span>
      </div>
      <div className="flex items-center gap-2">
        <Building2 className="w-4 h-4 text-primary-600 dark:text-primary-400" />
        <span>{t(company)}</span>
      </div>
    </div>
  );
};
