"use client";

import {
  useRef,
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import gsap from "gsap";
import { cameraState } from "@/lib/cameraState";

// Per-slide camera depth — creates progressive immersion as user navigates
const SLIDE_Z = [6.0, 5.0, 4.2, 3.5, 2.8];
const SLIDE_Y = [0,   0,   0,   0,   0  ];

export interface SlideShellHandle {
  goTo: (index: number) => void;
}

interface Props {
  slides: Array<(isActive: boolean) => import("react").ReactNode>;
  labels?: string[];
}

const SlideShell = forwardRef<SlideShellHandle, Props>(function SlideShell(
  { slides, labels },
  ref
) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const currentRef = useRef(0);
  const busyRef    = useRef(false);
  const slideRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const total      = slides.length;

  const goTo = useCallback(
    (next: number) => {
      const curr = currentRef.current;
      if (busyRef.current || next === curr || next < 0 || next >= total) return;
      busyRef.current = true;

      const dir    = next > curr ? 1 : -1;
      const fromEl = slideRefs.current[curr];
      const toEl   = slideRefs.current[next];
      if (!fromEl || !toEl) { busyRef.current = false; return; }

      // Position next slide off-screen on the correct side
      gsap.set(toEl,   { rotateY: dir * 90, visibility: "visible", zIndex: 2 });
      gsap.set(fromEl, { zIndex: 1 });

      // Spin up the DNA helix
      gsap.to(cameraState, { helixSpeedMult: 22, duration: 0.22, ease: "power2.in" });

      gsap
        .timeline({
          onComplete() {
            gsap.set(fromEl, { visibility: "hidden", zIndex: 0, rotateY: 0 });
            gsap.set(toEl,   { zIndex: 1 });
            // Spin down helix
            gsap.to(cameraState, { helixSpeedMult: 1, duration: 0.9, ease: "power3.out" });
            currentRef.current = next;
            setCurrentIdx(next);
            busyRef.current = false;
          },
        })
        // Phase 1 — current page folds away
        .to(fromEl, { rotateY: dir * -90, duration: 0.38, ease: "power2.in" })
        // Set camera target at the midpoint (DNA fully exposed)
        .call(() => {
          cameraState.targetZ = SLIDE_Z[next] ?? 4;
          cameraState.targetY = SLIDE_Y[next] ?? 0;
        })
        // 100ms gap where only the spinning DNA is visible
        .to(toEl, { rotateY: 0, duration: 0.38, ease: "power2.out" }, "+=0.1");
    },
    [total]
  );

  useImperativeHandle(ref, () => ({ goTo }), [goTo]);

  // ── Wheel ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    let lastWheel = 0;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = Date.now();
      if (now - lastWheel < 900) return;
      lastWheel = now;
      goTo(currentRef.current + (e.deltaY > 0 ? 1 : -1));
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [goTo]);

  // ── Keyboard ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        goTo(currentRef.current + 1);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        goTo(currentRef.current - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo]);

  // ── Touch ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    let startY = 0;
    const onTouchStart = (e: TouchEvent) => { startY = e.touches[0].clientY; };
    const onTouchEnd   = (e: TouchEvent) => {
      const dy = startY - e.changedTouches[0].clientY;
      if (Math.abs(dy) > 55) goTo(currentRef.current + (dy > 0 ? 1 : -1));
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend",   onTouchEnd,   { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend",   onTouchEnd);
    };
  }, [goTo]);

  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ perspective: "1100px" }}
    >
      {slides.map((renderSlide, i) => (
        <div
          key={i}
          ref={(el) => { slideRefs.current[i] = el; }}
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{
            visibility:          i === 0 ? "visible" : "hidden",
            backfaceVisibility: "hidden",
            zIndex: 1,
          }}
        >
          {renderSlide(i === currentIdx)}
        </div>
      ))}

      {/* ── Navigation dots ─────────────────────────────────────────────────── */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-[60]">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            title={labels?.[i]}
            className={`rounded-full transition-all duration-300 ${
              i === currentIdx
                ? "w-1.5 h-5 bg-white"
                : "w-1.5 h-1.5 bg-white/20 hover:bg-white/50"
            }`}
          />
        ))}
      </div>

      {/* ── Slide counter ───────────────────────────────────────────────────── */}
      <div className="fixed bottom-8 right-6 z-[60] font-mono text-[10px] text-white/15 tracking-[0.3em] pointer-events-none select-none">
        {String(currentIdx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>
    </div>
  );
});

export default SlideShell;
