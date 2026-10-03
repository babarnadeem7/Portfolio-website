export type Experience = {
  role: string;
  company: string;
  /** ISO month, e.g. "2025-08" */
  start: string;
  /** ISO month, or null when current */
  end: string | null;
  location: string;
  summary: string;
  highlights: string[];
};

/** Newest first. */
export const experience: Experience[] = [
  {
    role: "UI/UX Designer",
    company: "Cyber Axes",
    start: "2025-08",
    end: null,
    location: "Islamabad",
    summary:
      "Leading end-to-end design of the company's product: the web portal, the marketing website and the mobile app.",
    highlights: [
      "Built and maintain a scalable design system of reusable components, auto-layout structures and variables that keeps every platform consistent.",
      "Run user research and usability testing, turning findings into clearer task flows and stronger interface decisions.",
      "Deliver interactive prototypes and developer-ready handoffs, working closely with engineering.",
    ],
  },
  {
    role: "UI/UX Designer Intern",
    company: "Ropstam Solutions",
    start: "2025-02",
    end: "2025-07",
    location: "Islamabad",
    summary: "Designed responsive web interfaces and complete user flows in Figma within a cross-functional team.",
    highlights: [
      "Produced interactive prototypes and UI animations for web and mobile.",
      "Created high-fidelity mockups, image edits and assets in Photoshop and Illustrator.",
      "Worked within established design systems on long-term projects from concept to delivery.",
    ],
  },
  {
    role: "UI/UX Designer",
    company: "Texinity Technologies",
    start: "2024-08",
    end: "2025-02",
    location: "Islamabad",
    summary:
      "Delivered design across web, mobile and brand assets, from product interfaces and mockups to client-facing presentations.",
    highlights: [
      "Applied user research and design thinking to build wireframes and prototypes.",
      "Presented concepts directly to clients and iterated on their feedback.",
    ],
  },
  {
    role: "UI/UX Designer Intern",
    company: "Webrange Solutions",
    start: "2024-06",
    end: "2024-08",
    location: "Islamabad",
    summary: "Designed user-centred web and mobile interfaces aligned to client needs.",
    highlights: [
      "Ran research, wireframing and prototyping for client work.",
      "Collaborated with developers on design handoffs.",
      "Worked with components, auto-layout and variables for scalable design systems.",
    ],
  },
  {
    role: "UI/UX Designer Trainee",
    company: "College Mastermind",
    start: "2024-05",
    end: "2024-06",
    location: "Remote",
    summary: "Created wireframes and prototypes to refine user flows.",
    highlights: [
      "Led a full website redesign that improved usability and visual consistency.",
      "Gained hands-on experience with Figma plugins, vector design, sizing and alignment.",
    ],
  },
];
