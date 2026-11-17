export const GALAXY_VERTEX_SHADER = /* glsl */ `
attribute float aRadius;
attribute float aArm;
attribute float aRand;
attribute float aSize;
attribute vec3 aColor;

uniform float uTime;
uniform float uArms;
uniform float uPixelRatio;

varying vec3 vColor;
varying float vAlpha;

void main() {
  float spin = uTime * 0.045 / (aRadius * 0.35 + 1.2);
  float branchAngle = (aArm / uArms) * 6.2831853;
  float spiralAngle = aRadius * 0.24;
  float scatterAngle = (aRand - 0.5) * (0.45 + 0.06 * aRadius);
  float angle = branchAngle + spiralAngle - spin + scatterAngle;

  float yScatter = (fract(aRand * 19.37) - 0.5) * (2.6 / (1.0 + aRadius * 0.14));
  float radialJitter = (fract(aRand * 41.13) - 0.5) * (0.6 + aRadius * 0.09);
  float r = max(0.4, aRadius + radialJitter);

  vec3 pos = vec3(cos(angle) * r, yScatter, sin(angle) * r);
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

  gl_PointSize = aSize * uPixelRatio * (120.0 / max(1.0, -mvPosition.z));
  gl_PointSize = clamp(gl_PointSize, 1.0, 14.0);
  gl_Position = projectionMatrix * mvPosition;

  vColor = aColor;
  vAlpha = smoothstep(32.0, 2.0, r) * 0.85 + 0.12;
}
`;

export const GALAXY_FRAGMENT_SHADER = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;

void main() {
  vec2 uv = gl_PointCoord - vec2(0.5);
  float d = length(uv);
  if (d > 0.5) discard;

  float core = smoothstep(0.5, 0.0, d);
  float glow = pow(core, 2.2);
  gl_FragColor = vec4(vColor * (0.85 + glow * 0.75), glow * vAlpha);
}
`;
