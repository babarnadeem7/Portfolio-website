"use client";

import { motion } from "motion/react";
import { useLenis } from "lenis/react";
import { useState } from "react";
import { spring } from "@/motion.config";
import { site } from "@/content/site";
import { showToast } from "@/lib/app-store";
import { cn } from "@/lib/cn";
import { Magnetic } from "@/components/motion/Magnetic";

const VARIANTS = ["Default", "Outline", "Accent", "Inverse"] as const;
type Variant = (typeof VARIANTS)[number];

const variantClass: Record<Variant, string> = {
  Default: "bg-ink text-canvas border-ink",
  Outline: "bg-transparent text-ink border-ink",
  Accent: "bg-accent text-on-accent border-accent",
  Inverse: "bg-canvas text-ink border-line",
};

/**
 * Easter egg: the footer mark is the "main component". Clicking cycles its
 * variants; a full cycle reveals the joke.
 */
function MasterComponent() {
  const [index, setIndex] = useState(0);
  const [clicks, setClicks] = useState(0);
  const variant = VARIANTS[index];

  return (
    <button
      type="button"
      data-cursor-label="Swap variant"
      onClick={() => {
        const next = (index + 1) % VARIANTS.length;
        const n = clicks + 1;
        setIndex(next);
        setClicks(n);
        showToast(
          n === VARIANTS.length
            ? "You found the main component. Every instance on this site inherits from it."
            : `Variant: ${VARIANTS[next]}`,
        );
      }}
      className="group flex items-center gap-3 text-left"
    >
      <motion.span
        layout
        className={cn("flex size-12 items-center justify-center rounded-[10px] border transition-colors duration-300", variantClass[variant])}
        animate={{ rotate: index * 90 }}
        transition={{ type: "spring", ...spring.snap }}
      >
        <svg width="18" height="18" viewBox="0 0 14 14" aria-hidden>
          <path d="M7 1l6 6-6 6-6-6z" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <path d="M7 4l3 3-3 3-3-3z" fill="currentColor" />
        </svg>
      </motion.span>
      <span>
        <span className="text-label block text-accent-ink">Main component</span>
        <span className="block text-sm font-semibold">
          {site.initials} / {variant}
          <span className="sr-only">, swap variant</span>
        </span>
      </span>
    </button>
  );
}

export function Footer() {
  const lenis = useLenis();
  const year = new Date().getFullYear();

  return (
    <footer className="px-page relative border-t border-line pt-14 pb-8">
      <div className="grid gap-10 md:grid-cols-[1fr_auto_auto] md:items-end">
        <MasterComponent />
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {site.socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noreferrer" className="link-underline">
                {s.label}
              </a>
            </li>
          ))}
          <li>
            <a href={`mailto:${site.email}`} className="link-underline">
              Email
            </a>
          </li>
          <li>
            <a href={site.phone.whatsapp} target="_blank" rel="noreferrer" className="link-underline">
              WhatsApp
            </a>
          </li>
        </ul>
        <Magnetic strength={0.4}>
          <button
            type="button"
            onClick={() => (lenis ? lenis.scrollTo(0, { duration: 1.6 }) : window.scrollTo({ top: 0 }))}
            className="flex size-12 items-center justify-center rounded-full border border-line bg-frame transition-colors hover:border-ink"
            aria-label="Back to top"
            data-cursor-label="Back to top"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
              <path d="M7 12V2M2.5 6.5L7 2l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </Magnetic>
      </div>

      <div className="text-label mt-14 flex flex-col gap-2 text-muted sm:flex-row sm:items-center sm:justify-between">
        <span>
          © {year} {site.name}
        </span>
        <span>Designed in Figma, built frame by frame.</span>
        <span className="hidden pointer-fine:inline">
          Press <kbd className="rounded border border-line px-1">?</kbd> for shortcuts
        </span>
      </div>
    </footer>
  );
}
