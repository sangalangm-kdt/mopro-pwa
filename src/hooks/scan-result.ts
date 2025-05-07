import { useEffect, useRef, useState } from "react";
import { MOCK_SCAN_DATA, SCAN_RESULT_CONFIG } from "@/constants";
import {
  getOverviewFields,
  getProductDetailsFields,
} from "@/constants/variables/fields";
import { isMatchingSerial } from "@/utils/compare-serial";
import { ScanResult as ParsedResult } from "@/constants";

// Custom hook for handling QR scan result logic
export function useScanResult(qrData: string, onClose: () => void) {
  const [expanded, setExpanded] = useState(false); // Controls expanded state of scan result card
  const [loading, setLoading] = useState(true); // Controls loading state
  const startY = useRef<number | null>(null); // Track touch start Y position for swipe detection

  // Try to find a matching entry from mock data based on the scanned QR data
  const foundEntry = Object.values(MOCK_SCAN_DATA).find((item) =>
    isMatchingSerial(qrData, item.serialNumber)
  );

  // Parsed result to display – either found data or error message
  const parsed: ParsedResult = foundEntry ?? {
    error: "No data found for this serial number",
  };

  // Get structured field groups for display
  const overviewFields = getOverviewFields(parsed);
  const productDetailsFields = getProductDetailsFields(parsed);

  // Simulate loading delay (especially useful in development for visual feedback)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, [qrData]);

  // Record the Y-position of initial touch
  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };

  // Handle touch end to detect swipe gestures
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startY.current === null) return;

    const endY = e.changedTouches[0].clientY;
    const diffY = endY - startY.current;

    if (!expanded && diffY > SCAN_RESULT_CONFIG.COLLAPSE_THRESHOLD) {
      // Swipe down to close if not expanded
      onClose();
    } else if (diffY < SCAN_RESULT_CONFIG.EXPAND_THRESHOLD) {
      // Swipe up to expand
      setExpanded(true);
    }

    startY.current = null; // Reset touch start reference
  };

  // Clicking the background overlay closes the result if not expanded
  const handleOverlayClick = () => {
    if (!expanded) onClose();
  };

  // Toggle expand/collapse manually (e.g., by tapping a button)
  const toggleExpanded = () => setExpanded((prev) => !prev);

  return {
    expanded,
    loading,
    parsed,
    overviewFields,
    productDetailsFields,
    handleTouchStart,
    handleTouchEnd,
    handleOverlayClick,
    toggleExpanded,
  };
}
