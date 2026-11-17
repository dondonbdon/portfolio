"use client";

import { useMemo } from "react";
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import { useExperience } from "@/state/useExperience";

export function Effects() {
  const quality = useExperience((s) => s.quality);
  const phase = useExperience((s) => s.phase);
  const warpProgress = useExperience((s) => s.warpProgress);

  const chromaticOffset = useMemo(() => {
    if (phase === "warp") {
      const amp = 0.002 + warpProgress * 0.016;
      return new THREE.Vector2(amp, amp * 0.6);
    }
    return new THREE.Vector2(0.0005, 0.0005);
  }, [phase, warpProgress]);

  if (quality === "low") {
    return null;
  }

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={phase === "warp" ? 1.55 : 0.95}
        luminanceThreshold={0.55}
        luminanceSmoothing={0.35}
        mipmapBlur
      />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={chromaticOffset}
        radialModulation
        modulationOffset={0.45}
      />
      <Vignette eskil={false} offset={0.22} darkness={0.62} />
    </EffectComposer>
  );
}
