"use client";

import { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import type { MouseEvent } from "react";

interface Card {
  id: string;
  category: string;
  categoryKey: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
}

const cards: Card[] = [
  {
    id: "1",
    category: "Hipertrofia",
    categoryKey: "hipertrofia",
    title: "Ganho de Massa",
    subtitle: "Construção muscular com precisão científica",
    description:
      "Protocolo avançado de nutrição para hipertrofia máxima. Carboidratos periodizados, proteínas estratégicas e timing nutricional otimizado para máximos resultados.",
    tags: ["Proteínas", "Periodização", "Suplementação"],
  },
  {
    id: "2",
    category: "Emagrecimento",
    categoryKey: "emagrecimento",
    title: "Composição Corporal",
    subtitle: "Perda de gordura sem sacrificar músculo",
    description:
      "Estratégia científica para reduzir gordura preservando massa magra. Déficit calórico inteligente, refeeding semanal e monitoramento metabólico contínuo.",
    tags: ["Déficit", "Recomp", "Metabolismo"],
  },
  {
    id: "3",
    category: "Patologias",
    categoryKey: "patologias",
    title: "Nutrição Clínica",
    subtitle: "SOP · Lipedema · Disbiose intestinal",
    description:
      "Abordagem especializada para condições clínicas. Modulação do microbioma, protocolos anti-inflamatórios e manejo de condições hormonais e metabólicas.",
    tags: ["SOP", "Microbioma", "Anti-inflamatório"],
  },
  {
    id: "4",
    category: "Performance",
    categoryKey: "performance",
    title: "Alta Performance",
    subtitle: "Nutrição para atletas de elite",
    description:
      "Suporte nutricional completo para máxima performance esportiva. Fueling avançado, hidratação e recuperação muscular otimizados.",
    tags: ["Atletas", "Fueling", "Recuperação"],
  },
];

function Card3D({ card, onClick }: { card: Card; onClick: (c: Card) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(
    useSpring(y, { stiffness: 130, damping: 18 }),
    [-0.5, 0.5],
    [8, -8]
  );
  const rotateY = useTransform(
    useSpring(x, { stiffness: 130, damping: 18 }),
    [-0.5, 0.5],
    [-8, 8]
  );

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={onMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      onClick={() => onClick(card)}
      whileHover={{ scale: 1.025 }}
      whileTap={{ scale: 0.97 }}
      className="cursor-pointer select-none"
    >
      <div className="relative p-6 rounded-2xl overflow-hidden border border-white/[0.07] bg-[#111111]/90 backdrop-blur-sm hover:border-white/[0.14] transition-colors duration-300 shadow-[0_24px_48px_rgba(0,0,0,0.6)]">
        {/* top line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="flex justify-between items-start mb-8">
          <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/50">
            {card.category}
          </span>
          <div className="w-6 h-6 rounded-full border border-white/12 flex items-center justify-center">
            <span className="text-white/30 text-[10px]">↗</span>
          </div>
        </div>

        <h3 className="text-lg font-space-grotesk font-bold text-white mb-1.5">
          {card.title}
        </h3>
        <p className="text-xs text-white/35 mb-5">{card.subtitle}</p>

        <div className="flex flex-wrap gap-1.5">
          {card.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2.5 py-1 rounded-full border border-white/10 text-white/40 bg-white/[0.03]"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      </div>
    </motion.div>
  );
}

function CardDetail({ card, onClose }: { card: Card; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-lg w-full p-8 rounded-3xl border border-white/10 bg-[#101010]/95 backdrop-blur-xl shadow-[0_0_80px_rgba(0,0,0,0.8)]"
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent rounded-t-3xl" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-white/25 hover:text-white/70 transition-colors text-sm"
        >
          ✕
        </button>

        <span className="inline-block text-[10px] font-bold tracking-[0.3em] uppercase text-white/40 mb-5">
          {card.category}
        </span>

        <h2 className="text-3xl font-space-grotesk font-bold text-white mb-2">
          {card.title}
        </h2>
        <p className="text-white/35 text-sm mb-6">{card.subtitle}</p>
        <p className="text-white/60 text-sm leading-relaxed mb-8">{card.description}</p>

        <div className="flex flex-wrap gap-2 mb-8">
          {card.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-3 py-1.5 rounded-full border border-white/12 text-white/50"
            >
              {tag}
            </span>
          ))}
        </div>

        <a
          href="https://wa.me/5527999998290"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black text-sm font-bold hover:bg-white/90 transition-colors"
        >
          Agendar Consulta →
        </a>
      </motion.div>
    </motion.div>
  );
}

interface FloatingCardsProps {
  activeCategory: string | null;
}

export default function FloatingCards({ activeCategory }: FloatingCardsProps) {
  const [selected, setSelected] = useState<Card | null>(null);

  const filtered = activeCategory
    ? cards.filter((c) => c.categoryKey === activeCategory)
    : cards;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((card, i) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              delay: i * 0.1,
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Card3D card={card} onClick={setSelected} />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <CardDetail card={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
