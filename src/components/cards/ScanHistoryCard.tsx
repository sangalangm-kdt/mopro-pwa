import { formatDate } from "@/utils/format-date";
import ScanHistorySkeleton from "@components/skeletons/ScanHistorySkeleton";
import { Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import RadialProgress from "../RadialProgress";
import { HOME_TEXT_KEYS } from "@/constants";

export interface ScanEntry {
  id: number;
  percent: number;
  drawingNumber: string;
  productName: string;
  date: string;
  createdAt: string;
  product: {
    productList: {
      name: string;
    };
  };
  process: {
    processList: {
      name: string;
    };
  };
}

interface ScanHistoryCardProps {
  history: ScanEntry[];
  scrollable?: boolean;
  loading?: boolean;
}

export default function ScanHistoryCard({
  history,
  loading,
}: ScanHistoryCardProps) {
  const { t, i18n } = useTranslation(["common", "home"]);
  const locale = i18n.language || "en";

  return (
    <div>
      <h2 className="text-lg sm:text-md font-semibold text-gray-800 dark:text-white flex items-center gap-2">
        <Clock className="w-4 h-4 text-primary-500" />
        {t(HOME_TEXT_KEYS.SCAN_HISTORY)}
      </h2>

      <hr className="border-t border-gray-200 dark:border-zinc-700 my-2" />

      {loading ? (
        <ScanHistorySkeleton />
      ) : history?.length > 0 ? (
        <ul className="divide-y divide-gray-100 dark:divide-zinc-700 text-sm">
          {history.map((entry) => (
            <li
              key={entry.id}
              className="py-3 flex flex-row justify-between gap-3 sm:gap-1"
            >
              <div className="flex flex-col">
                <p className="font-medium text-base sm:text-sm text-gray-800 dark:text-white truncate max-w-[200px]">
                  {entry.product.productList.name}
                </p>
                <p className="text-sm py-4 text-gray-500 truncate dark:text-gray-400">
                  {t(
                    `process.${entry.process.processList.name}`,
                    entry.process.processList.name
                  )}
                </p>
              </div>
              <div className="flex flex-col items-end text-sm text-right">
                <span className="text-gray-500 dark:text-gray-400 italic mb-1">
                  {formatDate(entry.createdAt, undefined, locale)}
                </span>
                <RadialProgress size={50} percentage={entry.percent} />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex items-center justify-center p-8">
          <p className="text-gray-500 dark:text-gray-400 text-base sm:text-sm">
            {t(HOME_TEXT_KEYS.SCAN_HISTORY_EMPTY)}
          </p>
        </div>
      )}
    </div>
  );
}
