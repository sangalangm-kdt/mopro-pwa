import React from "react";

interface BottomSheetProps {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  className?: string;
  showOverlay?: boolean;
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  children,
  className = "",
  showOverlay = true,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none ">
      {/* Optional overlay */}
      {showOverlay && (
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto dark:bg-black/60"
          onClick={onClose}
        />
      )}

      {/* Bottom fixed panel */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-white text-black dark:bg-gray-900 dark:text-white rounded-t-2xl px-4 pt-4 pb-6 shadow-xl max-h-[40vh] overflow-y-auto pointer-events-auto ${className}`}
      >
        <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-3" />
        {children}
      </div>
    </div>
  );
};

export default BottomSheet;
