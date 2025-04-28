import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants";

interface ScanResultModalProps {
  qrData: string;
  onClose: () => void;
}

export default function ScanResult({ qrData, onClose }: ScanResultModalProps) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const startY = useRef<number | null>(null);

  const handleConfirm = () => {
    console.log("Confirmed:", qrData);
    onClose();
  };

  const handleRescan = () => {
    navigate(ROUTES.SCANNER);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!startY.current) return;

    const endY = e.changedTouches[0].clientY;
    const diffY = endY - startY.current;

    if (diffY > 80) {
      onClose(); // Dragged down = close
    } else if (diffY < -30) {
      setExpanded(true); // Small drag up = expand
    }

    startY.current = null;
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/40 flex justify-center items-end overflow-hidden">
      <div
        ref={sheetRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`w-full max-w-md bg-white dark:bg-gray-900 rounded-t-2xl shadow-lg transition-all duration-300 ease-in-out flex flex-col ${
          expanded ? "h-[95%]" : "h-[45%]"
        }`}
        style={{ touchAction: "none" }}
      >
        {/* Drag Indicator */}
        <div className="w-12 h-1.5 bg-gray-300 mx-auto mt-2 mb-4 rounded-full" />

        {/* Scrollable content */}
        <div
          className={`flex-1 px-6 pb-6 overflow-y-auto transition-all ${
            expanded ? "pt-2" : "overflow-hidden"
          }`}
        >
          <h2 className="text-2xl font-bold mb-4 text-center">
            Scanned QR Result
          </h2>

          <p className="text-center text-lg break-all">{qrData}</p>

          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={handleConfirm}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition"
            >
              Confirm
            </button>
            <button
              onClick={handleRescan}
              className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition"
            >
              Rescan
            </button>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
