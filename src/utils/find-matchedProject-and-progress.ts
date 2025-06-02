// utils/findMatchedProjectAndProgress.ts

import { isMatchingSerial } from "@/utils/compare-serial";
import type { Project, Product } from "@/types/editProgress";
import type { RawProgressEntry } from "@/types/scan";

export function findMatchedProject(
  projects: Project[] | undefined,
  serial: string
): Project | undefined {
  return projects?.find((project) =>
    project.products.some((product) =>
      isMatchingSerial(String(product.lineNumber), String(serial))
    )
  );
}

export function findMatchedProduct(
  project: Project | undefined,
  serial: string
): Product | undefined {
  return project?.products.find((product) =>
    isMatchingSerial(String(product.lineNumber), String(serial))
  );
}

export function findLatestProgress(
  entries: RawProgressEntry[] | undefined,
  serial: string
): RawProgressEntry | undefined {
  return entries
    ?.filter((entry) =>
      isMatchingSerial(String(entry.product?.lineNumber), String(serial))
    )
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )[0];
}
