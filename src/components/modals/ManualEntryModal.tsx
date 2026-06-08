import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, X } from "lucide-react";
import Button from "../buttons/Button";
import { MANUAL_ENTRY_TEXT_KEYS } from "@/constants";

interface ManualEntryModalProps {
  onClose: () => void;
  onSubmit: (data: { drawingNumber: string }) => void;
  submitDisabled?: boolean;
  statusMessage?: string;
  statusTone?: "info" | "error";
}

const ManualEntryModal = ({
  onClose,
  onSubmit,
  submitDisabled = false,
  statusMessage,
  statusTone = "info",
}: ManualEntryModalProps) => {
  const { t } = useTranslation("common");
  const [drawingNumber, setDrawingNumber] = useState("");

  const TEXT = {
    title: t(MANUAL_ENTRY_TEXT_KEYS.TITLE),
    description: t(MANUAL_ENTRY_TEXT_KEYS.DESCRIPTION),
    placeholder: t(MANUAL_ENTRY_TEXT_KEYS.PLACEHOLDER),
    cancel: t(MANUAL_ENTRY_TEXT_KEYS.CANCEL),
    submit: t(MANUAL_ENTRY_TEXT_KEYS.SUBMIT),
  };

  const handleSubmit = () => {
    const trimmedDrawingNumber = drawingNumber.trim();

    if (submitDisabled || !trimmedDrawingNumber) return;

    onSubmit({ drawingNumber: trimmedDrawingNumber });
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4 transition-opacity duration-300 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl animate-slide-up dark:border-zinc-700 dark:bg-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-zinc-800 dark:hover:text-white"
          aria-label="Close manual entry"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="pr-8 text-xl font-semibold text-gray-800 dark:text-white">
          {TEXT.title}
        </h2>

        <p className="mt-2 text-base text-gray-600 dark:text-gray-300">
          {TEXT.description}
        </p>

        <div className="mt-6">
          <label
            htmlFor="manual-drawing-number"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            {TEXT.placeholder}
          </label>

          <input
            id="manual-drawing-number"
            type="text"
            placeholder={TEXT.placeholder}
            value={drawingNumber}
            disabled={submitDisabled}
            onChange={(e) => setDrawingNumber(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500 dark:disabled:bg-zinc-800/60"
          />
        </div>

        {statusMessage && (
          <div
            className={`mt-4 flex items-start gap-2 rounded-lg px-3 py-2 text-sm ${
              statusTone === "error"
                ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300"
                : "bg-gray-50 text-gray-700 dark:bg-zinc-800 dark:text-gray-300"
            }`}
            role={statusTone === "error" ? "alert" : "status"}
            aria-live="polite"
          >
            {submitDisabled && statusTone !== "error" && (
              <Loader2 className="mt-0.5 h-4 w-4 shrink-0 animate-spin" />
            )}
            <span>{statusMessage}</span>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outlined" onClick={onClose}>
            {TEXT.cancel}
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={submitDisabled || !drawingNumber.trim()}
          >
            {submitDisabled ? "Loading..." : TEXT.submit}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ManualEntryModal;
