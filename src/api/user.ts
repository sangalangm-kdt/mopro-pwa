import axios from "@/lib/axios";
import useSWR from "swr";

export const useUser = () => {
    const csrf = () => axios.get("/sanctum/csrf-cookie");

    const { data: user, mutate } = useSWR("/api/user", () =>
        axios
            .get("/api/user")
            .then((res) => res.data)
            .catch((error) => {
                if (error.response.status !== 409) throw error;
            })
    );

    const updateUser = async (data) => {
        await csrf();
        console.log(user);
        try {
            const response = await axios.patch(
                `/api/users/${user.data.id}`,
                data
            );
            console.log("User updated", response.data);

            await mutate(); // Re-fetch progress data
            return true;
        } catch (error: unknown) {
            if (error.response.status !== 409) throw error;
        }
    };

    return { user, mutate, updateUser };
};
