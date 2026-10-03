"use client";

import { LayoutGroup, motion } from "motion/react";
import { useState } from "react";
import { spring, stagger } from "@/motion.config";
import { projects } from "@/content/projects";
import { cn } from "@/lib/cn";
import { ProjectCard } from "./ProjectCard";
import { ProjectList } from "./ProjectList";
import { WorkEmpty } from "./WorkEmpty";

type View = "grid" | "list";

/** Work index with a grid / list toggle. Driven entirely by content/projects.ts. */
export function WorkView({ limit }: { limit?: number }) {
  const [view, setView] = useState<View>("grid");
  const items = limit ? projects.slice(0, limit) : projects;

  if (items.length === 0) return <WorkEmpty />;

  return (
    <LayoutGroup>
      <div className="mb-8 flex justify-end">
        <div role="radiogroup" aria-label="Layout" className="flex rounded-md border border-line bg-frame p-1">
          {(["grid", "list"] as const).map((v) => (
            <button
              key={v}
              type="button"
              role="radio"
              aria-checked={view === v}
              onClick={() => setView(v)}
              className={cn(
                "relative rounded-[4px] px-3.5 py-1.5 text-sm capitalize transition-colors",
                view === v ? "text-canvas" : "text-muted hover:text-ink",
              )}
            >
              {view === v && (
                <motion.span
                  layoutId="work-view-pill"
                  className="absolute inset-0 rounded-[4px] bg-ink"
                  transition={{ type: "spring", ...spring.snap }}
                />
              )}
              <span className="relative">{v}</span>
            </button>
          ))}
        </div>
      </div>

      {view === "grid" ? (
        <motion.div
          key="grid"
          className="grid gap-x-8 gap-y-14 md:grid-cols-2"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: stagger.items } } }}
        >
          {items.map((p, i) => (
            <motion.div
              key={p.slug}
              variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }}
              className={i % 3 === 2 ? "md:col-span-2" : undefined}
            >
              <ProjectCard project={p} index={i} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <ProjectList projects={items} />
        </motion.div>
      )}
    </LayoutGroup>
  );
}
