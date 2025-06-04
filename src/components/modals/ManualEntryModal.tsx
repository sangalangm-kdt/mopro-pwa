import { useState } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import Button from "../buttons/Button";
import { MANUAL_ENTRY_TEXT_KEYS } from "@/constants";

interface ManualEntryModalProps {
  onClose: () => void;
  onSubmit: (data: { drawingNumber: string }) => void;
}

const ManualEntryModal = ({ onClose, onSubmit }: ManualEntryModalProps) => {
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
    if (!drawingNumber.trim()) return;
    onSubmit({ drawingNumber });
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 transition-opacity duration-300 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white m-1 dark:bg-zinc-900 rounded-lg shadow-xl p-6 border border-gray-200 dark:border-zinc-700 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Content */}
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          {TEXT.title}
        </h2>
        <p className="text-base text-gray-600 dark:text-gray-300 mb-6">
          {TEXT.description}
        </p>

        {/* Input Field */}
        <input
          type="text"
          placeholder={TEXT.placeholder}
          value={drawingNumber}
          onChange={(e) => setDrawingNumber(e.target.value)}
          className="w-full rounded-md border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text- text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        />

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outlined" onClick={onClose}>
            {TEXT.cancel}
          </Button>
          <Button onClick={handleSubmit}>{TEXT.submit}</Button>
        </div>
      </div>
    </div>
  );
};

export default ManualEntryModal;
