import { SIMPLEX_NOISE_3D } from "./noise";

export const PLANET_VERTEX = /* glsl */ `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWorldPos;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vPosition = position;
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorldPos = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;

export const BANDS_FRAGMENT = /* glsl */ `
${SIMPLEX_NOISE_3D}

uniform float uTime;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWorldPos;

void main() {
  vec3 p = normalize(vPosition);
  float warp = fbm(p * 3.0 + vec3(uTime * 0.06, 0.0, -uTime * 0.04));
  float lat = p.y * 8.0 + warp * 2.4;
  float band = 0.5 + 0.5 * sin(lat);
  float storm = smoothstep(0.45, 0.85, fbm(p * 5.2 + vec3(0.0, uTime * 0.03, 0.0)) + 0.5);

  vec3 base = mix(uColorA, uColorB, band);
  base = mix(base, uColorC, storm * 0.48);

  vec3 viewDir = normalize(cameraPosition - vWorldPos);
  float fresnel = pow(1.0 - max(0.0, dot(normalize(vNormal), viewDir)), 3.0);
  vec3 lightDir = normalize(vec3(0.0) - vWorldPos);
  float diffuse = max(0.22, dot(normalize(vNormal), lightDir));

  vec3 finalCol = base * diffuse + uColorC * fresnel * 0.75;
  gl_FragColor = vec4(finalCol, 1.0);
}
`;

export const CIRCUIT_FRAGMENT = /* glsl */ `
uniform float uTime;
uniform vec3 uBaseColor;
uniform vec3 uTraceColor;
uniform vec3 uPulseColor;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWorldPos;

void main() {
  vec2 grid = vUv * vec2(28.0, 14.0);
  vec2 cell = fract(grid);
  vec2 id = floor(grid);

  float lineX = step(0.91, cell.x);
  float lineY = step(0.91, cell.y);
  float node = step(0.72, length(cell - 0.5) * -1.0 + 0.9);
  float trace = clamp(lineX + lineY * step(0.35, fract(sin(dot(id, vec2(12.9898,78.233))) * 43758.5453)), 0.0, 1.0);

  float currentWave = smoothstep(0.0, 0.14, fract(vUv.x * 3.0 - uTime * 0.45)) *
                      (1.0 - smoothstep(0.14, 0.35, fract(vUv.x * 3.0 - uTime * 0.45)));

  vec3 viewDir = normalize(cameraPosition - vWorldPos);
  float fresnel = pow(1.0 - max(0.0, dot(normalize(vNormal), viewDir)), 2.8);

  vec3 col = uBaseColor;
  col += uTraceColor * trace * 0.75;
  col += uPulseColor * trace * currentWave * 2.1;
  col += uTraceColor * node * 0.35;
  col += uTraceColor * fresnel * 0.45;

  gl_FragColor = vec4(col, 1.0);
}
`;

export const ICE_FRAGMENT = /* glsl */ `
${SIMPLEX_NOISE_3D}

uniform float uTime;
uniform vec3 uDeepColor;
uniform vec3 uFrostColor;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWorldPos;

void main() {
  vec3 p = normalize(vPosition);
  float ridge = abs(snoise(p * 4.2 + vec3(0.0, uTime * 0.02, 0.0)));
  float crack = 1.0 - smoothstep(0.0, 0.16, ridge);
  float snow = smoothstep(0.1, 0.85, fbm(p * 3.5) + 0.5);

  vec3 col = mix(uDeepColor, uFrostColor, snow * 0.85);
  col += vec3(0.45, 0.85, 1.0) * crack * 0.85;

  vec3 viewDir = normalize(cameraPosition - vWorldPos);
  float fresnel = pow(1.0 - max(0.0, dot(normalize(vNormal), viewDir)), 2.6);
  col += uFrostColor * fresnel * 0.7;

  gl_FragColor = vec4(col, 1.0);
}
`;

export const WARP_VERTEX = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const WARP_FRAGMENT = /* glsl */ `
uniform float uTime;
uniform float uProgress;

varying vec2 vUv;

float hash(float n) {
  return fract(sin(n) * 43758.5453123);
}

void main() {
  vec2 centered = (vUv - 0.5) * vec2(1.6, 1.0);
  float r = length(centered);
  float angle = atan(centered.y, centered.x);

  float sectorCount = 96.0;
  float rawSector = (angle + 3.1415926) / 6.2831853 * sectorCount;
  float sector = floor(rawSector);
  float sectorFrac = fract(rawSector) - 0.5;

  float widthMask = smoothstep(0.28, 0.0, abs(sectorFrac));
  float speed = 2.4 + hash(sector) * 3.8;
  float radial = fract(0.22 / max(0.05, r) - uTime * speed + hash(sector * 7.3));

  float streak = pow(smoothstep(0.55, 0.99, radial), 2.0) * widthMask * smoothstep(0.05, 0.35, r);
  float centerVoid = smoothstep(0.04, 0.28, r);

  vec3 amber = vec3(0.96, 0.68, 0.14);
  vec3 cyan = vec3(0.22, 0.78, 0.99);
  vec3 streakCol = mix(cyan, amber, step(0.5, hash(sector * 3.1)));

  float flash = smoothstep(0.76, 0.99, uProgress);
  vec3 col = streakCol * streak * (1.5 + uProgress * 2.4) + vec3(0.92, 0.97, 1.0) * flash * 0.85;
  float alpha = clamp(streak * centerVoid * 0.95 + flash * 0.9, 0.0, 1.0);

  gl_FragColor = vec4(col, alpha);
}
`;
