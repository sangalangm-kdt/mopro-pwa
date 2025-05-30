import Header from "@/components/navigation/Header";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FAQ_ITEMS, CONTACTS } from "@/constants/variables/fields";
import { ContactCard } from "@/components/cards/ContactCard";

const HelpAndSupport = () => {
  const { t } = useTranslation("common");

  const faqItems = FAQ_ITEMS.map((item) => ({
    question: t(item.question),
    answer: t(item.answer),
  }));

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggleFAQ = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-gray-800 dark:text-gray-100">
      <Header
        title={t("help.title")}
        textColorClass="text-gray-800 dark:text-white"
      />

      <div className="p-4 space-y-10 max-w-md mx-auto">
        {/* FAQ Accordion */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-primary-600 dark:text-primary-400">
            {t("help.faq.title")}
          </h2>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 shadow-sm"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center p-4 text-left text-sm font-medium text-gray-800 dark:text-gray-100"
                >
                  {item.question}
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-primary-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-primary-500" />
                  )}
                </button>
                {openIndex === index && (
                  <div className="px-4 pb-4 pt-0 text-sm text-gray-600 dark:text-gray-300">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Contact Support */}
        <section className="space-y-4 mt-10">
          <h2 className="text-lg font-semibold text-primary-600 dark:text-primary-400">
            {t("help.contact.title")}
          </h2>
          <div className="flex flex-col gap-6">
            {CONTACTS.map((person, index) => (
              <ContactCard
                key={index}
                email={person.email}
                position={person.position}
                company={person.company}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HelpAndSupport;
