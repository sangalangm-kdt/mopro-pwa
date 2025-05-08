import { useEffect, useRef, useState, useCallback } from "react";
import jsQR, { QRCode } from "jsqr";
import { toast } from "sonner";
import { stopCamera } from "@/utils/stop-camera";

// Interval in ms between scan attempts
const SCAN_INTERVAL = 500;

interface UseQrScannerProps {
    onResult: (data: string) => void;
}

type Point = { x: number; y: number };

export const useQrScanner = ({ onResult }: UseQrScannerProps) => {
    // Refs for video and canvas elements
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const overlayRef = useRef<HTMLCanvasElement | null>(null);
    const scanBoxRef = useRef<HTMLCanvasElement | null>(null);

    // State to manage scanning session
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [detecting, setDetecting] = useState<boolean>(false);

    const scanTimer = useRef<number | null>(null);
    const noResultTimeout = useRef<number | null>(null);

    // Track current screen size for overlay calculations
    const [screenSize, setScreenSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    // Trigger error toast if no QR is detected after 10s
    const startNoResultTimer = () => {
        if (noResultTimeout.current) {
            clearTimeout(noResultTimeout.current);
        }
        noResultTimeout.current = window.setTimeout(() => {
            setScanning(false);
            setDetecting(false);
            console.warn("⚠️ No QR code detected within timeout.");
            toast.error("No QR code detected. Please try again.");
        }, 10000);
    };

    // Clear timeout if QR is detected or scanning ends
    const clearNoResultTimer = () => {
        if (noResultTimeout.current) {
            clearTimeout(noResultTimeout.current);
            noResultTimeout.current = null;
        }
    };

    // Calculate center scan box rectangle based on screen size
    const getScanBoxRect = useCallback(() => {
        const { width, height } = screenSize;
        const size = Math.min(width, height) * 0.45;
        const x = (width - size) / 2;
        const y = (height - size) / 2 - height * 0.1;
        return { x, y, width: size, height: size };
    }, [screenSize]);

    // Draw dark overlay with transparent scan box and white corners
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

        // Draw 4 corner brackets around scan box
        const corners = [
            [x, y, x + cornerLength, y, x, y + cornerLength],
            [
                x + width,
                y,
                x + width - cornerLength,
                y,
                x + width,
                y + cornerLength,
            ],
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
        corners.forEach(([moveX, moveY, line1X, line1Y, line2X, line2Y]) => {
            ctx.beginPath();
            ctx.moveTo(moveX, moveY);
            ctx.lineTo(line1X, line1Y);
            ctx.moveTo(moveX, moveY);
            ctx.lineTo(line2X, line2Y);
            ctx.stroke();
        });
    }, [screenSize, getScanBoxRect]);

    // Draw bounding box on top of detected QR code
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

            const drawCorner = (
                p1: Point,
                p2: Point,
                horizontalFirst = true
            ) => {
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

    // Update overlay size when screen resizes
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

    // Main camera & scanning logic
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

            // Skip scan if scan area is out of bounds
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
                    const loc = code.location;

                    // Validate QR size
                    const boxWidth = Math.hypot(
                        loc.topRightCorner.x - loc.topLeftCorner.x,
                        loc.topRightCorner.y - loc.topLeftCorner.y
                    );
                    const boxHeight = Math.hypot(
                        loc.bottomLeftCorner.x - loc.topLeftCorner.x,
                        loc.bottomLeftCorner.y - loc.topLeftCorner.y
                    );
                    const MIN_BOX_SIZE = 50;
                    if (boxWidth < MIN_BOX_SIZE || boxHeight < MIN_BOX_SIZE)
                        return;

                    drawBoundingBox(loc, sx, sy);
                    setDetecting(true);

                    clearNoResultTimer();
                    setResult(code.data);
                    setScanning(false);
                    setDetecting(false);
                    onResult(code.data); // ETO YUNG RESULT
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
            clearNoResultTimer();
            stopCamera(video);
        };
    }, [
        scanning,
        onResult,
        drawScanBoxOverlay,
        screenSize,
        getScanBoxRect,
        drawBoundingBox,
    ]);

    // Start timeout when scanning begins
    useEffect(() => {
        if (scanning) startNoResultTimer();
        else clearNoResultTimer();
    }, [scanning]);

    // Reset scanner state and clear overlay
    const handleRescan = () => {
        setResult(null);
        setScanning(false);
        setDetecting(false);

        const canvas = overlayRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    // Return scanner control and refs
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
    };
};
