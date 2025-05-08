import axios from "@/lib/axios";
import useSWR from "swr";

export const useProduct = () => {
  const { data: products, mutate } = useSWR("/api/product", () =>
    axios
      .get("/api/product")
      .then((res) => res.data)
      .catch((error) => {
        if (error.response.status !== 409) throw error;
      })
  );

  return { products, mutate };
};
