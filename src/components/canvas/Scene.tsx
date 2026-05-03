"use client";

import { useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import ParticleField from "./ParticleField";
import FloatingObjects from "./FloatingObjects";
import { cameraState } from "@/lib/cameraState";

function CameraRig() {
  const { camera } = useThree();

  useFrame(() => {
    // During a DNA transition, bypass lerp for direct scroll-sync
    if (cameraState.inTransition) {
      camera.position.z = cameraState.transitionZ;
    } else {
      camera.position.z += (cameraState.targetZ - camera.position.z) * 0.038;
    }

    camera.position.y   += (cameraState.targetY - camera.position.y)   * 0.038;
    camera.rotation.y   += (cameraState.mouseX * -0.055 - camera.rotation.y) * 0.018;
    camera.rotation.x   += (cameraState.mouseY * -0.028 - camera.rotation.x) * 0.018;
  });

  return null;
}

function SceneContent() {
  return (
    <>
      <fog attach="fog" args={["#080808", 16, 42]} />
      <ambientLight intensity={0.05} />
      <pointLight position={[0, 0, 2]} intensity={1.0} color="#ffffff" distance={15} />
      <pointLight position={[4, 2, -3]} intensity={0.35} color="#dddddd" distance={20} />

      <CameraRig />
      <FloatingObjects />
      <ParticleField />

      <EffectComposer multisampling={0}>
        <Bloom
          intensity={0.75}
          luminanceThreshold={0.22}
          luminanceSmoothing={0.85}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

export default function Scene() {
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      cameraState.mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
      cameraState.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none bg-transparent" style={{ zIndex: -10 }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 68 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        dpr={[1, 1.2]}
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
