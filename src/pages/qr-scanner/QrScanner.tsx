import { useState } from "react";
import { useQrScanner } from "./qr-scanner";

const QRScanner = () => {
  const [qrData, setQrData] = useState<string | null>(null);

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

  return (
    <div className="fixed inset-0 z-[9999] bg-black overflow-hidden">
      {/* Live video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        playsInline
      />

      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Yellow bounding box */}
      <canvas
        ref={overlayRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Scan box overlay with corner brackets */}
      <canvas
        ref={scanBoxRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Detected QR result */}
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

      {/* Detecting Indicator */}
      {detecting && !qrData && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-4 py-2 rounded font-semibold animate-pulse shadow-md">
          🟡 Detecting QR Code...
        </div>
      )}
    </div>
  );
};

export default QRScanner;
