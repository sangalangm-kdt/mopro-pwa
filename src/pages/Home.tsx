import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES, BUTTON_TEXT, MOCK_SCAN_HISTORY } from "@constants/index";
import Button from "@/components/buttons/Button";
import { QrCode } from "lucide-react";
import ScanHistoryCard, { ScanEntry } from "@/components/cards/ScanHistoryCard";
import FullscreenScanHistory from "@/components/modals/FullscreenScanHistory";
import { useProgressUpdate } from "@/api/progress-update";

const Home = () => {
    const { progressUpdates, isLoading } = useProgressUpdate();
    console.log("progressUpdate", progressUpdates);

    const navigate = useNavigate();
    const [showFullHistory, setShowFullHistory] = useState(false);

    return (
        <div className="flex flex-col items-center justify-start px-1 py-4 space-y-5 bg-bg-color">
            {/* 👋 Welcome Section */}
            <div className="w-full max-w-md bg-gradient-to-br from-white to-gray-50 dark:from-zinc-900 dark:to-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl p-5 shadow-sm transition-colors">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Welcome to{" "}
                    <span className="font-raleway text-primary-600 dark:text-primary-400">
                        MOPro
                    </span>
                </h1>
                <p className="text-sm text-gray-800 dark:text-gray-200 mt-2 leading-relaxed">
                    Manage inspections, track progress, and scan your project QR
                    codes effortlessly and efficiently.
                </p>
            </div>

            {/* 🔍 Scan QR Section */}
            <div className="w-full max-w-md rounded-lg flex items-center justify-between bg-gray-50 dark:bg-zinc-800 p-5 shadow border border-gray-200 dark:border-zinc-700">
                <div className="flex items-center gap-3">
                    <div className="p-1 bg-white dark:bg-zinc-900 rounded-md">
                        <QrCode className="w-6 h-6 text-primary-500" />
                    </div>
                    <div className="text-sm">
                        <p className="text-gray-800 dark:text-white font-semibold">
                            Scan QR Code
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">
                            Click here to update your progress
                        </p>
                    </div>
                </div>
                <Button
                    onClick={() => navigate(ROUTES.SCANNER)}
                    className="px-6 py-2"
                >
                    {BUTTON_TEXT.SCAN}
                </Button>
            </div>

            {/* 📜 Scan History */}
            <div className="w-full flex justify-center">
                <ScanHistoryCard
                    history={progressUpdates?.slice(0, 5)}
                    scrollable={false}
                    onLoadMore={() => setShowFullHistory(true)}
                    loading={isLoading}
                />
            </div>

            {/* 🧾 Fullscreen Modal */}
            {showFullHistory && (
                <FullscreenScanHistory
                    data={progressUpdates}
                    onClose={() => setShowFullHistory(false)}
                />
            )}
        </div>
    );
};

export default Home;
