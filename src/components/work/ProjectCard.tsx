"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { spring } from "@/motion.config";
import type { Project } from "@/content/projects";
import { useRichPointer } from "@/lib/media";
import { pad2 } from "@/lib/format";
import { TransitionLink } from "@/components/motion/PageTransition";

/** Grid card with a 3D tilt that follows the pointer (fine pointers only). */
export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const rich = useRichPointer();
  const ref = useRef<HTMLAnchorElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [6, -6]), spring.soft);
  const rotateY = useSpring(useTransform(mx, [0, 1], [-8, 8]), spring.soft);
  const glare = useTransform(mx, (x) => `radial-gradient(60% 60% at ${x * 100}% 0%, rgb(255 255 255 / 0.18), transparent 70%)`);

  return (
    <motion.div style={{ perspective: 1200 }} layout>
      <TransitionLink
        ref={ref}
        href={`/work/${project.slug}`}
        data-cursor="view"
        data-cursor-label="Open"
        className="group block"
        onPointerMove={(e) => {
          if (!rich || !ref.current) return;
          const r = ref.current.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width);
          my.set((e.clientY - r.top) / r.height);
        }}
        onPointerLeave={() => {
          mx.set(0.5);
          my.set(0.5);
        }}
      >
        <motion.div
          style={rich ? { rotateX, rotateY, transformStyle: "preserve-3d" } : undefined}
          className="relative overflow-hidden rounded-[var(--radius-frame)] border border-line bg-frame"
        >
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={project.cover.src}
              alt={project.cover.alt}
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
            />
            {rich && (
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: glare }}
              />
            )}
          </div>
        </motion.div>
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-label text-muted tabular-nums">
              {pad2(index + 1)} · {project.year}
            </p>
            <h3 className="font-display mt-1 text-2xl font-bold md:text-3xl">{project.title}</h3>
          </div>
          <ul className="flex flex-wrap justify-end gap-1.5 pt-1">
            {project.tags.slice(0, 3).map((t) => (
              <li key={t} className="text-label rounded-full border border-line px-2 py-1">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </TransitionLink>
    </motion.div>
  );
}
