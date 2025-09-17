import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScanQrCode } from "lucide-react";

import { useAuth } from "@/api/auth";
import { useProgressUpdate } from "@/api/progress-update";
import { useProductUserAssign } from "@/api/product-user-assign";
import { useProgress } from "@/api/progress";

import TwoWeekProgress from "@/components/TwoWeekProgress";
import TaskStatusBar from "@/components/TaskStatusBar";
import MyTasksAssignedList from "@/components/TaskAssignedList";
import Button from "@/components/buttons/Button";
import ScanHistoryCard from "@/components/cards/ScanHistoryCard";
import FullscreenScanHistory from "@/components/modals/FullscreenScanHistory";

import { HOME_TEXT_KEYS, ROUTES } from "@constants/index";
import { useLocalizedText } from "@/utils/localized-text";

import { useDayKeys } from "@/hooks/use-day-keys";
import { usePeriodSummary } from "@/hooks/use-period-summary";
import { useMyTasks } from "@/hooks/use-my-tasks";
import type { ProgressUpdate } from "@/utils/progress-summary";

import {
  BaseRow,
  cx,
  makeProgressIndex,
  dedupeForDisplay,
  totalsFromDisplay,
} from "@/utils/home-helpers";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const TEXT = useLocalizedText("common", HOME_TEXT_KEYS);

  const { progressUpdates, isLoading: isProgressLoading } = useProgressUpdate(
    user?.data?.id
  );
  const { productUserAssigns, isLoading: isAssignLoading } =
    useProductUserAssign();
  const { progress } = useProgress();

  // UI state
  const [windowDays, setWindowDays] = useState<15 | 30>(15);
  const [mode, setMode] = useState<"progress" | "myTasks">("progress");
  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null);
  const [showFullHistory, setShowFullHistory] = useState(false);

  // Derived data
  const dayKeys = useDayKeys(windowDays);
  const { summary, rangeLabel, daysActive, latestLabel } = usePeriodSummary(
    (progressUpdates as ProgressUpdate[]) ?? [],
    windowDays
  );

  const {
    list: myAssignedTasks, // raw list (pre-dedupe)
    tasksFromProgress, // latest progress mapped to tasks
    assignedKeys, // used by list to mark "Assigned"
    loading: myTasksLoading,
  } = useMyTasks({
    userId: user?.data?.id,
    progressRows: progress, // uses new useProgress() rows
    productUserAssigns,
    dayKeys,
    isLoadingProgress: isProgressLoading,
    isLoadingAssign: isAssignLoading,
  });

  const progressIdx = useMemo(
    () => makeProgressIndex((tasksFromProgress as BaseRow[]) ?? []),
    [tasksFromProgress]
  );

  const displayTasks = useMemo(
    () => dedupeForDisplay((myAssignedTasks as BaseRow[]) ?? [], progressIdx),
    [myAssignedTasks, progressIdx]
  );

  const displayTotals = useMemo(
    () => totalsFromDisplay(displayTasks, progressIdx),
    [displayTasks, progressIdx]
  );

  // Handlers (stable refs)
  const handleToggleMode = useCallback(
    (m: "progress" | "myTasks") => setMode(m),
    []
  );
  const handleSetWindowDays = useCallback((n: 15 | 30) => setWindowDays(n), []);
  const handleOpenScanner = useCallback(
    () => navigate(ROUTES.SCANNER),
    [navigate]
  );
  const handleOpenFullHistory = useCallback(() => setShowFullHistory(true), []);
  const handleCloseFullHistory = useCallback(
    () => setShowFullHistory(false),
    []
  );

  return (
    <div className="flex flex-col items-center justify-start px-1 py-4 space-y-5 bg-bg-color">
      {/* Controls row */}
      <div className="w-full max-w-md flex items-center justify-between gap-2">
        {/* Mode toggle — LEFT */}
        <div className="flex gap-2">
          {["progress", "myTasks"].map((m) => (
            <button
              key={m}
              onClick={() => handleToggleMode(m as "progress" | "myTasks")}
              className={cx(
                "px-3 py-1 rounded-full border text-sm capitalize",
                mode === m
                  ? "border-primary-500 text-primary-600 dark:text-primary-400"
                  : "border-gray-300 dark:border-zinc-600 text-gray-600 dark:text-gray-300"
              )}
            >
              {m === "progress" ? TEXT.PROGRESS : TEXT.MY_TASKS}
            </button>
          ))}
        </div>

        {/* 15/30 filter — RIGHT */}
        <div className="flex gap-2 ml-auto">
          {[15, 30].map((n) => (
            <button
              key={n}
              onClick={() => handleSetWindowDays(n as 15 | 30)}
              className={cx(
                "px-3 py-1 rounded-full border text-sm",
                windowDays === n
                  ? "border-primary-500 text-primary-600 dark:text-primary-400"
                  : "border-gray-300 dark:border-zinc-600 text-gray-600 dark:text-gray-300"
              )}
            >
              {n} {TEXT.DAYS}
            </button>
          ))}
        </div>
      </div>

      {/* Progress vs My Tasks */}
      {mode === "progress" ? (
        <TwoWeekProgress
          title={TEXT.PROGRESS_DAYS_TITLE.replace(
            "{{count}}",
            String(windowDays)
          )}
          bars={summary.bars}
          avgPercent={summary.avgPercent}
          rangeLabel={rangeLabel}
          selectedDayKey={selectedDayKey}
          onSelectDay={setSelectedDayKey}
          loading={isProgressLoading}
          daysActive={daysActive}
          latestLabel={latestLabel}
        />
      ) : (
        <>
          <TaskStatusBar
            title={TEXT.MY_TASKS}
            rangeLabel={rangeLabel}
            tasks={displayTasks as any}
            progressTasks={tasksFromProgress as any}
            windowDays={`${windowDays} ${TEXT.DAYS}`}
            totals={displayTotals as any}
            loading={myTasksLoading}
          />
          <MyTasksAssignedList
            tasks={displayTasks as any}
            progressTasks={tasksFromProgress as any}
            assignedKeys={assignedKeys}
            loading={myTasksLoading}
            onOpen={() => {}}
          />
          <div className="h-16" />
        </>
      )}

      {/* Scan QR Section — only in Progress */}
      {mode === "progress" && (
        <div className="w-full max-w-md rounded-lg bg-gray-50 dark:bg-zinc-800 p-5 shadow border border-gray-200 dark:border-zinc-700">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-1 bg-white dark:bg-zinc-900 rounded-md">
                <ScanQrCode className="w-6 h-6 text-primary-500" />
              </div>
              <div className="text-sm">
                <p className="text-base text-gray-800 dark:text-white font-semibold">
                  {TEXT.SCAN_TITLE}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {TEXT.SCAN_SUBTITLE}
                </p>
              </div>
            </div>
            <Button onClick={handleOpenScanner} className="px-6 py-4">
              {TEXT.SCAN_BUTTON}
            </Button>
          </div>
        </div>
      )}

      {/* Scan History — only in Progress */}
      {mode === "progress" && (
        <div className="w-full rounded-lg border grow scrollbar border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4 shadow-sm sm:max-w-md overflow-y-auto scroll-smooth max-h-[800px] sm:max-h-[500px]">
          <ScanHistoryCard
            history={progressUpdates?.slice(0, 5)}
            loading={isProgressLoading}
          />
          {!isProgressLoading && (
            <div className="text-center mt-2">
              <button
                onClick={handleOpenFullHistory}
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
              >
                {TEXT.SCAN_HISTORY_LOAD_MORE}
              </button>
            </div>
          )}
          {showFullHistory && (
            <FullscreenScanHistory
              data={progressUpdates}
              onClose={handleCloseFullHistory}
              loading={isProgressLoading}
            />
          )}
        </div>
      )}

      {/* Floating Scan Button — only in My Tasks */}
      {mode === "myTasks" && (
        <button
          onClick={handleOpenScanner}
          aria-label={TEXT.SCAN_TITLE ?? "Scan QR"}
          title={TEXT.SCAN_TITLE ?? "Scan QR"}
          className={cx(
            "fixed z-50 right-5",
            "bottom-[calc(env(safe-area-inset-bottom,0)+16px)]",
            "h-15 w-15 rounded-full shadow-lg",
            "bg-gradient-to-br from-primary-600 to-primary-500",
            "hover:from-primary-700 hover:to-primary-600",
            "active:scale-95 transition transform",
            "flex items-center justify-center",
            "text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500",
            "dark:focus:ring-offset-zinc-900"
          )}
        >
          <ScanQrCode className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
