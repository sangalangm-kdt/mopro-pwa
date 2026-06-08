import { useAuthContext } from "@/context/auth/useAuth";
import { useProduct } from "@/api/product";
import { useProgressUpdate } from "@/api/progress-update";
import { useProject } from "@/api/project";
import { Process, Product, Project } from "@/types/editProgress";
import type { RawProgressEntry } from "@/types/scan";
import { isMatchingSerial } from "@/utils/compare-serial";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

// Extract line number from URL
function useLineNumber(): string | null {
  const { lineNumber } = useParams<{ lineNumber?: string }>();
  return useMemo(() => lineNumber ?? null, [lineNumber]);
}

// Format process options for dropdown
function useProcessOptions(processes: Process[] | undefined) {
  return useMemo(() => {
    return (
      processes?.map((v) => ({
        label: v.processList.name,
        value: String(v.id),
      })) ?? []
    );
  }, [processes]);
}

// Main logic
export function useEditProgress() {
  const {
    addProgressUpdate,
    progressUpdates,
    isLoading: progressUpdatesLoading,
    error: progressUpdatesError,
  } = useProgressUpdate();

  const { user } = useAuthContext();

  const lineNumber = useLineNumber();
  const {
    products,
    isLoading: productsLoading,
    error: productsError,
  } = useProduct();
  const {
    projects,
    isLoading: projectsLoading,
    error: projectsError,
  } = useProject();
  const matchedProject = useMemo(() => {
    if (!projects || !lineNumber) return undefined;
    return projects.find((project: Project) =>
      project.products.some((product: Product) =>
        isMatchingSerial(product.lineNumber, lineNumber)
      )
    );
  }, [projects, lineNumber]);

  // Get the specific product
  const product = products?.find(
    (p: Product) => String(p.lineNumber) === String(lineNumber)
  );

  const progresses = useMemo(() => {
    return progressUpdates
      ?.filter((entry: RawProgressEntry) =>
        isMatchingSerial(String(entry.product?.lineNumber), String(lineNumber))
      )
      .sort(
        (a: RawProgressEntry, b: RawProgressEntry) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
  }, [progressUpdates, lineNumber]);
  const latestProgress = progresses?.[0];

  const processes = useProcessOptions(matchedProject?.process);

  const [selectedProcess, setSelectedProcess] = useState<string>(
    () => latestProgress?.process?.id?.toString() ?? ""
  );

  console.log("Selected Process:", selectedProcess);
  const [progress, setProgress] = useState(() =>
    typeof latestProgress?.percent === "number"
      ? latestProgress.percent
      : typeof product?.progress === "number"
      ? product.progress
      : 0
  );
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const loading = productsLoading || projectsLoading || progressUpdatesLoading;
  const error = productsError || projectsError || progressUpdatesError;
  const errorMessage = error
    ? "Unable to load product information. Please check your connection and try again."
    : !loading && !product
      ? "Unable to load product information."
      : "";
  const isValid = !error && selectedProcess !== "" && progress > 0;

  const handleSave = async () => {
    setSubmitted(true);
    if (
      error ||
      !isValid ||
      !lineNumber ||
      !product?.id ||
      !matchedProject?.id ||
      !user
    )
      return;

    setSaving(true);
    const success = await addProgressUpdate({
      processId: selectedProcess,
      lineNumber,
      userId: user.id,
      percent: progress,
      projectId: matchedProject.id,
      productId: product.id,
    });

    if (success) setSuccess(true);
    setSaving(false);
  };

  const percentage =
    progresses?.filter(
      (progress: { processId: string }) => progress.processId == selectedProcess
    )[0]?.percent ?? 0;

  return {
    percentage,
    lineNumber,
    product: product
      ? {
          ...product,
          updatedAt: latestProgress?.updatedAt,
          processes,
          previousProgress:
            progressUpdates?.filter(
              (entry: { product: { lineNumber: string } }) =>
                isMatchingSerial(entry.product?.lineNumber, product.lineNumber)
            ) ?? [],
        }
      : null,
    loading,
    error,
    errorMessage,
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
