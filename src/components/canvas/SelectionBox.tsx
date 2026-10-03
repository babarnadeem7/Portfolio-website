"use client";

import { AnimatePresence, motion } from "motion/react";
import { spring } from "@/motion.config";
import { cn } from "@/lib/cn";

type Props = {
  show: boolean;
  /** Optional size badge under the box, e.g. "W 320 H 88". */
  badge?: string;
  /** Optional collaborator tag above the box (multiplayer selection). */
  tag?: string;
  className?: string;
  /** Outset from the selected element, px. */
  inset?: number;
};

/** Figma-style selection: 1px accent outline, four corner handles, optional size badge. */
export function SelectionBox({ show, badge, tag, className, inset = 6 }: Props) {
  return (
    <AnimatePresence>
      {show && (
        <motion.span
          aria-hidden
          className={cn("pointer-events-none absolute z-10 block", className)}
          style={{ inset: -inset }}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02, transition: { duration: 0.15 } }}
          transition={{ type: "spring", ...spring.snap }}
        >
          <span className="absolute inset-0 border border-accent" />
          {[0, 1, 2, 3].map((c) => (
            <span
              key={c}
              className="absolute size-[7px] border border-accent bg-canvas"
              style={{
                left: c % 2 ? "auto" : -3.5,
                right: c % 2 ? -3.5 : "auto",
                top: c < 2 ? -3.5 : "auto",
                bottom: c < 2 ? "auto" : -3.5,
              }}
            />
          ))}
          {tag && (
            <span className="text-label absolute -top-[22px] left-[-1px] rounded-t-[3px] bg-accent px-1.5 py-[3px] whitespace-nowrap text-on-accent">
              {tag}
            </span>
          )}
          {badge && (
            <span className="text-label absolute -bottom-7 left-1/2 -translate-x-1/2 rounded-[3px] bg-accent px-1.5 py-[3px] whitespace-nowrap text-on-accent tabular-nums">
              {badge}
            </span>
          )}
        </motion.span>
      )}
    </AnimatePresence>
  );
}
