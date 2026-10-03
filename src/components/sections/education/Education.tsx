"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { dur, ease, stagger } from "@/motion.config";
import { education, languages } from "@/content/education";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/cn";
import { Frame } from "@/components/canvas/Frame";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";

/** Education as a Figma layers panel; languages as a quiet properties card. */
export function Education() {
  return (
    <Frame id="education" index={6} name="Layers" labelledBy="education-title" className="px-page py-28 md:py-40">
      <p className="text-label mb-5 text-muted uppercase">Education &amp; languages</p>
      <h2 id="education-title" className="font-display font-condensed text-display max-w-[16ch] font-extrabold">
        <SplitText text="The foundations under every layer." by="words" />
      </h2>

      <div className="mt-16 grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
        <Reveal>
          <LayersPanel />
        </Reveal>
        <Reveal delay={0.1}>
          <LanguagesCard />
        </Reveal>
      </div>
    </Frame>
  );
}

function LayerIcon({ kind }: { kind: "frame" | "component" | "text" }) {
  if (kind === "frame")
    return (
      <svg width="12" height="12" viewBox="0 0 10 10" aria-hidden className="shrink-0 text-muted">
        <path d="M3 0v10M7 0v10M0 3h10M0 7h10" stroke="currentColor" strokeWidth="1" />
      </svg>
    );
  if (kind === "component")
    return (
      <svg width="12" height="12" viewBox="0 0 10 10" aria-hidden className="shrink-0 text-accent">
        <path d="M5 .5l4.5 4.5L5 9.5.5 5z" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    );
  return (
    <span aria-hidden className="text-label w-3 shrink-0 text-center text-muted">
      T
    </span>
  );
}

function LayersPanel() {
  const [open, setOpen] = useState<boolean[]>(() => education.map(() => true));
  const [selected, setSelected] = useState<number | null>(0);

  return (
    <div className="overflow-hidden rounded-md border border-line bg-frame shadow-[var(--shadow-frame)]">
      <div className="text-label flex items-center justify-between border-b border-line px-4 py-3 text-muted">
        <span className="text-ink">Layers</span>
        <span>Education</span>
      </div>

      <ul className="py-2 text-sm" aria-label="Education">
        <li className="flex items-center gap-2 px-4 py-2 font-medium">
          <LayerIcon kind="frame" />
          Education
        </li>
        {education.map((ed, i) => (
          <motion.li
            key={ed.qualification}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: dur.base, ease: ease.out, delay: 0.1 + i * stagger.items * 2 }}
          >
            <button
              type="button"
              aria-expanded={open[i]}
              onClick={() => {
                setSelected(i);
                setOpen((o) => o.map((v, j) => (j === i ? !v : v)));
              }}
              className={cn(
                "group relative flex w-full items-center gap-2 py-2 pr-4 pl-8 text-left transition-colors",
                selected === i ? "bg-[var(--selection-fill)]" : "hover:bg-[var(--selection-fill)]",
              )}
            >
              {selected === i && <span aria-hidden className="absolute inset-0 border border-accent" />}
              <motion.svg
                width="8"
                height="8"
                viewBox="0 0 8 8"
                aria-hidden
                className="shrink-0 text-muted"
                animate={{ rotate: open[i] ? 90 : 0 }}
                transition={{ duration: dur.micro }}
              >
                <path d="M2 1l4 3-4 3z" fill="currentColor" />
              </motion.svg>
              <LayerIcon kind="component" />
              <span className="flex-1 font-medium">{ed.qualification}</span>
              <span className="text-label text-muted tabular-nums">
                {ed.start} – {ed.end}
              </span>
            </button>

            <AnimatePresence initial={false}>
              {open[i] && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: dur.base * 0.6, ease: ease.out }}
                  className="relative overflow-hidden"
                >
                  <span aria-hidden className="absolute top-0 bottom-2 left-[46px] w-px bg-line" />
                  {[ed.institution, ed.location].map((line) => (
                    <li
                      key={line}
                      className="flex items-center gap-2 py-1.5 pr-4 pl-[60px] text-muted"
                    >
                      <LayerIcon kind="text" />
                      {line}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

function LanguagesCard() {
  const { ielts } = languages;
  return (
    <div className="rounded-md border border-line bg-frame shadow-[var(--shadow-frame)]">
      <div className="text-label flex items-center justify-between border-b border-line px-4 py-3 text-muted">
        <span className="text-ink">Properties</span>
        <span>Languages</span>
      </div>
      <dl className="divide-y divide-line text-sm">
        {languages.spoken.map((l) => (
          <div key={l.language} className="grid grid-cols-[96px_1fr] gap-3 px-4 py-3">
            <dt className="text-label pt-0.5 text-muted">{l.language}</dt>
            <dd className="text-pretty">{l.level}</dd>
          </div>
        ))}
      </dl>
      <div className="border-t border-line px-4 py-4">
        <p className="text-label flex flex-wrap justify-between gap-2 text-muted">
          <span>{ielts.test}</span>
          <span>{formatDate(ielts.date)}</span>
        </p>
        <p className="mt-3 flex items-baseline gap-2">
          <span className="font-display text-3xl font-bold">{ielts.overall.score}</span>
          <span className="text-label text-muted">Overall · CEFR {ielts.overall.cefr}</span>
        </p>
        <dl className="mt-4 grid grid-cols-4 gap-px overflow-hidden rounded border border-line bg-line">
          {ielts.bands.map((b) => (
            <div key={b.label} className="flex flex-col-reverse bg-frame px-2 py-2.5 text-center">
              <dt className="text-label mt-1 text-muted">{b.label}</dt>
              <dd className="text-sm font-semibold tabular-nums">{b.score}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
