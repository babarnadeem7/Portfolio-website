"use client";

import { useAnimate } from "motion/react";
import { useEffect, useState } from "react";
import { ease } from "@/motion.config";
import { site } from "@/content/site";
import { SelectionBox } from "@/components/canvas/SelectionBox";

type Props = {
  /** Section the cursor lives in (coordinate space). */
  stage: React.RefObject<HTMLElement | null>;
  /** Element the collaborator selects. */
  target: React.RefObject<HTMLElement | null>;
  /** Start the choreography. */
  play: boolean;
};

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * A scripted multiplayer collaborator ("Kainat") who flies in, selects the
 * headline like a Figma layer, shows its size, then leaves the file.
 */
export function GhostCursor({ stage, target, play }: Props) {
  const [scope, run] = useAnimate<HTMLDivElement>();
  const [box, setBox] = useState<{ left: number; top: number; width: number; height: number } | null>(null);

  useEffect(() => {
    if (!play) return;
    let cancelled = false;

    (async () => {
      await wait(1400);
      const s = stage.current?.getBoundingClientRect();
      const t = target.current?.getBoundingClientRect();
      if (!s || !t || cancelled || !scope.current) return;

      const rel = { left: t.left - s.left, top: t.top - s.top, width: t.width, height: t.height };
      const start = { x: s.width + 40, y: s.height * 0.35 };
      const corner = { x: rel.left + rel.width - 8, y: rel.top + rel.height - 4 };

      await run(scope.current, { x: start.x, y: start.y, opacity: 1 }, { duration: 0 });
      await run(scope.current, { x: corner.x, y: corner.y }, { duration: 1.3, ease: ease.inOut });
      if (cancelled) return;
      await run(scope.current, { scale: [1, 0.82, 1] }, { duration: 0.25 });
      setBox(rel);
      await wait(2600);
      if (cancelled) return;
      setBox(null);
      await run(scope.current, { x: rel.left + rel.width * 0.4, y: rel.top - 40 }, { duration: 1.1, ease: ease.inOut });
      await wait(500);
      if (cancelled) return;
      await run(scope.current, { x: s.width + 60, y: rel.top - 120, opacity: 0 }, { duration: 1.2, ease: ease.inOut });
    })();

    return () => {
      cancelled = true;
    };
  }, [play, run, scope, stage, target]);

  return (
    <>
      {box && (
        <span className="pointer-events-none absolute z-10" style={box} aria-hidden>
          <SelectionBox
            show
            tag={site.firstName}
            badge={`${Math.round(box.width)} × ${Math.round(box.height)}`}
            inset={10}
          />
        </span>
      )}
      <div ref={scope} aria-hidden className="pointer-events-none absolute top-0 left-0 z-20 opacity-0">
        <svg width="18" height="22" viewBox="0 0 18 22">
          <path
            d="M1.5 1.5v16.2l4.3-4.2 2.9 6.8 2.9-1.2-2.8-6.6h6.1z"
            fill="var(--ink)"
            stroke="var(--canvas)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-label absolute top-[22px] left-[14px] rounded-[3px] rounded-tl-none bg-ink px-1.5 py-[3px] whitespace-nowrap text-canvas">
          {site.firstName}
        </span>
      </div>
    </>
  );
}
