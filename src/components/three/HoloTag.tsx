"use client";

import { Html } from "@react-three/drei";
import { useExperience } from "@/state/useExperience";

interface HoloTagProps {
  slug: string;
  name: string;
  era: string;
  color: string;
  offsetY?: number;
}

export function HoloTag({ slug, name, era, color, offsetY = 2.1 }: HoloTagProps) {
  const phase = useExperience((s) => s.phase);
  const activeSlug = useExperience((s) => s.activeSlug);
  const hoveredSlug = useExperience((s) => s.hoveredSlug);
  const focusBody = useExperience((s) => s.focusBody);
  const setHoveredSlug = useExperience((s) => s.setHoveredSlug);

  const isActive = activeSlug === slug;
  const isHovered = hoveredSlug === slug;
  const dimmed = phase === "focus" && !isActive;

  if (phase === "boot" || phase === "warp" || phase === "about" || (phase === "focus" && isActive)) {
    return null;
  }

  return (
    <Html
      position={[0, offsetY, 0]}
      center
      distanceFactor={24}
      zIndexRange={[10, 0]}
      style={{
        pointerEvents: dimmed ? "none" : "auto",
        transition: "opacity 280ms ease, transform 280ms ease",
        opacity: dimmed ? 0.16 : 1,
      }}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          focusBody(slug);
        }}
        onMouseEnter={() => setHoveredSlug(slug)}
        onMouseLeave={() => setHoveredSlug(null)}
        className="group flex flex-col items-center gap-1 select-none cursor-pointer focus:outline-none"
      >
        <div
          className="px-2.5 py-1 rounded-md backdrop-blur-md transition-all duration-200 flex items-center gap-2 whitespace-nowrap"
          style={{
            background: isActive || isHovered
              ? "rgba(8, 13, 24, 0.92)"
              : "rgba(6, 10, 19, 0.72)",
            border: `1px solid ${isActive || isHovered ? color : "rgba(255,255,255,0.14)"}`,
            boxShadow: isActive || isHovered ? `0 0 18px ${color}40` : "none",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
          />
          <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-slate-400">
            {era.split("·")[0]?.trim()}
          </span>
          <span className="text-xs font-semibold tracking-tight text-slate-100">
            {name}
          </span>
        </div>
        <div
          className="w-px h-3 transition-all duration-200"
          style={{
            background: `linear-gradient(to bottom, ${color}, transparent)`,
            opacity: isActive || isHovered ? 0.95 : 0.45,
          }}
        />
      </button>
    </Html>
  );
}
