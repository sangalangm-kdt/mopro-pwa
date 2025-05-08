import { useScanResult } from "@/hooks/scan-result";
import Header from "@/components/navigation/Header";
import Icon from "@/components/icons/Icons";
import QRButtonActions from "@/components/buttons/QRButtonActions";
import ScanSkeletonGroup from "@/components/skeletons/qrscanner/ScanSkeletonGroup";
import { SCAN_RESULT, SCAN_RESULT_CLASSES } from "@/constants";
import { FieldItem } from "@/constants/variables/fields";
import { useState } from "react";

interface ScanResultProps {
  qrData: string;
  onClose: () => void;
  projects?: [];
}

// import { useTranslation } from "react-i18next";

function Section({ label, value, icon }: FieldItem) {
  const isRemarks = label.toLowerCase() === "remarks";
  const [showFull, setShowFull] = useState(false);
  const stringValue = typeof value === "string" ? value : String(value ?? "-");
  const shouldTruncate = isRemarks && stringValue.length > 80;
  const displayValue =
    shouldTruncate && !showFull
      ? stringValue.slice(0, 80) + "..."
      : stringValue;

  return (
    <div className="flex items-start gap-2">
      <Icon name={icon} className="w-4 h-4 text-gray-500" />
      <div>
        <p className="text-gray-500 text-xs">{label}</p>
        <p className="font-medium text-gray-800 dark:text-white break-words text-sm">
          {displayValue}
          {shouldTruncate && (
            <button
              onClick={() => setShowFull(!showFull)}
              className="ml-1 text-primary-500 text-xs underline"
            >
              {showFull ? "Read less" : "Read more"}
            </button>
          )}
        </p>
      </div>
    </div>
  );
}

export default function ScanResult({
  qrData,
  onClose,
  projects,
}: ScanResultProps) {
  const {
    expanded,
    loading,
    parsed,
    overviewFields,
    productDetailsFields,
    handleTouchStart,
    handleTouchEnd,
    handleOverlayClick,
  } = useScanResult(qrData, onClose, projects);
  return (
    <div
      className="fixed inset-0 z-[200] bg-black/40 flex justify-center items-end overflow-hidden"
      onClick={handleOverlayClick}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`w-full bg-white dark:bg-zinc-900 rounded-t-2xl shadow-lg ${
          SCAN_RESULT_CLASSES.SHEET_TRANSITION_CLASSES
        } ${
          expanded
            ? SCAN_RESULT_CLASSES.SHEET_HEIGHT_EXPANDED
            : SCAN_RESULT_CLASSES.SHEET_HEIGHT_COLLAPSED
        }`}
        style={{ touchAction: "none" }}
      >
        <div className={SCAN_RESULT_CLASSES.HANDLE_STYLE} />

        {expanded && (
          <Header
            title={SCAN_RESULT.HEADER_TITLE}
            showBack={true}
            textColorClass="text-gray-700 dark:text-white"
          />
        )}

        <div
          className={`flex-1 px-6 pb-32 transition-all pt-2 ${
            expanded
              ? "overflow-y-auto max-h-[calc(100vh-6rem)] scrollbar"
              : "overflow-hidden"
          }`}
        >
          {!expanded && (
            <h2 className="text-base font-semibold mb-4 text-center text-gray-700">
              {SCAN_RESULT.TITLE}
            </h2>
          )}

          {loading ? (
            <ScanSkeletonGroup />
          ) : "error" in parsed ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Icon name="sticky-note" className="w-16 h-16 text-gray-400" />
              <p className="mt-4 text-center text-red-500">
                {String(parsed.error)}
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-primary-800">
                  {parsed.lineNumber}
                </h3>
                <p className="text-xs text-gray-500">Line number</p>
              </div>

              <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow border border-gray-200 dark:border-zinc-700 space-y-4">
                <p className="text-base font-bold text-gray-800 dark:text-white">
                  Overview
                </p>
                {overviewFields.map((field) => (
                  <Section key={field.label} {...field} />
                ))}
              </div>

              {productDetailsFields.length > 0 && (
                <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow border mt-3 border-gray-200 dark:border-zinc-700 space-y-4">
                  <p className="text-base font-bold text-gray-800 dark:text-white">
                    Product Details
                  </p>
                  {productDetailsFields.map((field) => (
                    <Section key={field.label} {...field} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {!loading && !("error" in parsed) && (
          <QRButtonActions
            serialNumber={parsed.serialNumber}
            onClose={onClose}
            showEdit={true}
          />
        )}
      </div>
    </div>
  );
}
