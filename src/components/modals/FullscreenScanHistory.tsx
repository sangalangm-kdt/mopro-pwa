import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import ScanHistorySkeleton from "@/components/skeletons/ScanHistorySkeleton";
import RadialProgress from "../RadialProgress";
import { formatDate } from "@/utils/format-date";
import { highlightMatch } from "@/utils/highlight-match";

import type { ScanEntry } from "../cards/ScanHistoryCard";
import { HOME_TEXT_KEYS } from "@/constants";

import {
  filterScanHistoryByDate,
  getFilterOptions,
  type DateFilterOption,
} from "@/utils/date-filter";
import { searchScanHistory } from "@/utils/search-scan-history";

interface FullscreenScanHistoryProps {
  data: ScanEntry[];
  onClose: () => void;
  loading: boolean;
}

export default function FullscreenScanHistory({
  data,
  onClose,
  loading,
}: FullscreenScanHistoryProps) {
  const { t, i18n } = useTranslation("common");
  const locale = i18n.language || "en";
  const filterOptions = getFilterOptions(t);

  const [visible, setVisible] = useState(false);
  const [dateFilter, setDateFilter] = useState<DateFilterOption>("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!loading) {
      setVisible(true);
    }
  }, [loading]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const filteredData = searchScanHistory(
    filterScanHistoryByDate(data, dateFilter),
    searchTerm
  );

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-white dark:bg-zinc-900 transition-all duration-300 ease-in-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-zinc-700">
        <h2 className="text-xl sm:text-lg font-semibold text-gray-800 dark:text-white">
          {t(HOME_TEXT_KEYS.SCAN_HISTORY)}
        </h2>
        <button
          onClick={handleClose}
          className="text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 h-[calc(100vh-60px)] overflow-y-auto scrollbar">
        {/* Search Input */}
        <div className="relative w-full sm:w-[240px] mb-4">
          <input
            type="text"
            placeholder="Search by ID, product name or process"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-base sm:text-sm rounded-md border border-gray-300 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition"
          />

          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-zinc-400 pointer-events-none" />
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 justify-start overflow-x-auto whitespace-nowrap mb-4 text-sm w-full scrollbar-hide">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setDateFilter(opt.value)}
              className={`px-3 py-1 rounded-full border ${
                dateFilter === opt.value
                  ? "bg-primary-500 text-white border-primary-500"
                  : "bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-zinc-600"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Scan History List */}
        {loading ? (
          <ScanHistorySkeleton count={Math.max(data.length || 0, 5)} />
        ) : filteredData.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-zinc-700 text-sm">
            {filteredData.map((entry) => (
              <li
                key={entry.id}
                className="py-3 flex justify-between items-start gap-2"
              >
                {/* Left side: Product and Process */}
                <div className="flex flex-col gap-1 max-w-[70%]">
                  <p className="font-medium text-base sm:text-sm text-gray-800 dark:text-white truncate">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: highlightMatch(
                          entry.product.productList.name,
                          searchTerm
                        ),
                      }}
                    />
                  </p>
                  <p className="text-sm text-gray-500 py-2 dark:text-gray-400">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: highlightMatch(entry.lineNumber, searchTerm),
                      }}
                    />
                  </p>
                </div>

                {/* Right side: Date and RadialProgress */}
                <div className="flex flex-col items-end min-w-[75px]">
                  <span className="text-sm text-gray-400">
                    {formatDate(entry.createdAt, undefined, locale)}
                  </span>
                  <div className="mt-1">
                    <RadialProgress size={50} percentage={entry.percent} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-base sm:text-sm text-center mt-10">
            {t(HOME_TEXT_KEYS.SCAN_HISTORY_EMPTY)}
          </p>
        )}
      </div>
    </div>
  );
}
