import { contact, site } from "@/content/site";
import { Frame } from "@/components/canvas/Frame";
import { Magnetic } from "@/components/motion/Magnetic";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { buttonClass } from "@/components/ui/button";
import { ContactForm } from "./ContactForm";

/** Contact as a developer handoff: the big ask, the specs, and a form. */
export function Contact() {
  const specs = [
    { label: "Email", value: site.email, href: `mailto:${site.email}` },
    { label: "Phone", value: site.phone.display, href: site.phone.href },
    { label: "WhatsApp", value: "Message on WhatsApp", href: site.phone.whatsapp, external: true },
    ...site.socials.map((s) => ({ label: s.label, value: s.href.replace(/^https:\/\/(www\.)?/, ""), href: s.href, external: true })),
  ];

  return (
    <Frame id="contact" index={7} name="Handoff" labelledBy="contact-title" className="px-page py-28 md:py-40">
      <p className="text-label mb-5 text-muted uppercase">{contact.eyebrow}</p>
      <h2 id="contact-title" className="font-display font-condensed text-display font-extrabold" aria-label={contact.headline.join(" ")}>
        {contact.headline.map((line, i) => (
          <SplitText
            key={line}
            text={line}
            by="chars"
            className={i === contact.headline.length - 1 ? "block text-accent" : "block"}
            delay={i * 0.12}
          />
        ))}
      </h2>

      <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <Reveal>
            <p className="max-w-md text-lg text-pretty text-muted">{contact.intro}</p>
          </Reveal>

          <Reveal delay={0.08} className="mt-10">
            <a
              href={`mailto:${site.email}`}
              className="font-display link-underline text-[clamp(1.35rem,3vw,2.4rem)] font-semibold break-all"
              data-cursor-label="Write an email"
            >
              {site.email}
            </a>
            <div className="mt-5 flex flex-wrap gap-3">
              <CopyEmail />
              <Magnetic strength={0.25}>
                <a href={site.cvPath} download className={buttonClass("solid", "h-9 px-4")} data-cursor-label="Download CV">
                  Download CV
                  <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden className="transition-transform duration-300 group-hover:translate-y-0.5">
                    <path d="M7 2v9M3 7l4 4 4-4M2 13h10" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </a>
              </Magnetic>
            </div>
          </Reveal>

          <Reveal delay={0.16} className="mt-12">
            <div className="rounded-md border border-line bg-frame">
              <div className="text-label flex items-center justify-between border-b border-line px-4 py-3 text-muted">
                <span className="text-ink">Inspect</span>
                <span>Contact specs</span>
              </div>
              <dl className="divide-y divide-line text-sm">
                {specs.map((s) => (
                  <div key={s.label} className="grid grid-cols-[96px_1fr] items-center gap-3 px-4 py-3">
                    <dt className="text-label text-muted">{s.label}</dt>
                    <dd className="min-w-0 truncate">
                      <a
                        href={s.href}
                        className="link-underline"
                        {...("external" in s && s.external ? { target: "_blank", rel: "noreferrer" } : {})}
                      >
                        {s.value}
                      </a>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <ContactForm />
        </Reveal>
      </div>
    </Frame>
  );
}
