import { useEditProgress } from "@/hooks/edit-progress";
import Icon from "@/components/icons/Icons";
import Header from "@/components/navigation/Header";
import ProcessDropdown from "@/components/ProcessDropdown";
import ProgressSlider from "@/components/ProgressSlider";
import ProductInfoField from "@/components/inputs/ProductInfoField";
import Button from "@/components/buttons/Button";
import EditProgressSkeleton from "@/components/skeletons/EditProgressSkeleton";
import { Loader2 } from "lucide-react";
import SuccessModal from "@/components/modals/SuccessModal";
import { formatDate } from "@/utils/format-date";
import { ROUTES } from "@/constants";
import { useNavigate } from "react-router-dom"; // ✅ make sure this import is present

const EditProgress = () => {
  const {
    lineNumber,
    product,
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
  } = useEditProgress();

  const navigate = useNavigate();

  if (loading || !product) {
    return (
      <div className="flex flex-col min-h-screen w-full dark:bg-zinc-900">
        <Header
          title="Edit Progress"
          showBack
          textColorClass="text-gray-800 dark:text-white"
          rightElement={
            <button
              onClick={() => navigate(ROUTES.HOME)}
              className="p-1 cursor-pointer"
              aria-label="Go to home"
            >
              <Icon name="home" />
            </button>
          }
        />
        <div className="flex-1 p-4">
          <EditProgressSkeleton />
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
        rightElement={
          <button
            onClick={() => navigate(ROUTES.HOME)}
            className="p-1 cursor-pointer"
            aria-label="Go to home"
          >
            <Icon name="home" />
          </button>
        }
      />

      <div className="flex-1 p-4 space-y-6 text-gray-800 dark:text-white pb-32">
        <p className="text-sm leading-relaxed">
          Update the current process and progress of the product
        </p>

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
          <ProductInfoField label="Drawing number" value={String(lineNumber)} />
          <ProductInfoField
            label="Product Name"
            value={product?.productList.name ?? "-"}
          />
        </div>

        <div className="space-y-4 p-4 bg-white dark:bg-zinc-800 rounded-md border border-gray-200 dark:border-zinc-700">
          <div>
            <p className="text-sm font-semibold mb-1 text-primary-700 dark:text-primary-400 tracking-wide">
              Progress update
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug">
              Select the current process and update the progress value below.
            </p>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Process <span className="text-red-500">*</span>
            </label>
            <ProcessDropdown
              value={selectedProcess}
              onChange={(val) => {
                setSelectedProcess(val);

                // Try to find the latest matching progress entry for this process
                const matchingEntry = product?.previousProgress?.find(
                  (entry: { process: { id: unknown } }) =>
                    String(entry.process.id) === val
                );

                if (matchingEntry) {
                  setProgress(matchingEntry.percent); // ✅ has previous progress
                } else {
                  setProgress(0); // 🔁 reset if none
                }
              }}
              options={product.processes}
            />

            {submitted && !selectedProcess && (
              <p className="text-xs text-red-500 mt-1">Process is required.</p>
            )}
          </div>

          <div className="space-y-1">
            <ProgressSlider value={progress} onChange={setProgress} />
            {submitted && progress <= 0 && (
              <p className="text-xs text-red-500 mt-1">
                Progress must be greater than 0%.
              </p>
            )}
          </div>
          {product.updatedAt && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Last Updated:{" "}
              <span className="font-semibold">
                {formatDate(product.updatedAt)}
              </span>
            </p>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 px-6 py-4 bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-700 flex justify-between gap-3 z-40">
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

      {success && <SuccessModal onClose={() => setSuccess(false)} />}
    </div>
  );
};

export default EditProgress;
