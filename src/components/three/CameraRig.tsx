"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  ABOUT_CAMERA_POS,
  ABOUT_CAMERA_TARGET,
  OVERVIEW_CAMERA_POS,
  OVERVIEW_CAMERA_TARGET,
  buildCameraRail,
  getProjectPosition,
  poseBySlug,
} from "@/lib/cameraRail";
import { getProjectBySlug } from "@/content/projects";
import { useExperience } from "@/state/useExperience";

export function CameraRig() {
  const { camera, pointer } = useThree();
  const phase = useExperience((s) => s.phase);
  const activeSlug = useExperience((s) => s.activeSlug);
  const scrollProgress = useExperience((s) => s.scrollProgress);

  const { positionCurve, targetCurve } = useMemo(() => buildCameraRail(), []);

  const desiredPos = useRef(OVERVIEW_CAMERA_POS.clone());
  const desiredTarget = useRef(OVERVIEW_CAMERA_TARGET.clone());
  const currentTarget = useRef(OVERVIEW_CAMERA_TARGET.clone());

  // Set initial camera placement on mount
  useEffect(() => {
    camera.position.copy(OVERVIEW_CAMERA_POS);
    camera.lookAt(OVERVIEW_CAMERA_TARGET);
  }, [camera]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.15);
    const parallaxX = pointer.x * 0.85;
    const parallaxY = pointer.y * 0.5;

    if (phase === "boot") {
      desiredPos.current.set(parallaxX * 1.4, 21 + parallaxY, 35);
      desiredTarget.current.set(0, 0, 0);
    } else if (phase === "warp") {
      desiredPos.current.set(0, 17, 31);
      desiredTarget.current.set(0, -0.5, 0);
    } else if (phase === "about") {
      desiredPos.current.copy(ABOUT_CAMERA_POS).add(new THREE.Vector3(parallaxX * 0.45, parallaxY * 0.3, 0));
      desiredTarget.current.copy(ABOUT_CAMERA_TARGET);
    } else if (phase === "focus" && activeSlug) {
      const knownPose = poseBySlug[activeSlug];
      if (knownPose) {
        desiredPos.current
          .copy(knownPose.dockPosition)
          .add(new THREE.Vector3(parallaxX * 0.25, parallaxY * 0.2, 0));
        desiredTarget.current.copy(knownPose.dockTarget);
      } else {
        const archive = getProjectBySlug(activeSlug);
        if (archive) {
          const p = getProjectPosition(archive);
          const out = p.clone().setY(0).normalize();
          desiredPos.current.copy(p).addScaledVector(out, 3.2).add(new THREE.Vector3(0, 1.1, 0));
          desiredTarget.current.copy(p).add(new THREE.Vector3(0.6, 0, 0));
        }
      }
    } else {
      // Overview scroll rail
      const t = THREE.MathUtils.clamp(scrollProgress, 0, 1);
      positionCurve.getPointAt(t, desiredPos.current);
      targetCurve.getPointAt(t, desiredTarget.current);
      desiredPos.current.x += parallaxX;
      desiredPos.current.y += parallaxY;
    }

    const damping = phase === "warp" ? 6.5 : 3.8;
    const alpha = 1 - Math.exp(-damping * dt);

    camera.position.lerp(desiredPos.current, alpha);
    currentTarget.current.lerp(desiredTarget.current, alpha);
    camera.lookAt(currentTarget.current);
  });

  return null;
}
