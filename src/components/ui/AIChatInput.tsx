"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function AIChatInput() {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.6, duration: 0.8 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-6"
    >
      <div
        className={`flex items-center gap-3 px-5 py-3 rounded-full border transition-all duration-500 ${
          focused
            ? "border-white/25 bg-[#111]/80 backdrop-blur-xl shadow-[0_0_24px_rgba(255,255,255,0.06)]"
            : "border-white/8 bg-[#0a0a0a]/60 backdrop-blur-md"
        }`}
      >
        <motion.div
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ repeat: Infinity, duration: 2.4 }}
          className="w-1.5 h-1.5 rounded-full bg-white/60 shrink-0"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Pergunte ao nutricionista..."
          className="flex-1 bg-transparent text-white/60 text-sm placeholder:text-white/20 outline-none"
        />
        {value && (
          <button
            onClick={() => setValue("")}
            className="text-white/40 text-sm hover:text-white/80 transition-colors"
          >
            →
          </button>
        )}
      </div>
    </motion.div>
  );
}
