import axios from "@/lib/axios";
import { isAxiosError } from "axios";
import useSWR from "swr";

export const useAuth = () => {
  const csrf = () => axios.get("/sanctum/csrf-cookie");

  const {
    data: user,
    error,
    mutate,
    isLoading,
  } = useSWR("/api/user", () =>
    axios
      .get("/api/user")
      .then((res) => res.data)
      .catch((error) => {
        if (error.response.status !== 409) throw error;
      })
  );

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
    }
  };

  const logout = async () => {
    if (!error) {
      await axios.post("/logout").then(() => mutate());
    }

    window.location.pathname = "login";
  };

  return { user, mutate, isLoading, login, logout, changePassword };
};
