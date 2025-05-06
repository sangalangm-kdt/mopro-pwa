import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { MOCK_SCAN_DATA, PROCESS_VALUES } from "@/constants";
import { isMatchingSerial } from "@/utils/compare-serial";

export function useEditProgress() {
  // Get serial number from route
  const { serialNumber = "" } = useParams<{ serialNumber: string }>();

  // Generate dropdown options
  const processes = useMemo(
    () => PROCESS_VALUES.map((v) => ({ label: v, value: v })),
    []
  );

  // Lookup product info by serial number
  const product = useMemo(() => {
    if (!serialNumber) return null;
    return (
      Object.values(MOCK_SCAN_DATA).find((item) =>
        isMatchingSerial(serialNumber, item.serialNumber)
      ) || null
    );
  }, [serialNumber]);

  // Form states
  const [selectedProcess, setSelectedProcess] = useState("");
  const [progress, setProgress] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Validation
  const isValid = selectedProcess.trim() !== "" && progress > 0;

  // Simulate loading (e.g., fetching from API)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Handle form submit/save
  const handleSave = () => {
    setSubmitted(true);
    if (!isValid) return;

    setSaving(true);
    setTimeout(() => {
      console.log("Saving progress for:", {
        serialNumber,
        selectedProcess,
        progress,
      });
      setSaving(false);
      setSuccess(true);
    }, 1000);
  };

  return {
    serialNumber,
    product: product ? { ...product, processes } : null,
    loading,
    saving,
    success,
    submitted,
    selectedProcess,
    progress,
    setSelectedProcess,
    setProgress,
    setSuccess,
    handleSave,
    isValid,
  };
}
