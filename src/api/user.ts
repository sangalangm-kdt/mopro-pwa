import axios from "@/lib/axios";
import useSWR from "swr";
import type { AxiosError } from "axios";

interface User {
  id: number;
  name: string;
  email: string;
}

interface UpdateUserData {
  name?: string;
  email?: string;
}

export const useUser = () => {
  const csrf = () => axios.get("/sanctum/csrf-cookie");

  const { data: user, mutate } = useSWR<User>("/api/user", () =>
    axios
      .get("/api/user")
      .then((res) => res.data)
      .catch((error: AxiosError) => {
        if (error.response?.status !== 409) throw error;
      })
  );

  const updateUser = async (data: UpdateUserData): Promise<boolean> => {
    await csrf();
    if (!user) return false;

    try {
      const response = await axios.patch(`/api/users/${user.id}`, data);
      console.log("User updated:", response.data);
      await mutate();
      return true;
    } catch (error: unknown) {
      const err = error as AxiosError;
      if (err.response?.status !== 409) throw error;
      return false;
    }
  };

  return { user, mutate, updateUser };
};
