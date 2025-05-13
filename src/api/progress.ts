import axios from "@/lib/axios";
import useSWR from "swr";

export const useProgress = () => {
    const csrf = () => axios.get("/sanctum/csrf-cookie");

    const { data: progress, mutate } = useSWR("/api/progress", () =>
        axios
            .get("/api/progress")
            .then((res) => res.data)
            .catch((error) => {
                if (error.response.status !== 409) throw error;
            })
    );

    const addProgress = async (data) => {
        await csrf();

        try {
            const response = await axios.post("/api/progress", data);
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
    return { progress, mutate, addProgress };
};
