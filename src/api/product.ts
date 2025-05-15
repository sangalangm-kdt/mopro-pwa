import axios from "@/lib/axios";
import useSWR from "swr";

export const useProduct = () => {
    const {
        data: products,
        mutate: mutateProducts,
        error: productsError,
    } = useSWR("/api/product", () =>
        axios
            .get("/api/product")
            .then((res) => res.data)
            .catch((error) => {
                if (error.response.status !== 409) throw error;
            })
    );

    // const {
    //     data: product,
    //     mutate: mutateProduct,
    //     error: productError,
    // } = useSWR(`/api/product/${lineNumber}`, () =>
    //     axios
    //         .get(`/api/product/${lineNumber}`)
    //         .then((res) => res.data)
    //         .catch((error) => {
    //             if (error.response.status !== 409) throw error;
    //         })
    // );

    return {
        products,
        // product,
        // mutateProduct,
        mutateProducts,
        // productError,
        productsError,
    };
};
