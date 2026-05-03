"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Cores "Cyber-Orgânicas" para os Macronutrientes
const MACRO_COLORS = [
  "#10b981", // Emerald (Fibras/Vitaminas)
  "#f59e0b", // Amber (Carboidratos)
  "#e11d48", // Rose (Proteínas)
  "#00f0ff", // Neon Blue (Água/Minerais/Tech)
];

const PARTICLE_COUNT = 400; // Quantidade de "células"

function MacroTunnel() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Gerar posições, velocidades e cores iniciais
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Distribuição cilíndrica/túnel
      const angle = Math.random() * Math.PI * 2;
      const radius = 2 + Math.random() * 8; // Espaço vazio no centro (raio 2 a 10)
      
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const z = (Math.random() - 0.5) * 100; // Profundidade longa (-50 a 50)
      
      const speed = 0.05 + Math.random() * 0.1; // Velocidade do zoom para cada partícula
      const scale = 0.2 + Math.random() * 0.8; // Tamanhos variados (macromoléculas vs micromoléculas)
      
      const color = new THREE.Color(MACRO_COLORS[Math.floor(Math.random() * MACRO_COLORS.length)]);

      temp.push({ x, y, z, speed, scale, color });
    }
    return temp;
  }, []);

  const colorArray = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    particles.forEach((p, i) => {
      p.color.toArray(arr, i * 3);
    });
    return arr;
  }, [particles]);

  useFrame(() => {
    if (!meshRef.current) return;

    particles.forEach((particle, i) => {
      // Efeito de ZOOM: Mover a partícula na direção da câmera (eixo Z positivo)
      particle.z += particle.speed;

      // Rotação orgânica e flutuação
      const time = performance.now() * 0.001;
      const wobbleX = Math.sin(time * 0.5 + i) * 0.02;
      const wobbleY = Math.cos(time * 0.5 + i) * 0.02;
      
      particle.x += wobbleX;
      particle.y += wobbleY;

      // Se a partícula passar da câmera (Z > 5), mandamos ela lá para o fundo (Z = -50)
      if (particle.z > 5) {
        particle.z = -50 - Math.random() * 10;
        // Opcional: sortear nova posição XY para variar
        const angle = Math.random() * Math.PI * 2;
        const radius = 2 + Math.random() * 8;
        particle.x = Math.cos(angle) * radius;
        particle.y = Math.sin(angle) * radius;
      }

      // Atualizar a matriz da instância
      dummy.position.set(particle.x, particle.y, particle.z);
      // Rotação em si da célula
      dummy.rotation.x += 0.01;
      dummy.rotation.y += 0.01;
      dummy.scale.set(particle.scale, particle.scale, particle.scale);
      dummy.updateMatrix();

      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
      <sphereGeometry args={[0.5, 16, 16]}>
        <instancedBufferAttribute attach="attributes-color" args={[colorArray, 3]} />
      </sphereGeometry>
      <meshStandardMaterial 
        vertexColors 
        roughness={0.2} 
        metalness={0.8}
        emissive="#000000"
        transparent
        opacity={0.8}
      />
    </instancedMesh>
  );
}

export default function ParticleBackground() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none bg-[#030407]">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <fog attach="fog" args={['#030407', 10, 40]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 0, 0]} intensity={2} color="#ffffff" distance={20} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#00f0ff" />
        <MacroTunnel />
      </Canvas>
    </div>
  );
}
