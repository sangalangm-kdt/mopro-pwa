import { useState } from "react";
import { useQrScanner } from "@/hooks/qr-scanner";
import Header from "@/components/navigation/Header";
import { Flashlight, FlashlightOff } from "lucide-react";
import { toggleFlashlight } from "@/utils/flashlight";

const QRScanner = () => {
  const [qrData, setQrData] = useState<string | null>(null);
  const [torchOn, setTorchOn] = useState(false);

  const {
    videoRef,
    canvasRef,
    overlayRef,
    scanBoxRef,
    handleRescan,
    detecting,
  } = useQrScanner({
    onResult: (data) => {
      console.log("✅ Scanned:", data);
      setQrData(data);
    },
  });

  const handleToggleFlashlight = async () => {
    try {
      await toggleFlashlight(!torchOn);
      setTorchOn((prev) => !prev);
    } catch {
      alert("🔦 Flashlight not supported.");
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black overflow-hidden">
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
        className="absolute inset-0 w-full h-full object-cover z-10"
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

      {qrData && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg flex items-center gap-3 shadow-lg">
          <span className="text-sm">✅ {qrData}</span>
          <button
            onClick={handleRescan}
            className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
          >
            🔄 Rescan
          </button>
        </div>
      )}

      {detecting && !qrData && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-4 py-2 rounded font-semibold animate-pulse shadow-md">
          🟡 Detecting QR Code...
        </div>
      )}
    </div>
  );
};

export default QRScanner;
