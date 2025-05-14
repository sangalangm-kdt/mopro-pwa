import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useProduct } from "@/api/product";
import { useProject } from "@/api/project";
import { isMatchingSerial } from "@/utils/compare-serial";
import { Product, Project, Process } from "@/types/editProgress";
import { useAuth } from "@/api/auth";
import { useProgressUpdate } from "@/api/progress-update";

// Extract and convert the `lineNumber` param from the URL
function useLineNumber(): number | null {
  const { lineNumber } = useParams<{ lineNumber?: string }>();
  return useMemo(() => (lineNumber ? +lineNumber : null), [lineNumber]);
}

// Find the project that contains the product with the given line number
function useMatchedProject(lineNumber: number | null): Project | undefined {
  const { projects } = useProject();

  return useMemo(() => {
    if (!projects || lineNumber === null) return undefined;

    return projects.find((project: Project) =>
      project.products.some(
        (product: Product) =>
          isMatchingSerial(String(product.lineNumber), String(lineNumber)) // Ensure string comparison
      )
    );
  }, [projects, lineNumber]);
}

// Transform process data into dropdown options format
function useProcessOptions(processes: Process[] | undefined) {
  return useMemo(() => {
    return (
      processes?.map((v) => ({
        label: v.processList.name,
        value: v.processList.id,
      })) ?? []
    );
  }, [processes]);
}

// handles edit progress form logic
export function useEditProgress() {
  const { addProgressUpdate } = useProgressUpdate();
  const user = useAuth().user.data;

  const lineNumber = useLineNumber(); // Extracted from route
  const { product } = useProduct(lineNumber ?? 0); // Fetch individual product data
  const matchedProject = useMatchedProject(lineNumber); // Identify the project
  const processes = useProcessOptions(matchedProject?.process); // Format for dropdown

  // Form state management
  const [selectedProcess, setSelectedProcess] = useState("");
  const [progress, setProgress] = useState(0);
  const [submitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  // Validation: user must select a process and progress must be > 0
  const isValid = selectedProcess !== "" && progress > 0;
  console.log(selectedProcess);
  // Simulate initial loading state
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Handle form submit/save
  const handleSave = async () => {
    if (!isValid || !product || lineNumber === null) return;

    setSaving(true);

    const success = await addProgressUpdate({
      processId: selectedProcess,
      lineNumber: lineNumber!, // ✅ ensure type safety
      userId: user.id,
      percent: progress,
      product_id: product.id,
      project_id: product.projectId,
    });

    console.log("Saving progress for:", {
      lineNumber,
      selectedProcess,
      progress,
    });

    if (success) {
      setSuccess(true);
    }

    setSaving(false);
  };

  return {
    lineNumber,
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
