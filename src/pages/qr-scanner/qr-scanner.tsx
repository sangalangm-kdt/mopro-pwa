import { useEffect, useRef, useState } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";

interface QrScannerProps {
  onDetected: (code: string) => void;
}

const QrScanner: React.FC<QrScannerProps> = ({ onDetected }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const qrReader = new BrowserQRCodeReader();

  // Define scan region (adjust as needed)
  const scanRegion = { x: 100, y: 100, width: 200, height: 200 };

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }

        requestAnimationFrame(processFrame);
      } catch (err) {
        console.error("Camera access error:", err);
        setError("Failed to access camera");
      }
    };

    const processFrame = async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = scanRegion.width;
      canvas.height = scanRegion.height;

      ctx.drawImage(
        video,
        scanRegion.x,
        scanRegion.y,
        scanRegion.width,
        scanRegion.height, // Crop
        0,
        0,
        scanRegion.width,
        scanRegion.height // Draw on canvas
      );

      try {
        const result = await qrReader.decodeFromCanvas(canvas);
        if (result) {
          onDetected(result.getText()); // Call callback only when a QR code is detected
        }
      } catch (error) {
        requestAnimationFrame(processFrame); // Continue scanning if no QR code is found
      }
    };

    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [onDetected]);

  return (
    <div className="relative">
      {error && <p className="text-red-500">{error}</p>}
      <video ref={videoRef} className="w-full h-auto mr-2" />
      <canvas ref={canvasRef} className="absolute top-0 left-0 opacity-50" />
    </div>
  );
};

export default QrScanner;
