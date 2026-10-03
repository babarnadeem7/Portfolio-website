"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useLenis } from "lenis/react";
import { useEffect, useRef, useState } from "react";
import { dur, ease, stagger } from "@/motion.config";
import { nav, site } from "@/content/site";
import { useAppState } from "@/lib/app-store";
import { cn } from "@/lib/cn";
import { Magnetic } from "@/components/motion/Magnetic";
import { TransitionLink } from "@/components/motion/PageTransition";
import { Clock } from "@/components/ui/Clock";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { buttonClass } from "@/components/ui/button";

/** Toolbar-like header. Hides on scroll down, returns on scroll up. */
export function Header() {
  const introDone = useAppState((s) => s.introDone);
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(!open && y > prev && y > 240);
  });

  return (
    <>
      <a
        href="#main"
        className="sr-only-focusable fixed top-3 left-3 z-[120] rounded bg-ink px-3 py-2 text-sm text-canvas"
      >
        Skip to content
      </a>
      <motion.header
        className={cn(
          "px-page fixed inset-x-0 top-0 z-[60] flex h-16 items-center justify-between gap-4 border-b transition-colors duration-300",
          scrolled ? "border-line bg-canvas/85 backdrop-blur-md" : "border-transparent",
        )}
        initial={{ y: "-100%" }}
        animate={{ y: introDone && !hidden ? "0%" : "-100%" }}
        transition={{ duration: dur.base, ease: ease.out }}
      >
        <TransitionLink href="/" className="group flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-[6px] bg-ink text-canvas transition-colors duration-300 group-hover:bg-accent group-hover:text-on-accent">
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
              <path d="M7 1l6 6-6 6-6-6z" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-semibold whitespace-nowrap">{site.name}</span>
            <span className="text-label block text-muted">{site.role}</span>
          </span>
        </TransitionLink>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-7 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <TransitionLink href={item.href} className="link-underline">
                  {item.label}
                </TransitionLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden xl:inline-flex">
            <Clock />
          </span>
          <ThemeToggle />
          <span className="hidden md:block">
            <Magnetic strength={0.25}>
              <TransitionLink href="/#contact" className={buttonClass("solid", "h-9 px-4")}>
                Let&apos;s talk
              </TransitionLink>
            </Magnetic>
          </span>
          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-full border border-line bg-frame lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            <span className="relative block h-3 w-4" aria-hidden>
              <motion.span
                className="absolute left-0 h-[1.5px] w-4 bg-ink"
                animate={open ? { top: 5, rotate: 45 } : { top: 1, rotate: 0 }}
                transition={{ duration: dur.micro * 1.5, ease: ease.out }}
              />
              <motion.span
                className="absolute left-0 h-[1.5px] w-4 bg-ink"
                animate={open ? { top: 5, rotate: -45 } : { top: 9, rotate: 0 }}
                transition={{ duration: dur.micro * 1.5, ease: ease.out }}
              />
            </span>
          </button>
        </div>
      </motion.header>
      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const first = useRef<HTMLAnchorElement>(null);
  const lenis = useLenis();

  // Freeze the page behind the open menu.
  useEffect(() => {
    if (!lenis || !open) return;
    lenis.stop();
    return () => lenis.start();
  }, [lenis, open]);

  useEffect(() => {
    if (!open) return;
    first.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          className="px-page fixed inset-0 z-[55] flex flex-col bg-frame pt-24 pb-8 lg:hidden"
          initial={{ clipPath: "circle(0% at 100% 0%)" }}
          animate={{ clipPath: "circle(150% at 100% 0%)" }}
          exit={{ clipPath: "circle(0% at 100% 0%)" }}
          transition={{ duration: dur.page, ease: ease.inOut }}
        >
          <nav aria-label="Mobile" className="flex-1">
            <ul className="space-y-1">
              {nav.map((item, i) => (
                <li key={item.href} className="overflow-hidden">
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "100%" }}
                    transition={{ duration: dur.base, ease: ease.out, delay: 0.2 + i * stagger.items }}
                  >
                    <TransitionLink
                      ref={i === 0 ? first : undefined}
                      href={item.href}
                      onClick={onClose}
                      className="font-display font-condensed flex items-baseline gap-3 text-[clamp(2.75rem,13vw,5rem)] leading-[1.02] font-bold"
                    >
                      <span className="text-label text-accent-ink">{String(i + 1).padStart(2, "0")}</span>
                      {item.label}
                    </TransitionLink>
                  </motion.div>
                </li>
              ))}
            </ul>
          </nav>
          <motion.div
            className="space-y-3 border-t border-line pt-6 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.5 } }}
            exit={{ opacity: 0 }}
          >
            <a href={`mailto:${site.email}`} className="block break-all">
              {site.email}
            </a>
            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                {site.socials.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="link-underline">
                    {s.label}
                  </a>
                ))}
              </div>
              <Clock />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
