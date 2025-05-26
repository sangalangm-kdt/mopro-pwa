export function highlightMatch(text: string, keyword: string): string {
  if (!keyword) return text;

  const regex = new RegExp(`(${keyword})`, "gi");
  return text.replace(
    regex,
    `<span class="font-semibold text-primary-500 dark:text-primary-400">$1</span>`
  );
}
