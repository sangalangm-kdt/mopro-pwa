// src/components/SkeletonLoader.tsx

interface SkeletonBlock {
  type: "title" | "text" | "rect";
  width?: string;
  height?: string;
  rounded?: boolean; // option for rounded shapes
}

interface SkeletonLoaderProps {
  blocks: SkeletonBlock[];
}

export default function SkeletonLoader({ blocks }: SkeletonLoaderProps) {
  return (
    <div className="p-6">
      <div className="space-y-4">
        {blocks.map((block, index) => {
          let defaultStyles = "";

          switch (block.type) {
            case "title":
              defaultStyles = "h-6 w-1/3";
              break;
            case "text":
              defaultStyles = "h-4 w-2/3";
              break;
            case "rect":
              defaultStyles = "h-48 w-full";
              break;
          }

          return (
            <div
              key={index}
              className={`relative overflow-hidden bg-gray-300 ${
                block.rounded ? "rounded-full" : "rounded-lg"
              } ${block.width ? `w-${block.width}` : ""} ${
                block.height ? `h-${block.height}` : ""
              } ${!block.width && !block.height ? defaultStyles : ""}`}
            >
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
