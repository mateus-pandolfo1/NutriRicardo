"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { cameraState } from "@/lib/cameraState";

// Mobile-aware particle count
const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
const PARTICLE_COUNT = isMobile ? 600 : 1100;

const vertexShader = `
  uniform float uTime;
  uniform float uMouseX;
  uniform float uMouseY;
  attribute float aSize;
  varying float vAlpha;

  void main() {
    vec3 pos = position;

    // Gentle drift
    pos.x += sin(uTime * 0.2 + position.z * 0.35) * 0.09;
    pos.y += cos(uTime * 0.14 + position.x * 0.25) * 0.08;

    // Mouse repulsion (subtle)
    float dx = pos.x - uMouseX * 2.8;
    float dy = pos.y - uMouseY * 2.0;
    float dist = length(vec2(dx, dy));
    pos.z += max(0.0, 1.0 - dist / 3.5) * 0.8;

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPos;
    gl_PointSize = aSize * (160.0 / -mvPos.z);
    gl_PointSize = clamp(gl_PointSize, 0.4, 5.5);
    vAlpha = clamp(1.0 - (-mvPos.z - 1.5) / 26.0, 0.0, 1.0);
  }
`;

const fragmentShader = `
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float dist = length(uv);
    if (dist > 0.5) discard;

    float alpha = pow(1.0 - smoothstep(0.08, 0.5, dist), 1.4);
    float core  = 1.0 - smoothstep(0.0, 0.14, dist);

    gl_FragColor = vec4(vec3(0.7 + core * 0.3), alpha * vAlpha * 0.65);
  }
`;

export default function ParticleField() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const { positions, sizes } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const sz  = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = 1.8 + Math.random() * 11;

      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = (Math.random() - 0.5) * 22;

      sz[i] = 0.3 + Math.random() * 1.8;
    }
    return { positions: pos, sizes: sz };
  }, []);

  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uMouseX: { value: 0 }, uMouseY: { value: 0 } }),
    []
  );

  useFrame(({ clock }) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value  = clock.elapsedTime;
    materialRef.current.uniforms.uMouseX.value = cameraState.mouseX;
    materialRef.current.uniforms.uMouseY.value = cameraState.mouseY;
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSize"    args={[sizes, 1]}    />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
