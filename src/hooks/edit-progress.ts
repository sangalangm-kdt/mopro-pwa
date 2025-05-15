import { useAuth } from "@/api/auth";
import { useProduct } from "@/api/product";
import { useProgressUpdate } from "@/api/progress-update";
import { useProject } from "@/api/project";
import { Process, Product, Project } from "@/types/editProgress";
import { isMatchingSerial } from "@/utils/compare-serial";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

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
                    isMatchingSerial(
                        String(product.lineNumber),
                        String(lineNumber)
                    ) // Ensure string comparison
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

    const { products } = useProduct(); // Fetch individual product data
    const product = products?.find((p) => p.lineNumber === lineNumber); // Find the product by line number
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

    // Simulate initial loading state
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    // Handle form submit/save
    const handleSave = async () => {
        if (!isValid) return;
        setSaving(true);
        const success = await addProgressUpdate({
            processId: selectedProcess,
            lineNumber: lineNumber,
            userId: user.id,
            percent: progress,
            projectId: matchedProject?.id,
            productId: product.id,
        });
        console.log({
            projectId: matchedProject?.id,
            productId: product.id,
            processId: selectedProcess,
            lineNumber: lineNumber,
            userId: user.id,
            percent: progress,
        });

        if (success) {
            console.log("Saving progress for:", {
                lineNumber,
                selectedProcess,
                progress,
            });

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
