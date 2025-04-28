import { useState } from "react";
import { useQrScanner } from "@/hooks/qr-scanner";
import Header from "@/components/navigation/Header";
import Button from "@/components/Button";
import { Flashlight, FlashlightOff } from "lucide-react";
import { toggleFlashlight } from "@/utils/flashlight";
import ScanResult from "./ScanResult";

const QRScanner = () => {
  const [torchOn, setTorchOn] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [qrData, setQrData] = useState<string | null>(null); // <-- for modal

  const {
    videoRef,
    canvasRef,
    overlayRef,
    scanBoxRef,
    scanning,
    handleRescan,
    setScanning,
  } = useQrScanner({
    onResult: (data) => {
      setLoading(true);
      setTimeout(() => {
        setQrData(data); // instead of navigate, open modal
        setLoading(false);
      }, 200);
    },
  });

  const startScan = () => {
    handleRescan();
    setScanning(true);
  };

  const handleToggleFlashlight = async () => {
    try {
      await toggleFlashlight(!torchOn);
      setTorchOn((prev) => !prev);
    } catch {
      alert("🔦 Flashlight not supported.");
    }
  };

  const handleManualSubmit = () => {
    setManualMode(false);
  };

  const handleCloseModal = () => {
    setQrData(null);
    handleRescan(); // Optionally reset scanning after closing result
  };

  return (
    <div className="fixed inset-0 z-40 bg-black overflow-hidden">
      <div className="relative z-20">
        <Header
          title="QR Scanner"
          rightElement={
            <button onClick={handleToggleFlashlight}>
              {torchOn ? (
                <FlashlightOff className="text-white" />
              ) : (
                <Flashlight className="text-white" />
              )}
            </button>
          }
        />
      </div>

      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        playsInline
      />
      <canvas ref={canvasRef} className="hidden" />
      <canvas
        ref={overlayRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
      <canvas
        ref={scanBoxRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/60">
          <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* 🧩 Show Modal if scanned */}
      {qrData && <ScanResult qrData={qrData} onClose={handleCloseModal} />}

      <div className="fixed bottom-0 left-0 right-0 z-[150] bg-bg-color text-black rounded-t-2xl px-4 pt-4 pb-6 shadow-xl max-h-[40vh] overflow-y-auto">
        {!manualMode ? (
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600">Scan a QR code to continue.</p>

            <div className="space-y-3">
              <Button
                onClick={startScan}
                disabled={scanning}
                className={`w-full ${
                  scanning
                    ? "bg-primary-300 cursor-not-allowed"
                    : "bg-primary-600 hover:bg-primary-700 text-white"
                }`}
              >
                {scanning ? "Scanning..." : "Start Scan"}
              </Button>

              <Button
                onClick={() => setManualMode(true)}
                variant="outlined"
                fullWidth
              >
                Add manually
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-center">Manual Entry</h2>
            <input
              type="text"
              placeholder="Serial No"
              className="w-full border text-base px-3 py-2 rounded"
            />
            <input
              type="text"
              placeholder="Description"
              className="w-full border text-base px-3 py-2 rounded"
            />
            <div className="flex justify-center gap-3 pt-2">
              <Button
                onClick={() => setManualMode(false)}
                className="bg-gray-200 hover:bg-gray-300 text-black"
              >
                Back
              </Button>
              <Button
                onClick={handleManualSubmit}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Submit
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRScanner;
