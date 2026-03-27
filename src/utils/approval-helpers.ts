import type { MyTask } from "@/utils/map-progress-to-tasks";
import {
  groupKeyComposite as groupKey,
  itemTs,
  toTime,
} from "@/utils/home-helpers";

/**
 * The ONE approval rule you use everywhere.
 * Matches ScanHistoryDetail: approved if there's an approver identity.
 */
export function isApprovedUnified(x: any): boolean {
  return Boolean(x?.approvedBy || x?.approvedById || x?.approvedAt);
}

export function isPendingApprovalUnified(x: any): boolean {
  // Pending means explicitly "for approval" and not approved yet.
  return Boolean(x?.forApproval) && !isApprovedUnified(x);
}

export type ProgressIndexRichByKey<TProgress = any> = {
  getByKey: (key: string) => TProgress | undefined;
  updatedAtByKey: (key: string) => number | undefined;
  hasKey: (key: string) => boolean;
};

/**
 * Index progress rows by the SAME composite key used in MyTasksAssignedList.
 * Always keep the latest progress row per key.
 */
export function buildProgressIndexByKey<TProgress = any>(
  progressTasks: TProgress[] | undefined,
): ProgressIndexRichByKey<TProgress> {
  const byKey = new Map<string, TProgress>();
  const updatedByKey = new Map<string, number>();

  for (const pr of progressTasks ?? []) {
    const k = groupKey(pr as any);

    // "latest wins" rule
    const ts =
      toTime((pr as any)?.updatedAt) ||
      toTime((pr as any)?.createdAt) ||
      itemTs(pr as any) ||
      0;

    const prevTs = updatedByKey.get(k) ?? -1;
    if (ts >= prevTs) {
      byKey.set(k, pr);
      updatedByKey.set(k, ts);
    }
  }

  return {
    getByKey: (key) => byKey.get(key),
    updatedAtByKey: (key) => updatedByKey.get(key),
    hasKey: (key) => byKey.has(key),
  };
}

/**
 * Decide the task chip state using ONLY the latest progress row (by key).
 * (No fallback to t.forApproval unless you truly want that behavior.)
 */
export function getUnifiedApprovalState(
  task: MyTask,
  progressIdx: ProgressIndexRichByKey<any>,
) {
  const k = groupKey(task as any);
  const pr = progressIdx.getByKey(k);

  const approved = isApprovedUnified(pr);
  const pending = isPendingApprovalUnified(pr);

  return { key: k, pr, approved, pending };
}
