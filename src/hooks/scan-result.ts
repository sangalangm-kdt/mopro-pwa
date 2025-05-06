import { useEffect, useRef, useState } from "react";
import { MOCK_SCAN_DATA, SCAN_RESULT_CONFIG } from "@/constants";
import {
  getOverviewFields,
  getProductDetailsFields,
} from "@/constants/variables/fields";
import { isMatchingSerial } from "@/utils/compare-serial";
import { ScanResult as ParsedResult } from "@/constants";

export function useScanResult(qrData: string, onClose: () => void) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const startY = useRef<number | null>(null);

  const foundEntry = Object.values(MOCK_SCAN_DATA).find((item) =>
    isMatchingSerial(qrData, item.serialNumber)
  );

  const parsed: ParsedResult = foundEntry ?? {
    error: "No data found for this serial number",
  };

  const overviewFields = getOverviewFields(parsed);
  const productDetailsFields = getProductDetailsFields(parsed);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, [qrData]);

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startY.current === null) return;

    const endY = e.changedTouches[0].clientY;
    const diffY = endY - startY.current;

    if (!expanded && diffY > SCAN_RESULT_CONFIG.COLLAPSE_THRESHOLD) {
      onClose();
    } else if (diffY < SCAN_RESULT_CONFIG.EXPAND_THRESHOLD) {
      setExpanded(true);
    }

    startY.current = null;
  };

  const handleOverlayClick = () => {
    if (!expanded) onClose();
  };

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
