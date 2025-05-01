export function isMatchingSerial(
  scannedSerial: string,
  dbSerial: string
): boolean {
  const clean = (str: string) =>
    str
      .trim()
      .replace(/[\u200B-\u200D\uFEFF]/g, "")
      .normalize();

  return clean(scannedSerial) === clean(dbSerial);
}
