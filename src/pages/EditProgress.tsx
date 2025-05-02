import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import Icon from "@/components/icons/Icons";
import Header from "@/components/navigation/Header";
import { MOCK_SCAN_DATA, PROCESS_VALUES } from "@/constants";
import { isMatchingSerial } from "@/utils/compare-serial";
import ProcessDropdown from "@/components/ProcessDropdown";
import ProgressSlider from "@/components/ProgressSlider";
import ProductInfoField from "@/components/inputs/ProductInfoField";
import Button from "@/components/buttons/Button";
import EditProgressSkeleton from "@/components/skeletons/EditProgressSkeleton";
import { Loader2 } from "lucide-react";
import SuccessModal from "@/components/modals/SuccessModal";

// This component allows editing of product progress and current process selection
const EditProgress = () => {
  // Extract serial number from route params
  const { serialNumber = "" } = useParams<{ serialNumber: string }>();

  // Create dropdown options from process constants
  const processes = useMemo(
    () => PROCESS_VALUES.map((v) => ({ label: v, value: v })),
    []
  );

  // Lookup product based on serial number (case-insensitive match)
  const product = useMemo(() => {
    if (!serialNumber) return null;
    return (
      Object.values(MOCK_SCAN_DATA).find((item) =>
        isMatchingSerial(serialNumber, item.serialNumber)
      ) || null
    );
  }, [serialNumber]);

  // Form state
  const [selectedProcess, setSelectedProcess] = useState("");
  const [progress, setProgress] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false); // Loading state while saving
  const [success, setSuccess] = useState(false); // Success state

  // Validate form
  const isValid = selectedProcess.trim() !== "" && progress > 0;

  // Simulate async loading (can replace with real fetch later)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Handle form submission
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

  // Show error if product not found
  if (!product && !loading) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-white dark:bg-zinc-900 text-gray-800 dark:text-white">
        <Header
          title="Edit Progress"
          showBack
          textColorClass="text-gray-800 dark:text-white"
          rightElement={<Icon name="home" />}
        />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">
              Product not found
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Serial number:{" "}
              <code className="text-xs font-mono bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded">
                {serialNumber}
              </code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full overflow-hidden dark:bg-zinc-900">
      <Header
        title="Edit Progress"
        showBack
        textColorClass="text-gray-800 dark:text-white"
        rightElement={<Icon name="home" />}
      />

      <div className="flex-1 p-4 space-y-6 text-gray-800 dark:text-white pb-32">
        <p className="text-sm leading-relaxed">
          Update the current process and progress of the product
        </p>

        {/* Skeleton Loader while loading */}
        {loading ? (
          <EditProgressSkeleton />
        ) : (
          <>
            {/* Static Product Info */}
            <div className="space-y-3 p-4 bg-white dark:bg-zinc-800 rounded-md border border-gray-200 dark:border-zinc-700">
              <div>
                <p className="text-sm font-semibold mb-1 text-primary-700 dark:text-primary-400 tracking-wide">
                  Product information
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 leading-snug">
                  These details are pulled from the scanned QR code and are not
                  editable.
                </p>
              </div>
              <ProductInfoField label="Drawing number" value={serialNumber} />
              <ProductInfoField
                label="Product Name"
                value={product?.productDetails.productName ?? "-"}
              />
            </div>

            {/* Editable Progress Section */}
            <div className="space-y-4 p-4 bg-white dark:bg-zinc-800 rounded-md border border-gray-200 dark:border-zinc-700">
              <div>
                <p className="text-sm font-semibold mb-1 text-primary-700 dark:text-primary-400 tracking-wide">
                  Progress update
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug">
                  Select the current process and update the progress value
                  below.
                </p>
              </div>

              {/* Process dropdown input */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Process <span className="text-red-500">*</span>
                </label>
                <ProcessDropdown
                  value={selectedProcess}
                  onChange={setSelectedProcess}
                  options={processes}
                />
                {submitted && !selectedProcess && (
                  <p className="text-xs text-red-500 mt-1">
                    Process is required.
                  </p>
                )}
              </div>

              {/* Progress slider */}
              <div className="space-y-1">
                <ProgressSlider value={progress} onChange={setProgress} />
                {submitted && progress <= 0 && (
                  <p className="text-xs text-red-500 mt-1">
                    Progress must be greater than 0%.
                  </p>
                )}
              </div>
            </div>
          </>
        )}

        {/* Fixed bottom action bar */}
        <div className="fixed bottom-0 left-0 right-0 px-6 py-4 bg-white  dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-700 flex justify-between gap-3 z-40">
          <Button
            onClick={() => window.history.back()}
            variant="outlined"
            className="w-full max-w-[50%]"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            disabled={!isValid || saving}
            className={`w-full max-w-[50%] ${
              !isValid || saving ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {saving ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </div>
            ) : (
              "Save"
            )}
          </Button>
        </div>

        {/* Success Modal */}
        {success && <SuccessModal onClose={() => setSuccess(false)} />}
      </div>
    </div>
  );
};

export default EditProgress;
