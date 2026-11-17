"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  STAR_SURFACE_VERTEX,
  STAR_SURFACE_FRAGMENT,
  CORONA_VERTEX,
  CORONA_FRAGMENT,
} from "@/shaders/star";
import type { Project } from "@/content/projects";
import { useExperience } from "@/state/useExperience";
import { HoloTag } from "../HoloTag";

export function SpotlyStar({ project }: { project: Project }) {
  const starMatRef = useRef<THREE.ShaderMaterial>(null);
  const moonsGroupRef = useRef<THREE.Group>(null);
  const satsGroupRef = useRef<THREE.Group>(null);
  const focusBody = useExperience((s) => s.focusBody);
  const setHoveredSlug = useExperience((s) => s.setHoveredSlug);

  const surfaceUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uCoreColor: { value: new THREE.Color("#fbbf24") },
      uFlareColor: { value: new THREE.Color("#b45309") },
      uAccentColor: { value: new THREE.Color("#38bdf8") },
    }),
    []
  );

  const coronaUniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color("#f59e0b") },
      uIntensity: { value: 1.45 },
    }),
    []
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (starMatRef.current) {
      starMatRef.current.uniforms.uTime.value = t;
    }
    if (moonsGroupRef.current) {
      moonsGroupRef.current.rotation.y = t * 0.32;
    }
    if (satsGroupRef.current) {
      satsGroupRef.current.rotation.y = -t * 0.48;
      satsGroupRef.current.rotation.z = Math.sin(t * 0.25) * 0.14;
    }
  });

  const verticalMoons = [
    { name: "Ride", color: "#f59e0b", angle: 0, radius: 3.4, y: 0.25 },
    { name: "Send", color: "#38bdf8", angle: (Math.PI * 2) / 3, radius: 3.7, y: -0.3 },
    { name: "Bite", color: "#10b981", angle: (Math.PI * 4) / 3, radius: 3.55, y: 0.15 },
  ];

  const appSatellites = [0, 1, 2, 3];

  return (
    <group position={[0, 0, 0]}>
      <pointLight color="#fbbf24" intensity={45} distance={48} decay={1.4} />

      {/* Main Plasma Star */}
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
        <sphereGeometry args={[project.bodyRadius, 64, 64]} />
        <shaderMaterial
          ref={starMatRef}
          vertexShader={STAR_SURFACE_VERTEX}
          fragmentShader={STAR_SURFACE_FRAGMENT}
          uniforms={surfaceUniforms}
        />
      </mesh>

      {/* Outer Fresnel Corona */}
      <mesh scale={1.28}>
        <sphereGeometry args={[project.bodyRadius, 48, 48]} />
        <shaderMaterial
          vertexShader={CORONA_VERTEX}
          fragmentShader={CORONA_FRAGMENT}
          uniforms={coronaUniforms}
          transparent
          depthWrite={false}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Equator Flare Ring */}
      <mesh rotation={[Math.PI / 2.2, 0.2, 0]}>
        <torusGeometry args={[project.bodyRadius * 1.38, 0.025, 16, 128]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.45} />
      </mesh>

      {/* 3 Orbiting Vertical Moons: Ride, Send, Bite */}
      <group ref={moonsGroupRef}>
        {verticalMoons.map((m) => (
          <group
            key={m.name}
            position={[
              Math.cos(m.angle) * m.radius,
              m.y,
              Math.sin(m.angle) * m.radius,
            ]}
          >
            <mesh>
              <sphereGeometry args={[0.24, 24, 24]} />
              <meshStandardMaterial
                color={m.color}
                emissive={m.color}
                emissiveIntensity={1.1}
                roughness={0.3}
                metalness={0.4}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* 4 Client App Satellites: Super, Driver, Merchant, Admin */}
      <group ref={satsGroupRef}>
        {appSatellites.map((idx) => {
          const ang = (idx / 4) * Math.PI * 2 + 0.4;
          const rad = 4.35;
          return (
            <mesh
              key={idx}
              position={[Math.cos(ang) * rad, (idx % 2 === 0 ? 1 : -1) * 0.45, Math.sin(ang) * rad]}
            >
              <octahedronGeometry args={[0.13, 0]} />
              <meshStandardMaterial
                color="#e2e8f0"
                emissive="#38bdf8"
                emissiveIntensity={1.2}
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
          );
        })}
      </group>

      <HoloTag
        slug={project.slug}
        name={project.name}
        era={project.era}
        color={project.color}
        offsetY={project.bodyRadius + 1.1}
      />
    </group>
  );
}
