"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { dur, ease } from "@/motion.config";
import { site } from "@/content/site";
import { showToast } from "@/lib/app-store";
import { cn } from "@/lib/cn";

async function copy(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  }
}

/** Copy-to-clipboard with an icon morph and a toast. */
export function CopyEmail({ className }: { className?: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(id);
  }, [copied]);

  return (
    <button
      type="button"
      onClick={async () => {
        const ok = await copy(site.email);
        if (ok) {
          setCopied(true);
          showToast("Email copied to clipboard");
        } else showToast("Copy failed. Select the address instead.");
      }}
      data-cursor-label={copied ? "Copied" : "Copy email"}
      className={cn(
        "relative inline-flex h-9 items-center gap-2 overflow-hidden rounded-full border px-3.5 text-sm transition-colors duration-300",
        copied ? "border-accent bg-accent text-on-accent" : "border-line bg-frame hover:border-ink",
        className,
      )}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
        <AnimatePresence initial={false} mode="wait">
          {copied ? (
            <motion.path
              key="check"
              d="M2.5 7.4l2.8 2.8 6.2-6.4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: dur.base * 0.6, ease: ease.out }}
            />
          ) : (
            <motion.g key="copy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <rect x="4.5" y="4.5" width="7.5" height="7.5" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
              <path d="M9.5 2.5V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v5.5a1 1 0 0 0 1 1h.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
      <span className="relative inline-flex overflow-hidden">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={copied ? "y" : "n"}
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "-100%" }}
            transition={{ duration: dur.micro * 1.5, ease: ease.out }}
          >
            {copied ? "Copied" : "Copy email"}
          </motion.span>
        </AnimatePresence>
      </span>
    </button>
  );
}
