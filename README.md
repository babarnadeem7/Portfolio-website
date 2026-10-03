# Syeda Kainat Anjum, Portfolio

Personal portfolio for Syeda Kainat Anjum, UI/UX Designer in Islamabad, Pakistan.
The site behaves like a living Figma file: frames, selections, multiplayer cursors,
component variants and prototype connectors.

Built with Next.js 16, TypeScript, Tailwind CSS 4, Motion, Lenis and OGL.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm run start
```

Checks: `npm run typecheck` and `npm run lint`.

## Before going live

1. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` to the real domain.
2. Optional: create a Formspree form and set `NEXT_PUBLIC_FORMSPREE_ID`. Without it, the contact form opens the visitor's email app with the message pre-filled.
3. Add the CV as `public/cv.pdf`. The Download CV button already points there.

## Editing content

All text lives in `src/content/`:

| File | What it holds |
|---|---|
| `site.ts` | Name, contact details, socials, hero, about and contact copy |
| `experience.ts` | Roles, newest first |
| `skills.ts` | Skill groups |
| `education.ts` | Education, languages and IELTS |
| `projects.ts` | Case studies (empty for now) |

## Adding a case study

Open `src/content/projects.ts`. The comment at the top has a complete example entry.
Put images and videos in `public/work/<slug>/`, add an entry to the `projects` array, and the
site generates the home-page card, the `/work` listing, the `/work/<slug>` page, the sitemap entry and
the next-project link automatically.

## Keyboard extras

Press `?` on the site for shortcuts. There are a couple of hidden surprises as well.
