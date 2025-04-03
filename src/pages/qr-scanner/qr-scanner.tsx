import { useState } from "react";
import { useQrScanner } from "../../constants/qr-scanner";

const QRScanner = () => {
  const [qrData, setQrData] = useState<string | null>(null);

  const { videoRef, canvasRef, overlayRef, scanBoxRef, handleRescan } =
    useQrScanner({
      onResult: (data) => {
        console.log("✅ Scanned:", data);
        setQrData(data); // store it in local state
      },
    });

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <video
        ref={videoRef}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        autoPlay
        muted
        playsInline
      />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <canvas
        ref={overlayRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />
      <canvas
        ref={scanBoxRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />
      {qrData && (
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: "50%",
            transform: "translateX(-50%)",
            color: "#fff",
          }}
        >
          ✅ {qrData}
          <button onClick={handleRescan}>🔄 Rescan</button>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
