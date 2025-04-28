import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants";

interface ScanResultModalProps {
  qrData: string;
  onClose: () => void;
}

export default function ScanResult({ qrData, onClose }: ScanResultModalProps) {
  const navigate = useNavigate();

  const handleConfirm = () => {
    console.log("Confirmed:", qrData);
    onClose();
    // You can also navigate or trigger something else if needed
  };

  const handleRescan = () => {
    navigate(ROUTES.SCANNER);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-end p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-t-2xl p-6 shadow-lg animate-slide-up">
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
