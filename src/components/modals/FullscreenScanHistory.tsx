import ScanHistorySkeleton from "@/components/skeletons/ScanHistorySkeleton";
import { formatDate } from "@/utils/format-date";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { ScanEntry } from "../cards/ScanHistoryCard";
import RadialProgress from "../RadialProgress";

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

    const [visible, setVisible] = useState(false);

    useEffect(() => {
        !loading && setVisible(true);
    }, []);

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 300);
    };

    return (
        <div
            className={`fixed inset-0 z-[9999] bg-white dark:bg-zinc-900 transition-transform duration-300 ${
                visible ? "translate-y-0" : "translate-y-full"
            }`}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-zinc-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {t("scanHistory.title", "Scan History")}
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
                {loading ? (
                    <ScanHistorySkeleton count={data.length || 5} />
                ) : data?.length > 0 ? (
                    <ul className="divide-y divide-gray-200 dark:divide-zinc-700 text-sm">
                        {data?.map((entry) => (
                            <li
                                key={entry.id}
                                className="py-4 flex flex-row justify-between items-center gap-4"
                            >
                                <div className="flex flex-col">
                                    <p className="font-medium text-gray-800 dark:text-white truncate max-w-[200px]">
                                        {entry.product.productList.name}
                                    </p>
                                    <p className="text-xs text-gray-500 py-4 dark:text-gray-400">
                                        {t(
                                            `process.${entry.process.processList.name}`,
                                            entry.process.processList.name
                                        )}
                                    </p>
                                </div>
                                <div className="flex flex-col items-end text-xs text-right">
                                    <span className="text-gray-500 dark:text-gray-400 italic mb-1">
                                        {formatDate(
                                            entry.createdAt,
                                            undefined,
                                            locale
                                        )}
                                    </span>
                                    <RadialProgress
                                        size={50}
                                        percentage={entry.percent}
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-sm text-center mt-10">
                        {t("scanHistory.empty", "No recent scans.")}
                    </p>
                )}
            </div>
        </div>
    );
}
