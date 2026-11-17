import * as THREE from "three";
import { featuredProjects, type Project } from "@/content/projects";

export interface BodySpatialPose {
  slug: string;
  position: THREE.Vector3;
  dockPosition: THREE.Vector3;
  dockTarget: THREE.Vector3;
  railT: number;
}

export function getProjectPosition(project: Project): THREE.Vector3 {
  const x = Math.cos(project.orbitAngle) * project.orbitRadius;
  const z = Math.sin(project.orbitAngle) * project.orbitRadius;
  return new THREE.Vector3(x, project.elevation, z);
}

/**
 * Compute camera dock position & lookAt target so the planet frames cleanly
 * on the left side of the viewport while the ProjectPanel slides in on the right.
 */
export function getBodySpatialPose(
  project: Project,
  index: number,
  total: number
): BodySpatialPose {
  const pos = getProjectPosition(project);
  const dist = Math.max(project.bodyRadius * 4.1, 5.8);

  if (project.orbitRadius === 0) {
    // Spotly galactic core — elevated diagonal hero shot
    const dockPosition = new THREE.Vector3(dist * 0.72, dist * 0.36, dist * 0.96);
    const forward = pos.clone().sub(dockPosition).normalize();
    const camRight = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();
    const dockTarget = pos.clone().addScaledVector(camRight, project.bodyRadius * 0.58);
    return {
      slug: project.slug,
      position: pos,
      dockPosition,
      dockTarget,
      railT: (index + 1) / (total + 1),
    };
  }

  // Approach from outside + slightly above orbital plane
  const radialOut = pos.clone().setY(0).normalize();
  const tangent = new THREE.Vector3(-radialOut.z, 0, radialOut.x);

  const dockPosition = pos
    .clone()
    .addScaledVector(radialOut, dist * 0.86)
    .addScaledVector(tangent, dist * 0.56)
    .add(new THREE.Vector3(0, project.bodyRadius * 0.72, 0));

  // Shift lookAt slightly right so the planet sits cleanly at ~36% viewport X
  const forward = pos.clone().sub(dockPosition).normalize();
  const camRight = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();
  const dockTarget = pos.clone().addScaledVector(camRight, project.bodyRadius * 0.62);

  return {
    slug: project.slug,
    position: pos,
    dockPosition,
    dockTarget,
    railT: (index + 1) / (total + 1),
  };
}

export const bodyPoses: BodySpatialPose[] = featuredProjects.map((project, idx) =>
  getBodySpatialPose(project, idx, featuredProjects.length)
);

export const poseBySlug: Record<string, BodySpatialPose> = Object.fromEntries(
  bodyPoses.map((pose) => [pose.slug, pose])
);

// Overview hero vantage point overlooking the spiral galaxy
export const OVERVIEW_CAMERA_POS = new THREE.Vector3(0, 17, 31);
export const OVERVIEW_CAMERA_TARGET = new THREE.Vector3(0, -0.5, 0);

// About / Contact inner-nebula calm vantage point (inside/beyond the solar core)
export const ABOUT_CAMERA_POS = new THREE.Vector3(0, 2.2, 6.2);
export const ABOUT_CAMERA_TARGET = new THREE.Vector3(0, 0.4, 0);

/**
 * Smooth CatmullRomCurve3 sweeping from Overview -> Outer Rim -> Inner Planets -> Core
 */
export function buildCameraRail(): {
  positionCurve: THREE.CatmullRomCurve3;
  targetCurve: THREE.CatmullRomCurve3;
} {
  const posPoints = [
    OVERVIEW_CAMERA_POS.clone(),
    ...bodyPoses.map((b) => b.dockPosition.clone()),
  ];
  const targetPoints = [
    OVERVIEW_CAMERA_TARGET.clone(),
    ...bodyPoses.map((b) => b.dockTarget.clone()),
  ];

  return {
    positionCurve: new THREE.CatmullRomCurve3(posPoints, false, "catmullrom", 0.35),
    targetCurve: new THREE.CatmullRomCurve3(targetPoints, false, "catmullrom", 0.35),
  };
}
