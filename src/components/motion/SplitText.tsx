"use client";

import { motion, type Variants } from "motion/react";
import { Fragment, useState, type ReactNode } from "react";
import { dur, ease, inView, stagger } from "@/motion.config";
import { cn } from "@/lib/cn";

const tags = {
  span: motion.span,
  p: motion.p,
  div: motion.div,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
} as const;

type Props = {
  text: string;
  by?: "chars" | "words";
  as?: keyof typeof tags;
  className?: string;
  /** Extra delay before the first unit, in seconds. */
  delay?: number;
  /** Controlled playback. Omit to play when scrolled into view. */
  play?: boolean;
  /** Optional wrapper for each unit (e.g. kinetic hero chars). */
  renderUnit?: (unit: string, index: number) => ReactNode;
  /** Drop the clipping masks once revealed, so units may move beyond them. */
  releaseMask?: boolean;
};

/**
 * Masked line/char/word reveal. Screen readers get the full string once
 * from a visually hidden copy; the split units are aria-hidden.
 */
export function SplitText({ text, by = "words", as = "span", className, delay = 0, play, renderUnit, releaseMask }: Props) {
  const Tag = tags[as];
  const [released, setReleased] = useState(false);
  const step = by === "chars" ? stagger.chars : stagger.words;

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: step, delayChildren: delay } },
  };
  const unit: Variants = {
    hidden: { y: "112%" },
    show: { y: "0%", transition: { duration: dur.slow, ease: ease.out } },
  };

  const words = text.split(" ");
  let index = 0;

  const playback =
    play === undefined
      ? { initial: "hidden", whileInView: "show", viewport: inView }
      : { initial: "hidden", animate: play ? "show" : "hidden" };

  return (
    <Tag
      className={className}
      variants={container}
      {...playback}
      onAnimationComplete={(def) => {
        if (releaseMask && def === "show") setReleased(true);
      }}
    >
      <span className="sr-only">{text}</span>
      {words.map((word, w) => {
        const units = by === "chars" ? Array.from(word) : [word];
        return (
          <Fragment key={w}>
            <span aria-hidden className="inline-block whitespace-nowrap">
              {units.map((u) => {
                const i = index++;
                return (
                  <span key={i} className={cn("-my-[0.14em] inline-block py-[0.14em] align-top", !released && "overflow-hidden")}>
                    <motion.span className="inline-block" variants={unit}>
                      {renderUnit ? renderUnit(u, i) : u}
                    </motion.span>
                  </span>
                );
              })}
            </span>
            {w < words.length - 1 ? " " : null}
          </Fragment>
        );
      })}
    </Tag>
  );
}
