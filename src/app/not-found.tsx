import type { Metadata } from "next";
import { TransitionLink } from "@/components/motion/PageTransition";
import { SplitText } from "@/components/motion/SplitText";
import { buttonClass } from "@/components/ui/button";

export const metadata: Metadata = { title: "Frame not found" };

export default function NotFound() {
  return (
    <section className="px-page flex min-h-[100svh] flex-col items-center justify-center py-32 text-center">
      <div className="relative px-10 py-12 md:px-20">
        <svg aria-hidden className="pointer-events-none absolute inset-0 size-full">
          <rect
            x="0.5"
            y="0.5"
            style={{ width: "calc(100% - 1px)", height: "calc(100% - 1px)" }}
            fill="none"
            stroke="var(--accent)"
            strokeDasharray="6 6"
            className="animate-[march_1.2s_linear_infinite] motion-reduce:animate-none"
          />
        </svg>
        <p className="text-label absolute -top-5 left-0 text-accent-ink">Frame 404</p>
        <h1 className="font-display font-condensed text-hero font-extrabold">
          <SplitText text="404" by="chars" play />
        </h1>
        <p className="mt-6 text-lg text-muted">This frame was deleted, renamed, or never existed.</p>
      </div>
      <TransitionLink href="/" className={buttonClass("solid", "mt-12")}>
        Back to the canvas
      </TransitionLink>
    </section>
  );
}
