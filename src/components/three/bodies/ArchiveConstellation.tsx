"use client";

import { useMemo } from "react";
import { Html, Line } from "@react-three/drei";
import * as THREE from "three";
import { archiveProjects } from "@/content/projects";
import { getProjectPosition } from "@/lib/cameraRail";
import { useExperience } from "@/state/useExperience";

export function ArchiveConstellation() {
  const phase = useExperience((s) => s.phase);
  const hoveredSlug = useExperience((s) => s.hoveredSlug);
  const activeSlug = useExperience((s) => s.activeSlug);
  const setHoveredSlug = useExperience((s) => s.setHoveredSlug);
  const focusBody = useExperience((s) => s.focusBody);

  const nodes = useMemo(
    () =>
      archiveProjects.map((project) => ({
        project,
        pos: getProjectPosition(project),
      })),
    []
  );

  const linePoints = useMemo(() => {
    const pts: [number, number, number][] = nodes.map((n) => [n.pos.x, n.pos.y, n.pos.z]);
    if (pts.length > 1) pts.push(pts[0]);
    return pts;
  }, [nodes]);

  const showLabels = phase === "overview" || phase === "focus";

  return (
    <group>
      {linePoints.length > 1 && (
        <Line
          points={linePoints}
          color="#38bdf8"
          lineWidth={0.8}
          transparent
          opacity={0.18}
        />
      )}

      {nodes.map(({ project, pos }) => {
        const isHovered = hoveredSlug === project.slug;
        const isActive = activeSlug === project.slug;
        return (
          <group key={project.slug} position={pos}>
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
              <sphereGeometry args={[isHovered || isActive ? 0.38 : 0.24, 16, 16]} />
              <meshBasicMaterial color={project.color} />
            </mesh>

            {/* Subtle Star Halo */}
            <mesh scale={isHovered || isActive ? 2.4 : 1.7}>
              <sphereGeometry args={[0.24, 12, 12]} />
              <meshBasicMaterial
                color={project.color}
                transparent
                opacity={0.22}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>

            {showLabels && (isHovered || isActive || phase === "overview") && (
              <Html
                position={[0, 0.65, 0]}
                center
                distanceFactor={30}
                zIndexRange={[5, 0]}
                style={{
                  pointerEvents: "auto",
                  opacity: phase === "focus" && !isActive ? 0.15 : isHovered ? 1 : 0.68,
                  transition: "opacity 200ms ease",
                }}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    focusBody(project.slug);
                  }}
                  onMouseEnter={() => setHoveredSlug(project.slug)}
                  onMouseLeave={() => setHoveredSlug(null)}
                  className="px-2 py-0.5 rounded text-[10px] font-mono tracking-wider text-slate-300 bg-slate-950/75 border border-white/10 hover:border-sky-400/60 hover:text-white whitespace-nowrap cursor-pointer"
                >
                  ✦ {project.name}
                </button>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}
