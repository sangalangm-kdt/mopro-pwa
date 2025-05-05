export function formatDate(
  dateInput: string | Date,
  options?: Intl.DateTimeFormatOptions,
  locale: string = "en-US"
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
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  return new Intl.DateTimeFormat(locale, options || defaultOptions).format(
    date
  );
}
