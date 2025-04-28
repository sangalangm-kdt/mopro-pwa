import { useEffect, useRef, useState, useCallback } from "react";
import jsQR, { QRCode } from "jsqr";

const SCAN_INTERVAL = 500;

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
  const [detecting, setDetecting] = useState(false);
  const scanTimer = useRef<number | null>(null);

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
    const color = "white";
    const lineWidth = 3;
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;

    // Draw corners
    const drawCorner = (
      startX: number,
      startY: number,
      dx: number,
      dy: number
    ) => {
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(startX + dx * cornerLength, startY + dy * cornerLength);
      ctx.stroke();
    };

    drawCorner(x, y, 1, 0); // top-left horizontal
    drawCorner(x, y, 0, 1); // top-left vertical
    drawCorner(x + width, y, -1, 0); // top-right horizontal
    drawCorner(x + width, y, 0, 1); // top-right vertical
    drawCorner(x, y + height, 1, 0); // bottom-left horizontal
    drawCorner(x, y + height, 0, -1); // bottom-left vertical
    drawCorner(x + width, y + height, -1, 0); // bottom-right horizontal
    drawCorner(x + width, y + height, 0, -1); // bottom-right vertical
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

      const cornerLength = 20;
      const color = "#ffeb3b";

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
        ctx.strokeStyle = color;
        ctx.lineWidth = 4;

        if (horizontalFirst) {
          ctx.moveTo(x, y);
          ctx.lineTo(x + ux * cornerLength, y + uy * cornerLength);
          ctx.moveTo(x, y);
          ctx.lineTo(x - uy * cornerLength, y + ux * cornerLength);
        } else {
          ctx.moveTo(x, y);
          ctx.lineTo(x - uy * cornerLength, y + ux * cornerLength);
          ctx.moveTo(x, y);
          ctx.lineTo(x + ux * cornerLength, y + uy * cornerLength);
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
    handleResize();
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
    };

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
          setDetecting(true);
        } else {
          setDetecting(false);

          const overlayCanvas = overlayRef.current;
          if (overlayCanvas) {
            const overlayCtx = overlayCanvas.getContext("2d");
            if (overlayCtx)
              overlayCtx.clearRect(
                0,
                0,
                overlayCanvas.width,
                overlayCanvas.height
              );
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
    screenSize,
    getScanBoxRect,
    drawBoundingBox,
    drawScanBoxOverlay,
  ]);

  const handleRescan = () => {
    setScanning(true);
    setDetecting(false);

    const canvas = overlayRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const manualScan = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    canvas.width = videoWidth;
    canvas.height = videoHeight;

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

    const imageData = ctx.getImageData(sx, sy, sw, sh);
    const code = jsQR(imageData.data, sw, sh);

    if (code) {
      onResult(code.data);
    } else {
      console.log("No QR detected manually");
    }
  };

  return {
    videoRef,
    canvasRef,
    overlayRef,
    scanBoxRef,
    scanning,
    detecting,
    handleRescan,
    manualScan,
    setScanning,
  };
};
