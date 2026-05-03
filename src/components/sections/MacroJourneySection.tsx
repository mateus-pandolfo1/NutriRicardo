"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

// ─── Data ─────────────────────────────────────────────────────────────────────

const macroLabels = [
  { text: "PROTEÍNAS",    sub: "reconstroem e constroem tecidos",   x: "8%",  y: "22%" },
  { text: "CARBOIDRATOS", sub: "combustível para treino e foco",     x: "55%", y: "16%" },
  { text: "FIBRAS",       sub: "saúde intestinal & imunidade",       x: "5%",  y: "58%" },
  { text: "LIPÍDIOS",     sub: "ômega 3·6·9 e hormônios",            x: "60%", y: "60%" },
  { text: "VITAMINAS",    sub: "micronutrientes essenciais",         x: "36%", y: "76%" },
];

const molecules = [
  {
    id: "glucose",
    label: "C₆H₁₂O₆",
    sublabel: "Glicose",
    x: "14%",
    y: "30%",
    viewBox: "-90 -90 180 180",
    paths: [
      "M 0 -55 L 47.6 -27.5 L 47.6 27.5 L 0 55 L -47.6 27.5 L -47.6 -27.5 Z",
      "M 47.6 -27.5 L 72 -27.5 M 47.6 27.5 L 72 27.5",
      "M 0 55 L 0 80 M 0 -55 L 0 -80",
      "M -47.6 -27.5 L -72 -27.5 M -47.6 27.5 L -72 27.5",
    ],
  },
  {
    id: "aminoacid",
    label: "NH₂–CHR–COOH",
    sublabel: "Aminoácido",
    x: "60%",
    y: "24%",
    viewBox: "-110 -70 220 140",
    paths: [
      "M -90 0 L -50 0",
      "M -50 -35 L -50 35 M -50 0 L -10 0",
      "M -10 0 L 20 -30 M -10 0 L 20 30",
      "M 20 -30 L 55 -30 M 20 30 L 55 30",
      "M 55 -30 L 55 -50 M 55 30 L 55 50",
    ],
  },
  {
    id: "fattyacid",
    label: "CₙH₂ₙCOOH",
    sublabel: "Ácido Graxo",
    x: "7%",
    y: "62%",
    viewBox: "-110 -60 220 120",
    paths: [
      "M -95 0 L -70 -20 L -45 20 L -20 -20 L 5 20 L 30 -20 L 55 20 L 80 0",
      "M 80 0 L 95 -22 M 80 0 L 95 22",
      "M -95 0 L -110 -16 M -95 0 L -110 16",
    ],
  },
  {
    id: "vitamin",
    label: "Vit. D₃",
    sublabel: "Vitamina",
    x: "63%",
    y: "64%",
    viewBox: "-100 -70 200 140",
    paths: [
      "M -80 -18 C -40 -55 40 5 80 -18",
      "M -80 18 C -40 55 40 -5 80 18",
      "M -80 -18 L -80 18 M 80 -18 L 80 18",
      "M -28 -42 L -28 42 M 28 -38 L 28 38",
    ],
  },
  {
    id: "fiber",
    label: "Fibra Dietética",
    sublabel: "Polissacarídeo",
    x: "39%",
    y: "78%",
    viewBox: "-100 -55 200 110",
    paths: [
      "M -90 0 L -70 0 L -70 -30 L -50 -30 L -50 0 L -30 0 L -30 -30 L -10 -30 L -10 0 L 10 0 L 10 -30 L 30 -30 L 30 0 L 50 0 L 50 -30 L 70 -30 L 70 0 L 90 0",
    ],
  },
];

// ─── Phase cycling ────────────────────────────────────────────────────────────

type Phase = "hidden" | "labels" | "molecules";

const PHASE_DURATIONS = { labels: 4200, molecules: 4200 } as const;

// ─── Components ───────────────────────────────────────────────────────────────

function MacroLabel({
  label,
  visible,
  index,
}: {
  label: (typeof macroLabels)[0];
  visible: boolean;
  index: number;
}) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: label.x, top: label.y }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 18 }}
      transition={{ duration: 0.5, delay: visible ? 0.3 + index * 0.13 : 0 }}
    >
      <div className="flex items-start gap-2.5">
        <motion.div
          className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white shrink-0"
          style={{ boxShadow: "0 0 8px rgba(255,255,255,0.8)" }}
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
        />
        <div>
          <p className="text-white font-bold tracking-[0.25em] text-xs md:text-sm uppercase leading-none">
            {label.text}
          </p>
          <p className="text-white/35 text-[10px] tracking-wider mt-1.5">{label.sub}</p>
        </div>
      </div>
    </motion.div>
  );
}

function MoleculeCard({
  mol,
  visible,
  index,
}: {
  mol: (typeof molecules)[0];
  visible: boolean;
  index: number;
}) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: mol.x, top: mol.y, transform: "translate(-50%, -50%)" }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.6, delay: visible ? index * 0.18 : 0 }}
    >
      <svg width="180" height="140" viewBox={mol.viewBox} className="overflow-visible">
        {mol.paths.map((d, pi) => (
          <motion.path
            key={pi}
            d={d}
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: visible ? 1 : 0 }}
            transition={{
              pathLength: {
                duration: 1.2,
                delay: visible ? index * 0.18 + pi * 0.18 : 0,
                ease: "easeOut",
              },
            }}
          />
        ))}
      </svg>
      <motion.div
        className="text-center mt-1"
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.4, delay: visible ? index * 0.18 + 0.9 : 0 }}
      >
        <p className="text-white/60 font-mono text-[11px] tracking-wider">{mol.label}</p>
        <p className="text-white/25 text-[9px] tracking-widest uppercase mt-0.5">
          {mol.sublabel}
        </p>
      </motion.div>
    </motion.div>
  );
}

// ─── Slide ────────────────────────────────────────────────────────────────────

export default function MacroJourneySection({ isActive = false }: { isActive?: boolean }) {
  const [phase, setPhase] = useState<Phase>("hidden");
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    if (!isActive) {
      setPhase("hidden");
      return;
    }

    // Start cycle
    const cycle = () => {
      setPhase("labels");
      const t1 = setTimeout(() => {
        setPhase("molecules");
        const t2 = setTimeout(() => cycle(), PHASE_DURATIONS.molecules);
        timersRef.current.push(t2);
      }, PHASE_DURATIONS.labels);
      timersRef.current.push(t1);
    };

    cycle();

    return () => { timersRef.current.forEach(clearTimeout); };
  }, [isActive]);

  const showLabels    = phase === "labels";
  const showMolecules = phase === "molecules";

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-transparent">
      {/* Subtle cooking-image hint behind macros */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url('/assets/healthy_cooking_bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.07,
        }}
      />
      <div className="absolute inset-0 bg-[#080808]/75 pointer-events-none" />

      {/* Central title — visible during labels phase */}
      <motion.div
        className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-10"
        animate={{ opacity: showLabels ? 1 : 0, y: showLabels ? 0 : 16 }}
        transition={{ duration: 0.7 }}
      >
        <p className="text-white/20 text-[10px] tracking-[0.5em] uppercase mb-3">
          Composição Nutricional
        </p>
        <h2 className="text-3xl md:text-5xl font-space-grotesk font-bold text-white leading-tight">
          O que está no
          <br />
          <span className="text-white/50">seu prato?</span>
        </h2>
      </motion.div>

      {/* Molecule view title */}
      <motion.div
        className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-10"
        animate={{ opacity: showMolecules ? 1 : 0, y: showMolecules ? 0 : 16 }}
        transition={{ duration: 0.7 }}
      >
        <p className="text-white/20 text-[10px] tracking-[0.5em] uppercase mb-3">
          Ciência da Nutrição
        </p>
        <h2 className="text-3xl md:text-5xl font-space-grotesk font-bold text-white leading-tight">
          Nutrição baseada
          <br />
          <span className="text-white/50">em evidências.</span>
        </h2>
      </motion.div>

      {/* Macro labels */}
      {macroLabels.map((label, i) => (
        <MacroLabel key={label.text} label={label} visible={showLabels} index={i} />
      ))}

      {/* Molecules */}
      {molecules.map((mol, i) => (
        <MoleculeCard key={mol.id} mol={mol} visible={showMolecules} index={i} />
      ))}

      {/* Phase indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 pointer-events-none z-10">
        {(["labels", "molecules"] as Phase[]).map((p) => (
          <div
            key={p}
            className={`h-px transition-all duration-500 rounded-full ${
              phase === p ? "w-8 bg-white/50" : "w-3 bg-white/15"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
