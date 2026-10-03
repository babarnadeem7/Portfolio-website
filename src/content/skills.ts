export type Skill = { label: string; note?: string };

export type SkillGroup = {
  /** Shown like a Figma component-set name. */
  name: string;
  description: string;
  skills: Skill[];
};

export const skillGroups: SkillGroup[] = [
  {
    name: "Tools",
    description: "Where the work happens.",
    skills: [
      { label: "Figma", note: "Advanced" },
      { label: "Adobe Photoshop" },
      { label: "Adobe Illustrator" },
      { label: "Framer" },
    ],
  },
  {
    name: "Design",
    description: "From first wireframe to shipped system.",
    skills: [
      { label: "Web & Mobile App Design" },
      { label: "Web App Design" },
      { label: "Responsive Design" },
      { label: "Wireframing" },
      { label: "Prototyping & Interactive Prototypes" },
      { label: "Design Systems & Component Libraries" },
      { label: "Auto-Layout & Variables" },
      { label: "Brand Identity & Rebranding" },
      { label: "Presentation Design" },
    ],
  },
  {
    name: "Research & UX",
    description: "Evidence before pixels.",
    skills: [
      { label: "User Research" },
      { label: "User Flows & Information Architecture" },
      { label: "Usability Testing" },
    ],
  },
  {
    name: "Craft & Delivery",
    description: "Details that survive handoff.",
    skills: [
      { label: "UI Animations & Micro-interactions" },
      { label: "Developer Handoff" },
      { label: "Design QA" },
    ],
  },
];
