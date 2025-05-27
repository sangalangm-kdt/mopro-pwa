import Header from "@/components/navigation/Header";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const CollapsibleSection = ({
  title,
  content,
}: {
  title: string;
  content: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-gray-300 dark:border-zinc-700 rounded-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 text-left font-semibold text-sm text-gray-800 dark:text-gray-100"
      >
        {title}
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-primary-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-primary-500" />
        )}
      </button>
      {isOpen && (
        <div className="p-4 pt-0 text-sm text-gray-700 dark:text-gray-300">
          {content}
        </div>
      )}
    </div>
  );
};

const UserGuidelines = () => {
  const { t } = useTranslation("common");

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-gray-800 dark:text-gray-100">
      <Header
        title={t("user_guidelines.title")}
        textColorClass="text-gray-800 dark:text-white"
      />

      <main className="p-4 max-w-2xl mx-auto space-y-6">
        {/* Always visible: Intro */}
        <section>
          <h2 className="text-lg font-semibold text-primary-600 dark:text-primary-400 mb-2">
            {t("user_guidelines.intro_title")}
          </h2>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {t("user_guidelines.intro_description")}
          </p>
        </section>

        {/* Collapsible: General Guidelines */}
        <CollapsibleSection
          title={t("user_guidelines.general_title")}
          content={
            <ul className="list-disc pl-5 space-y-2">
              {[...Array(5)].map((_, i) => (
                <li key={i}>{t(`user_guidelines.general_item_${i + 1}`)}</li>
              ))}
            </ul>
          }
        />

        {/* Collapsible: Troubleshooting */}
        <CollapsibleSection
          title={t("user_guidelines.troubleshooting_title")}
          content={
            <ul className="list-disc pl-5 space-y-2">
              {[...Array(3)].map((_, i) => (
                <li key={i}>
                  {t(`user_guidelines.troubleshooting_item_${i + 1}`)}
                </li>
              ))}
            </ul>
          }
        />

        {/* Always visible: Support */}
        <section>
          <h2 className="text-lg font-semibold text-primary-600 dark:text-primary-400 mb-2">
            {t("user_guidelines.support_title")}
          </h2>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {t("user_guidelines.support_description")}
          </p>
        </section>
      </main>
    </div>
  );
};

export default UserGuidelines;
