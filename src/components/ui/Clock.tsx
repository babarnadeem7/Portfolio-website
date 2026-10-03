"use client";

import { useSyncExternalStore } from "react";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

const formatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: site.location.timeZone,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

function subscribe(onTick: () => void) {
  const id = window.setInterval(onTick, 1000);
  return () => window.clearInterval(id);
}

const nowSeconds = () => Math.floor(Date.now() / 1000);

/** Live local time in Islamabad. Renders a placeholder on the server to avoid hydration drift. */
export function Clock({ className, showZone = true }: { className?: string; showZone?: boolean }) {
  const seconds = useSyncExternalStore(subscribe, nowSeconds, () => 0);
  const time = seconds ? formatter.format(seconds * 1000) : "--:--:--";

  return (
    <span className={cn("text-label inline-flex items-center gap-1.5 tabular-nums", className)}>
      <span className="relative flex size-1.5" aria-hidden>
        <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-60" />
        <span className="relative size-1.5 rounded-full bg-accent" />
      </span>
      <span className="sr-only">Local time in {site.location.city}:</span>
      <time suppressHydrationWarning>{time}</time>
      {showZone && <span className="text-muted">PKT</span>}
    </span>
  );
}
