"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import type { GalleryItem, Project } from "@/content/projects";
import { pad2 } from "@/lib/format";
import { useReducedMotion } from "@/lib/media";
import { cn } from "@/lib/cn";
import { ParallaxLayer } from "@/components/motion/ParallaxLayer";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { TransitionLink } from "@/components/motion/PageTransition";
import { buttonClass } from "@/components/ui/button";

/**
 * Case-study template. Scroll story: title reveal, cover that opens from an
 * inset frame to full bleed, sticky chapter labels, a process rail that
 * fills as you read, a parallax gallery, and a next-project handoff.
 */
export function CaseStudy({ project, next }: { project: Project; next?: Project }) {
  return (
    <article className="pt-28">
      <header className="px-page relative pb-14">
        <div className="text-label flex items-center justify-between text-muted">
          <TransitionLink href="/work" className="link-underline">
            All work
          </TransitionLink>
          <span>Case study / {project.year}</span>
        </div>
        <h1 className="font-display font-condensed text-display mt-8 max-w-[16ch] font-extrabold">
          <SplitText text={project.title} by="chars" play />
        </h1>
        <Reveal delay={0.3} className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <dl className="grid grid-cols-2 gap-6 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-label text-muted">Year</dt>
              <dd className="mt-1">{project.year}</dd>
            </div>
            <div>
              <dt className="text-label text-muted">Role</dt>
              <dd className="mt-1">{project.role}</dd>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <dt className="text-label text-muted">Scope</dt>
              <dd className="mt-1">{project.tags.join(", ")}</dd>
            </div>
          </dl>
          <p className="text-lead text-pretty">{project.summary}</p>
        </Reveal>
      </header>

      <Cover project={project} />

      <div className="px-page space-y-28 py-28 md:space-y-40 md:py-40">
        {project.challenge.length > 0 && (
          <Chapter index={1} title="Challenge">
            {project.challenge.map((p) => (
              <Reveal key={p}>
                <p className="text-lg text-pretty md:text-xl">{p}</p>
              </Reveal>
            ))}
          </Chapter>
        )}

        {project.process.length > 0 && (
          <Chapter index={2} title="Process">
            <ProcessRail steps={project.process} />
          </Chapter>
        )}

        {project.gallery.length > 0 && <Gallery items={project.gallery} />}

        {project.outcome.length > 0 && (
          <Chapter index={3} title="Outcome">
            {project.outcome.map((p) => (
              <Reveal key={p}>
                <p className="text-lg text-pretty md:text-xl">{p}</p>
              </Reveal>
            ))}
            {project.links.length > 0 && (
              <div className="flex flex-wrap gap-3 pt-4">
                {project.links.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className={buttonClass("outline")}>
                    {l.label}
                  </a>
                ))}
              </div>
            )}
          </Chapter>
        )}
      </div>

      {next && <NextProject project={next} />}
    </article>
  );
}

function Cover({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.15"] });
  const inset = useTransform(scrollYProgress, [0, 1], [10, 0]);
  const clipPath = useTransform(inset, (v) => `inset(0% ${v}% 0% ${v}% round ${v * 0.6}px)`);
  const scale = useTransform(scrollYProgress, [0, 1], [1.18, 1]);

  return (
    <motion.div
      ref={ref}
      className="relative overflow-hidden"
      style={{ aspectRatio: `${project.cover.width} / ${project.cover.height}`, clipPath: reduced ? undefined : clipPath }}
    >
      <motion.div className="absolute inset-0" style={reduced ? undefined : { scale }}>
        <Image src={project.cover.src} alt={project.cover.alt} fill priority sizes="100vw" className="object-cover" />
      </motion.div>
    </motion.div>
  );
}

function Chapter({ index, title, children }: { index: number; title: string; children: ReactNode }) {
  return (
    <section className="grid gap-8 lg:grid-cols-[minmax(200px,1fr)_2fr] lg:gap-20" aria-labelledby={`chapter-${index}`}>
      <div className="lg:sticky lg:top-28 lg:self-start">
        <p className="text-label text-accent-ink tabular-nums">{pad2(index)}</p>
        <h2 id={`chapter-${index}`} className="font-display font-condensed text-title mt-2 font-bold">
          {title}
        </h2>
      </div>
      <div className="max-w-3xl space-y-6">{children}</div>
    </section>
  );
}

function ProcessRail({ steps }: { steps: Project["process"] }) {
  const ref = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.75", "end 0.6"] });

  return (
    <ol ref={ref} className="relative space-y-14 pl-10">
      <span aria-hidden className="absolute top-1 bottom-1 left-[5px] w-px bg-line" />
      <motion.span
        aria-hidden
        className="absolute top-1 bottom-1 left-[5px] w-px origin-top bg-accent"
        style={reduced ? undefined : { scaleY: scrollYProgress }}
      />
      {steps.map((s, i) => (
        <li key={s.title} className="relative">
          <span aria-hidden className="absolute top-2 -left-10 size-[11px] rotate-45 border border-accent bg-canvas" />
          <Reveal>
            <h3 className="font-display text-2xl font-bold">
              <span className="text-label mr-3 align-middle text-muted">{pad2(i + 1)}</span>
              {s.title}
            </h3>
            <div className="mt-4 space-y-4 text-pretty text-muted md:text-lg">
              {s.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}

function Gallery({ items }: { items: GalleryItem[] }) {
  const reduced = useReducedMotion();
  return (
    <section aria-label="Gallery" className="grid gap-6 md:grid-cols-2 md:gap-8">
      {items.map((item, i) => {
        const wide = i % 3 === 0;
        return (
          <Reveal key={item.src} className={cn(wide && "md:col-span-2")}>
            <figure className="overflow-hidden rounded-[var(--radius-frame)] border border-line bg-frame">
              <ParallaxLayer speed={wide ? 0.08 : 0.04}>
                {item.type === "video" ? (
                  <video
                    src={item.src}
                    poster={item.poster}
                    width={item.width}
                    height={item.height}
                    className="h-auto w-full"
                    muted
                    loop
                    playsInline
                    autoPlay={!reduced}
                    controls={reduced}
                    preload="metadata"
                    aria-label={item.alt}
                  />
                ) : (
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={item.width}
                    height={item.height}
                    sizes={wide ? "100vw" : "(min-width: 768px) 50vw, 100vw"}
                    className="h-auto w-full"
                  />
                )}
              </ParallaxLayer>
            </figure>
          </Reveal>
        );
      })}
    </section>
  );
}

function NextProject({ project }: { project: Project }) {
  return (
    <TransitionLink
      href={`/work/${project.slug}`}
      data-cursor="view"
      data-cursor-label="Next"
      className="group px-page relative block overflow-hidden border-t border-line py-24 md:py-36"
    >
      <span className="absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-700 ease-[var(--ease-in-out-strong)] group-hover:scale-y-100" />
      <span className="relative block">
        <span className="text-label text-muted transition-colors duration-500 group-hover:text-canvas">Next project</span>
        <span className="font-display font-condensed text-display mt-4 block font-extrabold transition-colors duration-500 group-hover:text-canvas">
          {project.title}
        </span>
      </span>
      <span className="pointer-events-none absolute top-1/2 right-[var(--page-x)] hidden aspect-[4/3] w-[min(26vw,360px)] -translate-y-1/2 overflow-hidden rounded-[var(--radius-frame)] opacity-0 transition-all duration-700 ease-[var(--ease-out-expo)] group-hover:opacity-100 md:block">
        <Image src={project.cover.src} alt="" fill sizes="360px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
      </span>
    </TransitionLink>
  );
}
