export default function EditProgressSkeleton() {
  const SkeletonField = ({ labelWidth = "w-1/3" }: { labelWidth?: string }) => (
    <div className="relative overflow-hidden bg-gray-200 dark:bg-zinc-800 rounded">
      <div
        className={`h-4 ${labelWidth} bg-gray-300 dark:bg-zinc-700 rounded mb-2 relative overflow-hidden`}
      >
        <div className="absolute inset-0 shimmer" />
      </div>
      <div className="h-9 w-full bg-gray-200 dark:bg-zinc-800 rounded relative overflow-hidden">
        <div className="absolute inset-0 shimmer" />
      </div>
    </div>
  );

  return (
    <>
      {/* Static Info Skeleton */}
      <div className="space-y-3 p-4 bg-white dark:bg-zinc-800 rounded-md border border-gray-200 dark:border-zinc-700">
        <div className="relative overflow-hidden">
          <div className="h-4 w-1/2 bg-gray-300 dark:bg-zinc-500 rounded mb-2 shimmer" />
          <div className="h-3 w-2/3 bg-gray-200 dark:bg-zinc-600 rounded shimmer" />
        </div>
        <SkeletonField />
        <SkeletonField />
      </div>

      {/* Editable Section Skeleton */}
      <div className="space-y-4 p-4 bg-white dark:bg-zinc-800 rounded-md border border-gray-200 dark:border-zinc-700">
        <div className="relative overflow-hidden">
          <div className="h-4 w-1/2 bg-gray-300 dark:bg-zinc-500 rounded mb-2 shimmer" />
          <div className="h-3 w-2/3 bg-gray-200 dark:bg-zinc-600 rounded shimmer" />
        </div>
        <SkeletonField />
        <SkeletonField labelWidth="w-1/4" />
      </div>
    </>
  );
}
