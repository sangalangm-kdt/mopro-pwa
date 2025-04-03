import { useEffect, useRef, useState, useCallback } from "react";
import jsQR, { QRCode } from "jsqr";

const SCAN_INTERVAL = 500;

interface UseQrScannerProps {
  onResult: (data: string) => void;
}

export const useQrScanner = ({ onResult }: UseQrScannerProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayRef = useRef<HTMLCanvasElement | null>(null);
  const scanBoxRef = useRef<HTMLCanvasElement | null>(null);

  const [scanning, setScanning] = useState(true);
  const [result, setResult] = useState<string | null>(null);
  const scanTimer = useRef<number | null>(null);
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const getScanBoxRect = useCallback(() => {
    const { width, height } = screenSize;
    const size = Math.min(width, height) * 0.6;
    const x = (width - size) / 2;
    const y = (height - size) / 2;
    return { x, y, width: size, height: size };
  }, [screenSize]);

  const drawScanBoxOverlay = useCallback(() => {
    const canvas = scanBoxRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y, width, height } = getScanBoxRect();
    canvas.width = screenSize.width;
    canvas.height = screenSize.height;

    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.clearRect(x, y, width, height);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
  }, [screenSize, getScanBoxRect]);

  const drawBoundingBox = useCallback(
    (loc: QRCode["location"], offsetX = 0, offsetY = 0) => {
      const canvas = overlayRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = screenSize.width;
      canvas.height = screenSize.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "lime";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(loc.topLeftCorner.x + offsetX, loc.topLeftCorner.y + offsetY);
      ctx.lineTo(
        loc.topRightCorner.x + offsetX,
        loc.topRightCorner.y + offsetY
      );
      ctx.lineTo(
        loc.bottomRightCorner.x + offsetX,
        loc.bottomRightCorner.y + offsetY
      );
      ctx.lineTo(
        loc.bottomLeftCorner.x + offsetX,
        loc.bottomLeftCorner.y + offsetY
      );
      ctx.closePath();
      ctx.stroke();
    },
    [screenSize]
  );

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    const startCamera = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (video) {
        video.srcObject = stream;
        await new Promise<void>((resolve) => {
          video.onloadedmetadata = () => {
            video.play().then(resolve).catch(resolve);
          };
        });
      }
    };

    let lastDetectedCode: QRCode | null = null;

    const scan = () => {
      if (!video || !canvas || !scanning) return;

      if (video.readyState < 2) return;

      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;
      if (videoWidth === 0 || videoHeight === 0) return;

      canvas.width = videoWidth;
      canvas.height = videoHeight;

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const { x, y, width, height } = getScanBoxRect();
      const sx = Math.floor((x / screenSize.width) * canvas.width);
      const sy = Math.floor((y / screenSize.height) * canvas.height);
      const sw = Math.floor((width / screenSize.width) * canvas.width);
      const sh = Math.floor((height / screenSize.height) * canvas.height);

      if (
        sw <= 0 ||
        sh <= 0 ||
        sx < 0 ||
        sy < 0 ||
        sx + sw > canvas.width ||
        sy + sh > canvas.height
      ) {
        return;
      }

      try {
        const imageData = ctx.getImageData(sx, sy, sw, sh);
        const code = jsQR(imageData.data, sw, sh);

        if (code) {
          drawBoundingBox(code.location, sx, sy);

          if (lastDetectedCode?.data !== code.data) {
            lastDetectedCode = code;
          } else {
            setResult(code.data);
            setScanning(false);
            onResult(code.data);
          }
        }
      } catch (error) {
        console.error("Scan error:", error);
      }
    };

    startCamera();
    drawScanBoxOverlay();
    scanTimer.current = window.setInterval(scan, SCAN_INTERVAL);

    return () => {
      if (scanTimer.current) window.clearInterval(scanTimer.current);
      const stream = video?.srcObject as MediaStream;
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [
    scanning,
    onResult,
    drawScanBoxOverlay,
    screenSize,
    getScanBoxRect,
    drawBoundingBox,
  ]);

  const handleRescan = () => {
    setResult(null);
    setScanning(true);

    const canvas = overlayRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return {
    videoRef,
    canvasRef,
    overlayRef,
    scanBoxRef,
    scanning,
    result,
    handleRescan,
  };
};
