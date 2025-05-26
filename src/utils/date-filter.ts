import type { TFunction } from "i18next";
import type { ScanEntry } from "@/components/cards/ScanHistoryCard";

export type DateFilterOption =
  | "latest"
  | "today"
  | "week"
  | "month"
  | "last7days"
  | "all";

export function getFilterOptions(
  t: TFunction
): { label: string; value: DateFilterOption }[] {
  return [
    { label: t("date_filter.all"), value: "all" },
    { label: t("date_filter.latest"), value: "latest" },
    { label: t("date_filter.today"), value: "today" },
    { label: t("date_filter.week"), value: "week" },
    { label: t("date_filter.month"), value: "month" },
    { label: t("date_filter.last7days"), value: "last7days" },
  ];
}

export function filterScanHistoryByDate(
  entries: ScanEntry[],
  filter: DateFilterOption
): ScanEntry[] {
  const now = new Date();

  let filtered = entries.filter((entry) => {
    const entryDate = new Date(entry.createdAt);
    if (isNaN(entryDate.getTime())) return false;

    switch (filter) {
      case "today":
        return (
          entryDate.getFullYear() === now.getFullYear() &&
          entryDate.getMonth() === now.getMonth() &&
          entryDate.getDate() === now.getDate()
        );
      case "week": {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay() + 1);
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        return entryDate >= startOfWeek && entryDate <= endOfWeek;
      }
      case "month":
        return (
          entryDate.getFullYear() === now.getFullYear() &&
          entryDate.getMonth() === now.getMonth()
        );
      case "last7days": {
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 7);
        return entryDate >= sevenDaysAgo && entryDate <= now;
      }
      case "latest":
      case "all":
        return true;
      default:
        return true;
    }
  });

  if (filter === "latest") {
    filtered = filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  return filtered;
}
