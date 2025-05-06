import axios from "@/lib/axios";
import useSWR from "swr";

export const useAuth = () => {
    const csrf = () => axios.get("/sanctum/csrf-cookie");

    const {
        data: user,
        error,
        mutate,
        isLoading,
    } = useSWR("/api/user", () =>
        axios
            .get("/api/user")
            .then((res) => res.data)
            .catch((error) => {
                if (error.response.status !== 409) throw error;
            })
    );

    const login = async (data: {
        email: string;
        password: string;
    }): Promise<boolean> => {
        await csrf();

        try {
            const response = await axios.post("/login", data);
            console.log("Login success", response.data);

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
            } else {
                console.log("Unexpected error:", error.message);
            }
            return false;
        }
    };

    const setTimezone = async (): Promise<void> => {
        try {
            await csrf();

            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const response = await axios.post("/set-timezone", { timezone });
            console.log("Timezone set:", response.data);
            console.log(user.created_at);
            const date = new Date(user.created_at);
            console.log(
                date.toLocaleString("en-US", {
                    timeZone: timezone,
                    timeZoneName: "short",
                })
            );
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;

                if (status === 422) {
                    console.log("Validation error:", data.errors);
                } else if (status === 403) {
                    console.log("Unauthorized");
                } else {
                    console.log("Failed to set timezone:", status);
                }
            } else {
                console.log("Unexpected error:", error.message);
            }
        }
    };

    return { user, mutate, isLoading, login, setTimezone };
};
