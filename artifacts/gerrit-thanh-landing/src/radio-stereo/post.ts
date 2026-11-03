// Lens pass: renders the scene into an HDR buffer, then bends it through a fisheye lens,
// adds a soft neon glow around bright parts, tone maps it, lays old-monitor scan lines
// over the hi-fi and puts everything on a clean white page.
import * as THREE from 'three';

/** Diagonal field of view of the fisheye lens, in degrees. */
export const FISHEYE_DEG = 128;
const HALF = (FISHEYE_DEG * Math.PI) / 360;

/** Vertical field of view the scene camera needs so the lens corners line up. */
export const sourceFov = (aspect: number) =>
  (2 * Math.atan(Math.tan(HALF) / Math.hypot(aspect, 1)) * 180) / Math.PI;

/** Maps a point on screen (NDC) to the point in the flat render it shows. Used for clicks. */
export const lensToSource = (x: number, y: number, aspect: number, out: THREE.Vector2) => {
  const diag = Math.hypot(aspect, 1);
  const qx = x * aspect;
  const qy = y;
  const len = Math.hypot(qx, qy);
  if (len < 1e-6) return out.set(0, 0);
  const rho = Math.tan((len / diag) * HALF) / Math.tan(HALF);
  const s = (rho * diag) / len;
  return out.set((qx * s) / aspect, qy * s);
};

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D tScene;
  uniform float aspect;
  uniform float halfFov;
  uniform float exposure;
  uniform float scanPeriod;
  uniform float scanStrength;
  uniform float glow;
  uniform float aberration;
  uniform float dither;
  varying vec2 vUv;

  // 4x4 ordered dither, the soft colour banding of early 2000s consoles
  float bayer4(vec2 p) {
    vec2 q = mod(floor(p), 4.0);
    int i = int(q.x) + int(q.y) * 4;
    const float m[16] = float[16](0., 8., 2., 10., 12., 4., 14., 6., 3., 11., 1., 9., 15., 7., 13., 5.);
    return (m[i] + 0.5) / 16.0;
  }

  vec2 toSource(vec2 ndc) {
    float diag = length(vec2(aspect, 1.0));
    vec2 q = vec2(ndc.x * aspect, ndc.y);
    float len = length(q);
    if (len < 1e-5) return vec2(0.0);
    float rho = tan((len / diag) * halfFov) / tan(halfFov);
    vec2 s = q * (rho * diag / len);
    return vec2(s.x / aspect, s.y);
  }

  vec3 RRTAndODTFit(vec3 v) {
    vec3 a = v * (v + 0.0245786) - 0.000090537;
    vec3 b = v * (0.983729 * v + 0.4329510) + 0.238081;
    return a / b;
  }
  vec3 aces(vec3 color) {
    const mat3 inMat = mat3(
      vec3(0.59719, 0.07600, 0.02840),
      vec3(0.35458, 0.90834, 0.13383),
      vec3(0.04823, 0.01566, 0.83777));
    const mat3 outMat = mat3(
      vec3( 1.60475, -0.10208, -0.00327),
      vec3(-0.53108,  1.10813, -0.07276),
      vec3(-0.07367, -0.00605,  1.07602));
    color *= exposure / 0.6;
    color = inMat * color;
    color = RRTAndODTFit(color);
    color = outMat * color;
    return clamp(color, 0.0, 1.0);
  }
  vec3 toSRGB(vec3 c) {
    return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
  }

  void main() {
    vec2 ndc = vUv * 2.0 - 1.0;
    vec2 s = toSource(ndc);
    float r2 = dot(ndc, ndc) * 0.5;
    vec2 uvG = s * 0.5 + 0.5;
    vec2 uvR = s * (1.0 + aberration * r2) * 0.5 + 0.5;
    vec2 uvB = s * (1.0 - aberration * r2) * 0.5 + 0.5;
    vec4 g = texture2D(tScene, uvG);
    float red = texture2D(tScene, uvR).r;
    float blue = texture2D(tScene, uvB).b;
    float a = clamp(g.a, 0.0, 1.0);
    vec3 col = vec3(red, g.g, blue) / max(a, 0.02);

    // neon glow from the blurred levels of the buffer
    vec3 bloom = max(textureLod(tScene, uvG, 2.0).rgb - 0.75, 0.0) * 0.7
               + max(textureLod(tScene, uvG, 3.5).rgb - 0.4, 0.0) * 0.9
               + max(textureLod(tScene, uvG, 5.0).rgb - 0.22, 0.0) * 0.8;
    col += min(bloom * glow, vec3(1.6));

    vec3 mapped = aces(col);
    float luma = dot(mapped, vec3(0.2126, 0.7152, 0.0722));
    mapped = max(mix(vec3(luma), mapped, 1.14), 0.0);
    // scan lines, only on the hi-fi itself
    float line = step(mod(gl_FragCoord.y, scanPeriod), scanPeriod * 0.34);
    mapped *= 1.0 - scanStrength * line * a;
    vec3 srgb = toSRGB(mapped);
    float levels = 36.0;
    vec3 banded = floor(srgb * levels + bayer4(gl_FragCoord.xy / max(1.0, scanPeriod / 3.0))) / levels;
    srgb = mix(srgb, banded, dither);
    vec3 outColor = mix(vec3(1.0), srgb, a);
    gl_FragColor = vec4(outColor, 1.0);
  }
`;

export class LensPass {
  readonly target: THREE.WebGLRenderTarget;
  private material: THREE.ShaderMaterial;
  private quad: THREE.Mesh;
  private scene = new THREE.Scene();
  private camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  constructor(samples: number) {
    this.target = new THREE.WebGLRenderTarget(4, 4, {
      type: THREE.HalfFloatType,
      samples,
      generateMipmaps: true,
      minFilter: THREE.LinearMipmapLinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: true,
    });
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        tScene: { value: this.target.texture },
        aspect: { value: 1 },
        halfFov: { value: HALF },
        exposure: { value: 1.0 },
        scanPeriod: { value: 3 },
        scanStrength: { value: 0.13 },
        glow: { value: 1.35 },
        aberration: { value: 0.007 },
        dither: { value: 0.55 },
      },
      depthTest: false,
      depthWrite: false,
    });
    this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material);
    this.quad.frustumCulled = false;
    this.scene.add(this.quad);
  }

  setSize(width: number, height: number, scale: number, pixelRatio: number) {
    this.target.setSize(Math.max(2, Math.round(width * scale)), Math.max(2, Math.round(height * scale)));
    this.material.uniforms.aspect.value = width / height;
    this.material.uniforms.scanPeriod.value = Math.max(2, Math.round(3 * pixelRatio));
  }

  render(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera) {
    renderer.setRenderTarget(this.target);
    renderer.setClearColor(0x000000, 0);
    renderer.clear();
    renderer.render(scene, camera);
    renderer.setRenderTarget(null);
    renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.target.dispose();
    this.material.dispose();
    this.quad.geometry.dispose();
  }
}
