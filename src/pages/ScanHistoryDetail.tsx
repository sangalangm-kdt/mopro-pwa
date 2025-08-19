import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/navigation/Header";
import { ScanEntry } from "@/components/cards/ScanHistoryCard";
import { ROUTES } from "@/constants/routes";
import Icon from "@/components/icons/Icons";
import { formatDate } from "@/utils/format-date";
import { useLocalizedText } from "@/utils/localized-text";
import { SCAN_HISTORY_DETAIL_TEXT_KEYS } from "@/constants";
import { DetailSkeletonCard } from "@/components/skeletons/DetailSkeleton";

export default function ScanHistoryDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const entry = location.state as ScanEntry;

  const TEXT = useLocalizedText("common", SCAN_HISTORY_DETAIL_TEXT_KEYS);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-zinc-900">
      <Header
        title={TEXT.TITLE}
        showBack
        textColorClass="text-gray-800 dark:text-white"
        rightElement={
          <button
            onClick={() => navigate(ROUTES.HOME)}
            className="p-1 cursor-pointer"
            aria-label="Go to home"
          >
            <Icon
              name="home"
              className="w-6 h-6 text-gray-800 dark:text-white"
            />
          </button>
        }
      />

      <main className="flex-1 w-full px-4 py-6 md:py-10 bg-gray-50 dark:bg-zinc-900">
        <div className="max-w-3xl w-full mx-auto space-y-6">
          {entry ? (
            <>
              {/* Info Card */}
              <div className="w-full bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-5 md:p-8 space-y-6 transform transition duration-500 ease-in-out animate-fade-in">
                <h2 className="text-xl md:text-2xl font-bold text-center text-primary-600 dark:text-primary-400">
                  {entry.product.productList.name}
                </h2>

                <div className="divide-y divide-gray-200 dark:divide-zinc-700">
                  <DetailRow
                    label={TEXT.LINE_NUMBER}
                    value={entry.lineNumber}
                  />
                  <DetailRow
                    label={TEXT.BELONGS_TO}
                    value={entry.project?.name ?? "-"}
                  />
                  <DetailRow
                    label={TEXT.DATE}
                    value={formatDate(new Date(entry.createdAt))}
                  />
                  <DetailRow
                    label={TEXT.LAST_UPDATED_BY}
                    value={`${entry.user?.firstName ?? "--"} ${
                      entry.user?.lastName ?? ""
                    }`}
                  />
                  <DetailRow
                    label={TEXT.APPROVED_BY}
                    value={
                      entry.approvedBy
                        ? `${entry.approvedBy.firstName ?? ""} ${
                            entry.approvedBy.lastName ?? ""
                          }`
                        : ""
                    }
                    right={
                      !entry.approvedBy ? (
                        <span
                          className="inline-flex items-center px-2 py-2 rounded-full text-xs font-medium
                     bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                          aria-label="Waiting for approval"
                          title="Waiting for approval"
                        >
                          Waiting for approval
                        </span>
                      ) : null
                    }
                  />
                </div>
              </div>

              {/* Process & Progress Card */}
              <div className="w-full bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-5 md:p-8 space-y-4">
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white">
                  {TEXT.STATUS}
                </h3>

                <div className="divide-y divide-gray-200 dark:divide-zinc-700">
                  <DetailRow
                    label={TEXT.PROCESS}
                    value={entry.process?.processList?.name ?? "-"}
                  />
                  <DetailRow
                    label={TEXT.PROGRESS}
                    value={`${entry.percent}%`}
                    isProgress
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <DetailSkeletonCard rows={5} />
              <DetailSkeletonCard rows={2} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Reusable row with responsive text sizes
function DetailRow({
  label,
  value,
  isProgress = false,
  right,
}: {
  label: string;
  value: string;
  isProgress?: boolean;
  right?: React.ReactNode;
}) {
  const percent = isProgress
    ? Math.max(
        0,
        Math.min(100, Number.parseInt(value.replace("%", ""), 10) || 0)
      )
    : 0;

  return (
    <div className="py-3 md:py-4">
      <div className="flex justify-between items-center mb-1 gap-3">
        <span className="text-sm md:text-base text-gray-600 dark:text-gray-400 font-medium">
          {label}
        </span>

        {/* value + optional pill */}
        <div className="flex items-center gap-2">
          <span className="text-sm md:text-base text-gray-900 dark:text-gray-100">
            {value}
          </span>
          {right}
        </div>
      </div>

      {isProgress && (
        <div className="w-full bg-gray-200 dark:bg-zinc-700 rounded-full h-2">
          <div
            className="bg-primary-500 h-2 rounded-full"
            style={{ width: `${percent}%` }}
            aria-label={`${percent}%`}
          />
        </div>
      )}
    </div>
  );
}
