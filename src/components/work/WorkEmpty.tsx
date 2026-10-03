"use client";

import { motion } from "motion/react";
import { dur, ease } from "@/motion.config";
import { site, workCopy } from "@/content/site";
import { Magnetic } from "@/components/motion/Magnetic";
import { buttonClass } from "@/components/ui/button";

const behance = site.socials.find((s) => s.label === "Behance");

/**
 * Empty state while no projects are published: an empty Figma frame with
 * marching selection dashes and an honest note. No fake projects.
 */
export function WorkEmpty() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: dur.slow, ease: ease.out }}
      className="relative"
    >
      <p className="text-label mb-2 flex items-center justify-between text-muted">
        <span className="text-ink">Case studies</span>
        <span>0 items</span>
      </p>
      <div className="relative flex min-h-[52vh] flex-col items-center justify-center overflow-hidden rounded-[var(--radius-frame)] bg-frame/60 px-6 py-20 text-center">
        <svg aria-hidden className="pointer-events-none absolute inset-0 size-full">
          <rect
            x="0.5"
            y="0.5"
            style={{ width: "calc(100% - 1px)", height: "calc(100% - 1px)" }}
            rx="4"
            fill="none"
            stroke="var(--accent)"
            strokeDasharray="6 6"
            className="animate-[march_1.2s_linear_infinite] motion-reduce:animate-none"
          />
        </svg>

        {/* ghost placeholders hinting at the grid to come */}
        <div aria-hidden className="mb-10 grid w-full max-w-md grid-cols-3 gap-3 opacity-60">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="aspect-[4/3] rounded-[3px] border border-dashed border-line"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: dur.base, ease: ease.out, delay: 0.3 + i * 0.1 }}
            />
          ))}
        </div>

        <p className="font-display font-condensed text-title max-w-[18ch] font-bold text-balance">{workCopy.emptyTitle}</p>
        <p className="mt-4 max-w-md text-pretty text-muted">{workCopy.emptyBody}</p>
        {behance && (
          <Magnetic className="mt-8" strength={0.25}>
            <a href={behance.href} target="_blank" rel="noreferrer" className={buttonClass("accent")} data-cursor-label="Behance">
              {workCopy.emptyCta}
              <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <path d="M3 9l6-6M4 3h5v5" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </a>
          </Magnetic>
        )}
      </div>
    </motion.div>
  );
}
