import { formatDate } from "@/utils/format-date";
import ScanHistorySkeleton from "@components/skeletons/ScanHistorySkeleton"; // 🆕
import { Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import RadialProgress from "../RadialProgress";

export interface ScanEntry {
  id: number;
  drawingNumber: string;
  productName: string;
  date: string;
  progress: number;
  process: string;
}

interface ScanHistoryCardProps {
  history: ScanEntry[];
  scrollable?: boolean;
  onLoadMore?: () => void;
  loading?: boolean; // 🆕
}

export default function ScanHistoryCard({
  history,
  scrollable = true,
  onLoadMore,
  loading,
}: ScanHistoryCardProps) {
  const { t, i18n } = useTranslation("common");
  const locale = i18n.language || "en";

  console.log(history);
  console.log(loading);
  return (
    <div
      className={`w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4 shadow-sm sm:max-w-md ${
        scrollable ? "overflow-y-auto max-h-[400px]" : "overflow-hidden"
      }`}
    >
      <h2 className="text-md font-semibold text-gray-800 dark:text-white flex items-center gap-2">
        <Clock className="w-4 h-4 text-primary-500" />
        {t("scanHistory.title", "Scan History")}
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
                <p className="font-medium text-gray-800 dark:text-white truncate max-w-[160px] sm:max-w-[200px]">
                  {entry.product.productList.name}
                </p>
                <p className="text-xs py-4 text-gray-500 dark:text-gray-400">
                  {t(
                    `process.${entry.process.processList.name}`,
                    entry.process.processList.name
                  )}
                </p>
              </div>
              <div className="flex flex-col items-end text-xs text-right">
                <span className="text-gray-500 dark:text-gray-400 italic mb-1">
                  {formatDate(entry.createdAt, undefined, locale)}
                </span>
                <RadialProgress size={50} percentage={entry.percent} />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {t("scanHistory.empty", "No recent scans.")}
        </p>
      )}

      {!loading && (
        <div className="mt-2 text-center">
          <button
            onClick={onLoadMore}
            className="text-xs text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
          >
            {t("scanHistory.loadMore", "Load more...")}
          </button>
        </div>
      )}
    </div>
  );
}
