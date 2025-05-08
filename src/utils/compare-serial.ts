export function isMatchingSerial(
  scannedSerial: string,
  dbSerial: string
): boolean {
  const clean = (str: unknown) =>
    String(str)
      .replace(/[\u200B-\u200D\uFEFF]/g, "")
      .trim();

  return clean(scannedSerial) === clean(dbSerial);
}
