import { useAuthContext } from "@/context/auth/useAuth";
import { useProductUserAssign } from "@/api/product-user-assign";
import { useProgress } from "@/api/progress";
import { useProject } from "@/api/project";
import Button from "@/components/buttons/Button";
import ManualEntryModal from "@/components/modals/ManualEntryModal";
import Header from "@/components/navigation/Header";
import { QR_SCANNER_TEXT_KEYS } from "@/constants";
import { useQrScanner } from "@/hooks/qr-scanner";
import { toggleFlashlight } from "@/utils/flashlight";
import { stopCamera } from "@/utils/stop-camera";
import { Flashlight, FlashlightOff } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import ScanResult from "./ScanResult";

const QRScanner = () => {
  const { user } = useAuthContext();

  const {
    projects,
    isLoading: projectsLoading,
    error: projectsError,
  } = useProject();
  const {
    productUserAssigns,
    isLoading: productUserAssignsLoading,
    error: productUserAssignsError,
  } = useProductUserAssign();
  const {
    progress,
    isLoading: progressLoading,
    error: progressError,
  } = useProgress();
  const scannerDataError =
    projectsError || productUserAssignsError || progressError;

  const { t } = useTranslation("scan");
  const {
    TITLE,
    SCAN_PROMPT,
    START_SCAN,
    SCAN_AGAIN,
    SCANNING,
    ADD_MANUALLY,
    FLASHLIGHT_NOT_SUPPORTED,
    TOGGLE_FLASHLIGHT,
    PRODUCT_DATA_LOADING,
    PRODUCT_DATA_LOAD_ERROR,
    NO_DATA_RECORD_FOUND,
  } = QR_SCANNER_TEXT_KEYS;

  // ✅ Always return arrays (avoid products being undefined inside onResult)
  const products = useMemo(() => {
    if (!user?.id || !projects || !productUserAssigns) return [];

    const assignedLineNumbers = productUserAssigns
      .filter((prod: { userId: number }) => prod.userId === user.id)
      .map((assign: { lineNumber: string }) => assign.lineNumber);

    const flatProducts =
      projects.flatMap((item: { products: any[] }) => item.products) ?? [];

    return flatProducts.filter((prod: { lineNumber: string }) =>
      assignedLineNumbers.includes(prod.lineNumber),
    );
  }, [user?.id, projects, productUserAssigns]);

  const [torchOn, setTorchOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [qrData, setQrData] = useState<string | null>(null);
  const [showManualModal, setShowManualModal] = useState(false);
  const scannerDataLoading =
    !user?.id ||
    projectsLoading ||
    productUserAssignsLoading ||
    progressLoading ||
    !projects;
  const manualEntryStatusMessage = scannerDataError
    ? t(PRODUCT_DATA_LOAD_ERROR)
    : scannerDataLoading
      ? t(PRODUCT_DATA_LOADING)
      : undefined;

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
      if (scannerDataLoading) {
        toast.info(t(PRODUCT_DATA_LOADING));
        handleRescan();
        return;
      }

      if (scannerDataError) {
        toast.error(t(PRODUCT_DATA_LOAD_ERROR));
        handleRescan();
        return;
      }

      const found = products.find(
        (item: { lineNumber: string }) => item.lineNumber == data,
      );

      if (!found) {
        toast.error(t(NO_DATA_RECORD_FOUND));
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
    if (scannerDataLoading) {
      toast.info(t(PRODUCT_DATA_LOADING));
      return;
    }

    if (scannerDataError) {
      toast.error(t(PRODUCT_DATA_LOAD_ERROR));
      return;
    }

    handleRescan();
    setScanning(true);
  };

  const handleToggleFlashlight = async () => {
    try {
      // ✅ best: use current video stream track
      await toggleFlashlight(!torchOn, videoRef.current);
      setTorchOn((prev) => !prev);
    } catch {
      toast.error(t(FLASHLIGHT_NOT_SUPPORTED));
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
            <button
              onClick={handleToggleFlashlight}
              aria-label={t(TOGGLE_FLASHLIGHT)}
            >
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

      {showManualModal && (
        <ManualEntryModal
          onClose={() => setShowManualModal(false)}
          submitDisabled={scannerDataLoading || Boolean(scannerDataError)}
          statusMessage={manualEntryStatusMessage}
          statusTone={scannerDataError ? "error" : "info"}
          onSubmit={({ drawingNumber }) => {
            if (scannerDataError) {
              toast.error(t(PRODUCT_DATA_LOAD_ERROR));
              return;
            }

            if (scannerDataLoading) {
              toast.info(t(PRODUCT_DATA_LOADING));
              return;
            }

            const trimmedDrawingNumber = drawingNumber.trim();
            const found = products.find(
              (item: { lineNumber: string }) =>
                item.lineNumber == trimmedDrawingNumber,
            );

            if (!found) {
              toast.error(t(NO_DATA_RECORD_FOUND));
              return;
            }

            setQrData(trimmedDrawingNumber);
            stopCamera(videoRef.current);
            setShowManualModal(false);
          }}
        />
      )}

      <div className="fixed bottom-0 left-0 right-0 z-[150] bg-bg-color text-black rounded-t-2xl px-4 pt-4 pb-6 shadow-xl max-h-[40vh] overflow-y-auto w-full max-w-md mx-auto">
        <div className="text-center space-y-4">
          {scannerDataError && (
            <div
              className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
              role="alert"
            >
              {t(PRODUCT_DATA_LOAD_ERROR)}
            </div>
          )}

          <p className="text-sm text-gray-600">{t(SCAN_PROMPT)}</p>

          <div className="space-y-3">
            <Button
              onClick={startScan}
              disabled={
                scanning || scannerDataLoading || Boolean(scannerDataError)
              }
              className={`w-full ${
                scanning || scannerDataLoading || scannerDataError
                  ? "bg-primary-300 cursor-not-allowed"
                  : "bg-primary-600 hover:bg-primary-700 text-white"
              }`}
            >
              {scanning ? t(SCANNING) : qrData ? t(SCAN_AGAIN) : t(START_SCAN)}
            </Button>

            <Button
              onClick={() => setShowManualModal(true)}
              variant="outlined"
              fullWidth
              disabled={scannerDataLoading || Boolean(scannerDataError)}
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
