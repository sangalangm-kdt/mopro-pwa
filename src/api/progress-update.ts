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

  const { data: progressUpdates, mutate } = useSWR("/api/progress-update", () =>
    axios
      .get("/api/progress-update")
      .then((res) => res.data)
      .catch((error: unknown) => {
        const err = error as ApiError;
        if (err.response?.status !== 409) throw err;
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
      const err = error as ApiError;

      if (err.response) {
        const { status, data } = err.response;

        if (status === 422) {
          console.log("Validation error:", data?.errors);
        } else if (status === 403) {
          console.log("Unauthorized: Wrong credentials");
        } else {
          console.log("Login failed:", status);
        }
      } else if (err instanceof Error) {
        console.log("Unexpected error:", err.message);
      } else {
        console.log("Unknown error", err);
      }

      return false;
    }
  };

  return { progressUpdates, mutate, addProgressUpdate };
};
