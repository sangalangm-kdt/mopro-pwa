import axios from "@/lib/axios";
import useSWR from "swr";

export const useProduct = (id?: number) => {
  const {
    data: products,
    mutate: mutateProducts,
    error: productsError,
    isLoading,
  } = useSWR("/api/product", () =>
    axios
      .get("/api/product")
      .then((res) => res.data)
      .catch((error) => {
        if (error.response.status !== 409) throw error;
      })
  );

  const {
    data: product,
    mutate: mutateProduct,
    error: productError,
  } = useSWR(`/api/product/${id}`, () =>
    axios
      .get(`/api/product/${id}`)
      .then((res) => res.data)
      .catch((error) => {
        if (error.response.status !== 409) throw error;
      })
  );

  return {
    products,
    product,
    mutateProduct,
    mutateProducts,
    productError,
    productsError,
    isLoading,
  };
};
