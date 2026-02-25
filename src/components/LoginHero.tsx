import { useEffect, useMemo, useRef, useState } from "react";
import { useLocalizedText } from "@/utils/localized-text";
import { LOGIN_TEXT_KEYS } from "@constants/index";

type LoginHeroProps = {
  /** Match your form slide animation duration (ms) */
  syncDelayMs?: number;
};

export default function LoginHero({ syncDelayMs = 520 }: LoginHeroProps) {
  const TEXT = useLocalizedText("common", LOGIN_TEXT_KEYS);

  const [showText, setShowText] = useState(false);

  // parallax offsets
  const [px, setPx] = useState(0);
  const [py, setPy] = useState(0);
  const rafRef = useRef<number | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);

  // ✅ Sync hero text after form slide finishes
  useEffect(() => {
    const t = window.setTimeout(() => setShowText(true), syncDelayMs);
    return () => clearTimeout(t);
  }, [syncDelayMs]);

  // Subtle parallax
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setPx(nx * 14);
        setPy(ny * 10);
      });
    };

    const onLeave = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setPx(0);
        setPy(0);
      });
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const title = TEXT.WELCOME_TITLE ?? "Welcome to MoPro.";
  const subtitle =
    TEXT.WELCOME_SUBTITLE ??
    "Stay informed, stay productive—track progress anytime, anywhere with MoPro.";

  const transformStyle = useMemo(() => {
    const x = Math.max(-18, Math.min(18, px));
    const y = Math.max(-14, Math.min(14, py));
    return { x, y };
  }, [px, py]);

  return (
    <div ref={rootRef} className="relative h-full w-full overflow-hidden">
      {/* Always dark hero background */}
      <div className="absolute inset-0 bg-gradient-to-tl from-lime-800 via-lime-900 to-lime-950" />

      {/* Animated gradient movement layer */}
      <div
        className="absolute -inset-[25%] hero-gradient-anim opacity-70"
        style={{
          background:
            "radial-gradient(60% 60% at 20% 20%, rgba(190,242,100,0.35) 0%, rgba(190,242,100,0) 60%)," +
            "radial-gradient(55% 55% at 80% 30%, rgba(34,197,94,0.25) 0%, rgba(34,197,94,0) 60%)," +
            "radial-gradient(60% 60% at 50% 85%, rgba(250,204,21,0.12) 0%, rgba(250,204,21,0) 60%)",
        }}
      />

      {/* Depth overlay */}
      <div className="absolute inset-0 bg-black/15" />

      {/* ✅ Very subtle light sweep (slow) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="hero-light-sweep absolute top-0 left-0 h-[140%] w-[55%]"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0) 100%)",
            filter: "blur(10px)",
            transformOrigin: "center",
          }}
        />
      </div>

      {/* Floating abstract shapes */}
      <div
        className="absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl opacity-30 hero-float-y"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(190,242,100,0.9), rgba(190,242,100,0.0) 65%)",
          transform: `translate3d(${transformStyle.x * 0.35}px, ${transformStyle.y * 0.35}px, 0)`,
        }}
      />
      <div
        className="absolute top-24 -right-32 h-80 w-80 rounded-full blur-3xl opacity-25 hero-float-x"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(34,197,94,0.85), rgba(34,197,94,0.0) 65%)",
          transform: `translate3d(${transformStyle.x * 0.5}px, ${transformStyle.y * 0.5}px, 0)`,
        }}
      />
      <div
        className="absolute -bottom-28 left-1/3 h-96 w-96 rounded-full blur-3xl opacity-20 hero-float-y"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(250,204,21,0.65), rgba(250,204,21,0.0) 70%)",
          transform: `translate3d(${transformStyle.x * 0.6}px, ${transformStyle.y * 0.6}px, 0)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full w-full flex items-center px-12 lg:px-16">
        <div
          className="max-w-2xl"
          style={{
            transform: `translate3d(${transformStyle.x * 0.25}px, ${transformStyle.y * 0.25}px, 0)`,
            transition: "transform 120ms ease-out",
          }}
        >
          {/* ✅ Micro fade in synced */}
          <h1
            className={[
              "text-white font-extrabold tracking-tight leading-[1.05]",
              "text-5xl lg:text-6xl xl:text-7xl",
              "transition-all duration-700 ease-out",
              showText
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-3",
            ].join(" ")}
          >
            {title}
          </h1>

          <p
            className={[
              "mt-6 text-white/80 text-sm lg:text-base max-w-xl",
              "transition-all duration-700 ease-out delay-150",
              showText
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-3",
            ].join(" ")}
          >
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
