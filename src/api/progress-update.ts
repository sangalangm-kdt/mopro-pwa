import axios from "@/lib/axios";
import useSWR from "swr";

interface ProgressUpdatePayload {
  processId: string;
  lineNumber: number;
  userId: number;
  percent: number;
  product_id: number;
  project_id: number;
}

interface ApiError {
  response?: {
    status: number;
    data?: {
      errors?: Record<string, string[]>;
    };
  };
  message?: string;
}

export const useProgressUpdate = () => {
  const csrf = () => axios.get("/sanctum/csrf-cookie");

  const {
    data: progressUpdates,
    mutate,
    isLoading,
  } = useSWR("/api/progress-update", () =>
    axios
      .get("/api/progress-update")
      .then((res) => res.data)
      .catch((error) => {
        if (error.response.status !== 409) throw error;
      })
  );

  const addProgressUpdate = async (
    data: ProgressUpdatePayload
  ): Promise<boolean> => {
    await csrf();

    try {
      const response = await axios.post("/api/progress-update", data);
      console.log("Progress updated", response.data);

      await mutate();
      return true;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const { status, data } = error.response;

        if (status === 422) {
          console.log("Validation error:", data?.errors);
        } else if (status === 403) {
          console.log("Unauthorized: Wrong credentials");
        } else {
          console.log("Request failed:", status);
        }
      } else if (error instanceof Error) {
        console.log("Unexpected error:", error.message);
      } else {
        console.log("Unknown error", error);
      }
      return false;
    }
  };

  return { progressUpdates, isLoading, mutate, addProgressUpdate };
};
