interface PreferencesSectionProps {
  fontSize: "small" | "medium" | "large";
  setFontSize: (size: "small" | "medium" | "large") => void;
}

export default function PreferencesSection({
  fontSize,
  setFontSize,
}: PreferencesSectionProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-gray-500 dark:text-gray-400 text-sm">
          🔠 Font Size
        </span>
        <div className="flex gap-1">
          {["small", "medium", "large"].map((size) => (
            <button
              key={size}
              onClick={() => setFontSize(size as any)}
              className={`px-2 py-1 rounded text-xs border ${
                fontSize === size ? "border-lime-500" : "border-gray-500"
              }`}
            >
              {size === "small" ? "A−" : size === "medium" ? "A" : "A+"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
