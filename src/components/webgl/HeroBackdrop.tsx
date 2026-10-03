"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { useCallback, useState } from "react";
import { dur, ease } from "@/motion.config";
import { useReducedMotion } from "@/lib/media";

const MeshGradient = dynamic(() => import("./MeshGradient"), { ssr: false });

/**
 * Hero background. A static CSS gradient paints immediately (and is all that
 * reduced-motion users get); the WebGL shader loads after the intro and
 * cross-fades in on its first frame.
 */
export function HeroBackdrop({ active }: { active: boolean }) {
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 45% at 78% 18%, color-mix(in oklab, var(--accent) 55%, transparent), transparent 70%), radial-gradient(40% 35% at 18% 8%, color-mix(in oklab, var(--accent) 22%, transparent), transparent 70%), var(--canvas)",
        }}
      />
      {active && !reduced && (
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ duration: dur.slow * 1.4, ease: ease.out }}
        >
          <MeshGradient onReady={onReady} />
        </motion.div>
      )}
      {/* Canvas dot grid on top, so the hero still reads as the same "file". */}
      <div
        className="absolute inset-0"
        style={{ backgroundImage: "radial-gradient(var(--dot) 1px, transparent 1.2px)", backgroundSize: "24px 24px" }}
      />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-canvas to-transparent" />
    </div>
  );
}
