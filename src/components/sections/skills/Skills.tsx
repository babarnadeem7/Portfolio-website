"use client";

import { LayoutGroup, motion, type Variants } from "motion/react";
import { useState } from "react";
import { dur, ease, spring, stagger } from "@/motion.config";
import { skillGroups, type Skill } from "@/content/skills";
import { seeded } from "@/lib/format";
import { cn } from "@/lib/cn";
import { Frame } from "@/components/canvas/Frame";
import { SplitText } from "@/components/motion/SplitText";
import { Reveal } from "@/components/motion/Reveal";

const STYLES = ["Filled", "Outline", "Minimal"] as const;
type Style = (typeof STYLES)[number];

/**
 * Skills as a component library. Signature: chips arrive scattered and
 * snap into auto-layout; a "Variant" property swaps every instance at once;
 * hover / tap switches a single instance to its hover variant.
 */
export function Skills() {
  const [style, setStyle] = useState<Style>("Filled");

  return (
    <Frame id="skills" index={5} name="Components" labelledBy="skills-title" className="px-page overflow-x-clip py-28 md:py-40">
      <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="text-label mb-5 text-muted uppercase">Skills</p>
          <h2 id="skills-title" className="font-display font-condensed text-display max-w-[14ch] font-extrabold">
            <SplitText text="A component library of how I work." by="words" />
          </h2>
        </div>

        <Reveal className="flex flex-col gap-2">
          <span className="text-label text-muted" id="variant-label">
            Property: Variant
          </span>
          <div role="radiogroup" aria-labelledby="variant-label" className="flex rounded-md border border-line bg-frame p-1">
            {STYLES.map((s) => (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={style === s}
                onClick={() => setStyle(s)}
                className={cn(
                  "relative rounded-[4px] px-3.5 py-1.5 text-sm transition-colors",
                  style === s ? "text-canvas" : "text-muted hover:text-ink",
                )}
              >
                {style === s && (
                  <motion.span
                    layoutId="variant-pill"
                    className="absolute inset-0 rounded-[4px] bg-ink"
                    transition={{ type: "spring", ...spring.snap }}
                  />
                )}
                <span className="relative">{s}</span>
              </button>
            ))}
          </div>
        </Reveal>
      </div>

      <LayoutGroup>
        <div className="mt-16 grid gap-x-8 gap-y-16 lg:grid-cols-3">
          {skillGroups.map((group, g) => (
            <ComponentSet
              key={group.name}
              name={group.name}
              description={group.description}
              skills={group.skills}
              style={style}
              seed={g * 31}
              wide={g % 2 === 1}
            />
          ))}
        </div>
      </LayoutGroup>
    </Frame>
  );
}

function ComponentSet({
  name,
  description,
  skills,
  style,
  seed,
  wide,
}: {
  name: string;
  description: string;
  skills: Skill[];
  style: Style;
  seed: number;
  wide: boolean;
}) {
  const list: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger.items, delayChildren: 0.15 } },
  };

  return (
    <section aria-labelledby={`set-${seed}`} className={cn("relative", wide && "lg:col-span-2")}>
      <header className="mb-4 flex items-baseline justify-between gap-4">
        <h3 id={`set-${seed}`} className="text-label flex items-center gap-2 font-medium text-accent-ink">
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
            <path d="M5 0l5 5-5 5-5-5z" fill="currentColor" />
          </svg>
          {name}
        </h3>
        <span className="text-label text-muted">{description}</span>
      </header>

      <motion.ul
        className="relative flex flex-wrap gap-2.5 rounded-[6px] p-5 md:p-6"
        variants={list}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        {/* dashed component-set outline */}
        <svg aria-hidden className="pointer-events-none absolute inset-0 size-full overflow-visible">
          <rect
            x="0.5"
            y="0.5"
            style={{ width: "calc(100% - 1px)", height: "calc(100% - 1px)" }}
            rx="6"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1"
            strokeDasharray="6 6"
            className="animate-[march_1.2s_linear_infinite] motion-reduce:animate-none"
          />
        </svg>
        {skills.map((skill, i) => (
          <Chip key={skill.label} skill={skill} style={style} seed={seed + i} />
        ))}
      </motion.ul>
    </section>
  );
}

function Chip({ skill, style, seed }: { skill: Skill; style: Style; seed: number }) {
  const [on, setOn] = useState(false);
  const scatter: Variants = {
    hidden: {
      opacity: 0,
      x: (seeded(seed) - 0.5) * 220,
      y: (seeded(seed + 7) - 0.5) * 140,
      rotate: (seeded(seed + 3) - 0.5) * 24,
    },
    show: { opacity: 1, x: 0, y: 0, rotate: 0, transition: { type: "spring", ...spring.snap, mass: 1.2 } },
  };

  const base: Record<Style, string> = {
    Filled: "bg-ink text-canvas border-ink",
    Outline: "bg-transparent text-ink border-ink",
    Minimal: "bg-frame text-ink border-line",
  };

  return (
    <motion.li variants={scatter} layout transition={{ layout: { type: "spring", ...spring.snap } }}>
      <motion.span
        onHoverStart={() => setOn(true)}
        onHoverEnd={() => setOn(false)}
        onTap={() => setOn((v) => !v)}
        layout
        data-cursor="link"
        data-cursor-label={skill.note ?? "Instance"}
        className={cn(
          "flex items-center gap-2 border px-4 py-2 text-sm transition-colors duration-200 select-none",
          style === "Minimal" ? "rounded-[6px]" : "rounded-full",
          on ? "border-accent bg-accent text-on-accent" : base[style],
        )}
        transition={{ layout: { type: "spring", ...spring.snap } }}
      >
        <motion.svg
          layout="position"
          width="9"
          height="9"
          viewBox="0 0 10 10"
          aria-hidden
          animate={{ rotate: on ? 45 : 0 }}
          transition={{ duration: dur.micro * 2, ease: ease.out }}
        >
          <path d="M5 .5l4.5 4.5L5 9.5.5 5z" fill="none" stroke="currentColor" strokeWidth="1.2" />
        </motion.svg>
        <motion.span layout="position">{skill.label}</motion.span>
        {skill.note && (
          <motion.span
            layout="position"
            className={cn("text-label rounded-[3px] px-1 py-[1px]", on ? "bg-ink text-canvas" : "bg-accent text-on-accent")}
          >
            {skill.note}
          </motion.span>
        )}
      </motion.span>
    </motion.li>
  );
}
