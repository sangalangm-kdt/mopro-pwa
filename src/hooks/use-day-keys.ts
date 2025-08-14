import { useMemo } from "react";

export function useDayKeys(windowDays: 15 | 30) {
  return useMemo(() => {
    const arr: string[] = [];
    const today = new Date();
    for (let i = windowDays - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      arr.push(d.toLocaleDateString("en-CA")); // YYYY-MM-DD
    }
    return arr;
  }, [windowDays]);
}
