import axios from "@/lib/axios";
import useSWR from "swr";

export const useProductUserAssign = () => {
    const { data: productUserAssigns, mutate } = useSWR(
        "/api/product-user-assignment",
        () =>
            axios
                .get("/api/product-user-assignment")
                .then((res) => res.data)
                .catch((error) => {
                    if (error.response.status !== 409) throw error;
                })
    );

    return { productUserAssigns, mutate };
};
