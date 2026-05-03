"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { cameraState } from "@/lib/cameraState";

// ─── Config ───────────────────────────────────────────────────────────────────
const TURNS        = 3.2;
const HEIGHT       = 4.8;
const RADIUS       = 0.82;
const STRAND_PTS   = 90;
const NODE_STEP    = 5;
const CROSSLINKS   = 16;
const RISING_COUNT = 22;

function helixPoint(i: number, offset: number): THREE.Vector3 {
  const t = (i / STRAND_PTS) * Math.PI * 2 * TURNS;
  const y = (i / STRAND_PTS - 0.5) * HEIGHT;
  return new THREE.Vector3(
    Math.cos(t + offset) * RADIUS,
    y,
    Math.sin(t + offset) * RADIUS
  );
}

// ─── Instanced sphere nodes ───────────────────────────────────────────────────
function HelixNodes({ positions, scales }: { positions: Float32Array; scales: Float32Array }) {
  const ref   = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    if (!ref.current) return;
    const n = positions.length / 3;
    for (let i = 0; i < n; i++) {
      dummy.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
      dummy.scale.setScalar(scales[i]);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  }, [positions, scales, dummy]);

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, positions.length / 3]}>
      <sphereGeometry args={[0.048, 9, 9]} />
      <meshStandardMaterial
        color="#ffffff"
        emissive="#ffffff"
        emissiveIntensity={1.8}
        metalness={1}
        roughness={0}
      />
    </instancedMesh>
  );
}

// ─── Rising bio-particles ─────────────────────────────────────────────────────
function RisingParticles() {
  const ref   = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const data = useMemo(() => {
    const arr: { x: number; z: number; y: number; baseSpeed: number; s: number }[] = [];
    for (let i = 0; i < RISING_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r     = RADIUS * (0.2 + Math.random() * 1.1);
      arr.push({
        x: Math.cos(angle) * r,
        z: Math.sin(angle) * r,
        y: (Math.random() - 0.5) * HEIGHT,
        baseSpeed: 0.0025 + Math.random() * 0.005,
        s: 0.012 + Math.random() * 0.022,
      });
    }
    return arr;
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    data.forEach((p, i) => {
      dummy.position.set(p.x, p.y, p.z);
      dummy.scale.setScalar(p.s);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  }, [data, dummy]);

  useFrame(() => {
    if (!ref.current) return;
    const speedMult = cameraState.helixSpeedMult;
    data.forEach((p, i) => {
      p.y += p.baseSpeed * speedMult;
      if (p.y > HEIGHT / 2) p.y = -HEIGHT / 2;
      dummy.position.set(p.x, p.y, p.z);
      dummy.scale.setScalar(p.s * Math.min(speedMult * 0.5 + 0.5, 1.4));
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, RISING_COUNT]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshStandardMaterial
        color="#ffffff"
        emissive="#ffffff"
        emissiveIntensity={4}
        metalness={1}
        roughness={0}
        transparent
        opacity={0.55}
      />
    </instancedMesh>
  );
}

// ─── DNA helix ────────────────────────────────────────────────────────────────
export default function FloatingObjects() {
  const groupRef  = useRef<THREE.Group>(null);
  const rotYRef   = useRef(0); // accumulated rotation

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;

    const speed = 0.11 * cameraState.helixSpeedMult;
    rotYRef.current += delta * speed;
    groupRef.current.rotation.y = rotYRef.current;
    groupRef.current.position.y = Math.sin(clock.elapsedTime * 0.35) * 0.08;

    // Scale pulse during transition
    const targetScale = 1 + Math.max(0, cameraState.helixSpeedMult - 1) * 0.045;
    const cur = groupRef.current.scale.x;
    groupRef.current.scale.setScalar(cur + (Math.min(targetScale, 2.2) - cur) * 0.08);
  });

  const { line1, line2, crossLine, positions, scales } = useMemo(() => {
    const s1: THREE.Vector3[]  = [];
    const s2: THREE.Vector3[]  = [];
    const cross: THREE.Vector3[] = [];
    const pos: number[]        = [];
    const sz: number[]         = [];

    for (let i = 0; i <= STRAND_PTS; i++) {
      const p1 = helixPoint(i, 0);
      const p2 = helixPoint(i, Math.PI);
      s1.push(p1);
      s2.push(p2);

      if (i % NODE_STEP === 0) {
        const s = 0.55 + (i % 3) * 0.25 + Math.sin(i * 0.7) * 0.15;
        pos.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
        sz.push(s, s * 0.85);
      }
    }

    for (let i = 0; i < CROSSLINKS; i++) {
      const idx = Math.round((i / CROSSLINKS) * STRAND_PTS);
      const p1  = helixPoint(idx, 0);
      const p2  = helixPoint(idx, Math.PI);
      cross.push(p1, p2);
      const mid = p1.clone().lerp(p2, 0.5);
      pos.push(mid.x, mid.y, mid.z);
      sz.push(0.9 + (i % 4) * 0.18);
    }

    const strandMat = new THREE.LineBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.28 });
    const crossMat  = new THREE.LineBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.1 });

    return {
      line1:     new THREE.Line(new THREE.BufferGeometry().setFromPoints(s1), strandMat),
      line2:     new THREE.Line(new THREE.BufferGeometry().setFromPoints(s2), strandMat),
      crossLine: new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(cross), crossMat),
      positions: new Float32Array(pos),
      scales:    new Float32Array(sz),
    };
  }, []);

  return (
    <group ref={groupRef}>
      <primitive object={line1} />
      <primitive object={line2} />
      <primitive object={crossLine} />
      <HelixNodes positions={positions} scales={scales} />
      <RisingParticles />
    </group>
  );
}
