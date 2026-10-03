"use client";

import { animate, useInView } from "motion/react";
import { useEffect, useRef } from "react";
import { ease } from "@/motion.config";
import { useReducedMotion } from "@/lib/media";

type Props = {
  to: number;
  from?: number;
  /** Zero-pad to this many digits. */
  pad?: number;
  duration?: number;
  className?: string;
  suffix?: string;
};

function format(v: number, pad: number, suffix: string) {
  return String(Math.round(v)).padStart(pad, "0") + suffix;
}

/** Counts up once when visible. The final value is always exposed to assistive tech. */
export function Counter({ to, from = 0, pad = 0, duration = 1.6, className, suffix = "" }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !seen) return;
    if (reduced) {
      el.textContent = format(to, pad, suffix);
      return;
    }
    const controls = animate(from, to, {
      duration,
      ease: ease.out,
      onUpdate: (v) => {
        el.textContent = format(v, pad, suffix);
      },
    });
    return () => controls.stop();
  }, [seen, reduced, from, to, duration, pad, suffix]);

  return (
    <span className={className}>
      <span className="sr-only">{format(to, pad, suffix)}</span>
      <span ref={ref} aria-hidden className="tabular-nums">
        {format(from, pad, suffix)}
      </span>
    </span>
  );
}
