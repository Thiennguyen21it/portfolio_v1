# Design: AI Engineer Portfolio — Nguyen Hoan Thien

**Date:** 2026-06-20
**Status:** Approved
**Repo:** https://github.com/Thiennguyen21it/portfolio_v1
**Live URL (target):** https://thiennguyen21it.github.io/portfolio_v1/

## Purpose

A single-page personal portfolio website for Nguyen Hoan Thien (AI Engineer),
built from his CV (`thiennguyen.pdf`), deployed on GitHub Pages. Primary
audience: recruiters and hiring managers in AI/ML and software roles. Success
criteria: loads fast, looks distinctive and professional, presents all CV
content clearly, and deploys reliably to GitHub Pages with no build step.

## Decisions (from brainstorming)

- **Visual direction:** Bold gradient / vibrant — gradient hero, glassmorphism
  cards, animated accents.
- **Tech stack:** Static HTML/CSS/JS. No framework, no build step.
- **Features:** Resume PDF download, contact form (Formspree, scaffolded with a
  placeholder endpoint), light/dark toggle, scroll animations.
- **Formspree:** Scaffold with a placeholder endpoint `YOUR_FORM_ID`; user
  creates a free Formspree form later and pastes the ID. `mailto:` fallback
  provided.

## Architecture & File Structure

Single-page static site, no build step, deployed from repo root.

```
portfolio_v1/
├── index.html          # all sections, semantic HTML
├── css/styles.css      # design tokens + layout + glass/gradient + light/dark
├── js/main.js          # theme toggle, scroll animations, mobile nav, active-link
├── assets/
│   ├── resume.pdf      # copy of thiennguyen.pdf for download
│   └── favicon.svg     # simple mark
├── thiennguyen.pdf     # original CV (kept at root)
└── README.md           # how to edit + deploy + Formspree setup
```

Relative paths only, so the site works under the `/portfolio_v1/` base path on
GitHub Pages.

### Component boundaries

- **index.html** — content + structure only. Each section is an independent
  `<section>` with a stable id used by nav and scroll-spy. Adding/editing
  content never requires touching JS.
- **css/styles.css** — all presentation. Organized as: design tokens (CSS
  custom properties for both themes) → base/reset → layout primitives →
  component styles (cards, chips, buttons, timeline) → section styles →
  responsive media queries → reduced-motion overrides.
- **js/main.js** — behavior only, in small independent functions:
  `initThemeToggle()`, `initScrollAnimations()`, `initMobileNav()`,
  `initActiveLink()`. Each is self-contained, attaches its own listeners, and
  degrades gracefully if its target elements are absent.

## Visual System

- **Dark base** `#0b0b16`; **light variant** `#f7f7fb`. Theme stored in
  `localStorage`; first visit respects `prefers-color-scheme`.
- **Signature gradient:** indigo `#6366f1` → violet `#8b5cf6` → blue `#3b82f6`.
  Used on the animated hero backdrop, heading accents, and primary buttons.
- **Glassmorphism cards:** translucent surface + `backdrop-filter: blur()` +
  subtle 1px border + soft shadow.
- **Typography:** `Space Grotesk` for headings, `Inter` for body — loaded via
  Google Fonts with `preconnect` and a system-font fallback stack.
- **Responsive:** mobile-first; breakpoints at ~640px and ~1024px.
- **Accessible:** semantic landmarks (`header`/`nav`/`main`/`section`/`footer`),
  visible focus states, sufficient contrast in both themes, all motion gated
  behind `prefers-reduced-motion: reduce`.

## Sections & Content (mapped from CV)

1. **Hero** — name, "AI Engineer", tagline ("Building multi-agent AI systems &
   ML pipelines"), animated gradient backdrop, CTAs: View Work · Download
   Resume · Contact. Stat chips: GPA 3.47/4.0, TOEIC 750, 3+ yrs experience.
2. **About** — short bio synthesized from the profile; key tech tags.
3. **Experience** — vertical timeline of glass cards:
   - **FPT Software** — Junior AI Engineer (Nov 2025 – Jun 2026). Three
     sub-projects: Multi-Agent AI System for Functional Testing; Atomi Cowork
     (agentic knowledge-work product); AI Meeting Assistant.
   - **Center for Statistical Data Processing and Integration (Da Nang)** — AI
     Engineer Intern (May 2025 – Oct 2025). PhoBERT / VSIC-VCPA search, ONNX,
     Flutter on-device inference.
   - **SafeHorizons Software Services** — Python Backend Developer (Aug 2023 –
     Jun 2024). Agricultural marketplace, Django/PostgreSQL/Redis/Celery.
   Each card: role, org, dates, location, bullet highlights, tech tags.
4. **Projects** — **Emergix** (PROCON Vietnam, 3rd Prize, Nov–Dec 2024) and
   **GuardianNet** (GDGOC Hackathon 2025, Top 5 Central Region, Team Leader,
   Apr 2025). Each with description, tech tags, award badge, and GitHub link.
5. **Skills** — grouped chips: Programming Languages; AI/ML; Backend;
   Frontend/Mobile; Database; Cloud & DevOps.
6. **Awards** — 5 honors with dates (GDGOC Top 5; VKU Outstanding Student 2024;
   PROCON 3rd Prize; VKU Robocar Consolation; English Talent 3rd Prize).
7. **Education** — VKU, Engineer in Global IT, 2021–2026, GPA 3.47/4.0.
8. **Contact** — Formspree form (name, email, message) + direct links: email
   (nguyenhoanthien1312@gmail.com), GitHub (Thiennguyen21it), phone
   (+84 356496977).

## Features (implementation notes)

- **Resume download:** primary button links to `assets/resume.pdf` with
  `download` attribute; `thiennguyen.pdf` is copied into `assets/resume.pdf`.
- **Contact form:** `<form>` with `action="https://formspree.io/f/YOUR_FORM_ID"`
  `method="POST"`. Fields: `name`, `email`, `message`. A `mailto:` link is shown
  beneath as a fallback. README documents the 2-minute Formspree setup and
  exactly which string to replace.
- **Light/dark toggle:** button in the header; toggles a `data-theme` attribute
  on `<html>`; persists to `localStorage`; icon reflects current theme.
- **Scroll animations:** `IntersectionObserver` adds an `in-view` class to
  reveal sections (fade + slide). Animated hero gradient via CSS keyframes.
  Card hover-lift. All disabled under `prefers-reduced-motion: reduce`.

## Deployment

1. Create files, copy CV to `assets/resume.pdf`.
2. Commit and push to `master`.
3. Enable GitHub Pages: Settings → Pages → Deploy from branch → `master` /
   `(root)`. (If `gh` CLI is authenticated, enable via API instead.)
4. Verify live at `https://thiennguyen21it.github.io/portfolio_v1/`.

## Out of Scope (YAGNI)

- No framework, bundler, or package manager.
- No CMS or dynamic backend (Formspree handles form submission).
- No blog, analytics, or multi-page routing.
- No custom domain (default github.io URL; easy to add later).

## Testing / Verification

- Open `index.html` locally and confirm: all sections render, nav scrolls,
  theme toggle works and persists, animations fire (and are disabled under
  reduced-motion), resume downloads, form has correct Formspree action,
  responsive layout holds at mobile/tablet/desktop widths.
- After deploy: confirm live URL loads with assets and correct base paths.
```
