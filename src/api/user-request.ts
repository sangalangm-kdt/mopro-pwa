import axios from "@/lib/axios";
import { AxiosError } from "axios";

export type UserRequestPayload = {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  roleId: number;
  manufacturerId: number | null;
  projectId: number | null;
};

export const createUserRequest = async (payload: UserRequestPayload) => {
  const response = await axios.post("/api/user-request", payload);
  return response.data;
};

export type EmailAvailabilityResult = {
  available: boolean;
  endpointAvailable: boolean;
};

type EmailAvailabilityResponse = {
  available?: boolean;
  exists?: boolean;
  registered?: boolean;
  requested?: boolean;
};

export const checkUserRequestEmailAvailability = async (
  email: string,
  signal?: AbortSignal,
): Promise<EmailAvailabilityResult> => {
  try {
    const response = await axios.post<EmailAvailabilityResponse>(
      "/api/user-request/validate-email",
      { email },
      { signal },
    );
    const data = response.data;

    return {
      available:
        data.available ??
        !(data.exists || data.registered || data.requested),
      endpointAvailable: true,
    };
  } catch (error) {
    const axiosError = error as AxiosError<{ errors?: { email?: string[] } }>;

    if (axiosError.response?.status === 422) {
      return {
        available: !axiosError.response.data?.errors?.email?.length,
        endpointAvailable: true,
      };
    }

    if (
      axiosError.response?.status === 404 ||
      axiosError.response?.status === 405
    ) {
      return { available: true, endpointAvailable: false };
    }

    throw error;
  }
};
