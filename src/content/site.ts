/** Identity, contact and SEO copy. Edit here, never in components. */
export const site = {
  name: "Syeda Kainat Anjum",
  firstName: "Kainat",
  initials: "SKA",
  role: "UI/UX Designer",
  location: {
    city: "Islamabad",
    country: "Pakistan",
    countryCode: "PK",
    timeZone: "Asia/Karachi",
  },
  email: "kainatgardezi12@gmail.com",
  phone: {
    display: "+92 318 5779927",
    href: "tel:+923185779927",
    whatsapp: "https://wa.me/923185779927",
  },
  socials: [
    { label: "Behance", href: "https://www.behance.net/kainatsyeda" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/syeda-kainat-anjum-8941a5299" },
  ],
  /** Placeholder path. Drop the real file into /public/cv.pdf. */
  cvPath: "/cv.pdf",
  /** Set NEXT_PUBLIC_SITE_URL in production for absolute OG / sitemap URLs. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  /** Start of professional UI/UX work (ISO month), used for derived counters. */
  careerStart: "2024-05",
  seo: {
    title: "Syeda Kainat Anjum, UI/UX Designer",
    description:
      "Syeda Kainat Anjum is a UI/UX designer in Islamabad, Pakistan, designing mobile apps, websites, web applications and scalable Figma design systems.",
  },
} as const;

export const nav = [
  { label: "About", href: "/#about" },
  { label: "Work", href: "/#work" },
  { label: "Experience", href: "/#experience" },
  { label: "Skills", href: "/#skills" },
  { label: "Contact", href: "/#contact" },
] as const;

export const hero = {
  eyebrow: "UI/UX Designer",
  lines: ["Syeda Kainat", "Anjum"],
  tagline: "I turn complex ideas into seamless interfaces that people love to use.",
  scrollCue: "Scroll to explore",
} as const;

export const about = {
  /** Scroll-lit statement. Words wrapped in [brackets] get a selection box when lit. */
  statement:
    "I design user-centred digital products for software houses and design agencies, balancing creativity with business goals. My work spans [user research], wireframing, [prototyping] and usability testing, held together by scalable [design systems] built in [Figma].",
  body: [
    "From mobile apps, websites and web applications to mockups, presentations and rebranding, I care about interfaces that feel effortless and decisions that hold up for the business.",
    "Today I lead end-to-end product design at Cyber Axes, backed by strong visual design craft in Adobe Photoshop and Illustrator.",
  ],
  specialties: ["Mobile apps", "Websites", "Web applications", "Mockups", "Presentations", "Rebranding"],
  currently: "Cyber Axes",
} as const;

export const workCopy = {
  title: "Selected work",
  emptyTitle: "Selected work, loading soon.",
  emptyBody: "Case studies are being prepared frame by frame. Until then, Behance has the latest shots.",
  emptyCta: "Browse Behance",
} as const;

export const contact = {
  eyebrow: "Handoff",
  headline: ["Let's design", "something people", "love."],
  intro: "Have a product, a website or a rebrand in mind? Send a note and I'll get back to you.",
  form: {
    name: "Your name",
    email: "Email",
    message: "What are you working on?",
    submit: "Send message",
    sending: "Sending",
    success: "Message sent. Thank you, I'll reply soon.",
    successMailto: "Your email app should now be open with the message ready to send.",
    error: "Something went wrong. Please email me directly.",
  },
} as const;
