"use client";

import { motion, useMotionValue, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { dur, ease } from "@/motion.config";
import { hero, site } from "@/content/site";
import { useAppState } from "@/lib/app-store";
import { useReducedMotion, useRichPointer } from "@/lib/media";
import { SplitText } from "@/components/motion/SplitText";
import { TransitionLink } from "@/components/motion/PageTransition";
import { FrameLabel } from "@/components/canvas/Frame";
import { Clock } from "@/components/ui/Clock";
import { HeroBackdrop } from "@/components/webgl/HeroBackdrop";
import { KineticChar } from "./KineticChar";
import { GhostCursor } from "./GhostCursor";

const OFF = -1e5;

/**
 * Signature: oversized kinetic name revealed char by char after the intro,
 * glyphs stretch under the cursor, a collaborator selects the headline,
 * and the whole hero lifts and fades as you scroll away.
 */
export function Hero() {
  const introDone = useAppState((s) => s.introDone);
  const rich = useRichPointer();
  const reduced = useReducedMotion();
  const stage = useRef<HTMLElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const px = useMotionValue(OFF);
  const py = useMotionValue(OFF);

  const { scrollYProgress } = useScroll({ target: stage, offset: ["start start", "end start"] });
  const lift = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const onMove = (e: React.PointerEvent) => {
    if (!rich || !title.current) return;
    const r = title.current.getBoundingClientRect();
    px.set(e.clientX - r.left);
    py.set(e.clientY - r.top);
  };
  const onLeave = () => {
    px.set(OFF);
    py.set(OFF);
  };

  const char = (c: string) => (rich ? <KineticChar char={c} px={px} py={py} host={title} /> : c);

  return (
    <section
      ref={stage}
      id="top"
      aria-labelledby="hero-title"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pt-28 pb-8 md:pb-10"
    >
      <HeroBackdrop active={introDone} />
      <FrameLabel index={1} name="Hero" className="top-20" />

      <motion.div style={reduced ? undefined : { y: lift, opacity: fade }} className="px-page relative">
        <motion.div
          className="text-label mb-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-muted md:mb-12"
          initial={{ opacity: 0, y: 10 }}
          animate={introDone ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: dur.base, ease: ease.out, delay: 0.3 }}
        >
          <span className="text-ink">{hero.eyebrow}</span>
          <span>
            {site.location.city}, {site.location.country}
          </span>
          <Clock />
        </motion.div>

        <h1
          id="hero-title"
          ref={title}
          className="font-display font-condensed text-hero relative w-fit font-extrabold"
          aria-label={site.name}
        >
          {hero.lines.map((line, i) => (
            <SplitText
              key={line}
              text={line}
              by="chars"
              as="span"
              className={i === hero.lines.length - 1 ? "block text-right" : "block"}
              play={introDone}
              delay={0.1 + i * 0.14}
              renderUnit={char}
              releaseMask
            />
          ))}
        </h1>

        <div className="mt-8 grid gap-6 md:mt-10 md:grid-cols-[1fr_auto] md:items-end">
          <motion.p
            className="text-lead max-w-[26ch] text-pretty"
            initial={{ opacity: 0, y: 16 }}
            animate={introDone ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: dur.slow, ease: ease.out, delay: 0.4 }}
          >
            {hero.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={introDone ? { opacity: 1 } : undefined}
            transition={{ duration: dur.base, delay: 1.1 }}
          >
            <TransitionLink
              href="/#about"
              className="text-label group flex items-center gap-3 text-muted transition-colors hover:text-ink"
              data-cursor-label="Scroll"
            >
              <span className="relative h-10 w-px overflow-hidden bg-line">
                <span className="absolute inset-x-0 top-0 h-1/2 animate-[cue_1.8s_var(--ease-in-out-strong)_infinite] bg-accent" />
              </span>
              {hero.scrollCue}
            </TransitionLink>
          </motion.div>
        </div>
      </motion.div>

      {rich && <GhostCursor stage={stage} target={title} play={introDone} />}
    </section>
  );
}
