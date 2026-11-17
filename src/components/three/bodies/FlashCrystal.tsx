"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Project } from "@/content/projects";
import { getProjectPosition } from "@/lib/cameraRail";
import { useExperience } from "@/state/useExperience";
import { HoloTag } from "../HoloTag";

export function FlashCrystal({ project }: { project: Project }) {
  const pos = useMemo(() => getProjectPosition(project), [project]);
  const coreRef = useRef<THREE.Mesh>(null);
  const cardsRef = useRef<THREE.Group>(null);
  const focusBody = useExperience((s) => s.focusBody);
  const setHoveredSlug = useExperience((s) => s.setHoveredSlug);

  const cards = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => {
      const angle = (i / 10) * Math.PI * 2;
      const radius = project.bodyRadius * 1.65 + (i % 2) * 0.35;
      const y = Math.sin(i * 1.4) * 0.55;
      return { id: i, angle, radius, y };
    });
  }, [project.bodyRadius]);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.25;
      coreRef.current.rotation.x = Math.sin(t * 0.4) * 0.18;
    }
    if (cardsRef.current) {
      cardsRef.current.rotation.y -= delta * 0.22;
      cardsRef.current.children.forEach((child, idx) => {
        child.rotation.y = t * 0.8 + idx;
        child.rotation.x = Math.sin(t * 0.7 + idx) * 0.35;
      });
    }
  });

  return (
    <group position={pos}>
      <pointLight color="#38bdf8" intensity={6} distance={10} />

      {/* Refractive Crystal Core */}
      <mesh
        ref={coreRef}
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
        <icosahedronGeometry args={[project.bodyRadius, 1]} />
        <meshPhysicalMaterial
          color="#38bdf8"
          emissive="#0369a1"
          emissiveIntensity={0.55}
          roughness={0.12}
          metalness={0.45}
          clearcoat={1}
          clearcoatRoughness={0.08}
          iridescence={0.85}
          transparent
          opacity={0.82}
          flatShading
        />
      </mesh>

      {/* Outer Facet Wireframe */}
      <mesh scale={1.015}>
        <icosahedronGeometry args={[project.bodyRadius, 1]} />
        <meshBasicMaterial color="#bae6fd" wireframe transparent opacity={0.38} />
      </mesh>

      {/* Inner Glowing Knowledge Lattice */}
      <mesh scale={0.62}>
        <octahedronGeometry args={[project.bodyRadius, 0]} />
        <meshBasicMaterial color="#e0f2fe" wireframe transparent opacity={0.75} />
      </mesh>

      {/* Orbiting Flashcard Shards */}
      <group ref={cardsRef}>
        {cards.map((card) => (
          <mesh
            key={card.id}
            position={[
              Math.cos(card.angle) * card.radius,
              card.y,
              Math.sin(card.angle) * card.radius,
            ]}
          >
            <boxGeometry args={[0.38, 0.52, 0.03]} />
            <meshStandardMaterial
              color="#bae6fd"
              emissive="#38bdf8"
              emissiveIntensity={0.7}
              roughness={0.15}
              metalness={0.5}
              transparent
              opacity={0.86}
            />
          </mesh>
        ))}
      </group>

      <HoloTag
        slug={project.slug}
        name={project.name}
        era={project.era}
        color={project.color}
        offsetY={project.bodyRadius + 1.0}
      />
    </group>
  );
}
