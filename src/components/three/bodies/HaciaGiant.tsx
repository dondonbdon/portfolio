"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PLANET_VERTEX, BANDS_FRAGMENT } from "@/shaders/bodies";
import type { Project } from "@/content/projects";
import { getProjectPosition } from "@/lib/cameraRail";
import { useExperience } from "@/state/useExperience";
import { HoloTag } from "../HoloTag";

export function HaciaGiant({ project }: { project: Project }) {
  const pos = useMemo(() => getProjectPosition(project), [project]);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const planetRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Points>(null);

  const focusBody = useExperience((s) => s.focusBody);
  const setHoveredSlug = useExperience((s) => s.setHoveredSlug);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color("#064e3b") },
      uColorB: { value: new THREE.Color("#10b981") },
      uColorC: { value: new THREE.Color("#fbbf24") },
    }),
    []
  );

  // Particle ring representing Hacia v2 backend orbiting v3 core
  const ringGeo = useMemo(() => {
    const count = 2400;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const c1 = new THREE.Color("#34d399");
    const c2 = new THREE.Color("#fbbf24");
    const tmp = new THREE.Color();

    let seed = 918273;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };

    for (let i = 0; i < count; i++) {
      const r = project.bodyRadius * (1.42 + rand() * 0.72);
      const a = rand() * Math.PI * 2;
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = (rand() - 0.5) * 0.08;
      positions[i * 3 + 2] = Math.sin(a) * r;

      tmp.copy(c1).lerp(c2, rand());
      colors[i * 3] = tmp.r;
      colors[i * 3 + 1] = tmp.g;
      colors[i * 3 + 2] = tmp.b;
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return g;
  }, [project.bodyRadius]);

  useFrame(({ clock }, delta) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.14;
    }
    if (ringRef.current) {
      ringRef.current.rotation.y -= delta * 0.12;
    }
  });

  return (
    <group position={pos}>
      <mesh
        ref={planetRef}
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
          fragmentShader={BANDS_FRAGMENT}
          uniforms={uniforms}
        />
      </mesh>

      <points ref={ringRef} geometry={ringGeo} rotation={[0.42, 0.2, 0.18]}>
        <pointsMaterial
          size={0.055}
          vertexColors
          transparent
          opacity={0.85}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

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
