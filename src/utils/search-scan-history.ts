import type { ScanEntry } from "@/components/cards/ScanHistoryCard";

export function searchScanHistory(
  entries: ScanEntry[],
  searchTerm: string
): ScanEntry[] {
  if (!searchTerm.trim()) return entries;

  const lowerSearch = searchTerm.toLowerCase();

  return entries.filter(
    (entry) =>
      entry.product.productList.name.toLowerCase().includes(lowerSearch) ||
      entry.process.processList.name.toLowerCase().includes(lowerSearch) ||
      entry.lineNumber.toLowerCase().includes(lowerSearch)
  );
}
