import { workCopy } from "@/content/site";
import { projects } from "@/content/projects";
import { Frame } from "@/components/canvas/Frame";
import { SplitText } from "@/components/motion/SplitText";
import { TransitionLink } from "@/components/motion/PageTransition";
import { WorkView } from "@/components/work/WorkView";

const HOME_LIMIT = 6;

/** Home-page Work section. */
export function Work() {
  return (
    <Frame id="work" index={3} name="Work" labelledBy="work-title" className="px-page py-28 md:py-40">
      <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-label mb-5 text-muted uppercase">Work</p>
          <h2 id="work-title" className="font-display font-condensed text-display font-extrabold">
            <SplitText text={workCopy.title} by="chars" />
          </h2>
        </div>
        {projects.length > HOME_LIMIT && (
          <TransitionLink href="/work" className="link-underline text-sm">
            All {projects.length} case studies
          </TransitionLink>
        )}
      </div>
      <WorkView limit={HOME_LIMIT} />
    </Frame>
  );
}
