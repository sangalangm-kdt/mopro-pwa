// ✅ Add this SkeletonRow component below your DetailRow
export function SkeletonRow() {
  return (
    <div className="py-3 md:py-4">
      <div className="flex justify-between items-center mb-1">
        <span className="w-24 h-4 bg-gray-200 dark:bg-zinc-700 rounded animate-pulse"></span>
        <span className="w-32 h-4 bg-gray-200 dark:bg-zinc-700 rounded animate-pulse"></span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-zinc-700 rounded-full h-2"></div>
    </div>
  );
}

// ✅ Or a reusable full skeleton card
export function DetailSkeletonCard({ rows = 4 }: { rows?: number }) {
  return (
    <div className="w-full bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-5 md:p-8 space-y-6">
      <div className="w-1/2 h-6 bg-gray-200 dark:bg-zinc-700 rounded mx-auto animate-pulse"></div>
      <div className="divide-y divide-gray-200 dark:divide-zinc-700 space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <SkeletonRow key={i} />
        ))}
      </div>
    </div>
  );
}
