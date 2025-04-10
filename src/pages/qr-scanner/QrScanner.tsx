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
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Live video */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        muted
        playsInline
      />

      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* QR bounding box (yellow) */}
      <canvas
        ref={overlayRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      />

      {/* Scan box overlay (corner brackets & mask) */}
      <canvas
        ref={scanBoxRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      />

      {/* QR result */}
      {qrData && (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-60 px-4 py-2 rounded-lg flex items-center gap-4">
          <span>✅ {qrData}</span>
          <button
            onClick={handleRescan}
            className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
          >
            🔄 Rescan
          </button>
        </div>
      )}

      {/* Detecting indicator */}
      {detecting && !qrData && (
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold animate-pulse shadow-md">
          🟡 Detecting QR Code...
        </div>
      )}
    </div>
  );
};

export default QRScanner;
