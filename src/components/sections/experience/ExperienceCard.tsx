import type { Experience } from "@/content/experience";
import { formatDuration, formatMonth, monthsBetween, pad2 } from "@/lib/format";
import { cn } from "@/lib/cn";

/** One role, drawn as an artboard: frame title outside, content inside. */
export function ExperienceCard({ item, index, className }: { item: Experience; index: number; className?: string }) {
  const months = monthsBetween(item.start, item.end);
  const current = item.end === null;

  return (
    <article className={cn("relative", className)} aria-labelledby={`role-${index}`}>
      <p className="text-label mb-2 flex items-center gap-2 text-muted">
        <span className="tabular-nums">{pad2(index + 1)}</span>
        <span className="text-ink">{item.company}</span>
        {current && (
          <span className="rounded-[3px] bg-accent px-1.5 py-[2px] text-on-accent">Current</span>
        )}
      </p>
      <div className="rounded-[var(--radius-frame)] border border-line bg-frame p-6 shadow-[var(--shadow-frame)] md:p-8">
        <div className="text-label flex flex-wrap items-center justify-between gap-2 text-muted">
          <span className="tabular-nums">
            {formatMonth(item.start)} – {current ? "Present" : formatMonth(item.end as string)}
          </span>
          <span>
            {formatDuration(months)} · {item.location}
          </span>
        </div>
        <h3 id={`role-${index}`} className="font-display mt-6 text-[clamp(1.6rem,2.6vw,2.4rem)] leading-[1.02] font-bold">
          {item.role}
          <span className="block text-muted">{item.company}</span>
        </h3>
        <p className="mt-5 text-pretty">{item.summary}</p>
        <ul className="mt-5 space-y-2.5 text-sm text-muted">
          {item.highlights.map((h) => (
            <li key={h} className="flex gap-3">
              <svg width="8" height="8" viewBox="0 0 8 8" className="mt-1.5 shrink-0 text-accent" aria-hidden>
                <path d="M4 0l4 4-4 4-4-4z" fill="currentColor" />
              </svg>
              <span className="text-pretty">{h}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
