import type { Metadata } from "next";
import { workCopy } from "@/content/site";
import { Frame } from "@/components/canvas/Frame";
import { SplitText } from "@/components/motion/SplitText";
import { WorkView } from "@/components/work/WorkView";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected UI/UX case studies by Syeda Kainat Anjum.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <Frame index={1} name="Work" labelledBy="work-title" className="px-page pt-36 pb-28 md:pb-40">
      <h1 id="work-title" className="font-display font-condensed text-display mb-16 font-extrabold">
        <SplitText text={workCopy.title} by="chars" play />
      </h1>
      <WorkView />
    </Frame>
  );
}
