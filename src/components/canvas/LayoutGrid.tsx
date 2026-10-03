"use client";

import { AnimatePresence, motion } from "motion/react";
import { dur, ease, stagger } from "@/motion.config";
import { useAppState } from "@/lib/app-store";

/** Figma-style column layout grid overlay. Toggle with the G key. */
export function LayoutGrid() {
  const on = useAppState((s) => s.grid);
  return (
    <AnimatePresence>
      {on && (
        <div aria-hidden className="px-page pointer-events-none fixed inset-0 z-[70]">
          <div className="grid h-full grid-cols-4 gap-[var(--gutter)] md:grid-cols-6 lg:grid-cols-12">
            {Array.from({ length: 12 }, (_, i) => (
              <motion.div
                key={i}
                className={i >= 4 ? (i >= 6 ? "hidden lg:block" : "hidden md:block") : undefined}
                style={{ background: "var(--selection-fill)", transformOrigin: "top" }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1, transition: { duration: dur.base, ease: ease.out, delay: i * stagger.items * 0.5 } }}
                exit={{ scaleY: 0, transition: { duration: dur.base * 0.6, ease: ease.inOut, delay: (11 - i) * 0.015 } }}
              />
            ))}
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
