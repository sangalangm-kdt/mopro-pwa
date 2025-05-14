import { useEffect, useRef, useState, useMemo } from "react";
import { SCAN_RESULT_CONFIG } from "@/constants";
import {
  getOverviewFields,
  getProductDetailsFields,
} from "@/constants/variables/fields";
import { isMatchingSerial } from "@/utils/compare-serial";
import type { Project, Product, ScanResult } from "@/types/scan";

export function useScanResult(
  qrData: string,
  onClose: () => void,
  projects?: Project[],
  progress?: Product[]
) {
  // Find the matching project based on scanned QR code
  const matchedProject = useMemo(() => {
    return projects?.find((project) =>
      project.products.some((product) =>
        isMatchingSerial(product.lineNumber, qrData)
      )
    );
  }, [projects, qrData]);

  const matchedProgress = useMemo(() => {
    return progress?.filter((progress) =>
      isMatchingSerial(progress.lineNumber, qrData)
    );
  }, [progress, qrData]);
  console.log(matchedProgress);

  //  Find the specific product within the matched project
  const matchedProduct = useMemo(() => {
    return matchedProject?.products.find((product) =>
      isMatchingSerial(product.lineNumber, qrData)
    );
  }, [matchedProject, qrData]);

  // UI state: whether the result sheet is expanded or still loading
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const startY = useRef<number | null>(null);

  // Construct parsed scan result or error
  const parsed: ScanResult =
    matchedProject && matchedProduct
      ? {
          lineNumber: matchedProduct.lineNumber,
          serialNumber: matchedProduct.lineNumber,
          orderNumber: matchedProject.orderNumber,
          name: matchedProject.name,
          updatedAt: matchedProject.updatedAt,
          remarks: matchedProject.remarks,
          productDetails: matchedProduct,
        }
      : {
          error: "No data found for this serial number",
        };

  // Extract UI field groups from parsed data
  const overviewFields = getOverviewFields(parsed);
  const productDetailsFields =
    "error" in parsed ? [] : getProductDetailsFields(parsed.productDetails);

  //  Fake loading delay to simulate processing/animation
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
