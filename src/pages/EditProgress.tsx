import Button from "@/components/buttons/Button";
import Icon from "@/components/icons/Icons";
import ProductInfoField from "@/components/inputs/ProductInfoField";
import SuccessModal from "@/components/modals/SuccessModal";
import Header from "@/components/navigation/Header";
import ProcessDropdown from "@/components/ProcessDropdown";
import ProgressSlider from "@/components/ProgressSlider";
import EditProgressSkeleton from "@/components/skeletons/EditProgressSkeleton";
import { EDIT_PROGRESS_TEXT_KEYS, ROUTES } from "@/constants";
import { useEditProgress } from "@/hooks/edit-progress";
import { formatDate } from "@/utils/format-date";
import { useLocalizedText } from "@/utils/localized-text";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const EditProgress = () => {
  const {
    percentage,
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

  const TEXT = useLocalizedText("common", EDIT_PROGRESS_TEXT_KEYS);
  const navigate = useNavigate();
  const [highlight, setHighlight] = useState(false);

  if (loading || !product) {
    return (
      <div className="flex flex-col min-h-screen w-full dark:bg-zinc-900 scrollbar">
        <Header
          title={TEXT.TITLE}
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
    <div className="flex flex-col min-h-screen w-full overflow-hidden scrollbar">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-700">
        <Header
          title={TEXT.TITLE}
          showBack
          textColorClass="text-gray-800 dark:text-white"
          rightElement={
            <button
              onClick={() => navigate(ROUTES.HOME)}
              className="p-1 cursor-pointer"
              aria-label="Go to home"
            >
              <Icon name="home" className="w-7 h-7" />
            </button>
          }
        />
      </div>

      <div className="flex-1 p-4 pt-24 space-y-6 text-gray-800 dark:text-white pb-32 scrollbar">
        <p className="text-base leading-relaxed">{TEXT.SUBTITLE}</p>

        <div className="space-y-3 p-4 bg-white dark:bg-zinc-800 rounded-md border border-gray-200 dark:border-zinc-700">
          <div>
            <p className="text-base font-semibold mb-1 text-primary-700 dark:text-primary-400 tracking-wide">
              {TEXT.PRODUCT_INFO_TITLE}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 leading-snug">
              {TEXT.PRODUCT_INFO_NOTE}
            </p>
          </div>
          <ProductInfoField
            label={TEXT.DRAWING_NUMBER}
            value={String(lineNumber)}
          />
          <ProductInfoField
            label={TEXT.PRODUCT_NAME}
            value={product?.productList.name ?? "-"}
          />
        </div>

        <div className="space-y-4 p-4 bg-white dark:bg-zinc-800 rounded-md border border-gray-200 dark:border-zinc-700">
          <div>
            <p className="text-base font-semibold mb-1 text-primary-700 dark:text-primary-400 tracking-wide">
              {TEXT.PROGRESS_TITLE}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-snug">
              {TEXT.PROGRESS_NOTE}
            </p>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {TEXT.PROCESS_LABEL} <span className="text-red-500">*</span>
            </label>
            <ProcessDropdown
              value={selectedProcess}
              onChange={(val) => {
                setSelectedProcess(val);
                const matchingEntry = product?.previousProgress?.find(
                  (entry: { process: { id: unknown } }) =>
                    String(entry.process.id) === val
                );
                if (matchingEntry) {
                  setProgress(matchingEntry.percent);
                } else {
                  setProgress(0);
                }
                setHighlight(true);
                setTimeout(() => setHighlight(false), 800);
              }}
              options={product.processes}
            />
            {submitted && !selectedProcess && (
              <p className="text-xs text-red-500 mt-1">
                {TEXT.PROCESS_REQUIRED}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <ProgressSlider
              percentage={percentage}
              value={progress}
              onChange={setProgress}
              highlight={highlight}
            />
            {submitted && progress <= 0 && (
              <p className="text-xs text-red-500 mt-1">
                {TEXT.PROGRESS_REQUIRED}
              </p>
            )}
          </div>

          {product.updatedAt && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {TEXT.LAST_UPDATED}{" "}
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
          {TEXT.CANCEL}
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
              <Loader2 className="w-4 h-4 animate-spin" />
              {TEXT.SAVING}
            </div>
          ) : (
            TEXT.SAVE
          )}
        </Button>
      </div>

      {success && <SuccessModal onClose={() => setSuccess(false)} />}
    </div>
  );
};

export default EditProgress;
