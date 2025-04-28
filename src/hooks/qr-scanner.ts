import { useEffect, useRef, useState, useCallback } from "react";
import jsQR, { QRCode } from "jsqr";

const SCAN_INTERVAL = 300;

interface UseQrScannerProps {
  onResult: (data: string) => void;
}

type Point = { x: number; y: number };

export const useQrScanner = ({ onResult }: UseQrScannerProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayRef = useRef<HTMLCanvasElement | null>(null);
  const scanBoxRef = useRef<HTMLCanvasElement | null>(null);

  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [detecting, setDetecting] = useState<boolean>(false);
  const [noQrDetected, setNoQrDetected] = useState(false);
  const scanTimer = useRef<number | null>(null);
  const noQrTimeout = useRef<number | null>(null);

  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const getScanBoxRect = useCallback(() => {
    const { width, height } = screenSize;
    const size = Math.min(width, height) * 0.45;
    const x = (width - size) / 2;
    const y = (height - size) / 2 - height * 0.1;
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

    const cornerLength = 30;
    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;

    // Draw corners
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + cornerLength, y);
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + cornerLength);
    ctx.moveTo(x + width, y);
    ctx.lineTo(x + width - cornerLength, y);
    ctx.moveTo(x + width, y);
    ctx.lineTo(x + width, y + cornerLength);
    ctx.moveTo(x, y + height);
    ctx.lineTo(x + cornerLength, y + height);
    ctx.moveTo(x, y + height);
    ctx.lineTo(x, y + height - cornerLength);
    ctx.moveTo(x + width, y + height);
    ctx.lineTo(x + width - cornerLength, y + height);
    ctx.moveTo(x + width, y + height);
    ctx.lineTo(x + width, y + height - cornerLength);
    ctx.stroke();
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

      const points = {
        tl: loc.topLeftCorner,
        tr: loc.topRightCorner,
        br: loc.bottomRightCorner,
        bl: loc.bottomLeftCorner,
      };

      const drawCorner = (p1: Point, p2: Point, horizontalFirst = true) => {
        const x = p1.x + offsetX;
        const y = p1.y + offsetY;
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const ux = dx / length;
        const uy = dy / length;

        ctx.beginPath();
        ctx.strokeStyle = "#ffeb3b";
        ctx.lineWidth = 2;

        if (horizontalFirst) {
          ctx.moveTo(x, y);
          ctx.lineTo(x + ux * 20, y + uy * 20);
          ctx.moveTo(x, y);
          ctx.lineTo(x - uy * 20, y + ux * 20);
        } else {
          ctx.moveTo(x, y);
          ctx.lineTo(x - uy * 20, y + ux * 20);
          ctx.moveTo(x, y);
          ctx.lineTo(x + ux * 20, y + uy * 20);
        }

        ctx.stroke();
      };

      drawCorner(points.tl, points.tr, true);
      drawCorner(points.tr, points.br, false);
      drawCorner(points.br, points.bl, true);
      drawCorner(points.bl, points.tl, false);
    },
    [screenSize]
  );

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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

      // Start no QR fallback timer
      if (noQrTimeout.current) window.clearTimeout(noQrTimeout.current);
      noQrTimeout.current = window.setTimeout(() => {
        if (scanning) {
          setNoQrDetected(true);
          setScanning(false);
        }
      }, 10000); // 10 seconds
    };

    let lastDetectedCode: QRCode | null = null;

    const scan = () => {
      if (!video || !canvas || !scanning || video.readyState < 2) return;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;
      if (videoWidth === 0 || videoHeight === 0) return;

      canvas.width = videoWidth;
      canvas.height = videoHeight;

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const { x, y, width, height } = getScanBoxRect();
      const sx = (x / screenSize.width) * canvas.width;
      const sy = (y / screenSize.height) * canvas.height;
      const sw = (width / screenSize.width) * canvas.width;
      const sh = (height / screenSize.height) * canvas.height;

      try {
        const imageData = ctx.getImageData(sx, sy, sw, sh);
        const code = jsQR(imageData.data, sw, sh);

        if (code) {
          drawBoundingBox(code.location, sx, sy);
          setDetecting(true);

          if (lastDetectedCode?.data !== code.data) {
            lastDetectedCode = code;
          } else {
            if (navigator.vibrate) navigator.vibrate(200);
            setResult(code.data);
            setScanning(false);
            setDetecting(false);
            setNoQrDetected(false);
            onResult(code.data);

            if (noQrTimeout.current) window.clearTimeout(noQrTimeout.current);

            const stream = video?.srcObject as MediaStream;
            stream?.getTracks().forEach((track) => track.stop());
          }
        } else {
          setDetecting(false);
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
    setDetecting(false);
    setNoQrDetected(false);

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
    detecting,
    result,
    handleRescan,
    setScanning,
    noQrDetected,
  };
};
