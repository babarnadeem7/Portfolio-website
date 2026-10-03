"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { dur, ease } from "@/motion.config";
import { pad2 } from "@/lib/format";
import { cn } from "@/lib/cn";

type Props = {
  id?: string;
  /** Frame number shown in the label, e.g. 3 to "03". */
  index: number;
  /** Frame name shown like a Figma artboard title. */
  name: string;
  children: ReactNode;
  className?: string;
  /** Heading id this section is labelled by. */
  labelledBy?: string;
};

/**
 * A page section presented as a Figma artboard: a small frame title sits
 * above the content with the section's live pixel dimensions.
 */
export function Frame({ id, index, name, children, className, labelledBy }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [dims, setDims] = useState<string>("");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const box = entry.borderBoxSize?.[0];
      const w = box ? box.inlineSize : entry.contentRect.width;
      const h = box ? box.blockSize : entry.contentRect.height;
      setDims(`${Math.round(w)} × ${Math.round(h)}`);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <section ref={ref} id={id} aria-labelledby={labelledBy} className={cn("relative scroll-mt-16", className)}>
      <FrameLabel index={index} name={name} dims={dims} />
      {children}
    </section>
  );
}

export function FrameLabel({ index, name, dims, className }: { index: number; name: string; dims?: string; className?: string }) {
  return (
    <motion.div
      aria-hidden
      className={cn("text-label px-page pointer-events-none absolute inset-x-0 top-4 z-10 flex items-center justify-between text-muted", className)}
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: dur.base, ease: ease.out }}
    >
      <span className="flex items-center gap-2">
        <svg width="10" height="10" viewBox="0 0 10 10" className="text-accent">
          <path d="M3 0v10M7 0v10M0 3h10M0 7h10" stroke="currentColor" strokeWidth="1" />
        </svg>
        <span className="tabular-nums">{pad2(index)}</span>
        <span className="text-ink">{name}</span>
      </span>
      {dims && <span className="tabular-nums">{dims}</span>}
    </motion.div>
  );
}
