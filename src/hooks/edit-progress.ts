import { useAuth } from "@/api/auth";
import { useProduct } from "@/api/product";
import { useProgressUpdate } from "@/api/progress-update";
import { useProject } from "@/api/project";
import { Process, Product, Project } from "@/types/editProgress";
import type { RawProgressEntry } from "@/types/scan"; // make sure this matches your actual type location
import { isMatchingSerial } from "@/utils/compare-serial";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

// Extract line number from URL
function useLineNumber(): number | null {
    const { lineNumber } = useParams<{ lineNumber?: string }>();
    return useMemo(() => (lineNumber ? +lineNumber : null), [lineNumber]);
}

// Match project by lineNumber
function useMatchedProject(lineNumber: number | null): Project | undefined {
    const { projects } = useProject();
    return useMemo(() => {
        if (!projects || lineNumber === null) return undefined;
        return projects.find((project: Project) =>
            project.products.some((product: Product) =>
                isMatchingSerial(String(product.lineNumber), String(lineNumber))
            )
        );
    }, [projects, lineNumber]);
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
    const { addProgressUpdate, progressUpdates } = useProgressUpdate();

    const user = useAuth().user.data;

    const lineNumber = useLineNumber();
    const { products } = useProduct();
    const matchedProject = useMatchedProject(lineNumber);

    // Get the specific product
    const product = products?.find(
        (p: Product) => String(p.lineNumber) === String(lineNumber)
    );

    const progresses = useMemo(() => {
        return progressUpdates
            ?.filter((entry: RawProgressEntry) =>
                isMatchingSerial(
                    String(entry.product?.lineNumber),
                    String(lineNumber)
                )
            )
            .sort(
                (a: RawProgressEntry, b: RawProgressEntry) =>
                    new Date(b.updatedAt).getTime() -
                    new Date(a.updatedAt).getTime()
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
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    const isValid = selectedProcess !== "" && progress > 0;

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const handleSave = async () => {
        setSubmitted(true);
        if (!isValid || !lineNumber || !product?.id || !matchedProject?.id)
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
            (progress) => progress.processId == selectedProcess
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
                              isMatchingSerial(
                                  entry.product?.lineNumber,
                                  product.lineNumber
                              )
                      ) ?? [],
              }
            : null,
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
