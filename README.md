# Portfolio — Nguyen Hoan Thien

Personal portfolio for **Nguyen Hoan Thien**, AI Engineer.
Static site — plain HTML, CSS, and JavaScript. No build step.

**Live:** https://thiennguyen21it.github.io/portfolio_v1/

## Structure

```
index.html        All page content (semantic sections)
css/styles.css    Design system, themes, layout, components
js/main.js        Theme toggle, scroll reveal, nav, agent-graph hero
assets/
  resume.pdf      Downloadable résumé (copy of thiennguyen.pdf)
  favicon.svg     Site icon
```

## Run locally

It's a static site — just open `index.html` in a browser. For correct
paths and fonts, serve it instead:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Edit content

All text lives in `index.html`. Each `<section>` is self-contained — edit
the text directly; you never need to touch the CSS or JS to change content.
To swap the résumé, replace `assets/resume.pdf`.

## Contact form (Formspree) — finish this 2-minute step

The contact form is wired but needs your own Formspree endpoint:

1. Go to https://formspree.io and create a free account.
2. Create a new form; copy its endpoint (looks like `https://formspree.io/f/abcdwxyz`).
3. In `index.html`, find this line and replace `YOUR_FORM_ID` with your id:

   ```html
   <form class="card contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```

Until then, the "Prefer email?" link under the form works as a fallback.

## Deploy (GitHub Pages)

Already configured to deploy from the repo root:

1. Push to `master`.
2. On GitHub: **Settings → Pages → Build and deployment → Deploy from a
   branch → `master` / `(root)` → Save.**
3. Wait ~1 minute, then visit the live URL above.

## Design notes

- **Theme:** vibrant gradient (indigo → violet → cyan) over a deep ink base,
  glassmorphism cards. Light and dark modes; the toggle remembers your choice.
- **Signature:** the hero's animated **multi-agent graph** — nodes are agents,
  edges are orchestration, and cyan pulses are signal flow. A nod to the
  LangGraph / multi-agent systems work.
- **Fonts:** Space Grotesk (display), Inter (body), JetBrains Mono (labels).
- Accessibility: keyboard focus styles, semantic landmarks, and full
  `prefers-reduced-motion` support (animations disable, graph renders static).
