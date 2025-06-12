import { useAuth } from "@/api/auth";
import { useProgress } from "@/api/progress";
import { useProject } from "@/api/project";
import Button from "@/components/buttons/Button";
import ManualEntryModal from "@/components/modals/ManualEntryModal";
import Header from "@/components/navigation/Header";
import { QR_SCANNER_TEXT_KEYS, TOAST_MESSAGES } from "@/constants";
import { useQrScanner } from "@/hooks/qr-scanner";
import { toggleFlashlight } from "@/utils/flashlight";
import { stopCamera } from "@/utils/stop-camera";
import { Flashlight, FlashlightOff } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import ScanResult from "./ScanResult";

const QRScanner = () => {
    const user = useAuth()?.user.data;
    const { projects } = useProject();
    // Get only the projects that belong to the user's manufacturer
    const userManufacturerProjects = projects.filter(
        (proj) => proj.manufacturerId === user.manufacturerId
    );
    const product = userManufacturerProjects?.flatMap(
        (item: { products: unknown }) => item.products
    );
    const { progress } = useProgress();

    const { t } = useTranslation("scan");
    const {
        TITLE,
        SCAN_PROMPT,
        START_SCAN,
        SCAN_AGAIN,
        SCANNING,
        ADD_MANUALLY,
        FLASHLIGHT_NOT_SUPPORTED,
    } = QR_SCANNER_TEXT_KEYS;

    console.log(product);

    const [torchOn, setTorchOn] = useState(false);
    const [loading, setLoading] = useState(false);
    const [qrData, setQrData] = useState<string | null>(null);
    const [showManualModal, setShowManualModal] = useState(false);
    const {
        videoRef,
        canvasRef,
        overlayRef,
        scanBoxRef,
        scanning,
        handleRescan,
        setScanning,
    } = useQrScanner({
        onResult: (data) => {
            const found = product.find(
                (item: { lineNumber: string }) => item.lineNumber == data
            );

            if (!found) {
                toast.error(TOAST_MESSAGES.NO_DATA_RECORD_FOUND);
                handleRescan();
                return;
            }

            setLoading(true);
            setTimeout(() => {
                setQrData(data);
                setLoading(false);
            }, 200);
        },
    });

    const startScan = () => {
        handleRescan();
        setScanning(true);
    };

    const handleToggleFlashlight = async () => {
        try {
            await toggleFlashlight(!torchOn);
            setTorchOn((prev) => !prev);
        } catch {
            alert(t(FLASHLIGHT_NOT_SUPPORTED));
        }
    };

    const handleCloseModal = () => {
        setQrData(null);
        stopCamera(videoRef.current);
        handleRescan();
    };

    return (
        <div className="fixed inset-0 bg-black overflow-hidden">
            <div className="relative z-20">
                <Header
                    title={t(TITLE)}
                    rightElement={
                        <button onClick={handleToggleFlashlight}>
                            {torchOn ? (
                                <FlashlightOff className="text-white" />
                            ) : (
                                <Flashlight className="text-white" />
                            )}
                        </button>
                    }
                />
            </div>

            <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                muted
                playsInline
            />
            <canvas ref={canvasRef} className="hidden" />
            <canvas
                ref={overlayRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
            />
            <canvas
                ref={scanBoxRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
            />

            {loading && (
                <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/60">
                    <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            {qrData && (
                <ScanResult
                    qrData={qrData}
                    onClose={handleCloseModal}
                    projects={projects}
                    progress={progress}
                />
            )}

            {/* Manual entry modal */}
            {showManualModal && (
                <ManualEntryModal
                    onClose={() => setShowManualModal(false)}
                    onSubmit={({ drawingNumber }) => {
                        const found = product.find(
                            (item: { lineNumber: string }) =>
                                item.lineNumber == drawingNumber
                        );

                        if (!found) {
                            toast.error(
                                "No matching record found for the entered drawing number."
                            );
                            return;
                        }

                        setQrData(drawingNumber);
                        stopCamera(videoRef.current);
                        setShowManualModal(false);
                    }}
                />
            )}

            <div className="fixed bottom-0 left-0 right-0 z-[150] bg-bg-color text-black rounded-t-2xl px-4 pt-4 pb-6 shadow-xl max-h-[40vh] overflow-y-auto w-full max-w-md mx-auto">
                <div className="text-center space-y-4">
                    <p className="text-sm text-gray-600">{t(SCAN_PROMPT)}</p>

                    <div className="space-y-3">
                        <Button
                            onClick={startScan}
                            disabled={scanning}
                            className={`w-full ${
                                scanning
                                    ? "bg-primary-300 cursor-not-allowed"
                                    : "bg-primary-600 hover:bg-primary-700 text-white"
                            }`}
                        >
                            {scanning
                                ? t(SCANNING)
                                : qrData
                                ? t(SCAN_AGAIN)
                                : t(START_SCAN)}
                        </Button>

                        <Button
                            onClick={() => setShowManualModal(true)}
                            variant="outlined"
                            fullWidth
                        >
                            {t(ADD_MANUALLY)}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QRScanner;
