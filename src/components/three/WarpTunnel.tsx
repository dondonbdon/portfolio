"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { WARP_VERTEX, WARP_FRAGMENT } from "@/shaders/bodies";
import { useExperience } from "@/state/useExperience";

export function WarpTunnel() {
  const phase = useExperience((s) => s.phase);
  const setPhase = useExperience((s) => s.setPhase);
  const setWarpProgress = useExperience((s) => s.setWarpProgress);

  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const startTimeRef = useRef<number | null>(null);
  const { camera } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
    }),
    []
  );

  useFrame(({ clock }) => {
    if (phase !== "warp") {
      startTimeRef.current = null;
      return;
    }

    const now = performance.now();
    if (startTimeRef.current === null) {
      startTimeRef.current = now;
    }

    const durationMs = 2000;
    const progress = Math.min(1, (now - startTimeRef.current) / durationMs);
    setWarpProgress(progress);

    if (matRef.current) {
      matRef.current.uniforms.uTime.value = clock.getElapsedTime();
      matRef.current.uniforms.uProgress.value = progress;
    }

    if (meshRef.current) {
      const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
      meshRef.current.position.copy(camera.position).addScaledVector(forward, 2.4);
      meshRef.current.quaternion.copy(camera.quaternion);
    }

    if (progress >= 1) {
      startTimeRef.current = null;
      setPhase("overview");
    }
  });

  if (phase !== "warp") return null;

  return (
    <mesh ref={meshRef} renderOrder={999}>
      <planeGeometry args={[12, 8]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={WARP_VERTEX}
        fragmentShader={WARP_FRAGMENT}
        uniforms={uniforms}
        transparent
        depthTest={false}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
