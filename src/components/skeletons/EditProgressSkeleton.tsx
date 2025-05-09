export default function EditProgressSkeleton() {
  const SkeletonField = ({ labelWidth = "w-1/3" }: { labelWidth?: string }) => (
    <div className="space-y-2">
      <div
        className={`h-4 ${labelWidth} bg-gray-300 dark:bg-zinc-700 rounded relative overflow-hidden`}
      >
        <div className="absolute inset-0 shimmer" />
      </div>
      <div className="h-9 w-full bg-gray-200 dark:bg-zinc-800 rounded relative overflow-hidden">
        <div className="absolute inset-0 shimmer" />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen w-full overflow-hidden dark:bg-zinc-900">
      {/* Skeleton body */}
      <div className="flex-1 p-4 space-y-6 pb-32 text-gray-800 dark:text-white">
        <div className="h-4 w-2/3 bg-gray-300 dark:bg-zinc-700 rounded shimmer" />

        {/* Static Info Skeleton */}
        <div className="space-y-3 p-4 bg-white dark:bg-zinc-800 rounded-md border border-gray-200 dark:border-zinc-700">
          <div className="space-y-2">
            <div className="h-4 w-1/2 bg-gray-300 dark:bg-zinc-500 rounded shimmer" />
            <div className="h-3 w-2/3 bg-gray-200 dark:bg-zinc-600 rounded shimmer" />
          </div>
          <SkeletonField />
          <SkeletonField />
        </div>

        {/* Editable Section Skeleton */}
        <div className="space-y-4 p-4 bg-white dark:bg-zinc-800 rounded-md border border-gray-200 dark:border-zinc-700">
          <div className="space-y-2">
            <div className="h-4 w-1/2 bg-gray-300 dark:bg-zinc-500 rounded shimmer" />
            <div className="h-3 w-2/3 bg-gray-200 dark:bg-zinc-600 rounded shimmer" />
          </div>
          <SkeletonField />
          <SkeletonField labelWidth="w-1/4" />
        </div>
      </div>

      {/* Fixed footer button skeleton */}
      <div className="fixed bottom-0 left-0 right-0 px-6 py-4 bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-700 flex gap-3 z-40">
        <div className="h-10 w-full max-w-[50%] bg-gray-300 dark:bg-zinc-700 rounded shimmer" />
        <div className="h-10 w-full max-w-[50%] bg-gray-300 dark:bg-zinc-700 rounded shimmer" />
      </div>
    </div>
  );
}
