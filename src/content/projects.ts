/**
 * PROJECTS / CASE STUDIES
 * ------------------------------------------------------------------
 * This is the only file you edit to publish work. The home-page Work
 * section, the /work index, every /work/[slug] case study, the sitemap
 * and the "next project" links are all generated from `projects`.
 * Array order is display order.
 *
 * Images: put files in /public/work/<slug>/ and reference them as
 * "/work/<slug>/cover.jpg". Always give the real pixel width/height so
 * next/image can reserve space and nothing shifts while loading.
 *
 * Example entry (copy into the array, then edit):
 *
 * {
 *   title: "Project name",
 *   slug: "project-name",                      // URL: /work/project-name
 *   year: 2026,
 *   role: "Lead Product Designer",
 *   tags: ["Mobile App", "Design System"],
 *   cover: { src: "/work/project-name/cover.jpg", alt: "Describe the image", width: 2400, height: 1600 },
 *   gallery: [
 *     { src: "/work/project-name/01.jpg", alt: "Describe the image", width: 2400, height: 1600 },
 *     { type: "video", src: "/work/project-name/flow.mp4", poster: "/work/project-name/flow.jpg",
 *       alt: "Describe the video", width: 1920, height: 1080 },
 *   ],
 *   summary: "One or two sentences, shown on cards and used as the SEO description.",
 *   challenge: ["Paragraph."],
 *   process: [{ title: "Research", body: ["Paragraph."] }],
 *   outcome: ["Paragraph."],
 *   links: [{ label: "View on Behance", href: "https://www.behance.net/..." }],
 * }
 */

export type ProjectImage = {
  type?: "image";
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type ProjectVideo = {
  type: "video";
  src: string;
  poster?: string;
  alt: string;
  width: number;
  height: number;
};

export type GalleryItem = ProjectImage | ProjectVideo;

export type Project = {
  title: string;
  /** URL-safe and unique. Becomes /work/[slug]. */
  slug: string;
  year: number;
  role: string;
  tags: string[];
  cover: ProjectImage;
  gallery: GalleryItem[];
  /** Short summary for cards and the SEO description. */
  summary: string;
  /** Paragraphs. */
  challenge: string[];
  /** Ordered steps, each with paragraphs. */
  process: { title: string; body: string[] }[];
  /** Paragraphs. */
  outcome: string[];
  links: { label: string; href: string }[];
};

export const projects: Project[] = [];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/** The project after `slug`, wrapping around. Undefined when fewer than two exist. */
export function getNextProject(slug: string): Project | undefined {
  if (projects.length < 2) return undefined;
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
}
