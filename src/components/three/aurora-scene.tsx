'use client'

import { useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ============================================================
// GLSL: Simplex 3D Noise (Stefan Gustavson)
// ============================================================
const simplexNoise = /* glsl */ `
//
// Description : Array and textureless GLSL 2D/3D/4D simplex
//               noise functions.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : stegu
//     Lastmod : 20201014 (stegu)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License.
//               https://github.com/ashima/webgl-noise
//

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  // First corner
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  // Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  // Permutations
  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
  + i.y + vec4(0.0, i1.y, i2.y, 1.0))
  + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  // Gradients: 7x7 points over a square, mapped onto an octahedron.
  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  // Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  // Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`

// ============================================================
// Aurora Vertex Shader
// ============================================================
const auroraVertexShader = /* glsl */ `
${simplexNoise}

uniform float uTime;
uniform vec2  uMouse;

varying vec3  vNormal;
varying vec3  vPosition;
varying float vDisplacement;
varying vec2  vUv;

void main() {
  vUv = uv;
  vNormal = normal;
  vPosition = position;

  // Organic vertex displacement — aurora ripple
  float speed = uTime * 0.15;
  float mouseInfluence = uMouse.x * 0.3 + uMouse.y * 0.2;

  // Layered noise for organic displacement
  float noise1 = snoise(position * 0.8 + vec3(speed, speed * 0.7, mouseInfluence));
  float noise2 = snoise(position * 1.6 + vec3(speed * 1.3, -speed * 0.5, mouseInfluence * 0.5));
  float noise3 = snoise(position * 3.2 + vec3(-speed * 0.8, speed * 1.1, mouseInfluence * 0.3));

  float displacement = noise1 * 0.12 + noise2 * 0.05 + noise3 * 0.02;
  vDisplacement = displacement;

  // Displace along normal
  vec3 newPosition = position + normal * displacement;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`

// ============================================================
// Aurora Fragment Shader
// ============================================================
const auroraFragmentShader = /* glsl */ `
${simplexNoise}

uniform float uTime;
uniform vec2  uMouse;
uniform float uOpacity;

varying vec3  vNormal;
varying vec3  vPosition;
varying float vDisplacement;
varying vec2  vUv;

void main() {
  float speed = uTime * 0.1;
  float mouseShift = uMouse.x * 0.5 + uMouse.y * 0.3;

  // --- Aurora bands: horizontal ribbons that undulate ---
  // Use the y-component of position mixed with noise for ribbon pattern
  float ribbonBase = vPosition.y * 2.0 + vPosition.x * 0.3;

  // Multiple noise layers for the aurora curtain effect
  float n1 = snoise(vec3(
    vPosition.x * 0.6 + speed * 0.8,
    vPosition.y * 1.2 + speed * 0.3 + mouseShift,
    vPosition.z * 0.6 + speed * 0.5
  ));

  float n2 = snoise(vec3(
    vPosition.x * 1.2 - speed * 0.5,
    vPosition.y * 2.0 + speed * 0.7 + mouseShift * 0.6,
    vPosition.z * 1.0
  ));

  float n3 = snoise(vec3(
    vPosition.x * 2.5 + speed * 1.2,
    vPosition.y * 0.8 - speed * 0.4 + mouseShift * 0.3,
    vPosition.z * 2.0
  ));

  // Combine into aurora ribbon pattern
  float aurora = sin(ribbonBase * 3.0 + n1 * 2.5 + n2 * 1.5) * 0.5 + 0.5;
  aurora = pow(aurora, 2.5); // sharpen the ribbons
  aurora *= 0.7 + 0.3 * (n3 * 0.5 + 0.5); // modulate intensity

  // Secondary ribbon layer for depth
  float aurora2 = sin(ribbonBase * 5.0 + n2 * 3.0 - n1 * 1.0 + speed * 0.3) * 0.5 + 0.5;
  aurora2 = pow(aurora2, 3.5);
  aurora2 *= 0.4;

  // --- Color palette — real aurora borealis range ---
  vec3 greenBright  = vec3(0.45, 0.95, 0.65);      // vivid aurora green
  vec3 greenPrimary = vec3(0.494, 0.722, 0.635);   // #7eb8a2 Nordic green
  vec3 tealDeep     = vec3(0.18, 0.55, 0.58);      // deep ocean teal
  vec3 blueElectric = vec3(0.22, 0.42, 0.85);      // electric aurora blue
  vec3 violetSoft   = vec3(0.55, 0.30, 0.75);      // soft violet
  vec3 magentaWarm  = vec3(0.78, 0.25, 0.55);      // warm pink/magenta edge
  vec3 cyanGlow     = vec3(0.30, 0.85, 0.80);      // bright cyan flash

  // Noise-driven color zones that shift over time
  float colorNoise = snoise(vec3(
    vPosition.x * 0.5 + speed * 0.6,
    vPosition.y * 0.8 - speed * 0.3,
    vPosition.z * 0.5 + speed * 0.4
  ));

  float colorBand = snoise(vec3(
    vPosition.y * 1.5 + speed * 0.2,
    vPosition.z * 0.6 + speed * 0.5,
    vPosition.x * 0.4
  ));

  // Build color through layered mixing
  // Base: teal-to-green gradient
  float mix1 = smoothstep(-0.4, 0.6, colorNoise);
  vec3 auroraColor = mix(tealDeep, greenPrimary, mix1);

  // Layer 2: bright green flares
  float greenFlare = smoothstep(0.3, 0.7, n1 + 0.2 * sin(speed * 0.5));
  auroraColor = mix(auroraColor, greenBright, greenFlare * 0.5);

  // Layer 3: electric blue bands in lower regions
  float blueZone = smoothstep(-0.2, 0.4, colorBand - vPosition.y * 0.2);
  auroraColor = mix(auroraColor, blueElectric, blueZone * 0.45);

  // Layer 4: violet/purple in upper regions & edges
  float violetZone = smoothstep(0.1, 0.7, n2 + vPosition.y * 0.25);
  auroraColor = mix(auroraColor, violetSoft, violetZone * 0.4);

  // Layer 5: magenta/pink at the extreme edges (rare, like real aurora)
  float magentaEdge = smoothstep(0.5, 0.9, abs(colorNoise) + abs(n3) * 0.3);
  auroraColor = mix(auroraColor, magentaWarm, magentaEdge * 0.25);

  // Layer 6: cyan highlights on bright aurora peaks
  float cyanPeak = pow(max(aurora, 0.0), 3.0) * smoothstep(0.2, 0.6, n1);
  auroraColor = mix(auroraColor, cyanGlow, cyanPeak * 0.3);

  // Brighten the aurora edges with more intensity
  float edgeBright = pow(aurora, 0.4) * 1.4;
  auroraColor *= edgeBright;

  // --- Fresnel rim glow ---
  vec3 viewDir = normalize(cameraPosition - vPosition);
  float fresnel = 1.0 - abs(dot(normalize(vNormal), viewDir));
  fresnel = pow(fresnel, 2.5);

  // Fresnel rim picks up the local aurora color for cohesion
  vec3 rimColor = mix(greenPrimary, auroraColor, 0.5) * 0.5;

  // --- Combine ---
  float totalAurora = aurora + aurora2;
  totalAurora = clamp(totalAurora, 0.0, 1.0);

  // Base darkness of the geometry
  vec3 baseColor = vec3(0.02, 0.02, 0.03);

  // Add displacement-based subtle glow
  float dispGlow = smoothstep(-0.05, 0.12, vDisplacement) * 0.15;

  vec3 finalColor = baseColor;
  finalColor += auroraColor * totalAurora * 1.1;
  finalColor += rimColor * fresnel * 0.6;
  finalColor += greenPrimary * dispGlow;

  // Gentle overall pulsation
  float breathe = sin(uTime * 0.3) * 0.08 + 0.92;
  finalColor *= breathe;

  gl_FragColor = vec4(finalColor, uOpacity);
}
`

// ============================================================
// Wireframe Vertex Shader
// ============================================================
const wireVertexShader = /* glsl */ `
${simplexNoise}

uniform float uTime;
uniform vec2  uMouse;

varying vec3 vPos;

void main() {
  float speed = uTime * 0.15;
  float mouseInfluence = uMouse.x * 0.3 + uMouse.y * 0.2;
  float noise1 = snoise(position * 0.8 + vec3(speed, speed * 0.7, mouseInfluence));
  float noise2 = snoise(position * 1.6 + vec3(speed * 1.3, -speed * 0.5, mouseInfluence * 0.5));
  float displacement = noise1 * 0.12 + noise2 * 0.05;
  vec3 newPosition = position + normal * displacement;
  vPos = newPosition;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`

// ============================================================
// Wireframe Fragment Shader
// ============================================================
const wireFragmentShader = /* glsl */ `
uniform float uOpacity;
varying vec3 vPos;

void main() {
  // Faint green wireframe
  gl_FragColor = vec4(0.494, 0.722, 0.635, uOpacity * 0.08);
}
`

// ============================================================
// Shared state refs for mouse tracking across components
// ============================================================
const targetMouse = { x: 0, y: 0 }
const smoothMouse = { x: 0, y: 0 }

// ============================================================
// MouseTracker — window-level pointer tracking
// ============================================================
function MouseTracker() {
  useEffect(() => {
    function onPointerMove(e: PointerEvent) {
      targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1
      targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1
    }

    function onTouchMove(e: TouchEvent) {
      if (e.touches.length > 0) {
        targetMouse.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1
        targetMouse.y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1
      }
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [])

  return null
}

// ============================================================
// MouseSmoother — lerp smooth mouse toward target each frame
// ============================================================
function MouseSmoother() {
  useFrame(() => {
    const lerpSpeed = 0.04
    smoothMouse.x += (targetMouse.x - smoothMouse.x) * lerpSpeed
    smoothMouse.y += (targetMouse.y - smoothMouse.y) * lerpSpeed
  })

  return null
}

// ============================================================
// Detect mobile (for disabling mouse parallax)
// ============================================================
function getIsMobile() {
  if (typeof window === 'undefined') return false
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth < 768
  )
}

// ============================================================
// AuroraIcosahedron — solid mesh with aurora shaders
// ============================================================
function AuroraIcosahedron() {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const isMobile = useRef(false)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0.0 },
      uMouse: { value: new THREE.Vector2(0.0, 0.0) },
      uOpacity: { value: 0.0 },
    }),
    []
  )

  useEffect(() => {
    isMobile.current = getIsMobile()
  }, [])

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime()

    // Update uniforms
    uniforms.uTime.value = elapsed
    uniforms.uMouse.value.set(smoothMouse.x, smoothMouse.y)

    // Fade in over first 2 seconds
    if (uniforms.uOpacity.value < 1.0) {
      uniforms.uOpacity.value = Math.min(1.0, elapsed * 0.5)
    }

    // Rotation
    if (meshRef.current) {
      const baseRotationSpeed = 0.06
      meshRef.current.rotation.y = elapsed * baseRotationSpeed
      meshRef.current.rotation.x = Math.sin(elapsed * 0.04) * 0.15

      // Mouse parallax (not on mobile)
      if (!isMobile.current) {
        meshRef.current.rotation.y += smoothMouse.x * 0.15
        meshRef.current.rotation.x += smoothMouse.y * 0.1
      }
    }
  })

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.6, 5]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={auroraVertexShader}
        fragmentShader={auroraFragmentShader}
        uniforms={uniforms}
        transparent={true}
        side={THREE.DoubleSide}
        wireframe={false}
      />
    </mesh>
  )
}

// ============================================================
// WireframeOverlay — wireframe mesh on top
// ============================================================
function WireframeOverlay() {
  const meshRef = useRef<THREE.Mesh>(null)
  const isMobile = useRef(false)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0.0 },
      uMouse: { value: new THREE.Vector2(0.0, 0.0) },
      uOpacity: { value: 0.0 },
    }),
    []
  )

  useEffect(() => {
    isMobile.current = getIsMobile()
  }, [])

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime()

    // Update uniforms
    uniforms.uTime.value = elapsed
    uniforms.uMouse.value.set(smoothMouse.x, smoothMouse.y)

    // Fade in over first 2 seconds
    if (uniforms.uOpacity.value < 1.0) {
      uniforms.uOpacity.value = Math.min(1.0, elapsed * 0.5)
    }

    // Match rotation with aurora mesh
    if (meshRef.current) {
      const baseRotationSpeed = 0.06
      meshRef.current.rotation.y = elapsed * baseRotationSpeed
      meshRef.current.rotation.x = Math.sin(elapsed * 0.04) * 0.15

      if (!isMobile.current) {
        meshRef.current.rotation.y += smoothMouse.x * 0.15
        meshRef.current.rotation.x += smoothMouse.y * 0.1
      }
    }
  })

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.62, 2]} />
      <shaderMaterial
        vertexShader={wireVertexShader}
        fragmentShader={wireFragmentShader}
        uniforms={uniforms}
        transparent={true}
        wireframe={true}
        depthWrite={false}
      />
    </mesh>
  )
}

// ============================================================
// AuroraScene — Canvas containing all components
// ============================================================
export default function AuroraScene() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45, near: 0.1, far: 100 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
        style={{ background: '#050508' }}
      >
        <color attach="background" args={['#050508']} />
        <MouseTracker />
        <MouseSmoother />
        <AuroraIcosahedron />
        <WireframeOverlay />
      </Canvas>
    </div>
  )
}
