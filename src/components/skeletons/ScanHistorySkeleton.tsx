interface ScanHistorySkeletonProps {
  count?: number;
}

const ScanHistorySkeleton = ({ count = 5 }: ScanHistorySkeletonProps) => {
  return (
    <ul className="divide-y divide-gray-100 dark:divide-zinc-700 animate-pulse">
      {Array.from({ length: count }).map((_, index) => (
        <li
          key={index}
          className="py-3 flex flex-row justify-between gap-3 sm:gap-1"
        >
          <div className="flex flex-col gap-2">
            <div className="w-36 h-4 bg-gray-200 dark:bg-zinc-700 rounded" />
            <div className="w-24 h-3 bg-gray-200 dark:bg-zinc-700 rounded" />
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="w-24 h-3 bg-gray-200 dark:bg-zinc-700 rounded" />
            <div className="w-12 h-12 bg-gray-200 dark:bg-zinc-700 rounded-full" />
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ScanHistorySkeleton;
