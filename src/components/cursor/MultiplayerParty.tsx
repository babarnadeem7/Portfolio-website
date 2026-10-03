"use client";

import { motion } from "motion/react";
import { setAppState } from "@/lib/app-store";
import { seeded } from "@/lib/format";
import { useReducedMotion } from "@/lib/media";

const GUESTS = ["Client", "Developer", "PM", "QA", "Stakeholder", "Copywriter", "Intern", "Design Lead"];
const DURATION = 7;

/** Konami easter egg: a crowd of collaborator cursors drifts across the file, then leaves. */
export default function MultiplayerParty() {
  const reduced = useReducedMotion();

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[97] overflow-hidden">
      {GUESTS.map((name, i) => {
        const pts = Array.from({ length: 5 }, (_, k) => ({
          x: `${Math.round(8 + seeded(i * 7 + k) * 84)}vw`,
          y: `${Math.round(10 + seeded(i * 13 + k * 3) * 78)}vh`,
        }));
        const enterFromLeft = i % 2 === 0;
        const edge = enterFromLeft ? "-12vw" : "112vw";
        const accent = i % 2 === 0;
        return (
          <motion.div
            key={name}
            className="absolute top-0 left-0"
            initial={{ x: edge, y: pts[0].y }}
            animate={
              reduced
                ? { x: pts[1].x, y: pts[1].y }
                : { x: [edge, ...pts.map((p) => p.x), edge], y: [pts[0].y, ...pts.map((p) => p.y), pts[4].y] }
            }
            transition={{ duration: DURATION, ease: "easeInOut", delay: i * 0.12 }}
            onAnimationComplete={() => {
              if (i === GUESTS.length - 1) setAppState({ party: false });
            }}
          >
            <svg width="18" height="22" viewBox="0 0 18 22">
              <path
                d="M1.5 1.5v16.2l4.3-4.2 2.9 6.8 2.9-1.2-2.8-6.6h6.1z"
                fill={accent ? "var(--accent)" : "var(--ink)"}
                stroke="var(--canvas)"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
            <span
              className="text-label absolute top-[22px] left-[14px] rounded-[3px] rounded-tl-none px-1.5 py-[3px] whitespace-nowrap"
              style={{
                background: accent ? "var(--accent)" : "var(--ink)",
                color: accent ? "var(--on-accent)" : "var(--canvas)",
              }}
            >
              {name}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
