import { useAuth } from "@/api/auth";
import { useProgressUpdate } from "@/api/progress-update";
import { useProductUserAssign } from "@/api/product-user-assign";

import TwoWeekProgress from "@/components/TwoWeekProgress";
import TaskStatusBar from "@/components/TaskStatusBar";
import MyTasksAssignedList from "@/components/TaskAssignedList";
import Button from "@/components/buttons/Button";
import ScanHistoryCard from "@/components/cards/ScanHistoryCard";
import FullscreenScanHistory from "@/components/modals/FullscreenScanHistory";

import { HOME_TEXT_KEYS, ROUTES } from "@constants/index";
import { useLocalizedText } from "@/utils/localized-text";
import { ScanQrCode } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useDayKeys } from "@/hooks/use-day-keys";
import { usePeriodSummary } from "@/hooks/use-period-summary";
import { useMyTasks } from "@/hooks/use-my-tasks";
import type { ProgressUpdate } from "@/utils/progress-summary";
import { useProgress } from "@/api/progress";

type Mode = "progress" | "myTasks";

/* ---------- helpers to keep header count in sync with list ---------- */
const norm = (x: any) => String(x ?? "").trim();
const normLn = (x: any) =>
  norm(x)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const getPid = (t: any) => t?.productId ?? t?.product?.id ?? null;
const getLnRaw = (t: any) =>
  t?.lineNumber ?? t?.product?.lineNumber ?? t?.drawingNumber ?? null;
const getLn = (t: any) => {
  const raw = getLnRaw(t);
  return raw ? normLn(raw) : null;
};

// composite key: group pid-only and ln-only rows together
const groupKey = (t: any) => {
  const ln = getLn(t); // normalized (e.g., "5-1002" → "51002")
  if (ln) return `ln:${ln}`;

  const pid = getPid(t);
  if (pid != null) return `pid:${String(pid).toLowerCase()}`;

  return `id:${norm(t?.id)}`;
};

const toTime = (x: any) => {
  const n = new Date(x ?? 0).getTime();
  return Number.isFinite(n) ? n : 0;
};
const itemTs = (t: any) =>
  Math.max(
    toTime(t?.progressUpdatedAt),
    toTime(t?.updatedAt),
    toTime(t?.scheduledDate),
    toTime(t?.createdAt)
  );

function makeProgressIndex(progressTasks?: any[]) {
  const byPid = new Map<string, any>();
  const byLn = new Map<string, any>();

  const upsert = (
    map: Map<string, any>,
    key: any,
    row: any,
    normer: (v: any) => string
  ) => {
    const k = normer(key);
    if (!k) return;
    const prev = map.get(k);
    if (!prev || itemTs(row) >= itemTs(prev)) map.set(k, row);
  };

  const nz = (v: any) => (v == null ? "" : String(v).trim().toLowerCase());
  for (const p of progressTasks ?? []) {
    upsert(byPid, getPid(p), p, nz);
    upsert(byLn, getLnRaw(p), p, normLn);
  }

  const get = (t: any) => {
    const pid = getPid(t);
    const ln = getLn(t);
    return (
      (pid != null && byPid.get(nz(pid))) || (ln ? byLn.get(ln) : undefined)
    );
  };

  return {
    get,
    has: (t: any) => !!get(t),
    forApproval: (t: any) => !!(get(t) as any)?.forApproval,
    percent: (t: any): number | null => {
      const row = get(t) as any;
      return typeof row?.percent === "number" ? row.percent : null;
    },
    updatedAt: (t: any) => {
      const row = get(t) as any;
      return row?.progressUpdatedAt ?? row?.updatedAt ?? row?.createdAt ?? null;
    },
  };
}

function dedupeForDisplay(
  tasks: any[],
  progressIdx: ReturnType<typeof makeProgressIndex>
) {
  const groups = new Map<string, any[]>();
  for (const t of tasks ?? []) {
    const k = groupKey(t);
    const arr = groups.get(k);
    if (arr) arr.push(t);
    else groups.set(k, [t]);
  }

  const score = (t: any) => {
    const hasProg = progressIdx.has(t) ? 1 : 0;
    const ts = Math.max(itemTs(t), toTime(progressIdx.updatedAt(t)));
    return hasProg * 1e12 + ts;
  };

  const out: any[] = [];
  for (const [, arr] of groups) {
    let best = arr[0];
    for (const x of arr) if (score(x) >= score(best)) best = x;
    out.push(best);
  }
  return out;
}

function totalsFromDisplay(
  tasks: any[],
  progressIdx: ReturnType<typeof makeProgressIndex>
) {
  let todo = 0,
    in_progress = 0,
    blocked = 0,
    done = 0;
  for (const t of tasks) {
    if (progressIdx.forApproval(t)) blocked++;
    else if (t.status === "in_progress") in_progress++;
    else if (t.status === "done") done++;
    else todo++;
  }
  const all = todo + in_progress + blocked + done;
  return { todo, in_progress, blocked, done, all };
}
/* ------------------------------------------------------------------- */

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const TEXT = useLocalizedText("common", HOME_TEXT_KEYS);

  const { progressUpdates, isLoading: isProgressLoading } = useProgressUpdate(
    user.data.id
  );
  const { productUserAssigns, isLoading: isAssignLoading } =
    useProductUserAssign();

  const { progress } = useProgress();
  console.log("progress:", progress);
  const [windowDays, setWindowDays] = useState<15 | 30>(15);
  const [mode, setMode] = useState<Mode>("progress");
  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null);
  const [showFullHistory, setShowFullHistory] = useState(false);

  const dayKeys = useDayKeys(windowDays);
  const { summary, rangeLabel, daysActive, latestLabel } = usePeriodSummary(
    (progressUpdates as ProgressUpdate[]) ?? [],
    windowDays
  );

  const {
    // raw list (pre-dedupe)
    list: myAssignedTasks,
    // latest progress mapped to tasks
    tasksFromProgress,
    // optional: used by list to mark "Assigned"
    assignedKeys,
    // old totals (pre-dedupe) – we'll replace with deduped totals below
    loading: myTasksLoading,
  } = useMyTasks({
    userId: user?.data?.id,
    progressRows: progress, // ⬅ uses new useProgress() rows
    productUserAssigns,
    dayKeys,
    isLoadingProgress: isProgressLoading,
    isLoadingAssign: isAssignLoading,
  });

  // ✅ Build the same deduped view model we render and derive totals from it
  const progressIdx = useMemo(
    () => makeProgressIndex(tasksFromProgress as any[]),
    [tasksFromProgress]
  );

  const displayTasks = useMemo(
    () => dedupeForDisplay(myAssignedTasks as any[], progressIdx),
    [myAssignedTasks, progressIdx]
  );

  const displayTotals = useMemo(
    () => totalsFromDisplay(displayTasks, progressIdx),
    [displayTasks, progressIdx]
  );
  console.log("displayTasks:", displayTasks);
  return (
    <div className="flex flex-col  items-center justify-start px-1 py-4 space-y-5 bg-bg-color ">
      {/* Controls row */}
      <div className="w-full max-w-md flex items-center justify-between gap-2">
        {/* Mode toggle — LEFT */}
        <div className="flex gap-2">
          {(["progress", "myTasks"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={[
                "px-3 py-1 rounded-full border text-sm capitalize",
                mode === m
                  ? "border-primary-500 text-primary-600 dark:text-primary-400"
                  : "border-gray-300 dark:border-zinc-600 text-gray-600 dark:text-gray-300",
              ].join(" ")}
            >
              {m === "progress" ? "Progress" : "My Tasks"}
            </button>
          ))}
        </div>

        {/* 15/30 filter — RIGHT */}
        <div className="flex gap-2 ml-auto">
          {[15, 30].map((n) => (
            <button
              key={n}
              onClick={() => setWindowDays(n as 15 | 30)}
              className={[
                "px-3 py-1 rounded-full border text-sm",
                windowDays === n
                  ? "border-primary-500 text-primary-600 dark:text-primary-400"
                  : "border-gray-300 dark:border-zinc-600 text-gray-600 dark:text-gray-300",
              ].join(" ")}
            >
              {n} days
            </button>
          ))}
        </div>
      </div>

      {/* Progress vs My Tasks */}
      {mode === "progress" ? (
        <TwoWeekProgress
          title={`${windowDays}-Day Progress`}
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
          {/* ⬇️ totals now come from the deduped view */}
          <TaskStatusBar
            title="My Tasks"
            rangeLabel={rangeLabel}
            tasks={displayTasks}
            progressTasks={tasksFromProgress}
            windowDays={windowDays}
            totals={displayTotals}
            loading={myTasksLoading}
          />
          <MyTasksAssignedList
            // pass the deduped list so header + list match exactly
            tasks={displayTasks}
            progressTasks={tasksFromProgress}
            assignedKeys={assignedKeys}
            loading={myTasksLoading}
            onOpen={(_task) => {}}
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
            <Button
              onClick={() => navigate(ROUTES.SCANNER)}
              className="px-6 py-4"
            >
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
                onClick={() => setShowFullHistory(true)}
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
              >
                {TEXT.SCAN_HISTORY_LOAD_MORE}
              </button>
            </div>
          )}
          {showFullHistory && (
            <FullscreenScanHistory
              data={progressUpdates}
              onClose={() => setShowFullHistory(false)}
              loading={isProgressLoading}
            />
          )}
        </div>
      )}

      {/* Floating Scan Button — only in My Tasks */}
      {mode === "myTasks" && (
        <button
          onClick={() => navigate(ROUTES.SCANNER)}
          aria-label={TEXT.SCAN_TITLE ?? "Scan QR"}
          title={TEXT.SCAN_TITLE ?? "Scan QR"}
          className={[
            "fixed z-50 right-5",
            "bottom-[calc(env(safe-area-inset-bottom,0)+16px)]",
            "h-15 w-15 rounded-full shadow-lg",
            "bg-gradient-to-br from-primary-600 to-primary-500",
            "hover:from-primary-700 hover:to-primary-600",
            "active:scale-95 transition transform",
            "flex items-center justify-center",
            "text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500",
            "dark:focus:ring-offset-zinc-900",
          ].join(" ")}
        >
          <ScanQrCode className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
