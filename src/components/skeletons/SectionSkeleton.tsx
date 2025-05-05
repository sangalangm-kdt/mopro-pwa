interface SectionSkeletonProps {
  lines?: number;
  widths?: string[]; // e.g., ["80%", "60%"]
  showIcon?: boolean;
  showRoundedBox?: boolean;
  iconSize?: number; // default: 40
  roundedBoxSize?: { width: number; height: number };
}

export default function SectionSkeleton({
  lines = 3,
  widths = [],
  showIcon = false,
  showRoundedBox = false,
  iconSize = 40,
  roundedBoxSize = { width: 80, height: 30 },
}: SectionSkeletonProps) {
  return (
    <div className="flex gap-3 animate-pulse w-full">
      {showIcon && (
        <div
          className="bg-gray-300 dark:bg-zinc-700 rounded-md shrink-0"
          style={{ width: iconSize, height: iconSize }}
        />
      )}
      <div className="flex-1 space-y-2">
        {Array.from({ length: lines }).map((_, idx) => (
          <div
            key={idx}
            className="h-4 bg-gray-300 dark:bg-zinc-700 rounded"
            style={{
              width: widths[idx] || "100%",
            }}
          />
        ))}
      </div>
      {showRoundedBox && (
        <div
          className="bg-gray-300 dark:bg-zinc-700 rounded"
          style={{
            width: roundedBoxSize.width,
            height: roundedBoxSize.height,
          }}
        />
      )}
    </div>
  );
}
