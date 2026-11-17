import { SIMPLEX_NOISE_3D } from "./noise";

export const STAR_SURFACE_VERTEX = /* glsl */ `
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWorldPos;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vPosition = position;
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vWorldPos = worldPosition.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
`;

export const STAR_SURFACE_FRAGMENT = /* glsl */ `
${SIMPLEX_NOISE_3D}

uniform float uTime;
uniform vec3 uCoreColor;
uniform vec3 uFlareColor;
uniform vec3 uAccentColor;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWorldPos;

void main() {
  vec3 p = normalize(vPosition) * 2.4;
  float n1 = fbm(p + vec3(uTime * 0.18, -uTime * 0.12, uTime * 0.08));
  float n2 = fbm(p * 2.1 - vec3(uTime * 0.25, uTime * 0.16, -uTime * 0.15));
  float plasma = clamp(n1 * 0.65 + n2 * 0.45 + 0.52, 0.0, 1.0);

  vec3 viewDir = normalize(cameraPosition - vWorldPos);
  float fresnel = pow(1.0 - max(0.0, dot(normalize(vNormal), viewDir)), 2.5);

  vec3 col = mix(uFlareColor, uCoreColor, smoothstep(0.2, 0.85, plasma));
  col += uAccentColor * pow(plasma, 4.0) * 0.55;
  col += uCoreColor * fresnel * 0.9;

  gl_FragColor = vec4(col * 1.35, 1.0);
}
`;

export const CORONA_VERTEX = /* glsl */ `
varying vec3 vNormal;
varying vec3 vWorldPos;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorldPos = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;

export const CORONA_FRAGMENT = /* glsl */ `
uniform vec3 uColor;
uniform float uIntensity;

varying vec3 vNormal;
varying vec3 vWorldPos;

void main() {
  vec3 viewDir = normalize(cameraPosition - vWorldPos);
  // BackSide normals point outward; dot(-normal, viewDir) is 1 at center, 0 at silhouette rim
  float center = clamp(dot(-normalize(vNormal), viewDir), 0.0, 1.0);
  float glow = pow(center, 3.4);
  float alpha = clamp(glow * uIntensity * 0.72, 0.0, 0.82);
  gl_FragColor = vec4(uColor * 1.4, alpha);
}
`;
