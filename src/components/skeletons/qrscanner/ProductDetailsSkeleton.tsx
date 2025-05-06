export default function ProductDetailsSkeleton() {
  return (
    <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow border border-gray-200 dark:border-zinc-700 mt-3 space-y-4">
      <div className="h-5 w-1/3 rounded bg-gray-200 dark:bg-zinc-700 animate-pulse" />
      <div className="flex flex-col gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-2">
            <div className="w-4 h-4 rounded-full bg-gray-300 dark:bg-zinc-700 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-1/4 bg-gray-200 dark:bg-zinc-700 rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-gray-300 dark:bg-zinc-600 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
