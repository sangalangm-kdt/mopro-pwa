import axios from "@/lib/axios";
import useSWR from "swr";

export interface Manufacturer {
  id: number | string;
  name?: string;
  label?: string;
  isEnable?: boolean | number | string;
  is_enable?: boolean | number | string;
}

const unwrapData = (value: unknown): unknown => {
  let current: unknown = value;
  const seen = new Set<unknown>();

  while (
    current &&
    typeof current === "object" &&
    !Array.isArray(current) &&
    "data" in current &&
    !seen.has(current)
  ) {
    seen.add(current);
    current = (current as { data?: unknown }).data;
  }

  return current;
};

const isEnabledManufacturer = (manufacturer: Manufacturer) => {
  const enabledValue = manufacturer.isEnable ?? manufacturer.is_enable;

  return (
    enabledValue === 1 ||
    enabledValue === "1" ||
    enabledValue === true ||
    enabledValue === "true"
  );
};

const normalizeManufacturers = (payload: unknown): Manufacturer[] => {
  const unwrapped = unwrapData(payload);

  if (!Array.isArray(unwrapped)) return [];

  return unwrapped
    .filter(
      (item): item is Manufacturer =>
        Boolean(item) && typeof item === "object" && "id" in item,
    )
    .filter(isEnabledManufacturer)
    .map((manufacturer) => ({
      ...manufacturer,
      id: manufacturer.id,
      name: manufacturer.name ?? manufacturer.label ?? "",
      label: manufacturer.label ?? manufacturer.name ?? "",
    }))
    .filter((manufacturer) => manufacturer.id && manufacturer.label);
};

export const useManufacturer = () => {
  const { data, error, isLoading, mutate } = useSWR("/api/manufacturer", () =>
    axios.get("/api/manufacturer").then((res) => res.data),
  );

  const manufacturers = normalizeManufacturers(data);

  return {
    manufacturers,
    error,
    isLoading,
    mutate,
  };
};
