import { useEffect, useRef, useState } from "react";

interface ModalWrapperProps {
  children: React.ReactNode;
  onClose: () => void;
}

export default function ModalWrapper({ children, onClose }: ModalWrapperProps) {
  const [isClosing, setIsClosing] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Close on ESC
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        triggerClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Handle outside click
  const handleClickOutside = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) {
      triggerClose();
    }
  };

  // Animate close before unmount
  const triggerClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose(), 300);
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleClickOutside}
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
        isClosing ? "opacity-0" : "opacity-100"
      } bg-black/50`}
    >
      <div
        className={`w-full max-w-sm rounded-lg bg-white dark:bg-zinc-900 p-6 text-center shadow-xl border border-gray-200 dark:border-zinc-700 transition-all duration-300 ${
          isClosing
            ? "opacity-0 scale-95 translate-y-4"
            : "opacity-100 scale-100 translate-y-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
