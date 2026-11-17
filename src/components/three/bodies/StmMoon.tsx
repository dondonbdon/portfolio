"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PLANET_VERTEX, CIRCUIT_FRAGMENT } from "@/shaders/bodies";
import type { Project } from "@/content/projects";
import { getProjectPosition } from "@/lib/cameraRail";
import { useExperience } from "@/state/useExperience";
import { HoloTag } from "../HoloTag";

export function StmMoon({ project }: { project: Project }) {
  const pos = useMemo(() => getProjectPosition(project), [project]);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const moonRef = useRef<THREE.Group>(null);
  const focusBody = useExperience((s) => s.focusBody);
  const setHoveredSlug = useExperience((s) => s.setHoveredSlug);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uBaseColor: { value: new THREE.Color("#090d16") },
      uTraceColor: { value: new THREE.Color("#0284c7") },
      uPulseColor: { value: new THREE.Color("#f59e0b") },
    }),
    []
  );

  // Orbiting silicon pin headers
  const pins = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        angle: (i / 8) * Math.PI * 2,
        r: project.bodyRadius * 1.48,
      })),
    [project.bodyRadius]
  );

  useFrame(({ clock }, delta) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
    if (moonRef.current) {
      moonRef.current.rotation.y += delta * 0.22;
      moonRef.current.rotation.x = 0.22;
    }
  });

  return (
    <group position={pos}>
      <group ref={moonRef}>
        <mesh
          onClick={(e) => {
            e.stopPropagation();
            focusBody(project.slug);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredSlug(project.slug);
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            setHoveredSlug(null);
            document.body.style.cursor = "auto";
          }}
        >
          <sphereGeometry args={[project.bodyRadius, 48, 48]} />
          <shaderMaterial
            ref={matRef}
            vertexShader={PLANET_VERTEX}
            fragmentShader={CIRCUIT_FRAGMENT}
            uniforms={uniforms}
          />
        </mesh>

        {/* Equator Pin Orbit Ring */}
        {pins.map((pin) => (
          <mesh
            key={pin.id}
            position={[Math.cos(pin.angle) * pin.r, 0, Math.sin(pin.angle) * pin.r]}
            rotation={[0, -pin.angle, 0]}
          >
            <boxGeometry args={[0.14, 0.06, 0.24]} />
            <meshStandardMaterial
              color="#f59e0b"
              emissive="#38bdf8"
              emissiveIntensity={0.65}
              metalness={0.85}
              roughness={0.2}
            />
          </mesh>
        ))}
      </group>

      <HoloTag
        slug={project.slug}
        name={project.name}
        era={project.era}
        color={project.color}
        offsetY={project.bodyRadius + 0.95}
      />
    </group>
  );
}
