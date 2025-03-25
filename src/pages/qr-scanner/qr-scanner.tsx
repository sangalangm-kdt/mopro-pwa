import React, { useEffect, useRef } from "react";
import QrScanner from "qr-scanner";

QrScanner.WORKER_PATH = "https://unpkg.com/qr-scanner/qr-scanner-worker.min.js";

interface QRScannerProps {
  onScan: (result: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      const scanner = new QrScanner(
        videoRef.current,
        (result) => {
          onScan(result.data);
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      scannerRef.current = scanner;
      scanner.start();

      return () => {
        scanner.stop();
      };
    }
  }, []);

  return <video ref={videoRef} style={{ width: "100%", borderRadius: 8 }} />;
};

export default QRScanner;
