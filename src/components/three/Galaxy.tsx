"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { GALAXY_VERTEX_SHADER, GALAXY_FRAGMENT_SHADER } from "@/shaders/galaxy";
import { featuredProjects } from "@/content/projects";
import { useExperience } from "@/state/useExperience";

const PARTICLE_COUNTS = {
  high: 90000,
  medium: 45000,
  low: 16000,
} as const;

function createRng(initialSeed: number) {
  let s = initialSeed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

export function Galaxy() {
  const quality = useExperience((s) => s.quality);
  const count = PARTICLE_COUNTS[quality];
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const { geometry, uniforms } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const radii = new Float32Array(count);
    const arms = new Float32Array(count);
    const rands = new Float32Array(count);
    const sizes = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    const coreCol = new THREE.Color("#fbbf24");
    const midCol = new THREE.Color("#38bdf8");
    const outerCol = new THREE.Color("#10b981");
    const rimCol = new THREE.Color("#fb7185");
    const tmp = new THREE.Color();

    const nextRand = createRng(133742);

    const numArms = 4;

    for (let i = 0; i < count; i++) {
      const t = Math.pow(nextRand(), 1.35);
      const r = 1.6 + t * 28.0;
      const arm = i % numArms;
      const rnd = nextRand();

      radii[i] = r;
      arms[i] = arm;
      rands[i] = rnd;
      sizes[i] = 0.7 + nextRand() * 1.9;

      // Color gradient: amber core -> cyan mid -> emerald/rose outer
      if (t < 0.35) {
        tmp.copy(coreCol).lerp(midCol, t / 0.35);
      } else if (t < 0.75) {
        tmp.copy(midCol).lerp(outerCol, (t - 0.35) / 0.4);
      } else {
        tmp.copy(outerCol).lerp(rimCol, (t - 0.75) / 0.25);
      }

      const brightness = 0.7 + nextRand() * 0.45;
      colors[i * 3] = tmp.r * brightness;
      colors[i * 3 + 1] = tmp.g * brightness;
      colors[i * 3 + 2] = tmp.b * brightness;

      // Placeholder position (computed in vertex shader)
      positions[i * 3] = r;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;
    }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aRadius", new THREE.BufferAttribute(radii, 1));
    geo.setAttribute("aArm", new THREE.BufferAttribute(arms, 1));
    geo.setAttribute("aRand", new THREE.BufferAttribute(rands, 1));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));

    const uni = {
      uTime: { value: 0 },
      uArms: { value: numArms },
      uPixelRatio: { value: Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2) },
    };

    return { geometry: geo, uniforms: uni };
  }, [count]);

  const orbitLines = useMemo(() => {
    return featuredProjects
      .filter((p) => p.orbitRadius > 0)
      .map((p) => {
        const pts: THREE.Vector3[] = [];
        const segments = 96;
        for (let i = 0; i <= segments; i++) {
          const theta = (i / segments) * Math.PI * 2;
          pts.push(
            new THREE.Vector3(
              Math.cos(theta) * p.orbitRadius,
              p.elevation * 0.25,
              Math.sin(theta) * p.orbitRadius
            )
          );
        }
        const curveGeo = new THREE.BufferGeometry().setFromPoints(pts);
        return { slug: p.slug, color: p.color, geometry: curveGeo };
      });
  }, []);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <group>
      <points geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          ref={materialRef}
          vertexShader={GALAXY_VERTEX_SHADER}
          fragmentShader={GALAXY_FRAGMENT_SHADER}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {orbitLines.map((orbit) => (
        <lineLoop key={orbit.slug} geometry={orbit.geometry}>
          <lineBasicMaterial
            color={orbit.color}
            transparent
            opacity={0.14}
            depthWrite={false}
          />
        </lineLoop>
      ))}
    </group>
  );
}
