"use client";

import { motion, useSpring, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef } from "react";
import { spring } from "@/motion.config";

type Props = {
  char: string;
  /** Pointer position relative to the headline box, px. Off-screen when idle. */
  px: MotionValue<number>;
  py: MotionValue<number>;
  /** The headline element the pointer is measured against. */
  host: React.RefObject<HTMLElement | null>;
};

const RADIUS = 260;
const STRETCH = 0.3;

/** A glyph that stretches upward as the cursor passes (transform only). */
export function KineticChar({ char, px, py, host }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const center = useRef({ x: -1e5, y: -1e5 });

  useEffect(() => {
    const measure = () => {
      const el = ref.current;
      const h = host.current;
      if (!el || !h) return;
      const a = el.getBoundingClientRect();
      const b = h.getBoundingClientRect();
      center.current = { x: a.left - b.left + a.width / 2, y: a.top - b.top + a.height / 2 };
    };
    // Glyphs are first measured mid-intro (still offset), so refresh lazily
    // while the pointer is around, at most twice a second.
    let last = 0;
    const refresh = () => {
      const now = performance.now();
      if (now - last < 500) return;
      last = now;
      measure();
    };
    const h = host.current;
    const zone = h?.closest("section") ?? h;
    const ro = new ResizeObserver(measure);
    if (h) ro.observe(h);
    zone?.addEventListener("pointermove", refresh, { passive: true });
    return () => {
      ro.disconnect();
      zone?.removeEventListener("pointermove", refresh);
    };
  }, [host]);

  const target = useTransform(() => {
    const dx = px.get() - center.current.x;
    const dy = (py.get() - center.current.y) * 1.4;
    const f = Math.max(0, 1 - Math.hypot(dx, dy) / RADIUS);
    return 1 + STRETCH * f * f;
  });
  const scaleY = useSpring(target, spring.soft);

  return (
    <motion.span ref={ref} className="inline-block origin-bottom" style={{ scaleY }}>
      {char}
    </motion.span>
  );
}
