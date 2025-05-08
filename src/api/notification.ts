import axios from "@/lib/axios";
import useSWR from "swr";

export const useNotification = () => {
    const { data: notifications, mutate } = useSWR("/api/notification", () =>
        axios
            .get("/api/notification")
            .then((res) => res.data)
            .catch((error) => {
                if (error.response.status !== 409) throw error;
            })
    );

    return { notifications, mutate };
};
