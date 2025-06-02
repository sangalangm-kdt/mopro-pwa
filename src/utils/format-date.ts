import i18next from "i18next";

export function formatDate(
  dateInput: string | Date,
  options?: Intl.DateTimeFormatOptions,
  locale: string = i18next.language
): string {
  if (!dateInput) return "";

  let date: Date;
  try {
    date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    if (isNaN(date.getTime())) throw new Error("Invalid date");
  } catch {
    return "Invalid date";
  }

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short", // ✅ e.g. "Jun"
    day: "numeric", // ✅ e.g. "2"
    hour: "numeric", // ✅ e.g. "8"
    minute: "2-digit", // ✅ e.g. "45"
    hour12: true, // ✅ shows AM/PM
  };

  return new Intl.DateTimeFormat(locale, options || defaultOptions).format(
    date
  );
}
