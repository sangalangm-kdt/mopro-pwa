import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  buildPeriodSummary,
  type ProgressUpdate,
} from "@/utils/progress-summary";
import { HOME_TEXT_KEYS } from "@constants/index";

export function usePeriodSummary(
  progressUpdates: ProgressUpdate[] | undefined,
  windowDays: 15 | 30
) {
  const { t } = useTranslation("common");

  return useMemo(() => {
    const summary = buildPeriodSummary(progressUpdates ?? [], windowDays);
    const daysActive = summary.bars.filter((b) => b.pct > 0).length;

    // ✅ use HOME_TEXT_KEYS.RANGE_LABEL
    const rangeLabel = t(HOME_TEXT_KEYS.RANGE_LABEL, {
      start: summary.rangeStart,
      end: summary.rangeEnd,
    });

    const latestLabel = (() => {
      const r: any = (progressUpdates ?? [])[0];
      if (!r) return undefined;
      const title =
        r?.product?.productList?.name ??
        r?.product?.name ??
        r?.project?.name ??
        r?.lineNumber ??
        t("latest");
      const pct =
        typeof r?.percent === "number"
          ? `${Math.round(r.percent)}%`
          : undefined;
      return pct ? `${title} • ${pct}` : title;
    })();

    return { summary, daysActive, rangeLabel, latestLabel };
  }, [progressUpdates, windowDays, t]);
}
