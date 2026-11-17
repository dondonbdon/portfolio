import { create } from "zustand";

export type ExperiencePhase =
  | "boot"
  | "warp"
  | "overview"
  | "focus"
  | "about";

export type QualityTier = "high" | "medium" | "low";

interface ExperienceState {
  phase: ExperiencePhase;
  activeSlug: string | null;
  hoveredSlug: string | null;
  scrollProgress: number;
  quality: QualityTier;
  liteMode: boolean;
  warpProgress: number;
  bootSkipped: boolean;

  setPhase: (phase: ExperiencePhase) => void;
  setActiveSlug: (slug: string | null) => void;
  setHoveredSlug: (slug: string | null) => void;
  setScrollProgress: (progress: number) => void;
  setQuality: (quality: QualityTier) => void;
  downgradeQuality: () => void;
  setLiteMode: (lite: boolean) => void;
  setWarpProgress: (progress: number) => void;
  engageWarp: () => void;
  skipIntro: () => void;
  focusBody: (slug: string) => void;
  exitFocus: () => void;
  enterAbout: () => void;
}

export const useExperience = create<ExperienceState>((set) => ({
  phase: "boot",
  activeSlug: null,
  hoveredSlug: null,
  scrollProgress: 0,
  quality: "high",
  liteMode: false,
  warpProgress: 0,
  bootSkipped: false,

  setPhase: (phase) => set({ phase }),
  setActiveSlug: (activeSlug) => set({ activeSlug }),
  setHoveredSlug: (hoveredSlug) => set({ hoveredSlug }),
  setScrollProgress: (scrollProgress) => set({ scrollProgress }),
  setQuality: (quality) => set({ quality }),
  downgradeQuality: () =>
    set((state) => {
      if (state.quality === "high") return { quality: "medium" };
      if (state.quality === "medium") return { quality: "low" };
      return state;
    }),
  setLiteMode: (liteMode) => set({ liteMode }),
  setWarpProgress: (warpProgress) => set({ warpProgress }),
  engageWarp: () => set({ phase: "warp", warpProgress: 0 }),
  skipIntro: () =>
    set({
      phase: "overview",
      warpProgress: 1,
      bootSkipped: true,
      activeSlug: null,
      scrollProgress: 0,
    }),
  focusBody: (slug) =>
    set({
      phase: "focus",
      activeSlug: slug,
    }),
  exitFocus: () =>
    set({
      phase: "overview",
      activeSlug: null,
    }),
  enterAbout: () =>
    set({
      phase: "about",
      activeSlug: null,
    }),
}));
