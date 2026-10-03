"use client";

import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, useState } from "react";
import { useReducedMotion } from "@/lib/media";
import { SelectionBox } from "@/components/canvas/SelectionBox";

type Token = { text: string; key: boolean };

/** "a [b c] d" to tokens; bracketed groups are keywords. */
function tokenize(source: string): Token[] {
  const out: Token[] = [];
  for (const part of source.split(/(\[[^\]]+\])/g)) {
    if (!part) continue;
    if (part.startsWith("[")) out.push({ text: part.slice(1, -1), key: true });
    else for (const w of part.split(" ")) if (w) out.push({ text: w, key: false });
  }
  return out;
}

function Word({ token, progress, range }: { token: Token; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  const [selected, setSelected] = useState(false);
  useMotionValueEvent(progress, "change", (v) => {
    if (token.key) setSelected(v >= range[1]);
  });

  return (
    <motion.span className="relative inline-block" style={{ opacity }}>
      {token.key && <SelectionBox show={selected} inset={3} />}
      <span className={token.key ? "relative z-0" : undefined}>{token.text}</span>
    </motion.span>
  );
}

/**
 * Signature: the statement lights up word by word as it scrolls through the
 * viewport; keywords snap into Figma selections as they are reached.
 */
export function ScrollLitText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const tokens = tokenize(text);
  const n = tokens.length;

  if (reduced) {
    return (
      <p ref={ref} className={className}>
        {tokens.map((t, i) => (
          <span key={i} className={t.key ? "text-accent-ink" : undefined}>
            {t.text}{" "}
          </span>
        ))}
      </p>
    );
  }

  return (
    <p ref={ref} className={className}>
      <span className="sr-only">{text.replace(/[[\]]/g, "")}</span>
      <span aria-hidden>
        {tokens.map((t, i) => (
          <span key={i}>
            <Word token={t} progress={scrollYProgress} range={[i / n, (i + 1) / n]} />{" "}
          </span>
        ))}
      </span>
    </p>
  );
}
