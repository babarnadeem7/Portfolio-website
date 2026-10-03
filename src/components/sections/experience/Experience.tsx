"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { dur, ease } from "@/motion.config";
import { experience } from "@/content/experience";
import { formatMonth, pad2 } from "@/lib/format";
import { useDesktop, useReducedMotion } from "@/lib/media";
import { Frame } from "@/components/canvas/Frame";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { ExperienceCard } from "./ExperienceCard";

const COUNT = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
const TITLE = `${COUNT[experience.length] ?? experience.length} frames, one flow.`;
const INTRO = "Every role, newest first, connected like a prototype. Each one added a layer to how I design.";

/** Experience: pinned horizontal prototype flow on desktop, vertical flow elsewhere. */
export function Experience() {
  const desktop = useDesktop();
  const reduced = useReducedMotion();

  return (
    <Frame id="experience" index={4} name="Experience" labelledBy="experience-title">
      {desktop && !reduced ? <PinnedFlow /> : <StackedFlow />}
    </Frame>
  );
}

/* ---------------------------------------------------------------- */
/* Desktop: sticky stage, vertical scroll drives the horizontal track */

function PinnedFlow() {
  const section = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const distance = useMotionValue(0);
  const [height, setHeight] = useState<number | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () => {
      const d = Math.max(0, el.scrollWidth - window.innerWidth);
      distance.set(d);
      setHeight(d + window.innerHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [distance]);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform(() => -scrollYProgress.get() * distance.get());
  const bar = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const i = Math.min(experience.length - 1, Math.max(0, Math.floor(p * experience.length * 1.08 - 0.15)));
    setActive(i);
  });

  const item = experience[active];

  return (
    <div ref={section} style={{ height: height ?? "400vh" }} className="relative">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <motion.div ref={track} data-track style={{ x }} className="px-page relative flex w-max items-center gap-[10vw] pr-[20vw]">
          <div className="w-[min(40vw,560px)] shrink-0">
            <h2 id="experience-title" className="font-display font-condensed text-display font-extrabold">
              <SplitText text={TITLE} by="words" />
            </h2>
            <Reveal delay={0.2}>
              <p className="mt-6 max-w-sm text-pretty text-muted">{INTRO}</p>
              <p className="text-label mt-10 flex items-center gap-3 text-muted">
                <span className="h-px w-10 bg-accent" />
                Keep scrolling
              </p>
            </Reveal>
          </div>

          {experience.map((exp, i) => (
            <div key={exp.company + exp.start} className={i % 2 ? "mt-[14vh]" : "-mt-[14vh]"}>
              <div className="relative">
                <ExperienceCard item={exp} index={i} className="w-[min(34vw,500px)] shrink-0" />
                {i < experience.length - 1 && (
                  <Noodle progress={scrollYProgress} distance={distance} down={i % 2 === 0} />
                )}
              </div>
            </div>
          ))}
        </motion.div>

        {/* HUD: active frame + progress */}
        <div className="px-page text-label pointer-events-none absolute inset-x-0 bottom-8 flex items-end justify-between text-muted">
          <div className="flex items-center gap-4">
            <span className="text-ink tabular-nums">
              <RollingNumber value={pad2(active + 1)} /> / {pad2(experience.length)}
            </span>
            <span className="relative h-px w-40 bg-line">
              <motion.span className="absolute inset-0 origin-left bg-accent" style={{ scaleX: bar }} />
            </span>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: dur.micro * 1.5, ease: ease.out }}
              className="tabular-nums"
            >
              {item.company} · {formatMonth(item.start)} – {item.end ? formatMonth(item.end) : "Present"}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function RollingNumber({ value }: { value: string }) {
  return (
    <span className="relative inline-flex overflow-hidden align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: "100%" }}
          animate={{ y: "0%" }}
          exit={{ y: "-100%" }}
          transition={{ duration: dur.micro * 2, ease: ease.out }}
          className="inline-block"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/**
 * Prototype connector ("noodle") from this card to the next, drawn in real
 * pixels so the dot and arrowhead never distort. Its stroke is drawn by
 * scroll as it crosses the viewport.
 */
function Noodle({ progress, distance, down }: { progress: MotionValue<number>; distance: MotionValue<number>; down: boolean }) {
  const ref = useRef<SVGSVGElement>(null);
  const left = useRef(0);
  const width = useRef(1);
  const [box, setBox] = useState({ w: 1, h: 1 });

  useEffect(() => {
    const el = ref.current;
    const track = el?.closest<HTMLElement>("[data-track]");
    if (!el || !track) return;
    const measure = () => {
      const a = el.getBoundingClientRect();
      const b = track.getBoundingClientRect();
      left.current = a.left - b.left;
      width.current = Math.max(1, a.width);
      setBox({ w: Math.max(1, Math.round(a.width)), h: Math.max(1, Math.round(a.height)) });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    return () => ro.disconnect();
  }, []);

  const drawn = useTransform(() => {
    const vw = typeof window === "undefined" ? 1440 : window.innerWidth;
    const scrolled = progress.get() * distance.get();
    // starts when the noodle reaches 85% of the viewport, done by 40%
    const startAt = left.current - vw * 0.85;
    const endAt = left.current + width.current - vw * 0.4;
    return Math.min(1, Math.max(0, (scrolled - startAt) / (endAt - startAt)));
  });
  const head = useTransform(drawn, [0.9, 1], [0, 1]);

  const { w, h } = box;
  const y0 = h * (down ? 0.32 : 0.68);
  const y1 = h * (down ? 0.68 : 0.32);
  const path = `M 0 ${y0} C ${w * 0.5} ${y0}, ${w * 0.5} ${y1}, ${w - 2} ${y1}`;

  return (
    <svg
      ref={ref}
      aria-hidden
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      className="pointer-events-none absolute top-0 left-full h-full w-[10vw] overflow-visible text-accent"
    >
      <circle cx="0" cy={y0} r="4" fill="var(--canvas)" stroke="currentColor" strokeWidth="1.5" />
      <motion.path d={path} fill="none" stroke="currentColor" strokeWidth="1.5" style={{ pathLength: drawn }} />
      <motion.path
        d={`M ${w - 9} ${y1 - 5} L ${w - 2} ${y1} L ${w - 9} ${y1 + 5}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ opacity: head }}
      />
    </svg>
  );
}

/* ---------------------------------------------------------------- */
/* Mobile / reduced motion: vertical flow with a drawing rail         */

function StackedFlow() {
  const list = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: list, offset: ["start 0.7", "end 0.7"] });

  return (
    <div className="px-page py-28">
      <h2 id="experience-title" className="font-display font-condensed text-display font-extrabold">
        <SplitText text={TITLE} by="words" />
      </h2>
      <p className="mt-6 max-w-md text-pretty text-muted">{INTRO}</p>

      <ol ref={list} className="relative mt-16 space-y-14 pl-8 md:pl-14">
        <span aria-hidden className="absolute top-0 bottom-0 left-[5px] w-px bg-line md:left-[9px]" />
        <motion.span
          aria-hidden
          className="absolute top-0 bottom-0 left-[5px] w-px origin-top bg-accent md:left-[9px]"
          style={reduced ? undefined : { scaleY: scrollYProgress }}
        />
        {experience.map((exp, i) => (
          <li key={exp.company + exp.start} className="relative">
            <span
              aria-hidden
              className="absolute top-1 -left-8 size-[11px] rotate-45 border border-accent bg-canvas md:-left-14 md:size-[19px]"
            />
            <Reveal>
              <ExperienceCard item={exp} index={i} className="max-w-2xl" />
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}
