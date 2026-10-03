"use client";

import { motion, type Variants } from "motion/react";
import { useLenis } from "lenis/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import { dur, ease } from "@/motion.config";
import { useReducedMotion } from "@/lib/media";

type Nav = { navigate: (href: string) => void };
const NavContext = createContext<Nav>({ navigate: () => {} });

export const useTransitionNav = () => useContext(NavContext);

const HEADER_OFFSET = -72;

/** Human label for the curtain, e.g. "/work/foo" to "Work / foo". */
function labelFor(pathname: string): string {
  if (pathname === "/") return "Home";
  return pathname
    .split("/")
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, " "))
    .join(" / ");
}

type Curtain = { from: string; label: string; hash: string } | null;

/**
 * Route transitions. A link starts a "cover" wipe; when it completes the
 * route changes behind the curtain, and once the new pathname renders the
 * curtain wipes away. Same-page hash links smooth-scroll instead.
 * Browser back/forward fall back to the template.tsx enter animation.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();
  const reduced = useReducedMotion();
  const [curtain, setCurtain] = useState<Curtain>(null);
  const target = useRef<string | null>(null);

  const navigate = useCallback(
    (href: string) => {
      const url = new URL(href, window.location.href);
      if (url.pathname === window.location.pathname) {
        if (url.hash) {
          const el = document.querySelector(url.hash);
          if (el instanceof HTMLElement) lenis?.scrollTo(el, { offset: HEADER_OFFSET });
          history.replaceState(null, "", url.hash);
        } else {
          lenis?.scrollTo(0);
        }
        return;
      }
      if (reduced) {
        router.push(href);
        return;
      }
      target.current = href;
      setCurtain({ from: window.location.pathname, label: labelFor(url.pathname), hash: url.hash });
    },
    [lenis, reduced, router],
  );

  const covering = curtain !== null && curtain.from === pathname;
  const revealing = curtain !== null && curtain.from !== pathname;

  // After the new route renders behind the curtain, jump to its hash target.
  useEffect(() => {
    if (!revealing || !curtain?.hash) return;
    const el = document.querySelector(curtain.hash);
    if (el instanceof HTMLElement) lenis?.scrollTo(el, { offset: HEADER_OFFSET, immediate: true, force: true });
  }, [revealing, curtain, lenis]);

  const state = covering ? "cover" : revealing ? "reveal" : "idle";

  const panel: Variants = {
    idle: { clipPath: "inset(100% 0% 0% 0%)", transition: { duration: 0 } },
    cover: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: dur.page * 0.7, ease: ease.inOut } },
    reveal: { clipPath: "inset(0% 0% 100% 0%)", transition: { duration: dur.page * 0.8, ease: ease.inOut, delay: 0.1 } },
  };
  const accent: Variants = {
    idle: { clipPath: "inset(100% 0% 0% 0%)", transition: { duration: 0 } },
    cover: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: dur.page * 0.6, ease: ease.inOut } },
    reveal: { clipPath: "inset(0% 0% 100% 0%)", transition: { duration: dur.page * 0.8, ease: ease.inOut, delay: 0.18 } },
  };
  const label: Variants = {
    idle: { opacity: 0, y: 30, transition: { duration: 0 } },
    cover: { opacity: 1, y: 0, transition: { duration: dur.base, ease: ease.out, delay: 0.25 } },
    reveal: { opacity: 0, y: -30, transition: { duration: dur.micro * 2, ease: ease.in } },
  };

  const value = useMemo(() => ({ navigate }), [navigate]);

  return (
    <NavContext.Provider value={value}>
      {children}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[90]" data-state={state}>
        <motion.div className="absolute inset-0 bg-accent" variants={accent} initial="idle" animate={state} />
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-ink text-canvas"
          variants={panel}
          initial="idle"
          animate={state}
          onAnimationComplete={(def) => {
            if (def === "cover" && target.current) {
              lenis?.scrollTo(0, { immediate: true, force: true });
              router.push(target.current, { scroll: false });
              target.current = null;
            } else if (def === "reveal") {
              setCurtain(null);
            }
          }}
        >
          <motion.div variants={label} className="relative px-10 py-6">
            <span className="text-label absolute -top-5 left-0 text-accent">Frame</span>
            <span className="absolute inset-0 border border-accent" />
            {[0, 1, 2, 3].map((c) => (
              <span
                key={c}
                className="absolute size-2 border border-accent bg-ink"
                style={{
                  left: c % 2 ? "auto" : -4,
                  right: c % 2 ? -4 : "auto",
                  top: c < 2 ? -4 : "auto",
                  bottom: c < 2 ? "auto" : -4,
                }}
              />
            ))}
            <span className="font-display font-condensed text-display font-bold">{curtain?.label}</span>
          </motion.div>
        </motion.div>
      </div>
    </NavContext.Provider>
  );
}

type TransitionLinkProps = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

/** next/link that routes through the curtain transition. */
export function TransitionLink({ href, onNavigate, ...props }: TransitionLinkProps) {
  const { navigate } = useTransitionNav();
  return (
    <Link
      href={href}
      scroll={false}
      onNavigate={(e) => {
        onNavigate?.(e);
        e.preventDefault();
        navigate(href);
      }}
      {...props}
    />
  );
}
