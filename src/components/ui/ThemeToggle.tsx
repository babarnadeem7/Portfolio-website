"use client";

import { motion } from "motion/react";
import { spring } from "@/motion.config";
import { toggleTheme, useTheme } from "@/lib/theme";
import { cn } from "@/lib/cn";

/** Styled like a Figma variable-mode switch: Light / Dark. */
export function ThemeToggle({ className }: { className?: string }) {
  const theme = useTheme();
  const dark = theme === "dark";

  return (
    <button
      type="button"
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        toggleTheme({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      data-cursor-label={dark ? "Light mode" : "Dark mode"}
      className={cn(
        "relative flex h-8 items-center rounded-full border border-line bg-frame p-0.5 text-muted",
        className,
      )}
    >
      {(["light", "dark"] as const).map((mode) => (
        <span key={mode} className="relative z-10 flex size-7 items-center justify-center">
          {theme === mode && (
            <motion.span
              layoutId="theme-pill"
              className="absolute inset-0 -z-10 rounded-full bg-ink"
              transition={{ type: "spring", ...spring.snap }}
            />
          )}
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            aria-hidden
            className={cn("transition-colors duration-200", theme === mode && "text-canvas")}
          >
            {mode === "light" ? (
              <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                <circle cx="7" cy="7" r="2.6" />
                <path d="M7 .9v1.4M7 11.7v1.4M.9 7h1.4M11.7 7h1.4M2.7 2.7l1 1M10.3 10.3l1 1M2.7 11.3l1-1M10.3 3.7l1-1" />
              </g>
            ) : (
              <path d="M11.8 8.6A5.2 5.2 0 0 1 5.4 2.2a5.2 5.2 0 1 0 6.4 6.4z" fill="currentColor" />
            )}
          </svg>
        </span>
      ))}
    </button>
  );
}
