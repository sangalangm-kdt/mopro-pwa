import { useLocation, useNavigate } from "react-router-dom";

export default function ScanResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const qrData = location.state?.qrData || "No data";

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white px-4">
      <h1 className="text-2xl font-bold mb-4">📄 Scanned Result</h1>
      <p className="text-center break-words max-w-md mb-6">{qrData}</p>
      <button
        onClick={() => navigate(-1)}
        className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-2 rounded"
      >
        🔁 Scan Again
      </button>
    </div>
  );
}
