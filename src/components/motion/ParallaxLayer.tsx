"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/media";

type Props = {
  children: ReactNode;
  /** Positive drifts up faster than scroll, negative lags behind. ~0.1 to 0.4. */
  speed?: number;
  className?: string;
};

/** Scroll-linked vertical drift. Disabled for reduced motion. */
export function ParallaxLayer({ children, speed = 0.2, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [speed * 180, speed * -180]);

  return (
    <motion.div ref={ref} className={className} style={reduced ? undefined : { y }}>
      {children}
    </motion.div>
  );
}
