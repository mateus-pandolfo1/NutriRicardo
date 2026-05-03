"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const subtleMacros = [
  { text: "FIBRAS", top: "30%", left: "20%", delay: 0 },
  { text: "PROTEÍNAS", top: "50%", left: "70%", delay: 3 },
  { text: "VITAMINAS", top: "70%", left: "25%", delay: 6 },
  { text: "CARBOIDRATOS", top: "40%", left: "80%", delay: 9 },
  { text: "LIPÍDIOS", top: "20%", left: "60%", delay: 12 },
];

export default function CookingBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 bg-[#030407] overflow-hidden">
      {/* Video de Fundo */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      >
        <source src="/assets/cooking.mp4" type="video/mp4" />
      </video>

      {/* Camada Escura - clareada para mostrar melhor o vídeo */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030407]/80 via-[#030407]/40 to-[#030407]/80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#030407_100%)] opacity-50" />

      {/* Marcadores Animados - Mais visíveis */}
      {mounted && subtleMacros.map((macro, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
          animate={{ 
            opacity: [0, 0.8, 0], // Aumentei de 0.4 para 0.8
            scale: [0.9, 1, 1.1],
            filter: ["blur(10px)", "blur(0px)", "blur(10px)"] 
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: macro.delay,
            ease: "easeInOut",
          }}
          className="absolute flex items-center gap-2 pointer-events-none" // Removido "hidden md:"
          style={{ top: macro.top, left: macro.left }}
        >
          <div className="w-1 h-1 md:w-2 md:h-2 rounded-full bg-[#00f0ff] animate-pulse shadow-[0_0_10px_#00f0ff]" />
          <span className="font-space-grotesk font-bold text-white/80 tracking-[0.3em] text-sm md:text-base uppercase drop-shadow-md">
            {macro.text}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
