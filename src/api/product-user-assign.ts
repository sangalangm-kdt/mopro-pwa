// src/api/product-user-assign.ts
import axios from "@/lib/axios";
import useSWR from "swr";

export const useProductUserAssign = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/product-user-assignment",
    async () => {
      const res = await axios.get("/api/product-user-assignment");
      // if your API wraps data, adjust to res.data.data
      return res.data;
    }
  );

  return { productUserAssigns: data ?? [], isLoading, error, mutate };
};
