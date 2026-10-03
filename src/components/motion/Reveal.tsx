"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { dur, ease } from "@/motion.config";

const tags = {
  div: motion.div,
  section: motion.section,
  p: motion.p,
  li: motion.li,
  span: motion.span,
} as const;

type Props = {
  children: ReactNode;
  as?: keyof typeof tags;
  className?: string;
  delay?: number;
  /** Rise distance in px. */
  y?: number;
  /** Fraction of the element that must be visible. */
  amount?: number;
};

/** Fade-and-rise on first view. Reduced motion collapses to a plain fade (MotionConfig). */
export function Reveal({ children, as = "div", className, delay = 0, y = 28, amount = 0.25 }: Props) {
  const Tag = tags[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: dur.base, ease: ease.out, delay }}
    >
      {children}
    </Tag>
  );
}
