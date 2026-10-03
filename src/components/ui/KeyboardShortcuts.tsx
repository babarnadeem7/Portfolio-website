"use client";

import { AnimatePresence, motion } from "motion/react";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { dur, ease, stagger } from "@/motion.config";
import { getAppState, setAppState, showToast, useAppState } from "@/lib/app-store";
import { toggleTheme } from "@/lib/theme";

const MultiplayerParty = dynamic(() => import("@/components/cursor/MultiplayerParty"), { ssr: false });

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

const SHORTCUTS = [
  { keys: ["G"], action: "Toggle layout grid" },
  { keys: ["T"], action: "Toggle light / dark mode" },
  { keys: ["?"], action: "Show this panel" },
  { keys: ["Esc"], action: "Close" },
  { keys: ["↑", "↑", "↓", "↓", "←", "→", "←", "→", "B", "A"], action: "Invite collaborators" },
];

function isTyping(target: EventTarget | null) {
  return target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
}

/** Global keyboard layer: shortcuts, the shortcuts sheet and the Konami easter egg. */
export function KeyboardShortcuts() {
  const open = useAppState((s) => s.shortcuts);
  const party = useAppState((s) => s.party);
  const progress = useRef(0);
  const panel = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target)) return;
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;

      // Konami sequence
      progress.current = key === KONAMI[progress.current] ? progress.current + 1 : key === KONAMI[0] ? 1 : 0;
      if (progress.current === KONAMI.length) {
        progress.current = 0;
        setAppState({ party: true });
        showToast("Multiplayer mode: 8 collaborators joined the file");
        return;
      }

      if (key === "Escape" && getAppState().shortcuts) setAppState({ shortcuts: false });
      else if (key === "?") {
        returnFocus.current = document.activeElement as HTMLElement | null;
        setAppState((s) => ({ shortcuts: !s.shortcuts }));
      } else if (key === "g") {
        const next = !getAppState().grid;
        setAppState({ grid: next });
        showToast(next ? "Layout grid shown" : "Layout grid hidden");
      } else if (key === "t") toggleTheme();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) panel.current?.focus();
    else returnFocus.current?.focus?.();
  }, [open]);

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panel}
            tabIndex={-1}
            role="dialog"
            aria-modal="false"
            aria-label="Keyboard shortcuts"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: dur.base * 0.6, ease: ease.out }}
            className="fixed right-4 bottom-4 z-[96] w-[min(360px,calc(100vw-2rem))] rounded-md border border-line bg-frame p-5 shadow-2xl outline-none"
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="text-label text-muted uppercase">Keyboard shortcuts</p>
              <button
                type="button"
                onClick={() => setAppState({ shortcuts: false })}
                className="text-label rounded px-1.5 py-1 text-muted hover:text-ink"
              >
                Close
              </button>
            </div>
            <ul className="space-y-2.5">
              {SHORTCUTS.map((s, i) => (
                <motion.li
                  key={s.action}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0, transition: { delay: 0.08 + i * stagger.items } }}
                  className="flex items-center justify-between gap-4 text-sm"
                >
                  <span>{s.action}</span>
                  <span className="flex flex-wrap justify-end gap-1">
                    {s.keys.map((k, j) => (
                      <kbd key={j} className="text-label min-w-5 rounded border border-line bg-canvas px-1.5 py-1 text-center">
                        {k}
                      </kbd>
                    ))}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
      {party && <MultiplayerParty />}
    </>
  );
}
