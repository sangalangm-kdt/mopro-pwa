import { useCallback, useEffect, useRef, useState } from "react";
import jsQR, { QRCode } from "jsqr";
import { toast } from "sonner";
import { stopCamera } from "@/utils/stop-camera";
import { playBeep } from "@/utils/beep";

import { QR_SCANNER_TEXT_KEYS } from "@/constants";
import { useLocalizedText } from "@/utils/localized-text";

const SCAN_INTERVAL = 250; // faster feels better than 500

type Point = { x: number; y: number };

interface UseQrScannerProps {
  onResult: (data: string) => void;
}

/** ─────────────────────────────────────────────────────────────
 * object-cover coordinate mapping helpers
 * ───────────────────────────────────────────────────────────── */
function cssToVideoPoint(video: HTMLVideoElement, cssX: number, cssY: number) {
  const vw = video.videoWidth;
  const vh = video.videoHeight;
  const rect = video.getBoundingClientRect();
  const cw = rect.width;
  const ch = rect.height;

  const scale = Math.max(cw / vw, ch / vh); // cover
  const displayW = vw * scale;
  const displayH = vh * scale;

  const offsetX = (displayW - cw) / 2;
  const offsetY = (displayH - ch) / 2;

  const xOnDisplay = cssX - rect.left + offsetX;
  const yOnDisplay = cssY - rect.top + offsetY;

  return {
    x: (xOnDisplay / displayW) * vw,
    y: (yOnDisplay / displayH) * vh,
  };
}

function videoToCssPoint(video: HTMLVideoElement, vx: number, vy: number) {
  const vw = video.videoWidth;
  const vh = video.videoHeight;
  const rect = video.getBoundingClientRect();
  const cw = rect.width;
  const ch = rect.height;

  const scale = Math.max(cw / vw, ch / vh); // cover
  const displayW = vw * scale;
  const displayH = vh * scale;

  const offsetX = (displayW - cw) / 2;
  const offsetY = (displayH - ch) / 2;

  const xOnDisplay = (vx / vw) * displayW;
  const yOnDisplay = (vy / vh) * displayH;

  return {
    x: xOnDisplay - offsetX,
    y: yOnDisplay - offsetY,
  };
}

function fitOverlayToVideo(video: HTMLVideoElement, canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const rect = video.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);

  // draw in CSS pixels
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, rect.width, rect.height);

  return { ctx, rect };
}

export const useQrScanner = ({ onResult }: UseQrScannerProps) => {
  const cameraText = useLocalizedText("scan", QR_SCANNER_TEXT_KEYS.camera);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null); // hidden capture canvas
  const overlayRef = useRef<HTMLCanvasElement | null>(null); // bbox overlay
  const scanBoxRef = useRef<HTMLCanvasElement | null>(null); // scan window overlay

  // Camera preview is always ON by default (Option B)
  const [cameraOn, setCameraOn] = useState(true);

  // Only jsQR scanning loop is controlled by this
  const [scanning, setScanning] = useState(false);

  const [result, setResult] = useState<string | null>(null);
  const [detecting, setDetecting] = useState(false);

  const scanTimer = useRef<number | null>(null);
  const noResultTimeout = useRef<number | null>(null);

  // keep this for redraw triggers (orientation changes, etc.)
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const startNoResultTimer = useCallback(() => {
    if (noResultTimeout.current) clearTimeout(noResultTimeout.current);
    noResultTimeout.current = window.setTimeout(() => {
      setScanning(false);
      setDetecting(false);
      toast.error(cameraText.NO_QR);
    }, 10000);
  }, []);

  const clearNoResultTimer = useCallback(() => {
    if (noResultTimeout.current) clearTimeout(noResultTimeout.current);
    noResultTimeout.current = null;
  }, []);

  // Scan box relative to visible video rect
  const getScanBoxRect = useCallback(() => {
    const video = videoRef.current;
    const rect = video?.getBoundingClientRect();

    const width = rect?.width ?? screenSize.width;
    const height = rect?.height ?? screenSize.height;

    const size = Math.min(width, height) * 0.45;
    const x = (width - size) / 2;
    const y = (height - size) / 2 - height * 0.1;

    return { x, y, width: size, height: size };
  }, [screenSize]);

  const clearOverlay = useCallback(() => {
    const video = videoRef.current;
    const overlay = overlayRef.current;
    if (!video || !overlay) return;

    const fitted = fitOverlayToVideo(video, overlay);
    if (!fitted) return;
    fitted.ctx.clearRect(0, 0, fitted.rect.width, fitted.rect.height);
  }, []);

  // Draw scan window overlay (always visible while camera is on)
  const drawScanBoxOverlay = useCallback(() => {
    const video = videoRef.current;
    const canvas = scanBoxRef.current;
    if (!video || !canvas) return;

    const fitted = fitOverlayToVideo(video, canvas);
    if (!fitted) return;

    const { ctx, rect } = fitted;
    const { x, y, width, height } = getScanBoxRect();

    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.clearRect(x, y, width, height);

    const cornerLength = 30;
    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;

    const corners: Array<[number, number, number, number, number, number]> = [
      [x, y, x + cornerLength, y, x, y + cornerLength],
      [x + width, y, x + width - cornerLength, y, x + width, y + cornerLength],
      [
        x,
        y + height,
        x + cornerLength,
        y + height,
        x,
        y + height - cornerLength,
      ],
      [
        x + width,
        y + height,
        x + width - cornerLength,
        y + height,
        x + width,
        y + height - cornerLength,
      ],
    ];

    corners.forEach(([mx, my, l1x, l1y, l2x, l2y]) => {
      ctx.beginPath();
      ctx.moveTo(mx, my);
      ctx.lineTo(l1x, l1y);
      ctx.moveTo(mx, my);
      ctx.lineTo(l2x, l2y);
      ctx.stroke();
    });
  }, [getScanBoxRect]);

  const drawBoundingBox = useCallback(
    (
      video: HTMLVideoElement,
      loc: QRCode["location"],
      sx: number,
      sy: number,
    ) => {
      const canvas = overlayRef.current;
      if (!canvas) return;

      const fitted = fitOverlayToVideo(video, canvas);
      if (!fitted) return;

      const { ctx, rect } = fitted;
      ctx.clearRect(0, 0, rect.width, rect.height);

      const color = "#ffeb3b";
      const cornerLength = 20;

      const pts = {
        tl: loc.topLeftCorner,
        tr: loc.topRightCorner,
        br: loc.bottomRightCorner,
        bl: loc.bottomLeftCorner,
      };

      const toCss = (p: Point) => {
        const vx = p.x + sx;
        const vy = p.y + sy;
        return videoToCssPoint(video, vx, vy);
      };

      const drawCorner = (p1: Point, p2: Point, horizontalFirst = true) => {
        const a = toCss(p1);
        const b = toCss(p2);

        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        const ux = dx / len;
        const uy = dy / len;

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 4;

        if (horizontalFirst) {
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(a.x + ux * cornerLength, a.y + uy * cornerLength);
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(a.x - uy * cornerLength, a.y + ux * cornerLength);
        } else {
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(a.x - uy * cornerLength, a.y + ux * cornerLength);
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(a.x + ux * cornerLength, a.y + uy * cornerLength);
        }
        ctx.stroke();
      };

      drawCorner(pts.tl, pts.tr, true);
      drawCorner(pts.tr, pts.br, false);
      drawCorner(pts.br, pts.bl, true);
      drawCorner(pts.bl, pts.tl, false);
    },
    [],
  );

  // Resize listener: redraw scan box overlay
  useEffect(() => {
    const onResize = () => {
      setScreenSize({ width: window.innerWidth, height: window.innerHeight });
      // redraw overlays (best-effort)
      requestAnimationFrame(() => {
        drawScanBoxOverlay();
        clearOverlay();
      });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [drawScanBoxOverlay, clearOverlay]);

  /** ─────────────────────────────────────────────────────────────
   * Effect A: camera preview lifecycle (always-on)
   * ───────────────────────────────────────────────────────────── */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!cameraOn) {
      stopCamera(video);
      return;
    }

    let cancelled = false;

    const start = async () => {
      // 🔒 Secure context & API availability check
      if (!navigator.mediaDevices?.getUserMedia) {
        const msg = !window.isSecureContext
          ? cameraText.HTTPS_REQUIRED
          : cameraText.API_UNAVAILABLE;

        toast.error(msg);

        setCameraOn(false);
        setScanning(false);
        setDetecting(false);
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });

        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        video.srcObject = stream;
        await video.play();

        requestAnimationFrame(() => {
          drawScanBoxOverlay();
          clearOverlay();
        });
      } catch (err) {
        console.error("getUserMedia error:", err);
        toast.error(cameraText.PERMISSION_DENIED);

        setCameraOn(false);
        setScanning(false);
        setDetecting(false);
      }
    };

    start();

    return () => {
      cancelled = true;
      stopCamera(video);
    };
  }, [cameraOn, drawScanBoxOverlay, clearOverlay]);

  /** ─────────────────────────────────────────────────────────────
   * Effect B: scanning loop (manual start/stop)
   * ───────────────────────────────────────────────────────────── */
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    // if user isn't scanning, stop loop + timers, but keep camera preview
    if (!scanning) {
      if (scanTimer.current) window.clearInterval(scanTimer.current);
      scanTimer.current = null;
      clearNoResultTimer();
      setDetecting(false);
      // clear bbox when not scanning (optional)
      clearOverlay();
      return;
    }

    if (!video || !canvas) return;

    const scan = () => {
      if (!video || !canvas) return;
      if (video.readyState < 2) return;

      const vw = video.videoWidth;
      const vh = video.videoHeight;
      if (!vw || !vh) return;

      canvas.width = vw;
      canvas.height = vh;

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      ctx.drawImage(video, 0, 0, vw, vh);

      // compute crop rect in VIDEO pixels from scan box in CSS pixels
      const vrect = video.getBoundingClientRect();
      const { x, y, width, height } = getScanBoxRect();

      const absX1 = vrect.left + x;
      const absY1 = vrect.top + y;
      const absX2 = vrect.left + x + width;
      const absY2 = vrect.top + y + height;

      const p1 = cssToVideoPoint(video, absX1, absY1);
      const p2 = cssToVideoPoint(video, absX2, absY2);

      const sx = Math.floor(Math.min(p1.x, p2.x));
      const sy = Math.floor(Math.min(p1.y, p2.y));
      const sw = Math.floor(Math.abs(p2.x - p1.x));
      const sh = Math.floor(Math.abs(p2.y - p1.y));

      if (sw <= 0 || sh <= 0) return;
      if (sx < 0 || sy < 0 || sx + sw > vw || sy + sh > vh) return;

      try {
        const imageData = ctx.getImageData(sx, sy, sw, sh);
        const code = jsQR(imageData.data, sw, sh);

        if (code) {
          const loc = code.location;

          const boxW = Math.hypot(
            loc.topRightCorner.x - loc.topLeftCorner.x,
            loc.topRightCorner.y - loc.topLeftCorner.y,
          );
          const boxH = Math.hypot(
            loc.bottomLeftCorner.x - loc.topLeftCorner.x,
            loc.bottomLeftCorner.y - loc.topLeftCorner.y,
          );
          if (boxW < 50 || boxH < 50) return;

          drawBoundingBox(video, loc, sx, sy);
          setDetecting(true);
          clearNoResultTimer();

          setResult(code.data);
          setScanning(false); // stop scanning loop (camera stays ON)
          setDetecting(false);
          if ("vibrate" in navigator) {
            navigator.vibrate?.(80); // 80ms short feedback
          }

          playBeep();
          onResult(code.data);
        } else {
          setDetecting(false);
        }
      } catch (e) {
        console.error("Scan error:", e);
      }
    };

    // Start scanning session
    drawScanBoxOverlay();
    startNoResultTimer();

    scanTimer.current = window.setInterval(scan, SCAN_INTERVAL);

    return () => {
      if (scanTimer.current) window.clearInterval(scanTimer.current);
      scanTimer.current = null;
      clearNoResultTimer();
    };
  }, [
    scanning,
    onResult,
    getScanBoxRect,
    drawScanBoxOverlay,
    drawBoundingBox,
    startNoResultTimer,
    clearNoResultTimer,
    clearOverlay,
  ]);

  const handleRescan = () => {
    setResult(null);
    setScanning(false);
    setDetecting(false);
    clearNoResultTimer();
    clearOverlay();
    // scan box overlay stays (camera preview is still on)
    requestAnimationFrame(() => drawScanBoxOverlay());
  };

  return {
    videoRef,
    canvasRef,
    overlayRef,
    scanBoxRef,

    cameraOn,
    setCameraOn, // optional: turn camera off when leaving page

    scanning,
    setScanning,

    detecting,
    result,
    handleRescan,
  };
};
