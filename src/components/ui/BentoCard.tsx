"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BentoCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function BentoCard({ children, className, delay = 0 }: BentoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xl p-8",
        "transition-colors hover:border-[#00f0ff]/30 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(0,240,255,0.15)]",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#00f0ff]/5 to-transparent opacity-0 transition-opacity duration-500 hover:opacity-100 pointer-events-none" />
      {children}
    </motion.div>
  );
}
