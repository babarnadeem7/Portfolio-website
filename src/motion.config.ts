/**
 * Single source of truth for motion. Components never hard-code easing or timing.
 * Values are documented in CLAUDE.md under "Animation conventions".
 */
import type { SpringOptions } from "motion/react";

export const ease = {
  /** expo out: reveals, entrances */
  out: [0.16, 1, 0.3, 1],
  /** strong in-out: curtains, wipes, page transitions */
  inOut: [0.76, 0, 0.24, 1],
  /** gentle in: exits */
  in: [0.7, 0, 0.84, 0],
} as const satisfies Record<string, readonly [number, number, number, number]>;

/** Spring physics. Use with useSpring, or as a transition: { type: "spring", ...spring.snap }. */
export const spring = {
  /** auto-layout "snap", variant switches */
  snap: { stiffness: 520, damping: 34, mass: 1 },
  /** cursor follow, magnetic pull */
  soft: { stiffness: 140, damping: 20, mass: 0.6 },
  /** scroll-linked smoothing (parallax, progress) */
  scroll: { stiffness: 120, damping: 30, restDelta: 0.001 },
} as const satisfies Record<string, SpringOptions>;

export const dur = {
  micro: 0.18,
  base: 0.6,
  slow: 1.0,
  page: 0.9,
} as const;

export const stagger = {
  chars: 0.018,
  words: 0.04,
  lines: 0.08,
  items: 0.06,
} as const;

/** Viewport options for whileInView reveals. */
export const inView = { once: true, amount: 0.3 } as const;

/** Preloader timeline (seconds). */
export const preloader = {
  draw: 0.95,
  hold: 0.2,
  expand: 0.65,
  curtain: 0.75,
} as const;
