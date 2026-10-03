import { about, site } from "@/content/site";
import { experience } from "@/content/experience";
import { skillGroups } from "@/content/skills";
import { monthsBetween } from "@/lib/format";
import { Frame } from "@/components/canvas/Frame";
import { Counter } from "@/components/motion/Counter";
import { Reveal } from "@/components/motion/Reveal";
import { Clock } from "@/components/ui/Clock";
import { ScrollLitText } from "./ScrollLitText";

const tools = skillGroups.find((g) => g.name === "Tools")?.skills ?? [];

/** About: a scroll-lit statement beside an inspector panel. */
export function About() {
  const years = Math.floor(monthsBetween(site.careerStart, null) / 12);

  const properties: { label: string; value: React.ReactNode }[] = [
    { label: "Role", value: site.role },
    { label: "Based in", value: `${site.location.city}, ${site.location.country}` },
    { label: "Local time", value: <Clock /> },
    { label: "Currently", value: about.currently },
    { label: "Tools", value: tools.map((t) => t.label.replace("Adobe ", "")).join(", ") },
  ];

  const stats = [
    { value: experience.length, label: "Design roles, agencies to product teams", pad: 2 },
    { value: years, label: "Years designing interfaces", pad: 2, suffix: "+" },
    { value: tools.length, label: "Core tools, Figma first", pad: 2 },
  ];

  return (
    <Frame id="about" index={2} name="About" labelledBy="about-title" className="px-page py-28 md:py-40">
      <div className="grid gap-14 lg:grid-cols-[minmax(260px,340px)_1fr] lg:gap-20">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <h2 id="about-title" className="text-label mb-5 font-normal text-muted uppercase">
            About
          </h2>
          <Reveal className="rounded-md border border-line bg-frame shadow-[var(--shadow-frame)]">
            <div className="text-label flex items-center justify-between border-b border-line px-4 py-3 text-muted">
              <span>Design</span>
              <span>Inspect</span>
            </div>
            <dl className="divide-y divide-line text-sm">
              {properties.map((p) => (
                <div key={p.label} className="grid grid-cols-[96px_1fr] gap-3 px-4 py-3">
                  <dt className="text-label pt-0.5 text-muted">{p.label}</dt>
                  <dd>{p.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </aside>

        <div>
          <ScrollLitText text={about.statement} className="text-lead font-display font-medium text-balance" />

          <div className="mt-14 grid gap-8 md:grid-cols-2 md:gap-12">
            {about.body.map((para, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p className="max-w-prose text-pretty text-muted md:text-lg">{para}</p>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10">
            <ul className="flex flex-wrap gap-2" aria-label="Specialties">
              {about.specialties.map((s) => (
                <li key={s} className="rounded-full border border-line bg-frame px-3.5 py-1.5 text-sm">
                  {s}
                </li>
              ))}
            </ul>
          </Reveal>

          <dl className="mt-20 grid grid-cols-1 gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-3">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse bg-canvas p-6">
                <dt className="text-label mt-3 min-h-[2lh] text-muted">{s.label}</dt>
                <dd className="font-display font-condensed text-display leading-none font-bold">
                  <Counter to={s.value} pad={s.pad} suffix={s.suffix} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Frame>
  );
}
