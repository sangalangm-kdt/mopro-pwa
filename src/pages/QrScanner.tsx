import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQrScanner } from "@/hooks/qr-scanner";
import Header from "@/components/navigation/Header";
import Button from "@/components/buttons/Button";
import { Flashlight, FlashlightOff } from "lucide-react";
import { toggleFlashlight } from "@/utils/flashlight";
import ScanResult from "./ScanResult";
import { MOCK_SCAN_DATA, QR_SCANNER_TEXT_KEYS } from "@/constants"; // translation key constants
import { stopCamera } from "@/utils/stop-camera";
import { toast } from "sonner";

const QRScanner = () => {
  const { t } = useTranslation("scan");
  const {
    TITLE,
    SCAN_PROMPT,
    START_SCAN,
    SCAN_AGAIN,
    SCANNING,
    ADD_MANUALLY,
    FLASHLIGHT_NOT_SUPPORTED,
    OPEN_MANUAL_MODAL,
  } = QR_SCANNER_TEXT_KEYS;

  // Flashlight toggle state
  const [torchOn, setTorchOn] = useState(false);

  // Loading state while processing scanned QR
  const [loading, setLoading] = useState(false);

  // Holds scanned QR result string
  const [qrData, setQrData] = useState<string | null>(null);

  // Hook for scanning logic and canvas control
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
      const found = Object.values(MOCK_SCAN_DATA).find(
        (item) => item.serialNumber === data
      ); //compare the scanned qr to the mockdata

      if (!found) {
        toast.error("No matching record found for the scanned QR code.");
        handleRescan(); // Optional: restart scanning
        return;
      }

      setLoading(true); // Show spinner
      // stopCamera(videoRef.current); // Stop stream after valid scan
      setTimeout(() => {
        setQrData(data); // Store scan result
        setLoading(false); // Remove loading
      }, 200);
    },
  });

  // ▶️ Begin scanning session
  const startScan = () => {
    handleRescan();
    setScanning(true);
  };

  // 🔦 Toggle flashlight using supported API
  const handleToggleFlashlight = async () => {
    try {
      await toggleFlashlight(!torchOn);
      setTorchOn((prev) => !prev);
    } catch {
      alert(t(FLASHLIGHT_NOT_SUPPORTED));
    }
  };

  // ❌ Close QR result modal
  const handleCloseModal = () => {
    setQrData(null);
    stopCamera(videoRef.current);
    handleRescan();
  };

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* 🔝 Top bar with flashlight button */}
      <div className="relative z-20">
        <Header
          title={t(TITLE)}
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

      {/* 📹 Camera stream */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        playsInline
      />

      {/* 🖼 Hidden canvas for scanning logic */}
      <canvas ref={canvasRef} className="hidden" />

      {/* 📏 Overlay bounding box for detected QR */}
      <canvas
        ref={overlayRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* 📦 Transparent scan box UI */}
      <canvas
        ref={scanBoxRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* ⏳ Spinner loader on valid scan */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/60">
          <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* ✅ QR scan result modal */}
      {qrData && <ScanResult qrData={qrData} onClose={handleCloseModal} />}

      {/* 🔻 Bottom action area */}
      <div className="fixed bottom-0 left-0 right-0 z-[150] bg-bg-color text-black rounded-t-2xl px-4 pt-4 pb-6 shadow-xl max-h-[40vh] overflow-y-auto w-full max-w-md mx-auto">
        <div className="text-center space-y-4">
          <p className="text-sm text-gray-600">{t(SCAN_PROMPT)}</p>

          <div className="space-y-3">
            {/* 📷 Start scan / Scan again button */}
            <Button
              onClick={startScan}
              disabled={scanning}
              className={`w-full ${
                scanning
                  ? "bg-primary-300 cursor-not-allowed"
                  : "bg-primary-600 hover:bg-primary-700 text-white"
              }`}
            >
              {scanning ? t(SCANNING) : qrData ? t(SCAN_AGAIN) : t(START_SCAN)}
            </Button>

            {/* 📝 Manual input trigger */}
            <Button
              onClick={() => {
                alert(t(OPEN_MANUAL_MODAL));
              }}
              variant="outlined"
              fullWidth
            >
              {t(ADD_MANUALLY)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
