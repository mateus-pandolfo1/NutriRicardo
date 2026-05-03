"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface NavigationProps {
  onWorkClick: () => void;
  onContactClick: () => void;
}

export default function Navigation({ onWorkClick, onContactClick }: NavigationProps) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5"
    >
      {/* Logo */}
      <div className="relative w-28 h-10">
        <Image
          src="/assets/Logo.png"
          alt="Ricardo Salume Nutricionista"
          fill
          className="object-contain object-left"
          priority
        />
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onWorkClick}
          className="px-4 py-2 rounded-full border border-white/12 text-white/45 text-[11px] font-bold tracking-[0.18em] uppercase hover:border-white/35 hover:text-white/80 transition-all duration-300"
        >
          Serviços
        </button>
        <button
          onClick={onContactClick}
          className="px-4 py-2 rounded-full border border-white/12 text-white/45 text-[11px] font-bold tracking-[0.18em] uppercase hover:border-white/35 hover:text-white/80 transition-all duration-300"
        >
          Contato
        </button>
      </div>
    </motion.nav>
  );
}
