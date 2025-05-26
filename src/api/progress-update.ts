import axios from "@/lib/axios";
import { isAxiosError } from "axios";
import useSWR from "swr";

interface ProgressUpdatePayload {
  processId: string;
  lineNumber: number;
  userId: number;
  percent: number;
  productId: number;
  projectId: number;
}

export const useProgressUpdate = () => {
  const csrf = () => axios.get("/sanctum/csrf-cookie");

  const {
    data: progressUpdates,
    mutate,
    isLoading,
  } = useSWR("/api/progress-update", async () => {
    try {
      const res = await axios.get("/api/progress-update");
      return res.data;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status !== 409) {
        throw error;
      }
    }
  });

  const addProgressUpdate = async (
    data: ProgressUpdatePayload
  ): Promise<boolean> => {
    await csrf();

    try {
      const response = await axios.post("/api/progress-update", data);

      if (import.meta.env.DEV) {
        console.log("Progress updated", response.data);
      }

      await mutate(); // Refresh SWR cache
      return true;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        const { status, data } = error.response;

        if (import.meta.env.DEV) {
          if (status === 422) {
            console.log("Validation error:", data.errors);
          } else if (status === 403) {
            console.log("Unauthorized: Wrong credentials");
          } else {
            console.log("Progress update failed:", status);
          }
        }
      } else if (error instanceof Error) {
        if (import.meta.env.DEV)
          console.log("Unexpected error:", error.message);
      } else {
        if (import.meta.env.DEV) console.log("Unknown error", error);
      }

      return false;
    }
  };

  return {
    progressUpdates,
    isLoading,
    mutate,
    addProgressUpdate,
  };
};
