import { X } from "lucide-react";
import PWAButton from "@/components/buttons/PWAButton";

type Props = {
  onDismiss: () => void;
  text: {
    PWA_BANNER_TITLE?: string;
    PWA_BANNER_DESCRIPTION?: string;
  };
};

export default function PwaPrompt({ onDismiss, text }: Props) {
  return (
    <div className="absolute top-4 left-4 right-4 max-w-md mx-auto bg-yellow-50 dark:bg-zinc-800 border border-yellow-200 dark:border-zinc-700 rounded-lg px-4 py-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 z-10 transition-all animate-fade-in-up">
      <button
        onClick={onDismiss}
        className="absolute top-2 right-2 text-yellow-800 hover:text-yellow-900 dark:text-yellow-200"
        aria-label="Dismiss PWA prompt"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex flex-row pt-2 sm:flex-row sm:items-center sm:justify-between w-full">
        <div className="flex-1 text-sm text-yellow-800 dark:text-yellow-50 leading-tight mb-2 sm:mb-0">
          <p className="font-semibold">
            {text.PWA_BANNER_TITLE ?? "Want a mobile-like experience?"}
          </p>
          <p className="text-xs">
            {text.PWA_BANNER_DESCRIPTION ??
              "Install the app to your home screen."}
          </p>
        </div>
        <div className="shrink-0">
          <PWAButton />
        </div>
      </div>
    </div>
  );
}
