import { useScanResult } from "@/hooks/scan-result";
import Header from "@/components/navigation/Header";
import Icon from "@/components/icons/Icons";
import QRButtonActions from "@/components/buttons/QRButtonActions";
import ScanSkeletonGroup from "@/components/skeletons/qrscanner/ScanSkeletonGroup";
import {
  SCAN_RESULT_TEXT_KEYS,
  SCAN_LABEL_KEYS,
  SCAN_RESULT_CLASSES,
} from "@/constants";
import { FieldItem } from "@/constants/variables/fields";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface ScanResultProps {
  qrData: string;
  onClose: () => void;
  projects?: [];
  progress?: [];
}

function Section({ label, value, icon }: FieldItem) {
  const isRemarks = label.toLowerCase() === "remarks";
  const [showFull, setShowFull] = useState(false);
  const stringValue = typeof value === "string" ? value : String(value ?? "-");
  const shouldTruncate = isRemarks && stringValue.length > 80;
  const displayValue =
    shouldTruncate && !showFull
      ? stringValue.slice(0, 80) + "..."
      : stringValue;
  const { t } = useTranslation("common");
  const SCAN_RESULT = {
    READ_MORE: t(SCAN_RESULT_TEXT_KEYS.READ_MORE),
    READ_LESS: t(SCAN_RESULT_TEXT_KEYS.READ_LESS),
  };

  return (
    <div className="flex items-start gap-2">
      <Icon name={icon} className="w-4 h-4 text-gray-500" />
      <div>
        <p className="text-gray-500 text-base">{label}</p>
        <p className="font-medium text-gray-800 dark:text-white break-words text-base">
          {displayValue}
          {shouldTruncate && (
            <button
              onClick={() => setShowFull(!showFull)}
              className="ml-1 text-primary-500 text-sm underline"
            >
              {showFull ? SCAN_RESULT.READ_LESS : SCAN_RESULT.READ_MORE}
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
  progress,
}: ScanResultProps) {
  const { t } = useTranslation("common");
  const SCAN_LABELS = {
    PROJECT_NAME: t(SCAN_LABEL_KEYS.PROJECT_NAME),
    ORDER_NUMBER: t(SCAN_LABEL_KEYS.ORDER_NUMBER),
    LAST_UPDATED: t(SCAN_LABEL_KEYS.LAST_UPDATED),
    LAST_MODIFIED_BY: t(SCAN_LABEL_KEYS.LAST_MODIFIED_BY),
    DRAWING_NAME: t(SCAN_LABEL_KEYS.DRAWING_NAME),
    WEIGHT: t(SCAN_LABEL_KEYS.WEIGHT),
    CURRENT_PROCESS: t(SCAN_LABEL_KEYS.CURRENT_PROCESS),
    PROGRESS: t(SCAN_LABEL_KEYS.PROGRESS),
    REMARKS: t(SCAN_LABEL_KEYS.REMARKS),
  };

  const {
    expanded,
    loading,
    parsed,
    overviewFields,
    productDetailsFields,
    handleTouchStart,
    handleTouchEnd,
    handleOverlayClick,
  } = useScanResult(qrData, onClose, projects, progress, SCAN_LABELS);

  const SCAN_RESULT = {
    TITLE: t(SCAN_RESULT_TEXT_KEYS.TITLE),
    HEADER_TITLE: t(SCAN_RESULT_TEXT_KEYS.HEADER_TITLE),
    DRAWING_NUMBER: t(SCAN_RESULT_TEXT_KEYS.DRAWING_NUMBER),
    OVERVIEW: t(SCAN_RESULT_TEXT_KEYS.OVERVIEW),
    PRODUCT_DETAILS: t(SCAN_RESULT_TEXT_KEYS.PRODUCT_DETAILS),
    ERROR_MESSAGE: t(SCAN_RESULT_TEXT_KEYS.ERROR_MESSAGE),
    ERROR_NOTE: t(SCAN_RESULT_TEXT_KEYS.ERROR_NOTE),
  };

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
              {SCAN_RESULT.HEADER_TITLE}
            </h2>
          )}

          {loading ? (
            <ScanSkeletonGroup />
          ) : "error" in parsed ? (
            <div
              className={`flex flex-col items-center justify-center px-6 ${
                expanded ? "py-20" : "py-12"
              } bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700 shadow-sm transition-all duration-300`}
            >
              <Icon
                name="sad"
                className={`w-16 h-16 ${
                  expanded
                    ? "text-red-500 dark:text-red-300"
                    : "text-red-400 dark:text-red-300"
                }`}
              />
              <p className="mt-4 text-center text-red-700 dark:text-red-200 font-semibold text-sm">
                {String(parsed.error)}
              </p>
              <p className="text-xs text-red-500 dark:text-red-400 mt-2 text-center max-w-md">
                {SCAN_RESULT.ERROR_MESSAGE}
              </p>
              {expanded && (
                <p className="text-[11px] text-red-400 dark:text-red-500 text-center mt-2 italic">
                  {SCAN_RESULT.ERROR_NOTE}
                </p>
              )}
            </div>
          ) : (
            <>
              <div className="text-center py-2 mb-2">
                <h3 className="text-2xl font-bold text-primary-800">
                  {parsed.lineNumber}
                </h3>
                <p className="text-base text-gray-500">
                  {SCAN_RESULT.DRAWING_NUMBER}
                </p>
              </div>

              <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow border border-gray-200 dark:border-zinc-700 space-y-4">
                <p className="text-lg font-bold text-gray-800 dark:text-white">
                  {SCAN_RESULT.OVERVIEW}
                </p>
                {overviewFields.map((field) => (
                  <Section key={field.label} {...field} />
                ))}
              </div>

              {productDetailsFields.length > 0 && (
                <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow border mt-3 border-gray-200 dark:border-zinc-700 space-y-4">
                  <p className="text-lg font-bold text-gray-800 dark:text-white">
                    {SCAN_RESULT.PRODUCT_DETAILS}
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
            lineNumber={parsed.lineNumber}
            onClose={onClose}
            showEdit={true}
          />
        )}
      </div>
    </div>
  );
}
