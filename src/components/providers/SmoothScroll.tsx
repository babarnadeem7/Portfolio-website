"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect, type ReactNode } from "react";
import { useAppState } from "@/lib/app-store";

/** Locks scrolling while the preloader runs. */
function IntroLock() {
  const lenis = useLenis();
  const introDone = useAppState((s) => s.introDone);
  useEffect(() => {
    if (!lenis) return;
    if (introDone) lenis.start();
    else lenis.stop();
  }, [lenis, introDone]);
  return null;
}

/**
 * Lenis smooth scroll on the window. It honours prefers-reduced-motion
 * natively (lerp 1, instant programmatic scrolls).
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.11, wheelMultiplier: 1, smoothWheel: true, stopInertiaOnNavigate: true }}>
      <IntroLock />
      {children}
    </ReactLenis>
  );
}
