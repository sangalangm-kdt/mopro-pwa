import { useEffect, useRef, useState, useMemo } from "react";
import { SCAN_RESULT_CONFIG } from "@/constants";
import {
  getOverviewFields,
  getProductDetailsFields,
} from "@/constants/variables/fields";
import { isMatchingSerial } from "@/utils/compare-serial";
import type {
  RawProgressEntry,
  Project,
  Product,
  ScanResult,
} from "@/types/scan";

import { useIsMobile } from "./is-mobile-screen";

export function useScanResult(
  qrData: string,
  onClose: () => void,
  projects?: Project[],
  progress?: RawProgressEntry[],
  labels: Record<string, string> = {} // ✅ fixed: always pass a default empty object
) {
  const isMobile = useIsMobile();
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const startY = useRef<number | null>(null);

  const matchedProject = useMemo(() => {
    return projects?.find((project) =>
      project.products.some((product) =>
        isMatchingSerial(product.lineNumber, qrData)
      )
    );
  }, [projects, qrData]);

  const matchedProduct: Product | undefined = useMemo(() => {
    return matchedProject?.products.find((product) =>
      isMatchingSerial(product.lineNumber, qrData)
    );
  }, [matchedProject, qrData]);

  const matchedProgress = useMemo(() => {
    return progress
      ?.filter((entry) => isMatchingSerial(entry.product?.lineNumber, qrData))
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
  }, [progress, qrData]);

  const latestProgress = matchedProgress?.[0];

  const reconstructedProduct: Product | undefined = useMemo(() => {
    if (!matchedProduct) return undefined;

    return {
      lineNumber: String(matchedProduct.lineNumber),
      weight: matchedProduct.weight,
      remarks: matchedProduct.remarks,
      lastModifiedBy: latestProgress
        ? `${latestProgress.user.firstName} ${latestProgress.user.lastName}`
        : "-",
      currentProcess: latestProgress
        ? latestProgress.process.processList.name
        : matchedProduct.currentProcess,
      percent:
        typeof latestProgress?.percent === "number"
          ? latestProgress.percent
          : matchedProduct.percent ?? 0,
      productList: {
        name: matchedProduct.productList.name,
      },
    };
  }, [matchedProduct, latestProgress]);

  const parsed: ScanResult =
    matchedProject && reconstructedProduct
      ? {
          lineNumber: reconstructedProduct.lineNumber,
          serialNumber: reconstructedProduct.lineNumber,
          orderNumber: matchedProject.orderNumber,
          percent: reconstructedProduct.percent,
          name: matchedProject.name,
          updatedAt: new Date(latestProgress?.updatedAt ?? "Date is not set"),
          remarks: matchedProject.remarks,
          productDetails: reconstructedProduct,
        }
      : {
          error: "No data found for this drawing number.",
        };

  const overviewFields = getOverviewFields(parsed, labels);
  const productDetailsFields =
    "error" in parsed
      ? []
      : getProductDetailsFields(parsed.productDetails, labels);

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
    handleTouchStart: isMobile ? handleTouchStart : undefined,
    handleTouchEnd: isMobile ? handleTouchEnd : undefined,
    handleOverlayClick,
    toggleExpanded,
    isMobile,
  };
}
