"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { dur, ease } from "@/motion.config";
import { setAppState, useAppState } from "@/lib/app-store";

/** Figma-style toast: dark pill, bottom centre. Announced politely to screen readers. */
export function Toaster() {
  const toast = useAppState((s) => s.toast);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setAppState({ toast: null }), 2600);
    return () => window.clearTimeout(id);
  }, [toast]);

  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[95] flex justify-center px-4">
      <AnimatePresence mode="popLayout">
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: dur.base * 0.6, ease: ease.out }}
            className="flex items-center gap-2.5 rounded-md bg-ink px-4 py-2.5 text-sm text-canvas shadow-lg"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
              <motion.path
                d="M2.5 7.4l2.8 2.8 6.2-6.4"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: dur.base, ease: ease.out, delay: 0.1 }}
              />
            </svg>
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
