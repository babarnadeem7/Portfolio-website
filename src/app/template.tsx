"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { dur, ease } from "@/motion.config";

/**
 * Re-mounts on every navigation: a quiet fade for back/forward and first paint.
 * Opacity only, so no transform ever breaks sticky or fixed descendants.
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: dur.base, ease: ease.out }}
    >
      {children}
    </motion.div>
  );
}
