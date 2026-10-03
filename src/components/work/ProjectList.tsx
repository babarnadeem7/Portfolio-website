"use client";

import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useState } from "react";
import { dur, ease, spring } from "@/motion.config";
import type { Project } from "@/content/projects";
import { useRichPointer } from "@/lib/media";
import { pad2 } from "@/lib/format";
import { cn } from "@/lib/cn";
import { TransitionLink } from "@/components/motion/PageTransition";

/** List view: rows dim their siblings; a floating cover follows the cursor. */
export function ProjectList({ projects }: { projects: Project[] }) {
  const rich = useRichPointer();
  const [active, setActive] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, spring.soft);
  const sy = useSpring(y, spring.soft);

  return (
    <div
      className="relative"
      onPointerMove={(e) => {
        x.set(e.clientX);
        y.set(e.clientY);
      }}
      onPointerLeave={() => setActive(null)}
    >
      <ul className="border-t border-line">
        {projects.map((p, i) => (
          <motion.li key={p.slug} layout className="border-b border-line">
            <TransitionLink
              href={`/work/${p.slug}`}
              data-cursor="view"
              data-cursor-label="Open"
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className={cn(
                "group grid grid-cols-[auto_1fr_auto] items-baseline gap-4 py-6 transition-opacity duration-300 md:gap-8 md:py-8",
                active !== null && active !== i && "opacity-35",
              )}
            >
              <span className="text-label text-muted tabular-nums">{pad2(i + 1)}</span>
              <span className="font-display font-condensed text-title font-bold transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-3">
                {p.title}
              </span>
              <span className="text-label hidden text-right text-muted sm:block">
                {p.role}
                <br />
                {p.year}
              </span>
            </TransitionLink>
          </motion.li>
        ))}
      </ul>

      {rich && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed top-0 left-0 z-40 aspect-[4/3] w-[min(28vw,380px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[var(--radius-frame)]"
          style={{ x: sx, y: sy }}
          animate={{ opacity: active === null ? 0 : 1, scale: active === null ? 0.8 : 1 }}
          transition={{ duration: dur.base * 0.6, ease: ease.out }}
        >
          <AnimatePresence initial={false}>
            {active !== null && (
              <motion.div
                key={projects[active].slug}
                className="absolute inset-0"
                initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
                animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                exit={{ opacity: 0 }}
                transition={{ duration: dur.base, ease: ease.inOut }}
              >
                <Image src={projects[active].cover.src} alt="" fill sizes="380px" className="object-cover" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
