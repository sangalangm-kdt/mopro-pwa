import { lazy, Suspense, useMemo } from "react";
import type { FC, SVGProps } from "react";
import {
  Loader,
  ClipboardList,
  Clock,
  Workflow,
  StickyNote,
  LucideIcon,
  Home,
  Weight,
  UserPen,
} from "lucide-react";

// Lazy-loaded custom icons
const customIcons: Record<
  string,
  () => Promise<{ default: FC<SVGProps<SVGSVGElement>> }>
> = {
  email: () => import("@assets/icons/email.svg?react"),
  lock: () => import("@assets/icons/lock.svg?react"),
  eyeOn: () => import("@assets/icons/eye-on-icon.svg?react"),
  eyeOff: () => import("@assets/icons/eye-off-icon.svg?react"),
  menu: () => import("@assets/icons/hamburger-menu.svg?react"),
  languages: () => import("@assets/icons/language-icon.svg?react"),
  sun: () => import("@assets/icons/sun.svg?react"),
  moon: () => import("@assets/icons/moon.svg?react"),
};

// Direct Lucide icons
const lucideIcons: Record<string, LucideIcon> = {
  loader: Loader,
  "clipboard-list": ClipboardList,
  clock: Clock,
  workflow: Workflow,
  "sticky-note": StickyNote,
  home: Home,
  weight: Weight,
  "last-modified-by": UserPen,
};

interface IconProps extends SVGProps<SVGSVGElement> {
  name: string;
  className?: string;
}

export default function Icon({
  name,
  className = "w-5 h-5",
  ...rest
}: IconProps) {
  const LazyIcon = useMemo(() => {
    if (name in customIcons) {
      return lazy(customIcons[name]);
    }
    return null;
  }, [name]);

  if (LazyIcon) {
    return (
      <Suspense fallback={<div className={className} />}>
        <LazyIcon className={className} {...rest} />
      </Suspense>
    );
  }

  if (name in lucideIcons) {
    const LucideComponent = lucideIcons[name];
    return <LucideComponent className={className} {...rest} />;
  }

  return <span className={className} />;
}
