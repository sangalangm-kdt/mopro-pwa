import axios from "@/lib/axios";
import useSWR from "swr";

export const useProject = () => {
    const { data: projects, mutate } = useSWR("/api/project?columns", () =>
        axios
            .get("/api/project?columns")
            .then((res) => res.data)
            .catch((error) => {
                if (error.response.status !== 409) throw error;
            })
    );

    return { projects, mutate };
};
