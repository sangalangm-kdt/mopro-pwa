import { useEffect } from "react";

export function useSidebarControls(
  open: boolean,
  onClose: () => void,
  sidebarRef: React.RefObject<HTMLElement | null>,
  closeButtonRef?: React.RefObject<HTMLElement | null>
) {
  useEffect(() => {
    if (!open || !sidebarRef.current) return;

    closeButtonRef?.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();

      if (e.key === "Tab") {
        const focusables = sidebarRef.current!.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (!first || !last) return;

        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    };

    let startX = 0;
    let currentX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      currentX = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      const diff = currentX - startX;
      if (diff > 60) onClose();
    };

    const el = sidebarRef.current;
    document.addEventListener("keydown", handleKeyDown);
    el.addEventListener("touchstart", handleTouchStart);
    el.addEventListener("touchmove", handleTouchMove);
    el.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
      el.removeEventListener("touchend", handleTouchEnd);
    };
  }, [open, onClose, sidebarRef, closeButtonRef]);
}
