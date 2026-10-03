"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { PageTransition } from "@/components/motion/PageTransition";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Cursor } from "@/components/cursor/Cursor";
import { LayoutGrid } from "@/components/canvas/LayoutGrid";
import { KeyboardShortcuts } from "@/components/ui/KeyboardShortcuts";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { Toaster } from "@/components/ui/Toaster";

/** Client-side shell: motion policy, smooth scroll, route transitions and global UI layers. */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll>
        <PageTransition>
          {children}
          <ScrollProgress />
          <LayoutGrid />
          <KeyboardShortcuts />
          <Toaster />
          <Cursor />
        </PageTransition>
      </SmoothScroll>
    </MotionConfig>
  );
}
