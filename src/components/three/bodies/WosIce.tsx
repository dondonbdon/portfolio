"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PLANET_VERTEX, ICE_FRAGMENT } from "@/shaders/bodies";
import type { Project } from "@/content/projects";
import { getProjectPosition } from "@/lib/cameraRail";
import { useExperience } from "@/state/useExperience";
import { HoloTag } from "../HoloTag";

export function WosIce({ project }: { project: Project }) {
  const pos = useMemo(() => getProjectPosition(project), [project]);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const planetGroupRef = useRef<THREE.Group>(null);
  const snowRef = useRef<THREE.Points>(null);

  const focusBody = useExperience((s) => s.focusBody);
  const setHoveredSlug = useExperience((s) => s.setHoveredSlug);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uDeepColor: { value: new THREE.Color("#0c243c") },
      uFrostColor: { value: new THREE.Color("#bae6fd") },
    }),
    []
  );

  // Blizzard snow ring around the ice planet
  const snowGeo = useMemo(() => {
    const count = 900;
    const positions = new Float32Array(count * 3);
    let seed = 445566;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };

    for (let i = 0; i < count; i++) {
      const r = project.bodyRadius * (1.2 + rand() * 0.9);
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi);
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [project.bodyRadius]);

  // Mini fortress markers representing Hive / Castle / Foundry tactical nodes
  const fortresses = useMemo(() => {
    const dirs = [
      new THREE.Vector3(1, 0.35, 0.2),
      new THREE.Vector3(-0.7, 0.65, 0.5),
      new THREE.Vector3(0.2, -0.5, 0.85),
      new THREE.Vector3(-0.4, -0.35, -0.82),
    ];
    return dirs.map((d, idx) => {
      const normal = d.normalize();
      const position = normal.clone().multiplyScalar(project.bodyRadius + 0.06);
      const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
      return { id: idx, position, quaternion: quat };
    });
  }, [project.bodyRadius]);

  useFrame(({ clock }, delta) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
    if (planetGroupRef.current) {
      planetGroupRef.current.rotation.y += delta * 0.11;
    }
    if (snowRef.current) {
      snowRef.current.rotation.y -= delta * 0.32;
      snowRef.current.rotation.x += delta * 0.09;
    }
  });

  return (
    <group position={pos}>
      <group ref={planetGroupRef}>
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
            fragmentShader={ICE_FRAGMENT}
            uniforms={uniforms}
          />
        </mesh>

        {/* Tactical Fortress Turrets */}
        {fortresses.map((f) => (
          <mesh key={f.id} position={f.position} quaternion={f.quaternion}>
            <cylinderGeometry args={[0.08, 0.14, 0.18, 6]} />
            <meshStandardMaterial
              color="#e0f2fe"
              emissive="#38bdf8"
              emissiveIntensity={0.8}
              metalness={0.7}
              roughness={0.25}
            />
          </mesh>
        ))}
      </group>

      <points ref={snowRef} geometry={snowGeo}>
        <pointsMaterial
          color="#e0f2fe"
          size={0.04}
          transparent
          opacity={0.72}
          depthWrite={false}
        />
      </points>

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
