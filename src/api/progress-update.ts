import axios from "@/lib/axios";
import useSWR from "swr";

export const useProgressUpdate = () => {
    const csrf = () => axios.get("/sanctum/csrf-cookie");

    const {
        data: progressUpdates,
        mutate,
        isLoading,
    } = useSWR("/api/progress-update", () =>
        axios
            .get("/api/progress-update")
            .then((res) => res.data)
            .catch((error) => {
                if (error.response.status !== 409) throw error;
            })
    );

    const addProgressUpdate = async (data) => {
        await csrf();

        try {
            const response = await axios.post("/api/progress-update", data);
            console.log("Progress updated", response.data);

            // Revalidate user after login
            await mutate();
            return true;
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;

                if (status === 422) {
                    console.log("Validation error:", data.errors);
                } else if (status === 403) {
                    console.log("Unauthorized: Wrong credentials");
                } else {
                    console.log("Login failed:", status);
                }
            } else if (error instanceof Error) {
                console.log("Unexpected error:", error.message);
            } else {
                console.log("Unknown error", error);
            }
            return false;
        }
    };
    return { progressUpdates, isLoading, mutate, addProgressUpdate };
};
