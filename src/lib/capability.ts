import { getGPUTier } from "detect-gpu";
import type { QualityTier } from "@/state/useExperience";

export interface CapabilityReport {
  canUse3D: boolean;
  reason?: string;
  initialQuality: QualityTier;
}

export async function detectExperienceCapability(): Promise<CapabilityReport> {
  if (typeof window === "undefined") {
    return { canUse3D: false, reason: "ssr", initialQuality: "low" };
  }

  const params = new URLSearchParams(window.location.search);
  if (params.has("lite")) {
    return { canUse3D: false, reason: "query-lite", initialQuality: "low" };
  }

  if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) {
    return { canUse3D: false, reason: "reduced-motion", initialQuality: "low" };
  }

  let hasWebGL = false;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: false }) ||
      canvas.getContext("webgl", { failIfMajorPerformanceCaveat: false });
    hasWebGL = Boolean(gl);
  } catch {
    hasWebGL = false;
  }

  if (!hasWebGL) {
    return { canUse3D: false, reason: "no-webgl", initialQuality: "low" };
  }

  try {
    const gpuTier = await getGPUTier();
    // Allow force-3d override via ?3d for testing on headless SwiftShader
    if (params.has("3d")) {
      return { canUse3D: true, initialQuality: gpuTier.tier >= 2 ? "high" : "low" };
    }

    if (gpuTier.tier === 0) {
      return { canUse3D: false, reason: "low-gpu-tier", initialQuality: "low" };
    }

    const isMobile = gpuTier.isMobile ?? false;
    if (isMobile && gpuTier.tier <= 1) {
      return { canUse3D: true, initialQuality: "low" };
    }

    if (gpuTier.tier >= 3 && !isMobile) {
      return { canUse3D: true, initialQuality: "high" };
    }

    return { canUse3D: true, initialQuality: "medium" };
  } catch {
    return { canUse3D: true, initialQuality: "medium" };
  }
}
