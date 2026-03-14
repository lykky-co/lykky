'use client'

import { useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Simplex 3D Noise — Ian McEwan, Ashima Arts (MIT)
// https://github.com/ashima/webgl-noise
const simplexNoise = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
  + i.y + vec4(0.0, i1.y, i2.y, 1.0))
  + i.x + vec4(0.0, i1.x, i2.x, 1.0));

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

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`

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

  float speed = uTime * 0.15;
  float mouseInfluence = uMouse.x * 0.3 + uMouse.y * 0.2;

  float noise1 = snoise(position * 0.8 + vec3(speed, speed * 0.7, mouseInfluence));
  float noise2 = snoise(position * 1.6 + vec3(speed * 1.3, -speed * 0.5, mouseInfluence * 0.5));
  float noise3 = snoise(position * 3.2 + vec3(-speed * 0.8, speed * 1.1, mouseInfluence * 0.3));

  float displacement = noise1 * 0.12 + noise2 * 0.05 + noise3 * 0.02;
  vDisplacement = displacement;

  vec3 newPosition = position + normal * displacement;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`

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

  float ribbonBase = vPosition.y * 2.0 + vPosition.x * 0.3;

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

  float aurora = sin(ribbonBase * 3.0 + n1 * 2.5 + n2 * 1.5) * 0.5 + 0.5;
  aurora = pow(aurora, 2.5);
  aurora *= 0.7 + 0.3 * (n3 * 0.5 + 0.5);

  float aurora2 = sin(ribbonBase * 5.0 + n2 * 3.0 - n1 * 1.0 + speed * 0.3) * 0.5 + 0.5;
  aurora2 = pow(aurora2, 3.5);
  aurora2 *= 0.4;

  vec3 greenBright  = vec3(0.45, 0.95, 0.65);
  vec3 greenPrimary = vec3(0.494, 0.722, 0.635);
  vec3 tealDeep     = vec3(0.18, 0.55, 0.58);
  vec3 blueElectric = vec3(0.22, 0.42, 0.85);
  vec3 violetSoft   = vec3(0.55, 0.30, 0.75);
  vec3 magentaWarm  = vec3(0.78, 0.25, 0.55);
  vec3 cyanGlow     = vec3(0.30, 0.85, 0.80);

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

  float mix1 = smoothstep(-0.4, 0.6, colorNoise);
  vec3 auroraColor = mix(tealDeep, greenPrimary, mix1);

  float greenFlare = smoothstep(0.3, 0.7, n1 + 0.2 * sin(speed * 0.5));
  auroraColor = mix(auroraColor, greenBright, greenFlare * 0.5);

  float blueZone = smoothstep(-0.2, 0.4, colorBand - vPosition.y * 0.2);
  auroraColor = mix(auroraColor, blueElectric, blueZone * 0.45);

  float violetZone = smoothstep(0.1, 0.7, n2 + vPosition.y * 0.25);
  auroraColor = mix(auroraColor, violetSoft, violetZone * 0.4);

  float magentaEdge = smoothstep(0.5, 0.9, abs(colorNoise) + abs(n3) * 0.3);
  auroraColor = mix(auroraColor, magentaWarm, magentaEdge * 0.25);

  float cyanPeak = pow(max(aurora, 0.0), 3.0) * smoothstep(0.2, 0.6, n1);
  auroraColor = mix(auroraColor, cyanGlow, cyanPeak * 0.3);

  float edgeBright = pow(aurora, 0.4) * 1.4;
  auroraColor *= edgeBright;

  vec3 viewDir = normalize(cameraPosition - vPosition);
  float fresnel = 1.0 - abs(dot(normalize(vNormal), viewDir));
  fresnel = pow(fresnel, 2.5);

  vec3 rimColor = mix(greenPrimary, auroraColor, 0.5) * 0.5;

  float totalAurora = clamp(aurora + aurora2, 0.0, 1.0);

  vec3 baseColor = vec3(0.02, 0.02, 0.03);
  float dispGlow = smoothstep(-0.05, 0.12, vDisplacement) * 0.15;

  vec3 finalColor = baseColor;
  finalColor += auroraColor * totalAurora * 1.1;
  finalColor += rimColor * fresnel * 0.6;
  finalColor += greenPrimary * dispGlow;

  float breathe = sin(uTime * 0.3) * 0.08 + 0.92;
  finalColor *= breathe;

  gl_FragColor = vec4(finalColor, uOpacity);
}
`

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

const wireFragmentShader = /* glsl */ `
uniform float uOpacity;
varying vec3 vPos;

void main() {
  gl_FragColor = vec4(0.494, 0.722, 0.635, uOpacity * 0.08);
}
`

const targetMouse = { x: 0, y: 0 }
const smoothMouse = { x: 0, y: 0 }

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

function MouseSmoother() {
  useFrame(() => {
    smoothMouse.x += (targetMouse.x - smoothMouse.x) * 0.04
    smoothMouse.y += (targetMouse.y - smoothMouse.y) * 0.04
  })

  return null
}

function getIsMobile() {
  if (typeof window === 'undefined') return false
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth < 768
  )
}

interface IcosahedronMeshProps {
  radius: number
  detail: number
  vertexShader: string
  fragmentShader: string
  wireframe?: boolean
  depthWrite?: boolean
  side?: THREE.Side
}

function IcosahedronMesh({
  radius,
  detail,
  vertexShader,
  fragmentShader,
  wireframe = false,
  depthWrite = true,
  side = THREE.FrontSide,
}: IcosahedronMeshProps) {
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

    uniforms.uTime.value = elapsed
    uniforms.uMouse.value.set(smoothMouse.x, smoothMouse.y)

    if (uniforms.uOpacity.value < 1.0) {
      uniforms.uOpacity.value = Math.min(1.0, elapsed * 0.5)
    }

    if (meshRef.current) {
      meshRef.current.rotation.y = elapsed * 0.06
      meshRef.current.rotation.x = Math.sin(elapsed * 0.04) * 0.15

      if (!isMobile.current) {
        meshRef.current.rotation.y += smoothMouse.x * 0.15
        meshRef.current.rotation.x += smoothMouse.y * 0.1
      }
    }
  })

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[radius, detail]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        wireframe={wireframe}
        depthWrite={depthWrite}
        side={side}
      />
    </mesh>
  )
}

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
        <IcosahedronMesh
          radius={1.6}
          detail={5}
          vertexShader={auroraVertexShader}
          fragmentShader={auroraFragmentShader}
          side={THREE.DoubleSide}
        />
        <IcosahedronMesh
          radius={1.62}
          detail={2}
          vertexShader={wireVertexShader}
          fragmentShader={wireFragmentShader}
          wireframe
          depthWrite={false}
        />
      </Canvas>
    </div>
  )
}
