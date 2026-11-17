"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Project } from "@/content/projects";
import { getProjectPosition } from "@/lib/cameraRail";
import { useExperience } from "@/state/useExperience";
import { HoloTag } from "../HoloTag";

export function OriginsBelt({ project }: { project: Project }) {
  const pos = useMemo(() => getProjectPosition(project), [project]);
  const instancedRef = useRef<THREE.InstancedMesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const heroGroupRef = useRef<THREE.Group>(null);

  const focusBody = useExperience((s) => s.focusBody);
  const setHoveredSlug = useExperience((s) => s.setHoveredSlug);

  // 180 instanced rocky asteroids sweeping an arc around the 2023 rim
  const asteroidCount = 180;
  useEffect(() => {
    if (!instancedRef.current) return;
    const dummy = new THREE.Object3D();
    let seed = 202308;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };

    for (let i = 0; i < asteroidCount; i++) {
      const ang = project.orbitAngle + (rand() - 0.5) * 1.45;
      const rad = project.orbitRadius + (rand() - 0.5) * 2.8;
      const y = project.elevation + (rand() - 0.5) * 1.3;
      dummy.position.set(Math.cos(ang) * rad, y, Math.sin(ang) * rad);
      dummy.rotation.set(rand() * Math.PI, rand() * Math.PI, rand() * Math.PI);
      const scale = 0.08 + rand() * 0.22;
      dummy.scale.set(scale * (0.8 + rand() * 0.5), scale, scale * (0.8 + rand() * 0.5));
      dummy.updateMatrix();
      instancedRef.current.setMatrixAt(i, dummy.matrix);
    }
    instancedRef.current.instanceMatrix.needsUpdate = true;
  }, [project.elevation, project.orbitAngle, project.orbitRadius]);

  // 5 Hero Asteroids (Swift, Elixer, Oslea, Paoz, IdealZW)
  const heroAsteroids = useMemo(() => {
    const children = project.children ?? [];
    return children.map((child, idx) => {
      const offsetAngle = (idx - 2) * 0.11;
      const ang = project.orbitAngle + offsetAngle;
      const rad = project.orbitRadius + (idx % 2 === 0 ? 0.55 : -0.55);
      const y = project.elevation + Math.sin(idx * 1.2) * 0.4;
      return {
        ...child,
        position: new THREE.Vector3(Math.cos(ang) * rad, y, Math.sin(ang) * rad),
        scale: idx === 0 ? 0.62 : 0.44, // Swift is largest
      };
    });
  }, [project]);

  // Evolution beam from Swift asteroid -> Spotly core (0,0,0)
  const { evolutionCurve, evolutionGeo } = useMemo(() => {
    const swiftPos = heroAsteroids[0]?.position ?? pos;
    const mid = swiftPos.clone().multiplyScalar(0.5).add(new THREE.Vector3(0, 3.6, 0));
    const curve = new THREE.QuadraticBezierCurve3(swiftPos, mid, new THREE.Vector3(0, 0, 0));
    return {
      evolutionCurve: curve,
      evolutionGeo: new THREE.TubeGeometry(curve, 64, 0.032, 8, false),
    };
  }, [heroAsteroids, pos]);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    if (heroGroupRef.current) {
      heroGroupRef.current.children.forEach((child, idx) => {
        child.rotation.y += delta * (0.25 + idx * 0.06);
        child.rotation.x += delta * 0.12;
      });
    }
    if (pulseRef.current) {
      const p = (t * 0.22) % 1;
      pulseRef.current.position.copy(evolutionCurve.getPoint(p));
    }
  });

  return (
    <group>
      {/* Instanced Asteroid Arc */}
      <instancedMesh ref={instancedRef} args={[undefined, undefined, asteroidCount]}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#475569" roughness={0.85} metalness={0.25} flatShading />
      </instancedMesh>

      {/* 5 Hero Asteroids */}
      <group ref={heroGroupRef}>
        {heroAsteroids.map((hero) => (
          <mesh
            key={hero.slug}
            position={hero.position}
            scale={hero.scale}
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
            <icosahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color={hero.accent ?? "#fb7185"}
              emissive={hero.accent ?? "#fb7185"}
              emissiveIntensity={0.65}
              roughness={0.35}
              metalness={0.5}
              flatShading
            />
          </mesh>
        ))}
      </group>

      {/* Swift -> Spotly Evolution Beam */}
      <mesh geometry={evolutionGeo}>
        <meshBasicMaterial
          color="#f59e0b"
          transparent
          opacity={0.28}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.14, 12, 12]} />
        <meshBasicMaterial color="#fbbf24" />
      </mesh>

      {/* Beacon positioned at belt anchor */}
      <group position={pos}>
        <HoloTag
          slug={project.slug}
          name={project.name}
          era={project.era}
          color={project.color}
          offsetY={1.55}
        />
      </group>
    </group>
  );
}
