import { useEffect, useState } from "react";

interface RadialProgressProps {
  percentage: number; // 0–100
  size?: number; // in px
  strokeWidth?: number;
  label?: string;
}

export default function RadialProgress({
  percentage,
  size = 100,
  strokeWidth = 8,
  label = "",
}: RadialProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const progressOffset = circumference - (percentage / 100) * circumference;
    const timeout = setTimeout(() => {
      setOffset(progressOffset);
    }, 50);
    return () => clearTimeout(timeout);
  }, [percentage, circumference]);

  return (
    <div
      className="relative flex flex-col items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          className="stroke-gray-200 dark:stroke-zinc-700"
          strokeWidth={strokeWidth}
        />
        {/* Foreground Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          className="text-primary-500 dark:text-primary-500 transition-[stroke-dashoffset] duration-700 ease-out"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>

      {/* Centered Label */}
      <div className="absolute text-xs font-semibold text-gray-700 dark:text-white">
        {percentage}%
      </div>

      {/* Optional Label */}
      {label && (
        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {label}
        </div>
      )}
    </div>
  );
}
