@AGENTS.md

# CLAUDE.md: Syeda Kainat Anjum Portfolio

Award-level portfolio for **Syeda Kainat Anjum, UI/UX Designer, Islamabad, Pakistan**.
Concept: **"Live File"**, the site behaves like her open Figma file: frames with live
dimensions, selection boxes, multiplayer cursors, component sets with variants, prototype
connectors, layers and inspect panels. Restraint first: the metaphors only appear where they
explain her work.

> Status: Phases 1 to 4 built and verified (typecheck, lint, build, browser QA, Lighthouse).
> Projects intentionally ship empty. `/public/cv.pdf` is not supplied yet.

---

## Workflow rules
- Work in phases. After each phase: `npm run typecheck`, `npm run lint`, `npm run build`, then summarize and wait for feedback.
- Never run destructive commands. Ask before installing anything heavy (more than ~50 kB gz, or native deps).
- Next.js 16 has breaking changes: read `node_modules/next/dist/docs/` before using an unfamiliar API (see AGENTS.md).
- Keep this file updated whenever the stack, structure, tokens or conventions change.

## Content rules (non-negotiable)
- All copy lives in `src/content/*.ts`. Components never hard-code biography text.
- Never invent facts, employers, numbers, clients or projects. Light wording polish only.
- Counters show only values derived from content (number of roles, years since `careerStart`, number of tools).
- **Projects ship empty**: `src/content/projects.ts` exports `[]` with a documented schema. No fake projects, no lorem ipsum.
- Never show date of birth, gender, or home address.
- No skill percentage bars.
- Languages / IELTS are a small detail (Education section properties card), not a headline.
- CV button points to `/cv.pdf`, so the owner must drop the real file at `public/cv.pdf`.

## Stack (versions verified 2026-10-03)
- Next.js 16.3 (App Router, Turbopack) + React 19.2 + TypeScript strict
- Tailwind CSS 4 (CSS-first: `@theme inline` in `src/app/globals.css`, no tailwind.config)
- `motion` 14 (`motion/react`): the only animation engine
- Lenis 1.3 (`lenis/react`, root mode). Honours reduced motion natively
- OGL 1.0 (Unlicense) for the single WebGL moment, lazy-loaded
- `next/font/google`: Bricolage Grotesque (display, `opsz` + `wdth` axes), Instrument Sans (text), JetBrains Mono (labels)
- GSAP was evaluated and **dropped**: sticky + `useScroll` covers the pinned horizontal timeline, so it would be dead weight.
- React Three Fiber was **not used**: one full-screen shader does not justify three.js. OGL is a few kB.

Licenses: all MIT except OGL (Unlicense). Reference repos without a license were studied for ideas only.

## Commands
```bash
npm run dev        # local dev server
npm run build      # production build
npm run start      # serve production build
npm run lint       # eslint (next core-web-vitals + typescript + react-hooks rules)
npm run typecheck  # next typegen && tsc --noEmit (typegen creates PageProps route types)
```

Environment (see `.env.example`): `NEXT_PUBLIC_SITE_URL` for absolute OG/sitemap URLs,
`NEXT_PUBLIC_FORMSPREE_ID` for the contact form (falls back to a pre-filled mailto).

## Folder structure
```
src/
  app/
    layout.tsx            fonts, metadata, Person JSON-LD, theme boot script, shell
    template.tsx          opacity-only route enter (back/forward)
    page.tsx              Hero, About, Work, Experience, Skills, Education, Contact
    work/page.tsx         work index
    work/[slug]/page.tsx  case studies (generateStaticParams, dynamicParams = false)
    not-found.tsx         "Frame 404"
    opengraph-image.tsx, twitter-image.tsx, sitemap.ts, robots.ts, icon.svg
  components/
    motion/     Reveal, SplitText, Magnetic, ParallaxLayer, Counter, PageTransition (+ TransitionLink)
    canvas/     Frame (+ FrameLabel), SelectionBox, LayoutGrid
    cursor/     Cursor (context-aware), MultiplayerParty (Konami easter egg, lazy)
    layout/     Header (+ mobile menu), Footer (main-component easter egg), Preloader
    sections/   hero/, about/, work/, experience/, skills/, education/, contact/
    webgl/      HeroBackdrop (CSS fallback + lazy shader), MeshGradient (OGL), shaders.ts
    work/       WorkView (grid/list), ProjectCard (tilt), ProjectList (hover preview), WorkEmpty, CaseStudy
    ui/         Clock, ThemeToggle, ScrollProgress, Toaster, CopyEmail, KeyboardShortcuts, button.ts
    providers/  Providers (MotionConfig + Lenis + transitions + global layers), SmoothScroll
  content/      site.ts, experience.ts, skills.ts, education.ts, projects.ts
  lib/          app-store (tiny global UI store), media (pointer / reduced-motion hooks),
                theme, contact (form integration point), format, cn
  styles/tokens.css
  motion.config.ts
```

## Design tokens
CSS variables in `src/styles/tokens.css`, switched by `data-theme` on `<html>` (set before paint by
`themeBootScript`), mapped to Tailwind colors `canvas, frame, ink, muted, line, accent, accent-ink, on-accent`.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--canvas` | `#EDEBE6` | `#121212` | page background |
| `--frame` | `#F8F7F4` | `#1B1B1B` | panels / artboards |
| `--ink` | `#111111` | `#EDEBE6` | primary text |
| `--ink-muted` | `#5A5752` | `#A3A09A` | secondary text (AA) |
| `--line` | `#D6D3CC` | `#2C2C2C` | hairlines |
| `--accent` | `#EA4416` | `#FF6A3D` | the single accent |
| `--accent-ink` | `#B8340D` | `#FF8A66` | small accent text (AA) |

Contrast rule: on light, `--accent` is for graphics and text >= 24px (3.3:1). Small accent text uses
`--accent-ink` (5:1). Text on an accent fill is `--on-accent` (#111, 4.8:1), never white.

Type utilities (globals.css): `text-hero`, `text-display`, `text-title`, `text-lead`, `text-label` (mono 11px),
`font-condensed` (`wdth` 75), `px-page`, `link-underline`. Custom variant `pointer-fine:`.

## Animation conventions
Everything imports from `src/motion.config.ts`: `ease.out | inOut | in`, `spring.snap | soft | scroll`,
`dur.micro .18 | base .6 | slow 1 | page .9`, `stagger.chars .018 | words .04 | lines .08 | items .06`,
`inView`, `preloader` timings. No ad-hoc easing or duration literals.

Rules:
- Animate `transform` / `opacity` (clip-path for wipes). The only size animation is the preloader frame (one fixed element).
- Tailwind v4 `translate-*` classes use the CSS `translate` property, which motion's `transform` does NOT override. Put initial offsets that motion animates in inline `style`, never in translate classes.
- A component that combines `hidden` with its own display class breaks responsiveness: wrap it in a span that owns the responsive display (see Header).
- Reduced motion: `MotionConfig reducedMotion="user"` + `useReducedMotion()` branches: no preloader, no WebGL, no pinning (vertical experience flow), no parallax, no curtain (plain navigation), static scroll-lit text.
- Touch / coarse pointer: no custom cursor, magnetic, tilt, kinetic glyphs or ghost cursor (`useRichPointer`).
- Each section has one signature motion:
  - Preloader: frame drawn with a live W × H badge, then expands to the real viewport and lifts.
  - Hero: char reveal, glyphs stretch under the cursor (`KineticChar`), a "Kainat" collaborator selects the headline, shader bends toward the mouse.
  - About: statement lights word by word on scroll; keywords snap into selections.
  - Work: grid/list layout morph, tilt cards, cursor-following preview; empty state with marching dashes.
  - Experience: pinned horizontal prototype flow, connectors draw with scroll, rolling index HUD.
  - Skills: chips scatter then snap into auto-layout; a Variant property restyles every instance.
  - Education: layers panel with collapsible groups.
  - Contact: char-split headline, copy-email morph, validated form with animated states.

## Interaction API
- Cursor: `data-cursor="view|drag|link|text|hide"` and `data-cursor-label="..."` on any element. Links, buttons and fields are auto-detected.
- Routes: always use `TransitionLink` (curtain transition; same-page hashes smooth-scroll via Lenis).
- Toasts: `showToast(message)` from `lib/app-store`.
- `SplitText releaseMask`: drops the clipping masks after the reveal so units can move beyond them.

## Easter eggs
`?` shortcuts sheet, `G` layout grid, `T` theme, Konami code = multiplayer party, footer main-component mark cycles variants.

## QA notes
- Headless Chrome reports `prefers-reduced-motion: reduce` by default; emulate `no-preference` when testing the full motion path.
- Last measured (production build): Lighthouse desktop 100 / 100 / 100 / 100. Mobile accessibility, best practices and SEO 100; mobile performance high-80s, the gap being the intentional intro (LCP waits for the curtain).

## Adding a project
Edit only `src/content/projects.ts` (schema and example in that file). Put media in `public/work/<slug>/`.
Routes, home grid, `/work`, sitemap and next-project links are generated.
