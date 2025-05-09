import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { isMatchingSerial } from "@/utils/compare-serial";
import { useProduct } from "@/api/product";
import { useProject } from "@/api/project";

export function useEditProgress() {
    // Get serial number from route
    const { lineNumber } = useParams<{ lineNumber: string }>();

    // Data fetching
    const { product } = useProduct(+lineNumber);
    const { projects } = useProject();
    // const {addProgress} = useProgress();
    // console.log(projects);
    console.log(projects[0]);
    console.log(product);

    const matchedProject = useMemo(() => {
        return projects?.find((project) =>
            project.products.some((product) =>
                isMatchingSerial(product.lineNumber, +lineNumber)
            )
        );
    }, [projects]);

    // Generate dropdown options
    const processes = useMemo(
        () =>
            matchedProject?.process.map((v) => ({
                label: v.processList.name,
                value: v.processList.name,
            })),
        []
    );

    // Form states
    const [selectedProcess, setSelectedProcess] = useState("");
    const [progress, setProgress] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    console.log(selectedProcess);
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
                lineNumber,
                selectedProcess,
                progress,
            });
            setSaving(false);
            setSuccess(true);
        }, 1000);
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
