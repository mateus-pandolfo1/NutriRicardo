"use client";

import { motion } from "framer-motion";

export default function ContactSection() {
  return (
    <section id="contact" className="relative w-full h-full flex flex-col items-center justify-center px-6 bg-[#0a0a0a]">
      <div className="max-w-4xl w-full mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-white/25 text-[10px] font-bold tracking-[0.45em] uppercase mb-8">
            Começar Agora
          </p>
          <h2 className="text-4xl md:text-6xl font-space-grotesk font-bold text-white mb-8 leading-[0.95] tracking-tighter">
            Transforme seu corpo
            <br />
            <span className="text-white/40">com ciência.</span>
          </h2>
          <p className="text-white/30 text-base mb-14 max-w-sm mx-auto leading-relaxed">
            Nutrição clínica de alta performance para você atingir seus objetivos
            com base em evidências.
          </p>

          <a
            href="https://wa.me/5527999998290"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black font-bold text-sm tracking-wide hover:bg-white/90 transition-all duration-300"
          >
            Agendar Consulta
            <span>→</span>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-12 flex flex-col md:flex-row items-center justify-center gap-10 text-white/20 text-xs tracking-wider"
        >
          {[
            { label: "Instagram", value: "@rsnutri" },
            { label: "WhatsApp", value: "(27) 99999-8290" },
            { label: "Localização", value: "Vitória, ES" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <span className="text-[9px] text-white/10 uppercase tracking-[0.3em]">
                {item.label}
              </span>
              <span>{item.value}</span>
            </div>
          ))}
        </motion.div>

        <p className="mt-10 text-white/8 text-[10px] tracking-[0.2em] uppercase">
          © 2024 Ricardo Salume Nutricionista
        </p>
      </div>
    </section>
  );
}
