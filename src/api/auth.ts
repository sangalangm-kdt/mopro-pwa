import axios from "@/lib/axios";
import { isAxiosError } from "axios";
import i18n from "@/i18n";
import { toast } from "sonner";
import useSWR from "swr";

export const useAuth = () => {
  const csrf = () => axios.get("/sanctum/csrf-cookie");

  const {
    data: user,
    error,
    mutate,
    isLoading,
  } = useSWR("/api/user", async () => {
    try {
      const res = await axios.get("/api/user");
      return res.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const status = error.response?.status;

        if (status === 401 || status === 409) {
          return null;
        }
      }

      throw error;
    }
  });

  const login = async (data: {
    email: string;
    password: string;
  }): Promise<boolean> => {
    await csrf();

    try {
      const response = await axios.post("/login", data);
      console.log("Login success", response.data);

      // Revalidate user after login
      await mutate();
      return true;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        const { status, data } = error.response;

        if (status === 422) {
          console.log("Validation error:", data.errors);
        } else if (status === 403) {
          console.log("Unauthorized: Wrong credentials");
        } else {
          console.log("Login failed:", status);
        }
      } else if (error instanceof Error) {
        console.log("Unexpected error:", error.message);
      } else {
        console.log("Unknown error", error);
      }
      return false;
    }
  };

  const changePassword = async (data: {
    currentPassword: string;
    password: string;
    passwordConfirmation: string;
  }) => {
    await csrf();

    try {
      const response = await axios.put("/change-password", data);
      console.log("Change password success", response.data);

      // Revalidate user after login
      await mutate();
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        const { status, data } = error.response;

        if (status === 422) {
          console.log("Validation error:", data.errors);
        } else if (status === 403) {
          console.log("Unauthorized: Wrong credentials");
        } else {
          console.log("Login failed:", status);
        }
      } else if (error instanceof Error) {
        console.log("Unexpected error:", error.message);
      } else {
        console.log("Unknown error", error);
      }

      throw error;
    }
  };

  const logout = async () => {
    let logoutError: unknown;

    try {
      await csrf();
      await axios.post("/logout");
    } catch (error) {
      logoutError = error;
    } finally {
      await mutate(null, false);
    }

    toast.success(
      i18n.t(
        logoutError ? "common:auth.logged_out_cleared" : "common:auth.logout_success",
      ),
    );

    if (
      logoutError &&
      (!isAxiosError(logoutError) || logoutError.response?.status !== 419)
    ) {
      throw logoutError;
    }
  };

  return { user, mutate, error, isLoading, login, logout, changePassword };
};
