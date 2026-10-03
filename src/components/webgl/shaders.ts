/**
 * Mesh-gradient shader for the hero. Original code: hash value-noise + fbm
 * with two-step domain warping (after Inigo Quilez's well-known technique),
 * plus a mouse "lens" that pulls the accent field toward the cursor.
 */
export const vertex = /* glsl */ `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

export const fragment = /* glsl */ `
precision highp float;

uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uRes;
uniform vec3 uBase;
uniform vec3 uAccent;

varying vec2 vUv;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}

void main() {
  float aspect = uRes.x / uRes.y;
  vec2 p = vec2(vUv.x * aspect, vUv.y);
  vec2 m = vec2(uMouse.x * aspect, uMouse.y);
  float t = uTime * 0.045;

  // Mouse lens: bends the field toward the cursor.
  float d = distance(p, m);
  float lens = exp(-d * d * 5.0);
  p += (m - p) * lens * 0.22;

  // Two-step domain warp for slow, liquid motion.
  vec2 q = vec2(fbm(p * 1.2 + t), fbm(p * 1.2 - t + 3.1));
  vec2 r = vec2(fbm(p * 1.5 + q * 1.4 + vec2(1.7, 9.2) + t * 1.1),
                fbm(p * 1.5 + q * 1.4 + vec2(8.3, 2.8) - t));
  float f = fbm(p * 1.0 + r * 1.3);

  // Warm glow: biased to the upper right like the CSS fallback,
  // plus a soft halo that follows the cursor.
  float bias = smoothstep(0.1, 1.0, vUv.y) * (0.55 + 0.45 * smoothstep(0.0, 1.0, vUv.x));
  float glow = smoothstep(0.38, 0.82, f) * bias;
  float a = clamp(glow * 0.9 + lens * 0.35, 0.0, 1.0);

  vec3 col = mix(uBase, uAccent, a * 0.78);

  // Faint contour guides inside the glow only.
  float iso = 1.0 - smoothstep(0.0, 0.06, abs(fract(f * 7.0) - 0.5));
  col = mix(col, uAccent, iso * a * 0.18);

  // Keep the lower area (where the headline sits) calm and legible.
  col = mix(uBase, col, smoothstep(0.12, 0.62, vUv.y));

  // Film grain.
  col += (hash(vUv * uRes + fract(uTime)) - 0.5) * 0.028;

  gl_FragColor = vec4(col, 1.0);
}
`;
