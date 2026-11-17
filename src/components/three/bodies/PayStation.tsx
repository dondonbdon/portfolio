"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { featuredProjects, type Project } from "@/content/projects";
import { getProjectPosition } from "@/lib/cameraRail";
import { useExperience } from "@/state/useExperience";
import { HoloTag } from "../HoloTag";

export function PayStation({ project }: { project: Project }) {
  const pos = useMemo(() => getProjectPosition(project), [project]);
  const stationRef = useRef<THREE.Group>(null);
  const pulse1Ref = useRef<THREE.Mesh>(null);
  const pulse2Ref = useRef<THREE.Mesh>(null);

  const focusBody = useExperience((s) => s.focusBody);
  const hoveredSlug = useExperience((s) => s.hoveredSlug);
  const setHoveredSlug = useExperience((s) => s.setHoveredSlug);
  const isHighlighted = hoveredSlug === project.slug;

  // Bezier curves from PayStation -> Spotly core (0,0,0) and Hacia
  const { curveToCore, curveToHacia, tubeCoreGeo, tubeHaciaGeo } = useMemo(() => {
    const hacia = featuredProjects.find((p) => p.slug === "hacia");
    const haciaPos = hacia ? getProjectPosition(hacia) : new THREE.Vector3(-6, 0, 0);

    const relCore = new THREE.Vector3(0, 0, 0).sub(pos);
    const midCore = relCore.clone().multiplyScalar(0.5).add(new THREE.Vector3(0, 2.8, 0));
    const cCore = new THREE.QuadraticBezierCurve3(new THREE.Vector3(0, 0, 0), midCore, relCore);

    const relHacia = haciaPos.clone().sub(pos);
    const midHacia = relHacia.clone().multiplyScalar(0.5).add(new THREE.Vector3(0, 2.2, 0));
    const cHacia = new THREE.QuadraticBezierCurve3(new THREE.Vector3(0, 0, 0), midHacia, relHacia);

    return {
      curveToCore: cCore,
      curveToHacia: cHacia,
      tubeCoreGeo: new THREE.TubeGeometry(cCore, 44, 0.022, 6, false),
      tubeHaciaGeo: new THREE.TubeGeometry(cHacia, 44, 0.018, 6, false),
    };
  }, [pos]);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    if (stationRef.current) {
      stationRef.current.rotation.y += delta * 0.35;
      stationRef.current.rotation.z = Math.sin(t * 0.5) * 0.16;
    }
    if (pulse1Ref.current) {
      const p1 = (t * 0.42) % 1;
      pulse1Ref.current.position.copy(curveToCore.getPoint(p1));
    }
    if (pulse2Ref.current) {
      const p2 = (t * 0.34 + 0.5) % 1;
      pulse2Ref.current.position.copy(curveToHacia.getPoint(p2));
    }
  });

  return (
    <group position={pos}>
      <group
        ref={stationRef}
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
        {/* Outer Titanium Torus */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[project.bodyRadius, 0.22, 20, 64]} />
          <meshStandardMaterial
            color="#cbd5e1"
            metalness={0.85}
            roughness={0.22}
            emissive="#10b981"
            emissiveIntensity={isHighlighted ? 0.45 : 0.15}
          />
        </mesh>

        {/* Inner Counter-Rotating Ring */}
        <mesh rotation={[Math.PI / 3, 0.4, 0]}>
          <torusGeometry args={[project.bodyRadius * 0.62, 0.08, 12, 48]} />
          <meshStandardMaterial
            color="#10b981"
            emissive="#10b981"
            emissiveIntensity={0.8}
            metalness={0.6}
            roughness={0.25}
          />
        </mesh>

        {/* Central Clearing Core */}
        <mesh>
          <octahedronGeometry args={[0.42, 0]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#f59e0b"
            emissiveIntensity={1.4}
          />
        </mesh>

        {/* 4 Spokes */}
        {[0, 1].map((i) => (
          <mesh key={i} rotation={[0, (i * Math.PI) / 2, Math.PI / 2]}>
            <cylinderGeometry args={[0.04, 0.04, project.bodyRadius * 1.9, 8]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* Kafka / Paynow Event Beams */}
      <mesh geometry={tubeCoreGeo}>
        <meshBasicMaterial
          color="#10b981"
          transparent
          opacity={isHighlighted ? 0.65 : 0.22}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh geometry={tubeHaciaGeo}>
        <meshBasicMaterial
          color="#fbbf24"
          transparent
          opacity={isHighlighted ? 0.55 : 0.16}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Travelling Event Packets */}
      <mesh ref={pulse1Ref}>
        <sphereGeometry args={[0.11, 12, 12]} />
        <meshBasicMaterial color="#34d399" />
      </mesh>
      <mesh ref={pulse2Ref}>
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshBasicMaterial color="#fbbf24" />
      </mesh>

      <HoloTag
        slug={project.slug}
        name={project.name}
        era={project.era}
        color={project.color}
        offsetY={project.bodyRadius + 0.9}
      />
    </group>
  );
}
