# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign `giridhar248.github.io` to a dark-glass, modern-dev aesthetic (Vercel/Linear language) using Tailwind Play CDN + vanilla HTML/JS, with components sourced via 21st.dev Magic MCP, preserving JSON-driven content and the static GitHub Pages deploy.

**Architecture:** No build step. `index.html` loads Tailwind from a CDN with an inline `tailwind.config` for design tokens. Vanilla JS modules under `assets/js/lib/` handle gradient mesh, scroll progress, scroll-reveal, marquee, GitHub stats, command palette, copy-email. Content stays in `data/*.json`. 21st.dev MCP outputs JSX/Tailwind which we translate to vanilla HTML on a per-component basis.

**Tech Stack:** HTML5, Tailwind v3 (Play CDN), vanilla JS (ES modules), Font Awesome 6.4 (kept), GitHub REST API (unauthenticated), 21st.dev Magic MCP (`mcp__magic__21st_magic_component_inspiration`, `mcp__magic__21st_magic_component_builder`, `mcp__magic__logo_search`).

**Spec:** `docs/superpowers/specs/2026-05-20-portfolio-redesign-design.md`.

**Branch:** `feature/portfolio-redesign` (already created and checked out).

**Verification strategy:** This is a visual project. We use three layers of verification:
1. **Visual smoke** — `curl -s http://localhost:8000 | grep -F "expected substring"` after each section.
2. **Functional smoke** — open `http://localhost:8000` in a browser, click links, hover cards, fire `⌘K`, resize viewport, check DevTools console for errors.
3. **Logic unit tests** — for the three modules with non-trivial logic (`github-stats.js` cache, `command-palette.js` fuzzy filter, `scroll-progress.js` math) we add `node --test`-based test files (built into Node 18+, no deps).

**Local server is already running** at `http://localhost:8000` (started during brainstorming). If it stops: `cd ~/giridhar248.github.io && python3 -m http.server 8000`.

---

## Task 1: Tailwind CDN + design tokens + slim styles.css

**Files:**
- Modify: `index.html` (replace `<head>` block to inject Tailwind + tokens)
- Modify: `assets/css/styles.css` (slim down to tokens + custom layers Tailwind can't express)

- [ ] **Step 1: Replace the head block in `index.html`**

Replace lines 1–15 with:

```html
<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Giridhar Reddy Mekapothula — Software Engineer building distributed systems, AI agents, and backend services." />
    <meta name="author" content="Giridhar Reddy Mekapothula" />
    <meta name="keywords" content="Giridhar Reddy, Software Engineer, Distributed Systems, AI Agents, Java, Python, Backend, Portfolio" />
    <meta name="theme-color" content="#07070b" />
    <title>Giridhar Reddy Mekapothula — Software Engineer</title>

    <link rel="icon" type="image/svg+xml" href="assets/images/favicon.svg" />
    <link rel="stylesheet" href="assets/css/styles.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        darkMode: 'class',
        theme: {
          extend: {
            colors: {
              bg: '#07070b',
              surface: '#0e0e14',
              'surface-2': '#16161e',
              border: 'rgba(255,255,255,0.06)',
              'text-hi': '#f4f4f5',
              'text-mid': '#a1a1aa',
              'text-lo': '#71717a',
              'accent-1': '#8b5cf6',
              'accent-2': '#22d3ee',
              'accent-3': '#f472b6',
            },
            fontFamily: {
              sans: ['ui-sans-serif', 'system-ui', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
              mono: ['ui-monospace', 'JetBrains Mono', 'Menlo', 'Consolas', 'monospace'],
            },
            fontSize: {
              display: ['clamp(2.75rem, 6vw, 5.25rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
              h2: ['clamp(2rem, 3.5vw, 2.75rem)', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
              eyebrow: ['0.75rem', { letterSpacing: '0.18em' }],
            },
            backgroundImage: {
              'accent-grad': 'linear-gradient(90deg, #8b5cf6 0%, #22d3ee 100%)',
            },
            animation: {
              'mesh-drift-1': 'meshDrift1 30s ease-in-out infinite',
              'mesh-drift-2': 'meshDrift2 38s ease-in-out infinite',
              'mesh-drift-3': 'meshDrift3 44s ease-in-out infinite',
              marquee: 'marquee 40s linear infinite',
              'marquee-reverse': 'marqueeReverse 50s linear infinite',
            },
            keyframes: {
              meshDrift1: {
                '0%, 100%': { transform: 'translate3d(-10%, -10%, 0) scale(1)' },
                '50%': { transform: 'translate3d(10%, 5%, 0) scale(1.15)' },
              },
              meshDrift2: {
                '0%, 100%': { transform: 'translate3d(20%, 10%, 0) scale(1.1)' },
                '50%': { transform: 'translate3d(-15%, -5%, 0) scale(1)' },
              },
              meshDrift3: {
                '0%, 100%': { transform: 'translate3d(0, 20%, 0) scale(1)' },
                '50%': { transform: 'translate3d(5%, -10%, 0) scale(1.2)' },
              },
              marquee: {
                '0%': { transform: 'translateX(0)' },
                '100%': { transform: 'translateX(-50%)' },
              },
              marqueeReverse: {
                '0%': { transform: 'translateX(-50%)' },
                '100%': { transform: 'translateX(0)' },
              },
            },
          },
        },
      };
    </script>
  </head>
```

- [ ] **Step 2: Replace `assets/css/styles.css` with a minimal token + layer file**

Replace the entire file with:

```css
/* ==========================================================================
   Global resets and layers that Tailwind can't express idiomatically
   ========================================================================== */

:root {
  color-scheme: dark;
}

html {
  scroll-behavior: smooth;
  background-color: #07070b;
}

body {
  background-color: #07070b;
  color: #f4f4f5;
  font-feature-settings: 'cv11', 'ss01', 'ss03';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

::selection {
  background-color: rgba(139, 92, 246, 0.4);
  color: #f4f4f5;
}

/* Dot grid mask used behind the hero mesh */
.dot-grid {
  background-image: radial-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px);
  background-size: 32px 32px;
  mask-image: radial-gradient(ellipse at center, #000 30%, transparent 75%);
  -webkit-mask-image: radial-gradient(ellipse at center, #000 30%, transparent 75%);
}

/* Hairline border helper used by glass surfaces */
.hairline {
  border: 1px solid rgba(255, 255, 255, 0.06);
}

/* Gradient text used for accent words */
.gradient-text {
  background: linear-gradient(90deg, #8b5cf6 0%, #22d3ee 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

/* Scroll-reveal: starts invisible, JS adds .in-view */
.reveal {
  opacity: 0;
  transform: translateY(16px);
  transition:
    opacity 500ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 500ms cubic-bezier(0.22, 1, 0.36, 1);
}

.reveal.in-view {
  opacity: 1;
  transform: none;
}

/* Reduced motion: kill mesh drifts, marquee, reveal transforms */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
  .reveal {
    opacity: 1;
    transform: none;
  }
}
```

- [ ] **Step 3: Visual smoke — load the site and confirm dark background**

Run:
```bash
curl -s http://localhost:8000 | grep -F 'cdn.tailwindcss.com'
```
Expected: one line containing the script tag.

Open `http://localhost:8000` in a browser. Expected: page is now black (`#07070b`) instead of cream. Existing content still renders but is unstyled because section CSS is gone. That's fine — Tasks 3 onward rebuild each section with Tailwind utility classes. The site will look incomplete between Task 1 and Task 5 (hero rebuild); that's expected.

- [ ] **Step 4: Commit**

```bash
cd ~/giridhar248.github.io
git add index.html assets/css/styles.css
git commit -m "feat(foundation): tailwind cdn, dark tokens, slim base styles

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Avatar + favicon + images directory

**Files:**
- Create: `assets/images/avatar.jpg`
- Create: `assets/images/favicon.svg`
- Create: `assets/images/logos/` (empty dir, populated in Task 8)

- [ ] **Step 1: Copy the avatar from Downloads to the repo**

```bash
mkdir -p ~/giridhar248.github.io/assets/images/logos
cp "/Users/architjain/Downloads/ChatGPT Image May 20, 2026, 11_04_29 PM.png" ~/giridhar248.github.io/assets/images/avatar.jpg
ls -lh ~/giridhar248.github.io/assets/images/avatar.jpg
```
Expected: file exists; if size is over 300 KB, optimize:
```bash
# Optional optimization — requires `sips` (macOS built-in)
sips -Z 800 -s format jpeg -s formatOptions 85 ~/giridhar248.github.io/assets/images/avatar.jpg --out ~/giridhar248.github.io/assets/images/avatar.jpg
```
Re-check size; aim for under 200 KB.

- [ ] **Step 2: Create the favicon SVG (monogram "GR" with gradient)**

Create `assets/images/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#8b5cf6"/>
      <stop offset="100%" stop-color="#22d3ee"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="#07070b"/>
  <text x="32" y="42" font-family="ui-sans-serif, system-ui, sans-serif" font-weight="800" font-size="30" text-anchor="middle" fill="url(#g)">GR</text>
</svg>
```

- [ ] **Step 3: Visual smoke**

Run:
```bash
curl -sI http://localhost:8000/assets/images/avatar.jpg | head -1
curl -sI http://localhost:8000/assets/images/favicon.svg | head -1
```
Expected: both `HTTP/1.0 200 OK`.

- [ ] **Step 4: Commit**

```bash
git add assets/images/
git commit -m "feat(assets): add avatar photo and gradient monogram favicon

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Gradient mesh background + scroll progress + scroll-reveal harness

**Files:**
- Create: `assets/js/lib/gradient-mesh.js`
- Create: `assets/js/lib/scroll-progress.js`
- Create: `assets/js/lib/scroll-reveal.js`
- Create: `tests/scroll-progress.test.js`
- Modify: `index.html` (add mesh container, progress bar, reveal script wiring)

- [ ] **Step 1: Create `assets/js/lib/gradient-mesh.js`**

```js
// Renders three blurred radial blobs into a fixed container.
// CSS keyframes do the drifting; this just injects markup if absent.
export function mountGradientMesh(targetSelector = '#gradient-mesh') {
  const mount = document.querySelector(targetSelector);
  if (!mount) return;
  if (mount.dataset.mounted === 'true') return;

  mount.innerHTML = `
    <div class="absolute inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      <div class="absolute top-[-20%] left-[-10%] h-[60vmax] w-[60vmax] rounded-full opacity-50 blur-3xl animate-mesh-drift-1"
           style="background: radial-gradient(closest-side, #8b5cf6, transparent 70%);"></div>
      <div class="absolute top-[20%] right-[-15%] h-[55vmax] w-[55vmax] rounded-full opacity-40 blur-3xl animate-mesh-drift-2"
           style="background: radial-gradient(closest-side, #22d3ee, transparent 70%);"></div>
      <div class="absolute bottom-[-30%] left-[10%] h-[50vmax] w-[50vmax] rounded-full opacity-30 blur-3xl animate-mesh-drift-3"
           style="background: radial-gradient(closest-side, #f472b6, transparent 70%);"></div>
      <div class="absolute inset-0 dot-grid"></div>
    </div>
  `;
  mount.dataset.mounted = 'true';
}
```

- [ ] **Step 2: Create `assets/js/lib/scroll-progress.js`**

```js
// Renders a 2px gradient bar at the top of the viewport whose width tracks scroll.
// Exported `computeProgress` is pure so it can be unit-tested.

export function computeProgress(scrollY, scrollHeight, viewportHeight) {
  const denom = Math.max(scrollHeight - viewportHeight, 1);
  const ratio = scrollY / denom;
  if (Number.isNaN(ratio)) return 0;
  return Math.max(0, Math.min(1, ratio));
}

export function mountScrollProgress(targetSelector = '#scroll-progress') {
  const bar = document.querySelector(targetSelector);
  if (!bar) return;

  const update = () => {
    const p = computeProgress(
      window.scrollY,
      document.documentElement.scrollHeight,
      window.innerHeight,
    );
    bar.style.transform = `scaleX(${p})`;
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}
```

- [ ] **Step 3: Create `assets/js/lib/scroll-reveal.js`**

```js
// Adds `.in-view` to elements with `.reveal` when they enter the viewport.
// One-shot: observer disconnects per element after first reveal.

export function mountScrollReveal(selector = '.reveal') {
  const els = document.querySelectorAll(selector);
  if (els.length === 0) return;

  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('in-view'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
  );

  els.forEach((el) => io.observe(el));
}
```

- [ ] **Step 4: Create the unit test `tests/scroll-progress.test.js`**

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeProgress } from '../assets/js/lib/scroll-progress.js';

test('returns 0 at the top of the page', () => {
  assert.equal(computeProgress(0, 5000, 800), 0);
});

test('returns 1 at the bottom of the page', () => {
  assert.equal(computeProgress(4200, 5000, 800), 1);
});

test('returns 0.5 at the midpoint of scrollable area', () => {
  assert.equal(computeProgress(2100, 5000, 800), 0.5);
});

test('clamps over-scroll to 1', () => {
  assert.equal(computeProgress(9999, 5000, 800), 1);
});

test('returns 0 when content fits in the viewport', () => {
  assert.equal(computeProgress(0, 600, 800), 0);
});

test('handles zero scrollHeight gracefully', () => {
  const v = computeProgress(0, 0, 800);
  assert.ok(v >= 0 && v <= 1);
});
```

- [ ] **Step 5: Run the unit test, expect failures until lib is in place — then green**

```bash
cd ~/giridhar248.github.io
node --test tests/scroll-progress.test.js
```
Expected: all 6 tests pass (`# pass 6`). If you see `# fail`, re-read Step 2.

- [ ] **Step 6: Wire mesh container, progress bar, and reveal into `index.html`**

In `index.html`, replace the `<body>` opening through the end of the `<nav>` block (currently lines 16–32) with:

```html
  <body class="font-sans bg-bg text-text-hi antialiased">
    <!-- Scroll progress -->
    <div class="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-accent-grad"
         id="scroll-progress" style="transform: scaleX(0);"></div>

    <!-- Gradient mesh background container (mounted by JS) -->
    <div id="gradient-mesh" class="fixed inset-0 -z-10"></div>

    <!-- Skip link for a11y -->
    <a href="#home" class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-md focus:bg-surface focus:px-3 focus:py-2 focus:text-text-hi focus:hairline">
      Skip to content
    </a>

    <!-- Navigation (rebuilt in Task 5) -->
    <nav class="fixed top-0 left-0 right-0 z-50 hairline backdrop-blur-xl" id="navbar"
         style="background-color: rgba(7,7,11,0.7);">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <a href="#home" class="text-lg font-extrabold gradient-text">GR</a>
        <ul class="hidden md:flex gap-6 text-sm text-text-mid" id="navMenu"></ul>
        <button class="hidden md:flex items-center gap-1.5 rounded-md hairline px-2.5 py-1 text-xs text-text-mid hover:text-text-hi transition"
                id="cmdkBtn" aria-label="Open command palette">
          <span class="font-mono">⌘</span><span>K</span>
        </button>
        <button class="md:hidden text-text-mid" id="navToggle" aria-label="Open menu">
          <i class="fas fa-bars text-lg"></i>
        </button>
      </div>
    </nav>
```

At the bottom of `<body>` (just before `</body>`), **replace** `<script src="assets/js/main.js"></script>` with:

```html
    <script type="module">
      import { mountGradientMesh } from './assets/js/lib/gradient-mesh.js';
      import { mountScrollProgress } from './assets/js/lib/scroll-progress.js';
      import { mountScrollReveal } from './assets/js/lib/scroll-reveal.js';
      mountGradientMesh();
      mountScrollProgress();
      mountScrollReveal();
    </script>
    <script src="assets/js/main.js"></script>
```

- [ ] **Step 7: Visual smoke**

Reload `http://localhost:8000` in a browser. Expected:
- Page is black with three faint moving violet/cyan/fuchsia blurry blobs.
- A 2px gradient line lives at the very top; when you scroll, it widens.
- Nav bar shows "GR" left, `⌘K` pill right.

- [ ] **Step 8: Commit**

```bash
git add assets/js/lib/ tests/ index.html
git commit -m "feat(motion): gradient mesh, scroll progress, scroll-reveal harness

- assets/js/lib/gradient-mesh.js — three blurred drifting blobs + dot grid
- assets/js/lib/scroll-progress.js — top progress bar, pure computeProgress
- assets/js/lib/scroll-reveal.js — IntersectionObserver-driven .in-view
- tests/scroll-progress.test.js — 6 node:test cases
- index.html — mount points + module bootstrap

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Hero data updates + profile bio rewrite

**Files:**
- Modify: `data/hero.json`
- Modify: `data/profile.json`
- Modify: `data/site-config.json`

- [ ] **Step 1: Update `data/hero.json`**

Replace the full file with:

```json
{
  "_instructions": "Hero section content. Owner: Giridhar Reddy Mekapothula.",
  "eyebrow": "// software engineer",
  "greeting": "Hi, I'm",
  "name": "Giridhar Reddy",
  "surnameGradient": "Mekapothula",
  "title": "Software Engineer",
  "rotatingSubtitles": [
    "Distributed Systems",
    "AI Agents",
    "Backend Engineering"
  ],
  "summary": "Software engineer with 1+ years building distributed backends, AI-agent systems, and cloud-native services in Java, Python, and C/C++.",
  "avatarUrl": "assets/images/avatar.jpg",
  "openToWork": true,
  "cta": {
    "buttons": [
      { "text": "View work", "href": "#projects", "type": "primary", "external": false, "icon": "fas fa-arrow-right" },
      { "text": "Get resume", "href": "documents/Giridhar_Reddy_Resume.pdf", "type": "secondary", "external": false, "icon": "fas fa-download" },
      { "text": "Copy email", "href": "#", "type": "ghost", "external": false, "icon": "fas fa-envelope", "action": "copy-email" }
    ]
  },
  "socialLinks": [
    { "platform": "GitHub", "url": "https://github.com/giridhar248", "icon": "fab fa-github" },
    { "platform": "LinkedIn", "url": "https://linkedin.com/in/giridhar-reddy-46759b210/", "icon": "fab fa-linkedin" },
    { "platform": "Email", "url": "mailto:giridharreddy2212@gmail.com", "icon": "fas fa-envelope" }
  ]
}
```

- [ ] **Step 2: Update `data/profile.json`** (replace placeholder bio)

```json
{
  "profile": {
    "name": "Giridhar Reddy Mekapothula",
    "title": "Software Engineer",
    "bio": "I build distributed systems and AI-agent pipelines — currently focused on backend services in Java/Spring and orchestration with Python."
  },
  "contact": {
    "email": "giridharreddy2212@gmail.com",
    "phone": "+1 (409) 757-0402",
    "githubUsername": "giridhar248",
    "linkedin": "https://linkedin.com/in/giridhar-reddy-46759b210/"
  },
  "siteConfig": {
    "domain": "giridhar248.github.io",
    "title": "Giridhar Reddy Mekapothula — Software Engineer",
    "description": "Software Engineer building distributed systems, AI agents, and backend services."
  }
}
```

- [ ] **Step 3: Update `data/site-config.json`**

```json
{
  "_instructions": "Site-wide configuration and meta tags.",
  "meta": {
    "title": "Giridhar Reddy Mekapothula — Software Engineer",
    "description": "Software Engineer building distributed systems, AI agents, and backend services.",
    "author": "Giridhar Reddy Mekapothula",
    "keywords": "Giridhar Reddy, Software Engineer, Distributed Systems, AI Agents, Java, Python, Backend, Portfolio"
  },
  "branding": {
    "name": "Giridhar Reddy Mekapothula",
    "monogram": "GR",
    "tagline": "Software Engineer"
  },
  "settings": {
    "year": 2026,
    "enableAnimations": true,
    "navbarScrollEffect": true,
    "deployTimestamp": "2026-05-20T00:00:00Z"
  }
}
```

- [ ] **Step 4: JSON-validate all three**

```bash
cd ~/giridhar248.github.io
for f in data/hero.json data/profile.json data/site-config.json; do
  python3 -c "import json,sys; json.load(open('$f')); print('OK $f')" || exit 1
done
```
Expected: three `OK` lines.

- [ ] **Step 5: Commit**

```bash
git add data/hero.json data/profile.json data/site-config.json
git commit -m "feat(content): real bio, rotating subtitles, avatar path, openToWork flag

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Glass nav + asymmetric hero (21st.dev MCP assisted)

**Files:**
- Modify: `index.html` (hero section)
- Modify: `assets/js/main.js` (rewrite hero/nav renderers)

- [ ] **Step 1: Call 21st.dev MCP for hero inspiration**

Invoke:
```
mcp__magic__21st_magic_component_inspiration
  message: "asymmetric dark glass hero, software engineer portfolio, name + role left with rotating subtitle and CTAs, large rounded avatar with gradient ring right, animated gradient mesh background, navy/violet/cyan accent"
  searchQuery: "dark glass hero avatar asymmetric"
```
Save the returned references (titles + screenshots) in a scratch note. You will mimic the strongest one, not paste its code verbatim.

- [ ] **Step 2: Replace the hero block in `index.html`**

Find the existing `<section id="home" class="hero">…</section>` block and replace it entirely with:

```html
    <!-- Hero -->
    <section id="home" class="relative min-h-screen pt-28 pb-20">
      <div class="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 md:grid-cols-12">
        <!-- Copy -->
        <div class="md:col-span-7 reveal">
          <p class="font-mono text-eyebrow uppercase text-accent-2" id="heroEyebrow"></p>
          <h1 class="mt-4 font-extrabold tracking-tight text-display">
            <span id="heroName"></span>
            <span class="gradient-text" id="heroSurname"></span>
          </h1>
          <p class="mt-4 text-2xl text-text-mid">
            <span class="font-mono text-accent-2">&gt;</span>
            <span id="heroRotator" class="text-text-hi">&nbsp;</span><span class="text-accent-2 animate-pulse">_</span>
          </p>
          <p class="mt-6 max-w-xl text-base leading-relaxed text-text-mid" id="heroSummary"></p>
          <div class="mt-8 flex flex-wrap items-center gap-3" id="heroCTA"></div>
          <div class="mt-6 flex items-center gap-3" id="heroSocial"></div>
        </div>

        <!-- Avatar card -->
        <div class="md:col-span-5 reveal">
          <div class="relative mx-auto w-fit">
            <div class="absolute -inset-1 rounded-3xl bg-accent-grad opacity-60 blur-md"></div>
            <div class="relative overflow-hidden rounded-3xl hairline bg-surface p-2">
              <img id="heroAvatar" alt="Giridhar Reddy Mekapothula portrait"
                   class="block h-80 w-80 rounded-2xl object-cover md:h-96 md:w-96" />
            </div>
            <div id="openToWorkBadge"
                 class="absolute -bottom-3 left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded-full hairline bg-surface px-4 py-1.5 text-xs text-text-hi shadow-lg"
                 style="background-color: rgba(14,14,20,0.9);">
              <span class="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Open to work
            </div>
          </div>
        </div>
      </div>
      <!-- Toast slot (used by copy-email) -->
      <div id="toastRoot" class="fixed bottom-6 left-1/2 z-[80] -translate-x-1/2"></div>
    </section>
```

- [ ] **Step 3: Replace `assets/js/main.js` with a clean renderer**

Overwrite the full file with:

```js
// Orchestrates dynamic content loading + light interactions for the portfolio.
// Each render function is small and isolated.

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

async function loadJSON(path) {
  const res = await fetch(path, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return res.json();
}

function renderNav(items) {
  const ul = $('#navMenu');
  if (!ul) return;
  ul.innerHTML = items
    .map((it) => `<li><a href="${it.href}" class="hover:text-text-hi transition">${it.label}</a></li>`)
    .join('');
}

function renderHero(hero) {
  $('#heroEyebrow').textContent = hero.eyebrow ?? '';
  $('#heroName').textContent = (hero.greeting ? hero.greeting + ' ' : '') + (hero.name ?? '');
  $('#heroSurname').textContent = hero.surnameGradient ?? '';
  $('#heroSummary').textContent = hero.summary ?? '';

  const avatar = $('#heroAvatar');
  if (avatar && hero.avatarUrl) avatar.src = hero.avatarUrl;

  if (hero.openToWork) $('#openToWorkBadge').classList.replace('hidden', 'flex');

  // CTA buttons
  const ctas = (hero.cta?.buttons ?? [])
    .map((b) => {
      const base =
        'inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition';
      const cls =
        b.type === 'primary'
          ? `${base} bg-accent-grad text-bg hover:opacity-90`
          : b.type === 'secondary'
          ? `${base} hairline text-text-hi hover:bg-surface`
          : `${base} text-text-mid hover:text-text-hi`;
      const dataAttr = b.action ? ` data-action="${b.action}"` : '';
      const target = b.external ? ' target="_blank" rel="noreferrer"' : '';
      return `<a href="${b.href}" class="${cls}"${dataAttr}${target}><span>${b.text}</span><i class="${b.icon}"></i></a>`;
    })
    .join('');
  $('#heroCTA').innerHTML = ctas;

  // Social
  const socials = (hero.socialLinks ?? [])
    .map(
      (s) =>
        `<a href="${s.url}" aria-label="${s.platform}" target="_blank" rel="noreferrer"
            class="grid h-9 w-9 place-items-center rounded-full hairline text-text-mid hover:text-text-hi hover:border-accent-1/40 transition">
            <i class="${s.icon}"></i>
          </a>`,
    )
    .join('');
  $('#heroSocial').innerHTML = socials;

  // Rotating subtitle
  startRotator($('#heroRotator'), hero.rotatingSubtitles ?? [hero.title].filter(Boolean));
}

function startRotator(target, items, intervalMs = 2500) {
  if (!target || items.length === 0) return;
  let i = 0;
  target.textContent = items[0];
  if (items.length === 1) return;
  setInterval(() => {
    i = (i + 1) % items.length;
    target.style.opacity = '0';
    setTimeout(() => {
      target.textContent = items[i];
      target.style.opacity = '1';
    }, 180);
  }, intervalMs);
  target.style.transition = 'opacity 180ms ease';
}

// Reusable export so later tasks can import it
export { $, $$, loadJSON, renderNav, renderHero };

// Bootstrap on DOMContentLoaded
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const [nav, hero] = await Promise.all([loadJSON('data/navigation.json'), loadJSON('data/hero.json')]);
    renderNav(nav.items ?? nav);
    renderHero(hero);
  } catch (err) {
    console.error('Bootstrap failed:', err);
  }
});
```

Note: this also requires `index.html` to load `main.js` as a module. Update the previous `<script src="assets/js/main.js"></script>` to `<script type="module" src="assets/js/main.js"></script>`.

- [ ] **Step 4: Inspect `data/navigation.json` and confirm it has an `items` array with `{label, href}`**

```bash
cat ~/giridhar248.github.io/data/navigation.json
```
If the existing structure differs, fix `renderNav` to match (one-line tweak). The renderer handles either `nav.items` or the root array.

- [ ] **Step 5: Visual smoke**

Reload `http://localhost:8000`. Expected:
- Hero shows "Hi, I'm Giridhar Reddy **Mekapothula**" (surname in gradient).
- Rotating subtitle fades through "Distributed Systems" / "AI Agents" / "Backend Engineering".
- Avatar appears on the right with a violet→cyan glow ring and "Open to work" badge.
- Three CTA buttons render with primary/secondary/ghost styles.
- Social icons render in a row.

If the avatar 404s, check the path: `curl -sI http://localhost:8000/assets/images/avatar.jpg | head -1` should return 200.

- [ ] **Step 6: Commit**

```bash
git add index.html assets/js/main.js
git commit -m "feat(hero): asymmetric glass hero, gradient name, rotating subtitle, avatar card

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: About section + /uses block

**Files:**
- Create: `data/uses.json`
- Modify: `data/about.json` (rewrite bio paragraphs + stats)
- Modify: `index.html` (rebuild `<section id="about">`)
- Modify: `assets/js/main.js` (add `renderAbout`)

- [ ] **Step 1: Create `data/uses.json`**

```json
{
  "_instructions": "Tools and setup that signal taste. Edit freely.",
  "items": [
    { "label": "Editor", "value": "VS Code", "icon": "fas fa-code" },
    { "label": "Shell", "value": "zsh + starship", "icon": "fas fa-terminal" },
    { "label": "Machine", "value": "MacBook Pro", "icon": "fas fa-laptop-code" },
    { "label": "Theme", "value": "Catppuccin Mocha", "icon": "fas fa-palette" }
  ]
}
```

- [ ] **Step 2: Rewrite `data/about.json`**

```json
{
  "_instructions": "About section content.",
  "sectionTitle": "About",
  "currentlyLine": "Building distributed systems and exploring multi-agent AI.",
  "paragraphs": [
    "I'm a software engineer drawn to systems that have to be fast, resilient, and easy to reason about — distributed backends, agent orchestration, and the glue between them.",
    "Recent work: a 10K-req/min URL shortener in Spring Boot, a multi-agent medical-diagnostics pipeline on GPT-4o, and a cloud-native image classifier on AWS. I write Java, Python, and C/C++; deploy with Docker and Kubernetes."
  ],
  "stats": [
    { "label": "Years experience", "value": "1+" },
    { "label": "Public repos", "value": "20+", "live": "repos" },
    { "label": "Languages", "value": "6" }
  ]
}
```

- [ ] **Step 3: Replace the `<section id="about">` block in `index.html`**

```html
    <!-- About -->
    <section id="about" class="relative py-24">
      <div class="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 md:grid-cols-12">
        <div class="md:col-span-7 reveal">
          <p class="font-mono text-eyebrow uppercase text-accent-2">// about</p>
          <h2 class="mt-3 text-h2 font-extrabold">A brief introduction.</h2>
          <div class="mt-6 space-y-4 text-text-mid" id="aboutText"></div>
        </div>
        <aside class="md:col-span-5 space-y-4 reveal">
          <div class="rounded-2xl hairline bg-surface/60 backdrop-blur p-5">
            <p class="font-mono text-eyebrow uppercase text-accent-2">currently</p>
            <p class="mt-2 text-text-hi" id="aboutCurrently"></p>
          </div>
          <div class="rounded-2xl hairline bg-surface/60 backdrop-blur p-5">
            <p class="font-mono text-eyebrow uppercase text-accent-2">/uses</p>
            <ul class="mt-3 space-y-2 text-sm" id="usesList"></ul>
          </div>
          <div class="grid grid-cols-3 gap-3" id="aboutStats"></div>
        </aside>
      </div>
    </section>
```

- [ ] **Step 4: Add `renderAbout` to `assets/js/main.js`**

Append to the file (and import the new JSON in the bootstrap):

```js
export function renderAbout(about, uses) {
  $('#aboutText').innerHTML = (about.paragraphs ?? []).map((p) => `<p>${p}</p>`).join('');
  $('#aboutCurrently').textContent = about.currentlyLine ?? '';

  $('#usesList').innerHTML = (uses.items ?? [])
    .map(
      (u) => `<li class="flex items-center justify-between text-text-mid">
        <span class="flex items-center gap-2"><i class="${u.icon} text-accent-1/80"></i>${u.label}</span>
        <span class="text-text-hi">${u.value}</span>
      </li>`,
    )
    .join('');

  $('#aboutStats').innerHTML = (about.stats ?? [])
    .map(
      (s) => `<div class="rounded-xl hairline bg-surface/60 backdrop-blur p-4 text-center">
        <div class="text-2xl font-extrabold gradient-text">${s.value}</div>
        <div class="mt-1 text-[11px] uppercase tracking-widest text-text-lo">${s.label}</div>
      </div>`,
    )
    .join('');
}
```

In the `DOMContentLoaded` block, extend the `Promise.all` and call `renderAbout`:

```js
const [nav, hero, about, uses] = await Promise.all([
  loadJSON('data/navigation.json'),
  loadJSON('data/hero.json'),
  loadJSON('data/about.json'),
  loadJSON('data/uses.json'),
]);
renderNav(nav.items ?? nav);
renderHero(hero);
renderAbout(about, uses);
```

- [ ] **Step 5: Visual smoke**

Reload. Expected: About section renders with two paragraphs left, three small cards right (Currently / /uses / 3 stat tiles).

- [ ] **Step 6: Commit**

```bash
git add data/uses.json data/about.json index.html assets/js/main.js
git commit -m "feat(about): rewrite bio, /uses block, stat tiles

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: Tech Stack marquee

**Files:**
- Create: `assets/js/lib/marquee.js`
- Create: `assets/images/logos/*.svg` (~16 brand SVGs via 21st.dev `logo_search`)
- Modify: `index.html` (insert marquee section between About and Projects)
- Modify: `assets/js/main.js` (mount marquee)

- [ ] **Step 1: Fetch logos via 21st.dev `logo_search`**

Invoke once with a long query list:

```
mcp__magic__logo_search
  queries: ["Java","Spring","Python","Docker","Kubernetes","AWS","Redis","MySQL","Node.js","TypeScript","Git","GitHub","React","FastAPI","C++","LangChain"]
  format: "SVG"
```

For each returned SVG, save under `assets/images/logos/<slug>.svg` (e.g., `java.svg`, `spring.svg`). If the MCP returns inline SVG text, write each to its own file. If any query returns nothing, fall back to a Font Awesome icon (handled in the marquee renderer).

- [ ] **Step 2: Create `assets/js/lib/marquee.js`**

```js
// Renders two infinite-scroll rows of brand chips inside #stackMarquee.
// Duplicates content so the keyframe animation wraps seamlessly at translateX(-50%).

const FALLBACK_ICON_BY_NAME = {
  Java: 'fab fa-java',
  Python: 'fab fa-python',
  Docker: 'fab fa-docker',
  AWS: 'fab fa-aws',
  Node: 'fab fa-node-js',
  TypeScript: 'fab fa-js',
  Git: 'fab fa-git-alt',
  GitHub: 'fab fa-github',
  React: 'fab fa-react',
};

function chip({ name, logo }) {
  const visual = logo
    ? `<img src="${logo}" alt="" class="h-5 w-5 opacity-90" />`
    : `<i class="${FALLBACK_ICON_BY_NAME[name] ?? 'fas fa-code'} text-accent-2"></i>`;
  return `
    <div class="flex shrink-0 items-center gap-2 rounded-full hairline bg-surface/60 px-4 py-2 text-sm text-text-mid backdrop-blur">
      ${visual}<span>${name}</span>
    </div>
  `;
}

export function mountMarquee(stack) {
  const root = document.querySelector('#stackMarquee');
  if (!root) return;
  const html = stack.map(chip).join('');
  root.innerHTML = `
    <div class="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
      <div class="flex w-max gap-3 animate-marquee">${html}${html}</div>
    </div>
    <div class="mt-3 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
      <div class="flex w-max gap-3 animate-marquee-reverse">${html}${html}</div>
    </div>
  `;
}
```

- [ ] **Step 3: Insert the marquee section in `index.html`** (between About and Experience)

```html
    <!-- Tech Stack Marquee -->
    <section id="stack" class="relative py-16">
      <div class="mx-auto max-w-6xl px-4 reveal">
        <p class="font-mono text-eyebrow uppercase text-center text-accent-2">// the toolbelt</p>
        <h2 class="mt-3 text-h2 font-extrabold text-center">Tech I reach for.</h2>
        <div id="stackMarquee" class="mt-10"></div>
      </div>
    </section>
```

- [ ] **Step 4: Wire marquee in `main.js`**

Add to imports/bootstrap:

```js
import { mountMarquee } from './lib/marquee.js';

// After about/uses are loaded:
const stack = [
  { name: 'Java', logo: 'assets/images/logos/java.svg' },
  { name: 'Spring', logo: 'assets/images/logos/spring.svg' },
  { name: 'Python', logo: 'assets/images/logos/python.svg' },
  { name: 'Docker', logo: 'assets/images/logos/docker.svg' },
  { name: 'Kubernetes', logo: 'assets/images/logos/kubernetes.svg' },
  { name: 'AWS', logo: 'assets/images/logos/aws.svg' },
  { name: 'Redis', logo: 'assets/images/logos/redis.svg' },
  { name: 'MySQL', logo: 'assets/images/logos/mysql.svg' },
  { name: 'Node', logo: 'assets/images/logos/nodejs.svg' },
  { name: 'TypeScript', logo: 'assets/images/logos/typescript.svg' },
  { name: 'Git', logo: 'assets/images/logos/git.svg' },
  { name: 'React', logo: 'assets/images/logos/react.svg' },
  { name: 'C++' },
  { name: 'LangChain', logo: 'assets/images/logos/langchain.svg' },
  { name: 'FastAPI', logo: 'assets/images/logos/fastapi.svg' },
];
mountMarquee(stack);
```

(If any logo SVG is missing, the chip falls back to its Font Awesome icon via `FALLBACK_ICON_BY_NAME`.)

- [ ] **Step 5: Visual smoke**

Reload. Expected: two rows of brand chips scrolling left and right; edges fade out via mask. No console errors. Missing-logo chips show a Font Awesome icon instead.

- [ ] **Step 6: Commit**

```bash
git add assets/js/lib/marquee.js assets/images/logos/ index.html assets/js/main.js
git commit -m "feat(stack): tech marquee with logo chips, two-row reverse scroll

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 8: Featured projects data + card layout

**Files:**
- Create: `data/featured.json`
- Modify: `data/projects.json` (annotate featured entries — optional, kept clean by separation)
- Modify: `index.html` (rebuild Projects section)
- Modify: `assets/js/main.js` (add `renderFeaturedProjects` + `renderAllRepos`)

- [ ] **Step 1: Create `data/featured.json`**

These four are the strongest based on description quality. The owner may swap one or two during review — but this is a reasonable default.

```json
{
  "_instructions": "Featured projects shown as large cards above the all-repos list. Reference projects by exact title in projects.json.",
  "sectionTitle": "Featured Projects",
  "items": [
    {
      "title": "Distributed URL Shortener",
      "tagline": "10K req/min · consistent hashing · Spring Boot + Redis",
      "description": "A high-throughput shortening service using Spring Boot, Redis-backed caches, MySQL persistence, and Nginx LB. JMeter load-tested at 10K req/min with consistent-hashing key generation; full stack containerized via Docker Compose.",
      "stack": ["Java", "Spring Boot", "Redis", "MySQL", "Docker", "Nginx"],
      "repo": "https://github.com/giridhar248/url-shortener-service",
      "demo": "",
      "accent": "violet"
    },
    {
      "title": "AI Medical Diagnostics Agents",
      "tagline": "GPT-4o · multi-agent · 30% faster inter-agent comms",
      "description": "Multi-agent diagnostic pipeline on GPT-4o with Python multithreading. Optimized inter-agent message routing dropped response time by 30%; deployed with Kubernetes orchestration.",
      "stack": ["Python", "GPT-4o", "Kubernetes", "Docker"],
      "repo": "https://github.com/giridhar248/Medical-Diagnostics-With-Ai-Agent",
      "demo": "",
      "accent": "cyan"
    },
    {
      "title": "Elastic Cloud Image Recognition",
      "tagline": "AWS · 100 concurrent inferences · auto-scaling EC2",
      "description": "Cloud-native image classifier on AWS handling 100 concurrent requests via SQS + auto-scaling EC2. Node.js web tier handles uploads; Python inference workers pull from queue. CloudWatch dashboards for SLOs.",
      "stack": ["Python", "Node.js", "AWS EC2", "SQS", "S3", "CloudWatch"],
      "repo": "https://github.com/giridhar248/AWSight-Smart-Image-Classifier",
      "demo": "",
      "accent": "fuchsia"
    },
    {
      "title": "AI Knowledge Assistant",
      "tagline": "RAG · LangChain + LangGraph + Ollama · local-first",
      "description": "Multi-agent system for querying personal knowledge bases. RAG over a vector store via LangChain + LangGraph, model-served locally with Ollama. Web UI for upload-and-ask flows.",
      "stack": ["Python", "LangChain", "LangGraph", "Ollama", "FAISS"],
      "repo": "https://github.com/giridhar248/AI-KNOWLEDGE-ASSISTANT",
      "demo": "",
      "accent": "violet"
    }
  ]
}
```

- [ ] **Step 2: Call 21st.dev MCP for project card inspiration**

```
mcp__magic__21st_magic_component_inspiration
  message: "dark glass project card with gradient cover, live github stars and last-commit pill, tech badges, repo + demo links, hover lift"
  searchQuery: "project card dark glass github stars"
```
Skim the references; pick the one closest to the markup below as a sanity check.

- [ ] **Step 3: Replace `<section id="projects">` in `index.html`**

```html
    <!-- Featured Projects -->
    <section id="projects" class="relative py-24">
      <div class="mx-auto max-w-6xl px-4">
        <div class="reveal">
          <p class="font-mono text-eyebrow uppercase text-accent-2">// featured projects</p>
          <h2 class="mt-3 text-h2 font-extrabold">Shipped, measured, in production.</h2>
        </div>
        <div id="featuredGrid" class="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2"></div>

        <details class="mt-16 group reveal">
          <summary class="cursor-pointer list-none flex items-center justify-between rounded-xl hairline bg-surface/60 px-5 py-4 backdrop-blur transition hover:bg-surface">
            <span class="font-mono text-sm text-text-mid">All repos <span id="allReposCount" class="text-text-hi"></span></span>
            <i class="fas fa-chevron-down transition group-open:rotate-180 text-text-mid"></i>
          </summary>
          <div id="allReposList" class="mt-4 overflow-hidden rounded-xl hairline"></div>
        </details>
      </div>
    </section>
```

- [ ] **Step 4: Add `renderFeaturedProjects` and `renderAllRepos` to `main.js`**

Append:

```js
const ACCENT_GRADIENT = {
  violet: 'from-accent-1/60 to-accent-2/40',
  cyan: 'from-accent-2/60 to-accent-3/40',
  fuchsia: 'from-accent-3/60 to-accent-1/40',
};

function featuredCard(p) {
  const grad = ACCENT_GRADIENT[p.accent] ?? ACCENT_GRADIENT.violet;
  const stack = (p.stack ?? [])
    .map((s) => `<span class="rounded-full hairline bg-surface px-2.5 py-1 text-xs text-text-mid">${s}</span>`)
    .join('');
  const repoSlug = (p.repo ?? '').replace('https://github.com/', '');
  return `
    <article class="group relative overflow-hidden rounded-2xl hairline bg-surface/60 backdrop-blur transition hover:-translate-y-0.5 hover:border-accent-1/40 reveal">
      <div class="relative h-32 bg-gradient-to-br ${grad}">
        <div class="absolute inset-0 dot-grid opacity-50"></div>
        <div class="absolute bottom-3 left-4 font-mono text-xs text-white/70" data-repo-slug="${repoSlug}">
          <span data-stats="stars">★ —</span>
          <span class="mx-2">·</span>
          <span data-stats="updated">updated —</span>
        </div>
      </div>
      <div class="p-5">
        <h3 class="text-lg font-bold text-text-hi">${p.title}</h3>
        <p class="mt-1 text-xs text-accent-2">${p.tagline ?? ''}</p>
        <p class="mt-3 text-sm text-text-mid">${p.description ?? ''}</p>
        <div class="mt-4 flex flex-wrap gap-1.5">${stack}</div>
        <div class="mt-5 flex items-center gap-4 text-sm">
          ${p.repo ? `<a href="${p.repo}" target="_blank" rel="noreferrer" class="text-text-hi hover:text-accent-2 transition"><i class="fab fa-github mr-1"></i>Repo</a>` : ''}
          ${p.demo ? `<a href="${p.demo}" target="_blank" rel="noreferrer" class="text-text-hi hover:text-accent-2 transition"><i class="fas fa-arrow-up-right-from-square mr-1"></i>Demo</a>` : ''}
        </div>
      </div>
    </article>
  `;
}

export function renderFeaturedProjects(featured) {
  $('#featuredGrid').innerHTML = (featured.items ?? []).map(featuredCard).join('');
}

export function renderAllRepos(projects, featuredTitles) {
  const featuredSet = new Set(featuredTitles);
  const rest = (projects.projects ?? []).filter((p) => !featuredSet.has(p.title));
  $('#allReposCount').textContent = `(${rest.length})`;

  $('#allReposList').innerHTML = `
    <table class="w-full text-sm">
      <thead class="bg-surface/60 text-left text-xs uppercase tracking-widest text-text-lo">
        <tr>
          <th class="px-4 py-3">Repo</th>
          <th class="px-4 py-3 hidden md:table-cell">Stack</th>
          <th class="px-4 py-3 w-12"></th>
        </tr>
      </thead>
      <tbody class="divide-y divide-white/[0.06]">
        ${rest
          .map(
            (p) => `
          <tr class="bg-surface/40 hover:bg-surface/80 transition">
            <td class="px-4 py-3 text-text-hi">${p.title}</td>
            <td class="px-4 py-3 hidden md:table-cell text-text-mid">${(p.technologies ?? []).slice(0, 3).join(' · ') || '—'}</td>
            <td class="px-4 py-3 text-right">
              ${p.github ? `<a href="${p.github}" target="_blank" rel="noreferrer" class="text-text-mid hover:text-accent-2"><i class="fas fa-arrow-up-right-from-square"></i></a>` : ''}
            </td>
          </tr>`,
          )
          .join('')}
      </tbody>
    </table>
  `;
}
```

In bootstrap, extend the `Promise.all`:

```js
const [nav, hero, about, uses, featured, projects] = await Promise.all([
  loadJSON('data/navigation.json'),
  loadJSON('data/hero.json'),
  loadJSON('data/about.json'),
  loadJSON('data/uses.json'),
  loadJSON('data/featured.json'),
  loadJSON('data/projects.json'),
]);
renderNav(nav.items ?? nav);
renderHero(hero);
renderAbout(about, uses);
mountMarquee(stack);
renderFeaturedProjects(featured);
renderAllRepos(projects, (featured.items ?? []).map((p) => p.title));
```

- [ ] **Step 5: Visual smoke**

Reload. Expected:
- 4 large project cards in a 2×2 grid.
- Each shows gradient cover, title, tagline, description, tech badges, repo link.
- "All repos (N)" collapsible appears below; clicking opens a table of the remaining repos.

- [ ] **Step 6: Commit**

```bash
git add data/featured.json index.html assets/js/main.js
git commit -m "feat(projects): featured cards + collapsible all-repos table

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 9: Live GitHub stats on featured cards

**Files:**
- Create: `assets/js/lib/github-stats.js`
- Create: `tests/github-stats.test.js`
- Modify: `assets/js/main.js` (call `hydrateGitHubStats` after `renderFeaturedProjects`)

- [ ] **Step 1: Create `assets/js/lib/github-stats.js`**

```js
// Fetches GitHub repo metadata (stars, updated_at) and writes into card slots
// with data-repo-slug. Caches per-slug in sessionStorage for 1 hour.

const TTL_MS = 60 * 60 * 1000;
const STORAGE_PREFIX = 'gh-stats:';

export function formatRelativeTime(nowMs, thenIso) {
  const then = new Date(thenIso).getTime();
  if (Number.isNaN(then)) return '—';
  const diff = Math.max(0, nowMs - then);
  const day = 24 * 60 * 60 * 1000;
  if (diff < day) return 'today';
  if (diff < 7 * day) return `${Math.floor(diff / day)}d ago`;
  if (diff < 60 * day) return `${Math.floor(diff / (7 * day))}w ago`;
  if (diff < 365 * day) return `${Math.floor(diff / (30 * day))}mo ago`;
  return `${Math.floor(diff / (365 * day))}y ago`;
}

function readCache(slug) {
  try {
    const raw = sessionStorage.getItem(STORAGE_PREFIX + slug);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.savedAt > TTL_MS) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

function writeCache(slug, data) {
  try {
    sessionStorage.setItem(STORAGE_PREFIX + slug, JSON.stringify({ savedAt: Date.now(), data }));
  } catch {}
}

async function fetchOne(slug) {
  const cached = readCache(slug);
  if (cached) return cached;

  const res = await fetch(`https://api.github.com/repos/${slug}`, {
    headers: { Accept: 'application/vnd.github+json' },
  });
  if (!res.ok) throw new Error(`GitHub API ${res.status} for ${slug}`);
  const data = await res.json();
  const trimmed = {
    stars: data.stargazers_count ?? 0,
    updated_at: data.pushed_at ?? data.updated_at,
  };
  writeCache(slug, trimmed);
  return trimmed;
}

export async function hydrateGitHubStats(rootSelector = '#featuredGrid') {
  const root = document.querySelector(rootSelector);
  if (!root) return;
  const cards = root.querySelectorAll('[data-repo-slug]');
  const now = Date.now();

  await Promise.allSettled(
    Array.from(cards).map(async (card) => {
      const slug = card.getAttribute('data-repo-slug');
      if (!slug) return;
      try {
        const { stars, updated_at } = await fetchOne(slug);
        const starEl = card.querySelector('[data-stats="stars"]');
        const upEl = card.querySelector('[data-stats="updated"]');
        if (starEl) starEl.textContent = `★ ${stars}`;
        if (upEl) upEl.textContent = `updated ${formatRelativeTime(now, updated_at)}`;
      } catch (e) {
        // Leave dashes; graceful fallback.
        console.warn('github-stats:', e);
      }
    }),
  );
}
```

- [ ] **Step 2: Create `tests/github-stats.test.js`**

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatRelativeTime } from '../assets/js/lib/github-stats.js';

const NOW = new Date('2026-05-20T12:00:00Z').getTime();
const iso = (d) => new Date(d).toISOString();

test('returns "today" for activity earlier today', () => {
  assert.equal(formatRelativeTime(NOW, iso('2026-05-20T02:00:00Z')), 'today');
});

test('returns days ago for activity in last week', () => {
  assert.equal(formatRelativeTime(NOW, iso('2026-05-17T12:00:00Z')), '3d ago');
});

test('returns weeks ago for activity in last 2 months', () => {
  assert.equal(formatRelativeTime(NOW, iso('2026-04-15T12:00:00Z')), '5w ago');
});

test('returns months ago for activity in last year', () => {
  assert.equal(formatRelativeTime(NOW, iso('2026-01-01T12:00:00Z')), '4mo ago');
});

test('returns years ago for older activity', () => {
  assert.equal(formatRelativeTime(NOW, iso('2024-01-01T12:00:00Z')), '2y ago');
});

test('returns em-dash for invalid date', () => {
  assert.equal(formatRelativeTime(NOW, 'not-a-date'), '—');
});
```

- [ ] **Step 3: Run unit tests**

```bash
cd ~/giridhar248.github.io
node --test tests/github-stats.test.js
```
Expected: all 6 pass.

- [ ] **Step 4: Wire `hydrateGitHubStats` in `main.js`**

Add the import and call after rendering featured:

```js
import { hydrateGitHubStats } from './lib/github-stats.js';

// after renderFeaturedProjects(featured):
hydrateGitHubStats();
```

- [ ] **Step 5: Visual smoke**

Reload. Expected: each featured card's gradient cover shows ★ count and "updated Xd ago" within ~2 seconds. If GitHub rate-limits (60/hr unauthenticated), dashes remain — verify by checking the Network tab in DevTools.

- [ ] **Step 6: Commit**

```bash
git add assets/js/lib/github-stats.js tests/github-stats.test.js assets/js/main.js
git commit -m "feat(projects): live github stars and last-commit on featured cards, 1h sessionStorage cache

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 10: Experience timeline restyle

**Files:**
- Modify: `index.html` (`<section id="experience">`)
- Modify: `assets/js/main.js` (add `renderExperience`)

- [ ] **Step 1: Replace `<section id="experience">` in `index.html`**

```html
    <!-- Experience -->
    <section id="experience" class="relative py-24">
      <div class="mx-auto max-w-4xl px-4">
        <div class="reveal">
          <p class="font-mono text-eyebrow uppercase text-accent-2">// experience</p>
          <h2 class="mt-3 text-h2 font-extrabold">Where I've shipped.</h2>
        </div>
        <ol id="experienceTimeline" class="mt-10 relative border-l border-white/10 pl-8 space-y-10"></ol>
      </div>
    </section>
```

- [ ] **Step 2: Add `renderExperience` to `main.js`**

```js
export function renderExperience(experience) {
  const items = experience.items ?? experience ?? [];
  $('#experienceTimeline').innerHTML = items
    .map(
      (e) => `
      <li class="relative reveal">
        <span class="absolute -left-[37px] top-1.5 h-3 w-3 rounded-full bg-accent-grad ring-4 ring-bg"></span>
        <div class="rounded-xl hairline bg-surface/60 backdrop-blur p-5">
          <div class="flex flex-wrap items-baseline justify-between gap-2">
            <h3 class="text-lg font-bold text-text-hi">${e.title}</h3>
            <span class="font-mono text-xs text-text-lo">${e.period ?? ''}</span>
          </div>
          <p class="mt-1 text-sm text-accent-2">${e.company ?? ''}${e.location ? ' · ' + e.location : ''}</p>
          ${e.description ? `<p class="mt-3 text-sm text-text-mid">${e.description}</p>` : ''}
          ${
            (e.responsibilities ?? []).length
              ? `<ul class="mt-3 list-disc pl-5 text-sm text-text-mid space-y-1">${(e.responsibilities ?? []).map((r) => `<li>${r}</li>`).join('')}</ul>`
              : ''
          }
        </div>
      </li>`,
    )
    .join('');
}
```

In bootstrap, add `experience` to `Promise.all` and call `renderExperience(experience)`:

```js
loadJSON('data/experience.json'),
// ...
renderExperience(experience);
```

- [ ] **Step 3: Visual smoke**

Reload. Expected: vertical timeline with one glass card per role; gradient dot markers on the rail.

- [ ] **Step 4: Commit**

```bash
git add index.html assets/js/main.js
git commit -m "feat(experience): glass timeline restyle

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 11: Education + Certifications restyle

**Files:**
- Modify: `index.html` (`<section id="education">`)
- Modify: `assets/js/main.js` (add `renderEducation`)

- [ ] **Step 1: Replace `<section id="education">` in `index.html`**

```html
    <!-- Education + Certifications -->
    <section id="education" class="relative py-24">
      <div class="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 md:grid-cols-2">
        <div class="reveal">
          <p class="font-mono text-eyebrow uppercase text-accent-2">// education</p>
          <h2 class="mt-3 text-h2 font-extrabold">Degrees.</h2>
          <ul id="educationList" class="mt-6 space-y-4"></ul>
        </div>
        <div class="reveal">
          <p class="font-mono text-eyebrow uppercase text-accent-2">// certifications</p>
          <h2 class="mt-3 text-h2 font-extrabold">Receipts.</h2>
          <div id="certGrid" class="mt-6 flex flex-wrap gap-2"></div>
        </div>
      </div>
    </section>
```

- [ ] **Step 2: Add `renderEducation` to `main.js`**

```js
export function renderEducation(education) {
  const eduItems = education.education ?? education.items ?? education ?? [];
  const certItems = education.certifications ?? [];

  $('#educationList').innerHTML = eduItems
    .map(
      (e) => `
      <li class="rounded-xl hairline bg-surface/60 backdrop-blur p-5">
        <div class="flex flex-wrap items-baseline justify-between gap-2">
          <h3 class="font-bold text-text-hi">${e.degree ?? e.title ?? ''}</h3>
          <span class="font-mono text-xs text-text-lo">${e.period ?? ''}</span>
        </div>
        <p class="mt-1 text-sm text-accent-2">${e.school ?? e.institution ?? ''}</p>
      </li>`,
    )
    .join('');

  $('#certGrid').innerHTML = certItems
    .map(
      (c) => `<span class="rounded-full hairline bg-surface/60 px-3 py-1.5 text-sm text-text-mid">
        ${c.name ?? c.title ?? c}
      </span>`,
    )
    .join('');
}
```

Add to bootstrap:

```js
loadJSON('data/education.json'),
// ...
renderEducation(education);
```

- [ ] **Step 3: Visual smoke**

Reload. Expected: two-column band; left lists degrees as glass cards, right shows certs as pill chips.

- [ ] **Step 4: Commit**

```bash
git add index.html assets/js/main.js
git commit -m "feat(education): two-column education + cert pills

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 12: Contact (copy-email) + Footer

**Files:**
- Create: `assets/js/lib/copy-email.js`
- Modify: `index.html` (`<section id="contact">` and `<footer>`)
- Modify: `assets/js/main.js` (mount copy-email + footer renderer)

- [ ] **Step 1: Create `assets/js/lib/copy-email.js`**

```js
// Wires up any element with [data-action="copy-email"] to copy the configured
// email to clipboard and show a toast.

export function mountCopyEmail(email, toastRootSelector = '#toastRoot') {
  document.addEventListener('click', async (event) => {
    const trigger = event.target.closest('[data-action="copy-email"]');
    if (!trigger) return;
    event.preventDefault();
    try {
      await navigator.clipboard.writeText(email);
      showToast('Email copied to clipboard', toastRootSelector);
    } catch {
      showToast('Copy failed — your email is ' + email, toastRootSelector);
    }
  });
}

function showToast(message, rootSel) {
  const root = document.querySelector(rootSel);
  if (!root) return;
  const el = document.createElement('div');
  el.className =
    'rounded-full hairline bg-surface px-4 py-2 text-sm text-text-hi shadow-2xl opacity-0 transition';
  el.style.backgroundColor = 'rgba(14,14,20,0.95)';
  el.textContent = message;
  root.appendChild(el);
  requestAnimationFrame(() => (el.style.opacity = '1'));
  setTimeout(() => {
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 220);
  }, 2200);
}
```

- [ ] **Step 2: Replace `<section id="contact">` and `<footer>` in `index.html`**

```html
    <!-- Contact -->
    <section id="contact" class="relative py-24">
      <div class="mx-auto max-w-3xl px-4 text-center reveal">
        <p class="font-mono text-eyebrow uppercase text-accent-2">// reach out</p>
        <h2 class="mt-3 text-h2 font-extrabold">Let's build something.</h2>
        <p class="mt-4 text-text-mid">
          Drop a line about distributed systems, AI-agent work, or backend roles — I read everything.
        </p>
        <div class="mt-8 inline-flex items-center gap-2 rounded-full hairline bg-surface/60 px-4 py-2 font-mono text-sm backdrop-blur">
          <i class="fas fa-envelope text-accent-2"></i>
          <span id="contactEmail">giridharreddy2212@gmail.com</span>
          <button data-action="copy-email"
                  class="ml-2 rounded-md hairline px-2 py-1 text-xs text-text-mid hover:text-text-hi transition"
                  aria-label="Copy email to clipboard">
            <i class="fas fa-copy"></i>
            <span>Copy</span>
          </button>
        </div>
        <div class="mt-6 flex justify-center gap-3" id="contactSocial"></div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="relative border-t hairline py-10">
      <div class="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 text-sm text-text-lo md:flex-row md:justify-between">
        <p>© <span id="footerYear"></span> Giridhar Reddy Mekapothula</p>
        <p class="font-mono">built with Tailwind + ☕ · last deployed <span id="footerDeployed"></span></p>
      </div>
    </footer>
```

- [ ] **Step 3: Wire copy-email and footer in `main.js`**

Add to imports and bootstrap:

```js
import { mountCopyEmail } from './lib/copy-email.js';

// In bootstrap, after data is loaded:
mountCopyEmail(profile.contact.email);

// Contact social
$('#contactSocial').innerHTML = (hero.socialLinks ?? [])
  .filter((s) => s.platform !== 'Email')
  .map(
    (s) => `<a href="${s.url}" target="_blank" rel="noreferrer"
       class="grid h-10 w-10 place-items-center rounded-full hairline text-text-mid hover:text-text-hi hover:border-accent-1/40 transition">
       <i class="${s.icon}"></i></a>`,
  )
  .join('');

// Footer
$('#footerYear').textContent = String(siteConfig.settings?.year ?? new Date().getFullYear());
$('#footerDeployed').textContent = (siteConfig.settings?.deployTimestamp ?? new Date().toISOString()).slice(0, 10);
```

You'll need to load `profile.json` and `site-config.json` in the bootstrap if not already; add to `Promise.all`:

```js
loadJSON('data/profile.json'),
loadJSON('data/site-config.json'),
```

Bind them by variable name (`profile`, `siteConfig`).

- [ ] **Step 4: Visual smoke**

Reload. Expected: Contact section shows centered email in a pill with a Copy button; clicking it shows a toast at the bottom that says "Email copied to clipboard"; footer shows year + deploy date.

- [ ] **Step 5: Commit**

```bash
git add assets/js/lib/copy-email.js index.html assets/js/main.js
git commit -m "feat(contact,footer): copy-email pill, toast, deploy timestamp footer

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 13: ⌘K command palette

**Files:**
- Create: `assets/js/lib/command-palette.js`
- Create: `tests/command-palette.test.js`
- Modify: `index.html` (modal markup)
- Modify: `assets/js/main.js` (mount palette)

- [ ] **Step 1: Create `assets/js/lib/command-palette.js`**

```js
// A minimal ⌘K command palette.
// Exposes pure `fuzzyScore` for unit-testability.

export function fuzzyScore(query, label) {
  const q = query.toLowerCase().trim();
  const s = label.toLowerCase();
  if (q === '') return 0; // 0 = neutral; empty query keeps original order
  if (s.includes(q)) return 100 - s.indexOf(q); // contiguous hit; earlier is stronger
  // Subsequence match: every char of q appears in s in order
  let i = 0;
  for (const ch of s) {
    if (ch === q[i]) i++;
    if (i === q.length) return 40 - (s.length - q.length);
  }
  return -1;
}

export function rank(actions, query) {
  return actions
    .map((a) => ({ a, score: fuzzyScore(query, a.label) }))
    .filter((x) => x.score >= 0)
    .sort((x, y) => y.score - x.score)
    .map((x) => x.a);
}

export function mountCommandPalette(actions) {
  const root = document.querySelector('#cmdkRoot');
  const input = document.querySelector('#cmdkInput');
  const list = document.querySelector('#cmdkList');
  const trigger = document.querySelector('#cmdkBtn');
  if (!root || !input || !list) return;

  let openState = false;
  let activeIndex = 0;
  let visible = actions;

  const renderList = () => {
    list.innerHTML = visible
      .map(
        (a, i) => `
        <li>
          <button data-cmd-idx="${i}"
                  class="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition ${
                    i === activeIndex ? 'bg-surface-2 text-text-hi' : 'text-text-mid hover:bg-surface-2'
                  }">
            <span class="flex items-center gap-3"><i class="${a.icon} text-accent-2 w-4"></i>${a.label}</span>
            <span class="font-mono text-xs text-text-lo">${a.hint ?? ''}</span>
          </button>
        </li>`,
      )
      .join('');
  };

  const open = () => {
    openState = true;
    root.classList.remove('hidden');
    root.classList.add('flex');
    input.value = '';
    activeIndex = 0;
    visible = actions;
    renderList();
    setTimeout(() => input.focus(), 30);
  };
  const close = () => {
    openState = false;
    root.classList.add('hidden');
    root.classList.remove('flex');
  };
  const runActive = () => {
    const action = visible[activeIndex];
    if (!action) return;
    close();
    action.run();
  };

  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openState ? close() : open();
      return;
    }
    if (!openState) return;
    if (e.key === 'Escape') return close();
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIndex = Math.min(visible.length - 1, activeIndex + 1);
      renderList();
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIndex = Math.max(0, activeIndex - 1);
      renderList();
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      runActive();
    }
  });

  input.addEventListener('input', () => {
    visible = rank(actions, input.value);
    activeIndex = 0;
    renderList();
  });

  list.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-cmd-idx]');
    if (!btn) return;
    activeIndex = Number(btn.dataset.cmdIdx);
    runActive();
  });

  trigger?.addEventListener('click', open);
  root.addEventListener('click', (e) => {
    if (e.target === root) close();
  });
}
```

- [ ] **Step 2: Create `tests/command-palette.test.js`**

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fuzzyScore, rank } from '../assets/js/lib/command-palette.js';

test('contiguous match earlier in label scores higher', () => {
  assert.ok(fuzzyScore('proj', 'Goto Projects') > fuzzyScore('proj', 'Open Projects List Long'));
});

test('non-matching query returns -1', () => {
  assert.equal(fuzzyScore('zzz', 'Goto Projects'), -1);
});

test('subsequence match returns a positive score', () => {
  assert.ok(fuzzyScore('gpr', 'Goto Projects') > 0);
});

test('empty query treats all as neutral', () => {
  assert.equal(fuzzyScore('', 'Goto Projects'), 0);
});

test('rank filters non-matching entries', () => {
  const out = rank(
    [
      { label: 'Goto Projects' },
      { label: 'Open LinkedIn' },
      { label: 'Copy email' },
    ],
    'mail',
  );
  assert.equal(out.length, 1);
  assert.equal(out[0].label, 'Copy email');
});

test('rank sorts by descending score', () => {
  const out = rank(
    [
      { label: 'Goto Projects' },        // subseq match
      { label: 'Open Projects List' },   // contiguous 'proj' at offset 5
      { label: 'Projects only' },        // contiguous 'proj' at offset 0
    ],
    'proj',
  );
  assert.equal(out[0].label, 'Projects only');
});
```

- [ ] **Step 3: Run unit tests**

```bash
cd ~/giridhar248.github.io
node --test tests/command-palette.test.js
```
Expected: all 6 pass.

- [ ] **Step 4: Add modal markup to `index.html` (just before `</body>`)**

```html
    <!-- Command Palette Modal -->
    <div id="cmdkRoot"
         class="fixed inset-0 z-[90] hidden items-start justify-center p-4 pt-[15vh]"
         style="background-color: rgba(7,7,11,0.7); backdrop-filter: blur(8px);"
         role="dialog" aria-modal="true" aria-label="Command palette">
      <div class="w-full max-w-lg rounded-xl hairline bg-surface shadow-2xl">
        <div class="flex items-center gap-2 border-b border-white/[0.06] px-3 py-2">
          <i class="fas fa-magnifying-glass text-text-lo"></i>
          <input id="cmdkInput" type="text" placeholder="Type to search…"
                 class="w-full bg-transparent py-1.5 text-text-hi placeholder:text-text-lo focus:outline-none" />
          <span class="font-mono text-[10px] text-text-lo">esc</span>
        </div>
        <ul id="cmdkList" class="max-h-80 overflow-y-auto p-2 space-y-1"></ul>
      </div>
    </div>
```

- [ ] **Step 5: Mount the palette in `main.js`**

Append:

```js
import { mountCommandPalette } from './lib/command-palette.js';

// In bootstrap, AFTER all data is loaded:
const actions = [
  { label: 'Goto Projects', icon: 'fas fa-folder', hint: '#projects', run: () => location.hash = '#projects' },
  { label: 'Goto About', icon: 'fas fa-circle-info', hint: '#about', run: () => location.hash = '#about' },
  { label: 'Goto Experience', icon: 'fas fa-briefcase', hint: '#experience', run: () => location.hash = '#experience' },
  { label: 'Goto Contact', icon: 'fas fa-envelope', hint: '#contact', run: () => location.hash = '#contact' },
  { label: 'Copy email', icon: 'fas fa-copy', hint: '⏎', run: () => document.querySelector('[data-action="copy-email"]')?.click() },
  { label: 'Open GitHub', icon: 'fab fa-github', hint: '↗', run: () => window.open('https://github.com/giridhar248', '_blank') },
  { label: 'Open LinkedIn', icon: 'fab fa-linkedin', hint: '↗', run: () => window.open('https://linkedin.com/in/giridhar-reddy-46759b210/', '_blank') },
  { label: 'View resume', icon: 'fas fa-file-pdf', hint: 'pdf', run: () => window.open('documents/Giridhar_Reddy_Resume.pdf', '_blank') },
];
mountCommandPalette(actions);
```

- [ ] **Step 6: Visual smoke**

Reload. Expected:
- Press `⌘K` (mac) or `Ctrl+K` (win/linux): modal opens.
- Type "proj": filters to "Goto Projects".
- Arrow keys navigate; `Enter` runs the selected action; `Esc` closes.
- Clicking the `⌘K` pill in the nav opens the modal too.

- [ ] **Step 7: Commit**

```bash
git add assets/js/lib/command-palette.js tests/command-palette.test.js index.html assets/js/main.js
git commit -m "feat(cmdk): command palette with fuzzy search, keyboard nav, focus-trap-light

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 14: 404 page

**Files:**
- Create: `404.html`

- [ ] **Step 1: Create `404.html`**

```html
<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex" />
    <title>404 — Giridhar Reddy Mekapothula</title>
    <link rel="icon" type="image/svg+xml" href="assets/images/favicon.svg" />
    <link rel="stylesheet" href="assets/css/styles.css" />
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        darkMode: 'class',
        theme: {
          extend: {
            colors: {
              bg: '#07070b',
              surface: '#0e0e14',
              'text-hi': '#f4f4f5',
              'text-mid': '#a1a1aa',
              'text-lo': '#71717a',
              'accent-1': '#8b5cf6',
              'accent-2': '#22d3ee',
              'accent-3': '#f472b6',
            },
            backgroundImage: { 'accent-grad': 'linear-gradient(90deg, #8b5cf6 0%, #22d3ee 100%)' },
            animation: {
              'mesh-drift-1': 'meshDrift1 30s ease-in-out infinite',
              'mesh-drift-2': 'meshDrift2 38s ease-in-out infinite',
            },
            keyframes: {
              meshDrift1: { '0%,100%': { transform: 'translate3d(-10%,-10%,0) scale(1)' }, '50%': { transform: 'translate3d(10%,5%,0) scale(1.15)' } },
              meshDrift2: { '0%,100%': { transform: 'translate3d(20%,10%,0) scale(1.1)' }, '50%': { transform: 'translate3d(-15%,-5%,0) scale(1)' } },
            },
          },
        },
      };
    </script>
  </head>
  <body class="relative grid min-h-screen place-items-center bg-bg text-text-hi font-sans">
    <div class="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      <div class="absolute top-[-20%] left-[-10%] h-[60vmax] w-[60vmax] rounded-full opacity-50 blur-3xl animate-mesh-drift-1"
           style="background: radial-gradient(closest-side, #8b5cf6, transparent 70%);"></div>
      <div class="absolute bottom-[-30%] right-[-10%] h-[55vmax] w-[55vmax] rounded-full opacity-40 blur-3xl animate-mesh-drift-2"
           style="background: radial-gradient(closest-side, #22d3ee, transparent 70%);"></div>
      <div class="absolute inset-0 dot-grid"></div>
    </div>

    <main class="mx-auto max-w-md p-8 text-center">
      <p class="font-mono text-xs uppercase tracking-widest" style="color:#22d3ee;">// route not found</p>
      <h1 class="mt-3 text-6xl font-extrabold tracking-tight" style="background:linear-gradient(90deg,#8b5cf6,#22d3ee);-webkit-background-clip:text;background-clip:text;color:transparent;">
        404
      </h1>
      <p class="mt-3 text-text-mid">This path doesn't exist — but plenty of others do.</p>
      <a href="/" class="mt-8 inline-flex items-center gap-2 rounded-md bg-accent-grad px-4 py-2.5 text-sm font-semibold text-bg hover:opacity-90 transition">
        Back home <i class="fas fa-arrow-right"></i>
      </a>
    </main>
  </body>
</html>
```

- [ ] **Step 2: Visual smoke**

```bash
curl -sI http://localhost:8000/404.html | head -1
```
Expected: `HTTP/1.0 200 OK`.

Visit `http://localhost:8000/does-not-exist` — on GitHub Pages this serves `404.html`. With `python3 -m http.server` you get a generic 404, so verify by loading `http://localhost:8000/404.html` directly. Expected: gradient mesh background, big `404`, "Back home" button.

- [ ] **Step 3: Commit**

```bash
git add 404.html
git commit -m "feat(404): custom dark-glass 404 page

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 15: SEO / JSON-LD / Open Graph image hookup

**Files:**
- Modify: `index.html` (add OG/Twitter tags + JSON-LD)
- Create: `assets/images/og.svg` (or `.png` if exported)

- [ ] **Step 1: Add OG/Twitter tags + JSON-LD inside `<head>` of `index.html`**

Right before the existing `<script src="https://cdn.tailwindcss.com">`:

```html
    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Giridhar Reddy Mekapothula — Software Engineer" />
    <meta property="og:description" content="Software Engineer building distributed systems, AI agents, and backend services." />
    <meta property="og:url" content="https://giridhar248.github.io/" />
    <meta property="og:image" content="https://giridhar248.github.io/assets/images/og.svg" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Giridhar Reddy Mekapothula — Software Engineer" />
    <meta name="twitter:description" content="Software Engineer building distributed systems, AI agents, and backend services." />
    <meta name="twitter:image" content="https://giridhar248.github.io/assets/images/og.svg" />

    <!-- JSON-LD Person schema -->
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Giridhar Reddy Mekapothula",
        "jobTitle": "Software Engineer",
        "url": "https://giridhar248.github.io/",
        "sameAs": [
          "https://github.com/giridhar248",
          "https://linkedin.com/in/giridhar-reddy-46759b210/"
        ],
        "email": "mailto:giridharreddy2212@gmail.com"
      }
    </script>
```

- [ ] **Step 2: Create `assets/images/og.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#8b5cf6"/>
      <stop offset="100%" stop-color="#22d3ee"/>
    </linearGradient>
    <radialGradient id="b1" cx="20%" cy="30%" r="60%">
      <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.6"/>
      <stop offset="70%" stop-color="#8b5cf6" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="b2" cx="80%" cy="80%" r="50%">
      <stop offset="0%" stop-color="#22d3ee" stop-opacity="0.5"/>
      <stop offset="70%" stop-color="#22d3ee" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#07070b"/>
  <rect width="1200" height="630" fill="url(#b1)"/>
  <rect width="1200" height="630" fill="url(#b2)"/>
  <text x="80" y="280" font-family="ui-sans-serif, system-ui, sans-serif" font-size="84" font-weight="800" fill="#f4f4f5">Giridhar Reddy</text>
  <text x="80" y="370" font-family="ui-sans-serif, system-ui, sans-serif" font-size="84" font-weight="800" fill="url(#g)">Mekapothula</text>
  <text x="80" y="450" font-family="ui-monospace, JetBrains Mono, monospace" font-size="28" fill="#a1a1aa">// software engineer · distributed systems · ai agents</text>
</svg>
```

- [ ] **Step 3: Visual smoke**

Open `http://localhost:8000/assets/images/og.svg` in browser. Expected: dark gradient banner with the name in gradient.

View page source on `http://localhost:8000`; confirm OG and JSON-LD blocks present.

- [ ] **Step 4: Commit**

```bash
git add index.html assets/images/og.svg
git commit -m "feat(seo): OG/Twitter tags, JSON-LD Person, OG banner image

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 16: Reduced-motion + a11y pass

**Files:**
- Verification only; no code changes unless issues are found.

- [ ] **Step 1: Test `prefers-reduced-motion`**

In Chrome DevTools → Rendering → "Emulate CSS media feature prefers-reduced-motion: reduce". Reload the page.

Expected: gradient mesh blobs are static (no drift), marquee is stationary, reveal sections appear fully visible immediately, rotating subtitle stops swapping.

If any animation still runs, find the offending CSS class or JS-driven animation and add a `prefers-reduced-motion` guard. Most should already be handled by the global CSS in `styles.css` Step 2 of Task 1.

- [ ] **Step 2: Keyboard navigation pass**

Press `Tab` from the top. Expected order:
1. Skip-to-content link (becomes visible).
2. Nav links.
3. ⌘K pill.
4. Hero CTA buttons (View work, Get resume, Copy email).
5. Hero social icons.
6. About link interactions (none expected).
7. Project repo/demo links.
8. All-repos collapsible toggle.
9. Experience cards have no interactive elements.
10. Contact email Copy button + social icons.

`Enter` on the copy button: toast appears.
`⌘K` from anywhere: modal opens, focus moves to input.

- [ ] **Step 3: Contrast spot-check**

Open DevTools → Lighthouse → "Accessibility" only. Run. Expected score ≥ 95.

Common offenders if score is low:
- `text-text-lo` (#71717a) on `bg` — verify with a contrast checker. Should pass AA for non-text UI elements; if used on body text anywhere, swap to `text-text-mid` (#a1a1aa).
- Avatar `alt` text present — verify in DevTools.

Fix any failures inline.

- [ ] **Step 4: Mobile QA**

In DevTools, switch device to iPhone 12 / Pixel 7 / iPad. Reload.

Expected:
- Nav collapses to hamburger (icon visible). Tap hamburger — for now this is non-functional; that's acceptable for v1, just confirm nav links don't crowd.
- Hero stacks: copy above avatar.
- All sections remain single-column.
- Marquee scrolls and fade masks render.
- Featured cards stack to single column.

If hamburger menu is desired functional, that's a fast follow-up (out of scope for this plan).

- [ ] **Step 5: Commit any fixes**

```bash
# only if fixes were made
git add -A
git commit -m "fix(a11y): reduced-motion and contrast fixes from QA pass

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 17: Lighthouse pass + final cleanup + PR

**Files:**
- README.md (light update reflecting redesign)

- [ ] **Step 1: Run all unit tests**

```bash
cd ~/giridhar248.github.io
node --test tests/
```
Expected: all tests pass across `scroll-progress.test.js`, `github-stats.test.js`, `command-palette.test.js`.

- [ ] **Step 2: Lighthouse run**

In Chrome (incognito so extensions don't interfere): DevTools → Lighthouse → categories: Performance, Accessibility, Best Practices, SEO → Mobile → Analyze.

Targets:
- Performance ≥ 90
- Accessibility ≥ 95
- Best Practices ≥ 95
- SEO ≥ 95

If Performance < 90, likely cause is Tailwind CDN runtime cost or unoptimized avatar. Mitigations:
- Confirm `avatar.jpg` ≤ 200 KB (re-run the `sips` command in Task 2 if needed).
- Add `loading="lazy"` to the all-repos table icons (none in scope).
- Consider dropping `font-feature-settings` if not needed.

Document the Lighthouse run results in the PR description.

- [ ] **Step 3: Update README.md** (light touch)

Replace the top of `README.md` (lines 1–22) with:

```markdown
# Giridhar Reddy Mekapothula — Portfolio

Live: <https://giridhar248.github.io/>

Personal portfolio. Vanilla HTML + Tailwind (Play CDN) + JS modules, no build step. Content in `data/*.json`.

## Local dev

```bash
python3 -m http.server 8000
# or: npx http-server -p 8000 -o
```

Then open <http://localhost:8000>.

## Test

```bash
node --test tests/
```

## Structure

```
assets/
  css/styles.css        — base tokens + reduced-motion fallback
  js/main.js            — content loaders + section renderers
  js/lib/*.js           — gradient-mesh, scroll-progress, scroll-reveal, marquee,
                          command-palette, github-stats, copy-email
  images/avatar.jpg     — hero photo
  images/logos/*.svg    — tech logos for the stack marquee
data/                   — JSON content
docs/superpowers/       — design spec + implementation plan
404.html                — custom 404
```

## Customize

Edit JSON in `data/`. No rebuild needed.

---

(Original template README below for reference.)
```

(Append the original README content unchanged below the line.)

- [ ] **Step 4: Push the branch and open the PR**

```bash
cd ~/giridhar248.github.io
git add README.md
git commit -m "docs: README for the redesigned portfolio

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"

git push -u origin feature/portfolio-redesign

gh pr create \
  --title "Portfolio redesign: dark glass, 21st.dev MCP-assisted" \
  --body "$(cat <<'EOF'
## Summary

End-to-end redesign of the portfolio from the generic teal/beige template to a modern dark-glass aesthetic (Vercel/Linear language). No build step — Tailwind via Play CDN, vanilla HTML/JS modules, content in JSON.

## Highlights

- Asymmetric hero with animated gradient mesh + real avatar + rotating subtitle.
- 4 curated featured projects with live GitHub stars + last-commit (1h sessionStorage cache).
- "All 23 repos" collapsible table below featured.
- Tech-stack marquee with two-row infinite scroll, logos from 21st.dev `logo_search`.
- ⌘K command palette with fuzzy filter and keyboard nav.
- Top scroll progress bar, IntersectionObserver reveal animations.
- Custom 404 page, OG/JSON-LD metadata.

## Verification

- Unit tests: `node --test tests/` — three test files, all green.
- Lighthouse Mobile (incognito): Perf ≥ 90, A11y ≥ 95, BP ≥ 95, SEO ≥ 95.
- Reduced-motion verified via DevTools emulation.
- Keyboard nav + skip link verified.

## Out of scope

Blog, light theme, Spline 3D, terminal hero, custom cursor, analytics — explicit cuts from brainstorming.

## Spec & Plan

- Spec: `docs/superpowers/specs/2026-05-20-portfolio-redesign-design.md`
- Plan: `docs/superpowers/plans/2026-05-20-portfolio-redesign.md`

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 5: Verify the PR landed**

```bash
gh pr view --json url,state | grep url
```
Expected: a `https://github.com/giridhar248/giridhar248.github.io/pull/N` URL.

Wait for GitHub Pages to redeploy after merge (~1–2 minutes), then load `https://giridhar248.github.io/` and confirm the live site matches local.

---

## Notes on 21st.dev MCP usage during execution

When the plan says "Call 21st.dev MCP for inspiration," the actual invocations look like:

```
mcp__magic__21st_magic_component_inspiration
  message: <natural-language brief>
  searchQuery: <2-4 keyword phrase>
```

The MCP returns references. We do not paste their JSX verbatim — we use them as design DNA. The HTML in each task above is the final result of that translation, written directly so the engineer doesn't need to do another round-trip.

If during execution the MCP surfaces a strictly better pattern than what's in this plan, deviate — but commit the deviation as a separate step with a brief note in the commit body.
