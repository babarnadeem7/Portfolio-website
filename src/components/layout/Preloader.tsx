"use client";

import { animate, stagger, useAnimate } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ease, preloader } from "@/motion.config";
import { site } from "@/content/site";
import { setAppState } from "@/lib/app-store";

const LABEL = `${site.firstName} / Portfolio`;

/**
 * Branded intro, played once per session:
 * 1. a frame is drawn like Figma's Frame tool, with a live W × H badge
 * 2. the file name types in and the name rises inside the frame
 * 3. the frame expands to the visitor's real viewport size
 * 4. the whole layer lifts away as a curtain
 * Skipped instantly for repeat visits and reduced motion (see themeBootScript).
 */
export function Preloader() {
  const [scope, run] = useAnimate<HTMLDivElement>();
  const [finished, setFinished] = useState(false);
  const size = useRef<HTMLSpanElement>(null);
  const pct = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.intro === "skip") {
      setAppState({ introDone: true });
      return;
    }

    let cancelled = false;
    const writeSize = (w: number, h: number) => {
      if (size.current) size.current.textContent = `${Math.round(w)} × ${Math.round(h)}`;
    };

    (async () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const fw = Math.round(vw < 640 ? vw * 0.82 : Math.min(vw * 0.6, 760));
      const fh = Math.round(vw < 640 ? vh * 0.36 : Math.min(vh * 0.44, 430));
      const x0 = Math.round((vw - fw) / 2);
      const y0 = Math.round((vh - fh) / 2);

      await run("[data-frame]", { left: x0, top: y0, width: 0, height: 0, opacity: 1 }, { duration: 0 });

      const counter = animate(0, 100, {
        duration: preloader.draw + preloader.hold + 0.3,
        ease: ease.out,
        onUpdate: (v) => {
          if (pct.current) pct.current.textContent = String(Math.round(v)).padStart(3, "0");
        },
      });

      // 1. draw
      animate(0, 1, { duration: preloader.draw, ease: ease.inOut, onUpdate: (p) => writeSize(fw * p, fh * p) });
      await run("[data-frame]", { width: fw, height: fh }, { duration: preloader.draw, ease: ease.inOut });
      if (cancelled) return;

      // 2. label + name
      run("[data-badge]", { opacity: 1 }, { duration: 0.3, ease: ease.out });
      run("[data-label-char]", { opacity: 1 }, { duration: 0.01, delay: stagger(0.035) });
      await run("[data-name-char]", { y: "0%" }, { duration: 0.55, ease: ease.out, delay: stagger(0.015) });
      await Promise.all([document.fonts?.ready, counter.finished]);
      await new Promise((r) => setTimeout(r, preloader.hold * 1000));
      if (cancelled) return;

      // 3. expand to the viewport
      animate(0, 1, {
        duration: preloader.expand,
        ease: ease.inOut,
        onUpdate: (p) => writeSize(fw + (vw - fw) * p, fh + (vh - fh) * p),
      });
      run("[data-name]", { opacity: 0, scale: 0.94 }, { duration: preloader.expand * 0.6, ease: ease.in });
      await run("[data-frame]", { left: 0, top: 0, width: vw, height: vh }, { duration: preloader.expand, ease: ease.inOut });
      if (cancelled) return;

      // 4. curtain
      setAppState({ introDone: true });
      await run(scope.current, { clipPath: ["inset(0% 0% 0% 0%)", "inset(0% 0% 100% 0%)"] }, { duration: preloader.curtain, ease: ease.inOut });
      try {
        sessionStorage.setItem("ska-intro", "1");
      } catch {
        /* storage blocked: intro simply plays again next visit */
      }
      if (!cancelled) setFinished(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [run, scope]);

  if (finished) return null;

  return (
    <div
      ref={scope}
      data-preloader
      aria-hidden
      className="fixed inset-0 z-[110] overflow-hidden bg-canvas"
      style={{ backgroundImage: "radial-gradient(var(--dot) 1px, transparent 1.2px)", backgroundSize: "24px 24px" }}
    >
      <div data-frame className="absolute opacity-0" style={{ left: "50%", top: "50%", width: 0, height: 0 }}>
        <div className="absolute inset-0 border border-accent bg-frame/60" />
        {[0, 1, 2, 3].map((c) => (
          <span
            key={c}
            className="absolute size-2 border border-accent bg-canvas"
            style={{
              left: c % 2 ? "auto" : -4,
              right: c % 2 ? -4 : "auto",
              top: c < 2 ? -4 : "auto",
              bottom: c < 2 ? "auto" : -4,
            }}
          />
        ))}
        <p className="text-label absolute -top-5 left-0 whitespace-nowrap text-accent-ink">
          {Array.from(LABEL).map((ch, i) => (
            <span key={i} data-label-char className="opacity-0">
              {ch}
            </span>
          ))}
        </p>
        <div data-name className="absolute inset-0 flex items-center justify-center overflow-hidden px-4">
          <p className="font-display font-condensed text-center text-[clamp(2rem,6.5vw,5.5rem)] leading-[0.9] font-bold tracking-tight">
            {Array.from(site.name).map((ch, i) => (
              <span key={i} className="inline-block overflow-hidden align-top">
                <span data-name-char className="inline-block" style={{ transform: "translateY(110%)" }}>
                  {ch === " " ? " " : ch}
                </span>
              </span>
            ))}
          </p>
        </div>
        <span
          data-badge
          className="text-label absolute -bottom-8 left-1/2 -translate-x-1/2 rounded-[3px] bg-accent px-1.5 py-1 whitespace-nowrap text-on-accent tabular-nums opacity-0"
        >
          <span ref={size}>0 × 0</span>
        </span>
      </div>

      <div className="text-label px-page absolute inset-x-0 bottom-6 flex justify-between text-muted">
        <span>Opening file</span>
        <span>
          <span ref={pct} className="tabular-nums">
            000
          </span>
          %
        </span>
      </div>
    </div>
  );
}
