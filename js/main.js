/* ============================================================
   Portfolio behavior — each concern in its own small function.
   ============================================================ */
(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Theme toggle (persisted) ---------- */
  function initThemeToggle() {
    const root = document.documentElement;
    const btn = document.querySelector(".theme-toggle");
    if (!btn) return;

    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") {
      root.setAttribute("data-theme", stored);
    } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      root.setAttribute("data-theme", "light");
    }

    btn.addEventListener("click", function () {
      const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
    });
  }

  /* ---------- Mobile nav ---------- */
  function initMobileNav() {
    const toggle = document.querySelector(".nav-toggle");
    const menu = document.getElementById("nav-menu");
    if (!toggle || !menu) return;

    function close() {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", function () {
      const open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
  }

  /* ---------- Header shadow on scroll ---------- */
  function initHeaderState() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Scroll reveal ---------- */
  function initScrollAnimations() {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) return;
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("in-view"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    items.forEach((el) => io.observe(el));
  }

  /* ---------- Active link scroll-spy ---------- */
  function initActiveLink() {
    const links = Array.from(document.querySelectorAll(".nav-menu a[href^='#']"));
    const map = new Map();
    links.forEach((l) => {
      const id = l.getAttribute("href").slice(1);
      const sec = document.getElementById(id);
      if (sec) map.set(sec, l);
    });
    if (!map.size || !("IntersectionObserver" in window)) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            links.forEach((l) => l.classList.remove("active"));
            const link = map.get(entry.target);
            if (link) link.classList.add("active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    map.forEach((_, sec) => io.observe(sec));
  }

  /* ---------- Footer year ---------- */
  function initYear() {
    const el = document.getElementById("year");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  /* ---------- Signature: animated multi-agent graph ----------
     Nodes = agents, edges = orchestration, pulses = signal flow.
     Embodies the LangGraph / multi-agent work. Cheap to run; static
     under reduced-motion. */
  function initAgentGraph() {
    const canvas = document.getElementById("agent-graph");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    let nodes = [];
    let edges = [];
    let raf = null;
    let t = 0;

    const COLORS = { indigo: "99,102,241", violet: "139,92,246", cyan: "34,211,238" };

    function build() {
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Node count scales with width; weighted toward the right side of the hero.
      const count = w < 640 ? 9 : w < 1024 ? 12 : 16;
      nodes = [];
      for (let i = 0; i < count; i++) {
        const biasRight = Math.pow(Math.random(), 0.7); // cluster toward right
        nodes.push({
          x: (0.32 + biasRight * 0.7) * w,
          y: Math.random() * h,
          r: 1.6 + Math.random() * 2.6,
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.12,
          phase: Math.random() * Math.PI * 2,
        });
      }
      // Connect each node to its 2 nearest neighbors → graph edges.
      edges = [];
      for (let i = 0; i < nodes.length; i++) {
        const dists = [];
        for (let j = 0; j < nodes.length; j++) {
          if (i === j) continue;
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          dists.push({ j, d: dx * dx + dy * dy });
        }
        dists.sort((a, b) => a.d - b.d);
        for (let k = 0; k < 2 && k < dists.length; k++) {
          const j = dists[k].j;
          if (!edges.some((e) => (e.a === j && e.b === i))) {
            edges.push({ a: i, b: j, pulse: Math.random() });
          }
        }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      t += 0.005;

      // Edges + traveling pulses
      for (const e of edges) {
        const a = nodes[e.a], b = nodes[e.b];
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = "rgba(" + COLORS.violet + ",0.16)";
        ctx.lineWidth = 1;
        ctx.stroke();

        if (!prefersReducedMotion) {
          e.pulse += 0.004 + (e.a % 3) * 0.001;
          if (e.pulse > 1) e.pulse -= 1;
          const px = a.x + (b.x - a.x) * e.pulse;
          const py = a.y + (b.y - a.y) * e.pulse;
          const g = ctx.createRadialGradient(px, py, 0, px, py, 6);
          g.addColorStop(0, "rgba(" + COLORS.cyan + ",0.9)");
          g.addColorStop(1, "rgba(" + COLORS.cyan + ",0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(px, py, 6, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Nodes (gentle pulse glow)
      for (const n of nodes) {
        if (!prefersReducedMotion) {
          n.x += n.vx; n.y += n.vy;
          if (n.x < w * 0.28 || n.x > w) n.vx *= -1;
          if (n.y < 0 || n.y > h) n.vy *= -1;
        }
        const glow = prefersReducedMotion ? 0.5 : 0.5 + 0.5 * Math.sin(t * 2 + n.phase);
        const rad = n.r + glow * 2.4;
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, rad * 3);
        g.addColorStop(0, "rgba(" + COLORS.indigo + "," + (0.7 + glow * 0.3) + ")");
        g.addColorStop(0.5, "rgba(" + COLORS.violet + ",0.35)");
        g.addColorStop(1, "rgba(" + COLORS.violet + ",0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(n.x, n.y, rad * 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgba(" + COLORS.cyan + ",0.95)";
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    }

    function start() {
      build();
      if (raf) cancelAnimationFrame(raf);
      if (prefersReducedMotion) {
        draw(); // single static frame
      } else {
        raf = requestAnimationFrame(draw);
      }
    }

    // Pause when hero is offscreen to save battery.
    if ("IntersectionObserver" in window) {
      const hero = document.querySelector(".hero");
      if (hero) {
        new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              if (!raf && !prefersReducedMotion) raf = requestAnimationFrame(draw);
            } else if (raf) {
              cancelAnimationFrame(raf); raf = null;
            }
          });
        }, { threshold: 0 }).observe(hero);
      }
    }

    let resizeTimer = null;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(start, 200);
    });

    start();
  }

  /* ---------- Boot ---------- */
  function init() {
    initThemeToggle();
    initMobileNav();
    initHeaderState();
    initScrollAnimations();
    initActiveLink();
    initYear();
    initAgentGraph();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
