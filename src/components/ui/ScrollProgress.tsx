"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { spring } from "@/motion.config";

/** Hairline progress bar pinned to the top edge. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, spring.scroll);
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[80] h-[2px] origin-left bg-accent"
      style={{ scaleX }}
    />
  );
}
