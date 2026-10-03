"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { dur, ease, spring } from "@/motion.config";
import { useFinePointer } from "@/lib/media";

/**
 * Context-aware cursor. Elements opt in with data attributes:
 *   data-cursor="view" | "drag" | "link" | "text" | "hide"
 *   data-cursor-label="Open case study"
 * Links, buttons and fields are detected automatically.
 */
type Mode = "default" | "link" | "view" | "drag" | "text" | "hide";

const DEFAULT_TAG: Record<Mode, string> = {
  default: "You",
  link: "Click",
  view: "View",
  drag: "Drag",
  text: "Type",
  hide: "",
};

function resolve(target: EventTarget | null): { mode: Mode; label: string } {
  if (!(target instanceof Element)) return { mode: "default", label: "" };
  const tagged = target.closest<HTMLElement>("[data-cursor]");
  if (tagged) return { mode: (tagged.dataset.cursor as Mode) ?? "default", label: tagged.dataset.cursorLabel ?? "" };
  if (target.closest('input:not([type="checkbox"]):not([type="radio"]):not([type="submit"]), textarea, [contenteditable="true"]'))
    return { mode: "text", label: "" };
  const interactive = target.closest<HTMLElement>("a, button, [role='button'], label, select, summary");
  if (interactive) return { mode: "link", label: interactive.dataset.cursorLabel ?? "" };
  return { mode: "default", label: "" };
}

export function Cursor() {
  const fine = useFinePointer();
  return fine ? <CursorInner /> : null;
}

function CursorInner() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, spring.soft);
  const sy = useSpring(y, spring.soft);
  const [mode, setMode] = useState<Mode>("default");
  const [label, setLabel] = useState("");
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const shown = useRef(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("has-cursor");

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      if (!shown.current) {
        shown.current = true;
        sx.jump(e.clientX);
        sy.jump(e.clientY);
        setVisible(true);
      }
    };
    const over = (e: PointerEvent) => {
      const next = resolve(e.target);
      setMode(next.mode);
      setLabel(next.label);
    };
    const leave = (e: PointerEvent) => {
      if (e.relatedTarget === null) {
        shown.current = false;
        setVisible(false);
      }
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    document.addEventListener("pointerout", leave, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    return () => {
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.removeEventListener("pointerout", leave);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, [x, y, sx, sy]);

  const tag = label || DEFAULT_TAG[mode];
  const isView = mode === "view";
  const show = visible && mode !== "hide";

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      {/* Inverting disc for media / "view" targets */}
      <motion.div
        className="absolute top-0 left-0 flex size-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white mix-blend-difference"
        style={{ x: sx, y: sy }}
        initial={false}
        animate={{ scale: show && isView ? 1 : 0 }}
        transition={{ duration: dur.base * 0.6, ease: ease.out }}
      />

      {/* Pointer + name tag (1:1 with the mouse; only the tag eases) */}
      <motion.div className="absolute top-0 left-0" style={{ x, y }}>
        <motion.div
          initial={false}
          animate={{ opacity: show ? 1 : 0, scale: pressed ? 0.86 : 1 }}
          transition={{ duration: dur.micro, ease: ease.out }}
          style={{ transformOrigin: "0 0" }}
        >
          <AnimatePresence initial={false} mode="wait">
            {mode === "text" ? (
              <motion.svg
                key="beam"
                width="12"
                height="22"
                viewBox="0 0 12 22"
                className="-translate-x-1.5 -translate-y-2.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <path d="M2 1h3l1 1 1-1h3M6 2v18M2 21h3l1-1 1 1h3" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
              </motion.svg>
            ) : isView ? null : (
              <motion.svg
                key="arrow"
                width="18"
                height="22"
                viewBox="0 0 18 22"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: dur.micro }}
                style={{ transformOrigin: "0 0" }}
              >
                <path
                  d="M1.5 1.5v16.2l4.3-4.2 2.9 6.8 2.9-1.2-2.8-6.6h6.1z"
                  fill="var(--accent)"
                  stroke="var(--canvas)"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </motion.svg>
            )}
          </AnimatePresence>

          <motion.span
            layout
            className="text-label absolute top-[22px] left-[14px] overflow-hidden rounded-[3px] rounded-tl-none bg-accent px-1.5 py-[3px] font-medium whitespace-nowrap text-on-accent"
            animate={{ opacity: tag && !isView ? 1 : 0 }}
            transition={{ layout: { type: "spring", ...spring.snap }, opacity: { duration: dur.micro } }}
          >
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span
                key={tag}
                className="inline-block"
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -12, opacity: 0 }}
                transition={{ duration: dur.micro, ease: ease.out }}
              >
                {tag}
              </motion.span>
            </AnimatePresence>
          </motion.span>
        </motion.div>
      </motion.div>

      {/* "View" label rides the disc, above the blend layer */}
      <motion.span
        className="text-label absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 font-semibold tracking-wider text-white uppercase mix-blend-difference"
        style={{ x: sx, y: sy }}
        initial={false}
        animate={{ opacity: show && isView ? 1 : 0, scale: show && isView ? 1 : 0.5 }}
        transition={{ duration: dur.micro }}
      >
        {label || "View"}
      </motion.span>
    </div>
  );
}
