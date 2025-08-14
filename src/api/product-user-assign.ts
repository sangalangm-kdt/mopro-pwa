// src/api/product-user-assign.ts
import axios from "@/lib/axios";
import useSWR from "swr";

export type ProductUserAssign = any; // type it later if you know exact shape

export const useProductUserAssign = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/product-user-assignment",
    async () => {
      const res = await axios.get("/api/product-user-assignment");
      // if your API wraps data, adjust to res.data.data
      return res.data as ProductUserAssign[];
    }
  );

  return { productUserAssigns: data ?? [], isLoading, error, mutate };
};
