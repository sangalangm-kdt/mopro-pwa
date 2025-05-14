import axios from "@/lib/axios";
import useSWR from "swr";

interface ProgressPayload {
  processId: string;
  progress: number;
  // Add more fields if needed
}

interface ApiError {
  response?: {
    status: number;
    data?: {
      errors?: Record<string, string[]>;
    };
  };
}

export const useProgress = () => {
  const csrf = () => axios.get("/sanctum/csrf-cookie");

  const {
    data: progress,
    isLoading,
    mutate,
  } = useSWR("/api/progress", () =>
    axios
      .get("/api/progress")
      .then((res) => res.data)
      .catch((error: unknown) => {
        const typedError = error as ApiError;
        if (typedError.response?.status !== 409) {
          throw error;
        }
      })
  );

  const addProgress = async (data: ProgressPayload): Promise<boolean> => {
    await csrf();

    try {
      const response = await axios.post("/api/progress", data);
      console.log("Progress updated", response.data);

      await mutate(); // Re-fetch progress data
      return true;
    } catch (err: unknown) {
      const error = err as ApiError;

      if (error.response) {
        const { status, data } = error.response;

        if (status === 422) {
          console.log("Validation error:", data?.errors);
        } else if (status === 403) {
          console.log("Unauthorized: Wrong credentials");
        } else {
          console.log("Request failed with status:", status);
        }
      } else if (error instanceof Error) {
        console.log("Unexpected error:", error.message);
      } else {
        console.log("Unknown error", error);
      }

      return false;
    }
  };

  return { progress, isLoading, mutate, addProgress };
};
