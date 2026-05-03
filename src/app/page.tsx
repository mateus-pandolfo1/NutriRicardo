"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Navigation from "@/components/layout/Navigation";
import FloatingCards from "@/components/ui/FloatingCards";
import AIChatInput from "@/components/ui/AIChatInput";
import ContactSection from "@/components/sections/ContactSection";
import MacroJourneySection from "@/components/sections/MacroJourneySection";
import SlideShell, { type SlideShellHandle } from "@/components/slides/SlideShell";

const SLIDE_LABELS = ["Início", "Nutrição", "Serviços", "Planos", "Contato"];

// ─── Slide: Hero ──────────────────────────────────────────────────────────────

function HeroSlide() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: mounted ? 1 : 0 }}
        transition={{ duration: 1.5, delay: 0.1 }}
        className="flex flex-col items-center text-center z-10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative mb-10"
          style={{ width: "min(88vw, 680px)", aspectRatio: "1844 / 1475" }}
        >
          <Image
            src="/assets/Logo.png"
            alt="Ricardo Salume Nutricionista"
            fill
            className="object-contain"
            priority
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.8 }}
          className="text-white/65 text-xs font-bold tracking-[0.5em] uppercase mb-4"
        >
          Nutrição Clínica · Alta Performance
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.15, duration: 0.8 }}
          className="text-white/55 text-base font-bold max-w-sm mx-auto leading-relaxed"
        >
          Nutricionista especializado em composição corporal,
          patologias e performance de elite.
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.6, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-white/18 text-[9px] tracking-[0.4em] uppercase">Navegar</span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          className="w-px h-7 bg-gradient-to-b from-white/22 to-transparent"
        />
      </motion.div>
    </div>
  );
}

// ─── Slide: Services ──────────────────────────────────────────────────────────

function ServicesSlide() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-6 md:px-20 lg:px-36 bg-[#0d0d0d]">
      <div className="w-full max-w-3xl">
        <p className="text-white/22 text-[9px] tracking-[0.35em] uppercase mb-3">
          Especialidades
        </p>
        <h2 className="text-3xl md:text-4xl font-space-grotesk font-bold text-white mb-12">
          Áreas de Atuação
        </h2>
        <FloatingCards activeCategory={null} />
      </div>
    </div>
  );
}

// ─── Slide: Pricing ───────────────────────────────────────────────────────────

function PricingSlide() {
  const plans = [
    { title: "2 Consultas",  pix: "899,00",    inst: "2× R$ 476,90",  highlight: false, badge: null as string | null, extras: [] as string[] },
    { title: "3 Consultas",  pix: "1.250,00",  inst: "3× R$ 445,90",  highlight: false, badge: null as string | null, extras: ["1 Camiseta Premium RS"] },
    { title: "6 Consultas",  pix: "2.299,00",  inst: "6× R$ 420,20",  highlight: true,  badge: "Mais Popular",         extras: ["2 Camisetas Premium RS", "Brinde Exclusivo RS"] },
    { title: "22 Consultas", pix: "10.000,00", inst: "12× R$ 972,20", highlight: false, badge: "Multidisciplinar",     extras: ["10× Nutricionista", "4× Nutrólogo", "4× Psicólogo + 4× Fisio"] },
  ];

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-6 md:px-12 bg-[#0a0a0a]">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-10">
          <p className="text-white/22 text-[10px] tracking-[0.35em] uppercase mb-4">
            Investimento
          </p>
          <h2 className="text-3xl md:text-4xl font-space-grotesk font-bold text-white">
            Planos de Consulta
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className={`relative p-5 rounded-2xl border flex flex-col ${
                plan.highlight
                  ? "border-white/20 bg-[#1a1a1a] shadow-[0_0_40px_rgba(255,255,255,0.04)] lg:-translate-y-3"
                  : "border-white/[0.06] bg-[#111111] hover:border-white/[0.12] transition-colors"
              }`}
            >
              {plan.badge && (
                <div
                  className={`absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider whitespace-nowrap ${
                    plan.highlight
                      ? "bg-white text-black"
                      : "bg-[#1c1c1c] border border-white/12 text-white/40"
                  }`}
                >
                  {plan.badge}
                </div>
              )}
              <h3 className="text-xs font-bold text-white mb-4">{plan.title}</h3>
              <div className="mb-1">
                <span className="text-lg font-bold text-white">R$ {plan.pix}</span>
                <span className="text-white/22 text-xs ml-1">pix</span>
              </div>
              <p className="text-white/22 text-xs mb-3">{plan.inst}</p>
              {plan.extras.length > 0 && (
                <ul className="mb-4 space-y-1">
                  {plan.extras.map((e) => (
                    <li key={e} className="text-white/45 text-[11px] flex items-center gap-1.5">
                      <span className="text-[7px] text-white/25">◆</span> {e}
                    </li>
                  ))}
                </ul>
              )}
              <a
                href="https://wa.me/5527999998290"
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-auto text-center py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                  plan.highlight
                    ? "bg-white text-black hover:bg-white/90"
                    : "bg-white/6 text-white/70 hover:bg-white/12"
                }`}
              >
                Agendar
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const shellRef = useRef<SlideShellHandle>(null);

  const slides: Array<(isActive: boolean) => ReactNode> = [
    ()         => <HeroSlide />,
    (isActive) => <MacroJourneySection isActive={isActive} />,
    ()         => <ServicesSlide />,
    ()         => <PricingSlide />,
    ()         => <ContactSection />,
  ];

  return (
    <main className="relative w-full h-screen overflow-hidden">
      <Navigation
        onWorkClick={() => shellRef.current?.goTo(2)}
        onContactClick={() => shellRef.current?.goTo(4)}
      />

      <SlideShell ref={shellRef} slides={slides} labels={SLIDE_LABELS} />

      <AIChatInput />
    </main>
  );
}
