import { useMemo } from "react";
import {
  buildPeriodSummary,
  type ProgressUpdate,
} from "@/utils/progress-summary";

export function usePeriodSummary(
  progressUpdates: ProgressUpdate[] | undefined,
  windowDays: 15 | 30
) {
  return useMemo(() => {
    const summary = buildPeriodSummary(progressUpdates ?? [], windowDays);

    const daysActive = summary.bars.filter((b) => b.pct > 0).length;

    const rangeLabel = `${summary.rangeStart.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    })} – ${summary.rangeEnd.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    })}`;

    const latestLabel = (() => {
      const r: any = (progressUpdates ?? [])[0];
      if (!r) return undefined;
      const title =
        r?.product?.productList?.name ??
        r?.product?.name ??
        r?.project?.name ??
        r?.lineNumber ??
        "Latest";
      const pct =
        typeof r?.percent === "number"
          ? `${Math.round(r.percent)}%`
          : undefined;
      return pct ? `${title} • ${pct}` : title;
    })();

    return { summary, daysActive, rangeLabel, latestLabel };
  }, [progressUpdates, windowDays]);
}
