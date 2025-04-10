import type { FC, SVGProps } from "react";
import React from "react";

// Dynamically import based on icon name
const icons: Record<
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

interface IconProps extends SVGProps<SVGSVGElement> {
  name: keyof typeof icons;
  className?: string;
}

export default function Icon({
  name,
  className = "w-5 h-5 ",
  ...rest
}: IconProps) {
  const LazyIcon = useMemo(() => React.lazy(icons[name]), [name]);

  return (
    <React.Suspense fallback={<div className={className} />}>
      <LazyIcon className={className} {...rest} />
    </React.Suspense>
  );
}
