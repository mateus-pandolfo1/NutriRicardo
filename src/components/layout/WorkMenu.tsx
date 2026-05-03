"use client";

import { motion, AnimatePresence } from "framer-motion";

interface WorkMenuProps {
  isOpen: boolean;
  activeCategory: string | null;
  onCategoryClick: (cat: string) => void;
}

const categories = [
  { id: "hipertrofia", label: "Hipertrofia" },
  { id: "emagrecimento", label: "Emagrecimento" },
  { id: "patologias", label: "Patologias" },
  { id: "consulta", label: "Consultório" },
  { id: "performance", label: "Performance" },
];

export default function WorkMenu({ isOpen, activeCategory, onCategoryClick }: WorkMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -28 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed left-8 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-1"
        >
          <p className="text-white/18 text-[9px] font-bold tracking-[0.32em] uppercase mb-5">
            O que você busca?
          </p>
          {categories.map((cat, i) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => onCategoryClick(cat.id)}
              className={`text-left text-sm font-medium tracking-wide transition-all duration-200 flex items-center gap-3 py-1 ${
                activeCategory === cat.id
                  ? "text-white"
                  : "text-white/30 hover:text-white/60"
              }`}
            >
              <span
                className={`h-px transition-all duration-300 ${
                  activeCategory === cat.id
                    ? "w-8 bg-white"
                    : "w-3 bg-white/18"
                }`}
              />
              {cat.label}
            </motion.button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
