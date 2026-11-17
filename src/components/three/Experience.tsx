"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, PerformanceMonitor, Stars } from "@react-three/drei";
import { featuredProjects } from "@/content/projects";
import { useExperience } from "@/state/useExperience";
import { Galaxy } from "./Galaxy";
import { CameraRig } from "./CameraRig";
import { WarpTunnel } from "./WarpTunnel";
import { Effects } from "./Effects";
import { SpotlyStar } from "./bodies/SpotlyStar";
import { HaciaGiant } from "./bodies/HaciaGiant";
import { FlashCrystal } from "./bodies/FlashCrystal";
import { WosIce } from "./bodies/WosIce";
import { PayStation } from "./bodies/PayStation";
import { StmMoon } from "./bodies/StmMoon";
import { OriginsBelt } from "./bodies/OriginsBelt";
import { ArchiveConstellation } from "./bodies/ArchiveConstellation";

function GalaxyScene() {
  const exitFocus = useExperience((s) => s.exitFocus);
  const phase = useExperience((s) => s.phase);

  const byKind = {
    spotly: featuredProjects.find((p) => p.slug === "spotly")!,
    hacia: featuredProjects.find((p) => p.slug === "hacia")!,
    flashpdf: featuredProjects.find((p) => p.slug === "flashpdf")!,
    wos: featuredProjects.find((p) => p.slug === "wos-util")!,
    pay: featuredProjects.find((p) => p.slug === "payment-processor")!,
    stm: featuredProjects.find((p) => p.slug === "stm32-utils")!,
    origins: featuredProjects.find((p) => p.slug === "origins-belt")!,
  };

  return (
    <>
      <color attach="background" args={["#03050a"]} />
      <fogExp2 attach="fog" args={["#03050a", 0.011]} />

      <ambientLight intensity={0.42} color="#cbd5e1" />
      <directionalLight position={[18, 24, 12]} intensity={1.1} color="#e2e8f0" />

      {/* Background deep-field stars */}
      <Stars radius={85} depth={45} count={3200} factor={3.2} saturation={0.4} fade speed={0.4} />

      {/* Invisible click catcher to return to overview when clicking empty space */}
      <mesh
        visible={false}
        onClick={() => {
          if (phase === "focus") exitFocus();
        }}
      >
        <sphereGeometry args={[90, 8, 8]} />
        <meshBasicMaterial side={2} />
      </mesh>

      <Galaxy />

      <SpotlyStar project={byKind.spotly} />
      <HaciaGiant project={byKind.hacia} />
      <FlashCrystal project={byKind.flashpdf} />
      <WosIce project={byKind.wos} />
      <PayStation project={byKind.pay} />
      <StmMoon project={byKind.stm} />
      <OriginsBelt project={byKind.origins} />
      <ArchiveConstellation />

      <CameraRig />
      <WarpTunnel />
      <Effects />
    </>
  );
}

export function Experience() {
  const downgradeQuality = useExperience((s) => s.downgradeQuality);

  return (
    <div className="fixed inset-0 z-0 bg-[#03050a]">
      <Canvas
        dpr={[1, 2]}
        camera={{ fov: 48, near: 0.1, far: 180, position: [0, 17, 31] }}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          toneMappingExposure: 1.08,
        }}
      >
        <PerformanceMonitor onDecline={() => downgradeQuality()} />
        <AdaptiveDpr pixelated />
        <Suspense fallback={null}>
          <GalaxyScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
