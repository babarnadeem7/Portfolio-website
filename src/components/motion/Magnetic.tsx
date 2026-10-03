"use client";

import { motion, useSpring } from "motion/react";
import { useRef, type PointerEvent, type ReactNode } from "react";
import { spring } from "@/motion.config";
import { useRichPointer } from "@/lib/media";
import { cn } from "@/lib/cn";

type Props = {
  children: ReactNode;
  /** 0 to 1: how far the element follows the pointer. */
  strength?: number;
  className?: string;
};

/** Pulls its child toward the pointer. Inert on touch and reduced motion. */
export function Magnetic({ children, strength = 0.3, className }: Props) {
  const rich = useRichPointer();
  const ref = useRef<HTMLSpanElement>(null);
  const x = useSpring(0, spring.soft);
  const y = useSpring(0, spring.soft);

  function onMove(e: PointerEvent<HTMLSpanElement>) {
    if (!rich || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.span
      ref={ref}
      className={cn("inline-block", className)}
      style={rich ? { x, y } : undefined}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.span>
  );
}
