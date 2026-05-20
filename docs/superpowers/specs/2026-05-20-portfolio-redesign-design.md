# Portfolio Redesign — Design Spec

**Date:** 2026-05-20
**Owner:** Giridhar Reddy Mekapothula
**Status:** Approved (chat-confirmed)

## 1. Goal

Transform `giridhar248.github.io` from a generic teal/beige portfolio template into a unique, modern, aesthetic **dark-glass** site that signals *senior software engineer*. Preserve the static GitHub Pages deploy, preserve JSON-driven content, leverage **21st.dev Magic MCP** for component DNA.

## 2. Non-goals

Out of scope for this redesign:

- Blog or writing index
- Spline / 3D hero
- Terminal-typewriter hero
- Light theme toggle (dark-only)
- Custom cursor
- View-source-style code blocks
- "Now" widget
- Analytics integration

## 3. Locked Decisions (from brainstorming Q1–Q7)

| # | Decision |
|---|---|
| Q1 | **Architecture:** Tailwind Play CDN + vanilla HTML/JS. No build step. |
| Q2 | **Aesthetic:** Modern Dev / Dark Glass (Vercel / Linear / Resend language). |
| Q3 | **Hero:** Asymmetric — copy + animated gradient mesh background on left, large rounded avatar on right. |
| Q4 | **Projects:** 4–6 curated **Featured** + expandable "All 23 repos" compact list. |
| Q5 | **Sections + order:** Hero → About (+ `/uses` block) → Tech Stack marquee → Featured Projects → Experience → Education / Certs (compact) → Contact (copy-email, no form). |
| Q6 | **Photo:** Real headshot, saved to `assets/images/avatar.jpg` (copied from `~/Downloads`). |
| Q7 | **Micro-touches:** ⌘K palette, scroll progress bar, live GitHub stars/commits on featured cards, custom 404, IntersectionObserver scroll-reveal. |

## 4. Architecture & Build

- **No build step.** `index.html` loads Tailwind via `<script src="https://cdn.tailwindcss.com">` with an inline `tailwind.config = { ... }` for design tokens.
- **Tailwind via CDN** scans classes at runtime — acceptable cost for a portfolio. Documented as a known trade-off.
- **No external font CDN.** Use the system stack (`ui-sans-serif`, `system-ui`, `Inter`, …) and mono stack (`ui-monospace`, `JetBrains Mono`, …). Faster, zero FOUT.
- **File structure** (after redesign):

```
giridhar248.github.io/
├── index.html
├── 404.html                          (new)
├── assets/
│   ├── css/
│   │   └── styles.css                (slimmed — Tailwind owns most styling; this file holds tokens + layers Tailwind can't express)
│   ├── js/
│   │   ├── main.js                   (orchestrates content loading from JSON)
│   │   └── lib/
│   │       ├── gradient-mesh.js      (animated background — CSS-driven, JS only for reduced-motion check)
│   │       ├── scroll-reveal.js      (IntersectionObserver wrapper)
│   │       ├── scroll-progress.js    (top progress bar)
│   │       ├── command-palette.js    (⌘K modal)
│   │       ├── github-stats.js       (live stars/last-commit; sessionStorage cache; graceful fallback)
│   │       ├── marquee.js            (tech stack auto-scroll)
│   │       └── copy-email.js         (clipboard + toast)
│   └── images/
│       ├── avatar.jpg                (new)
│       └── logos/                    (new — SVG brand logos from 21st.dev logo_search)
├── data/
│   ├── ...existing JSON files...
│   ├── uses.json                     (new)
│   └── featured.json                 (new — IDs + rewritten descriptions of 4–6 highlighted projects)
└── docs/superpowers/specs/
    └── 2026-05-20-portfolio-redesign-design.md   (this file)
```

## 5. Visual Design System

### 5.1 Palette (dark base)

```
bg:        #07070b     (zinc-950 + a touch of blue)
surface:   #0e0e14     (cards)
surface-2: #16161e     (raised)
border:    rgba(255, 255, 255, 0.06)
text-hi:   #f4f4f5
text-mid:  #a1a1aa
text-lo:   #71717a
accent-1:  #8b5cf6     (violet)
accent-2:  #22d3ee     (cyan)
accent-3:  #f472b6     (fuchsia — used sparingly, mostly in gradient mesh)
```

Gradient-text headings use `accent-1 → accent-2`. The mesh background combines all three at low opacity over `bg`.

### 5.2 Typography

- **Sans:** Inter system stack.
- **Mono:** JetBrains Mono system stack (used for eyebrows, code-style accents, email address).
- **Display:** `clamp(2.75rem, 6vw, 5.25rem)` (hero name).
- **H2:** `clamp(2rem, 3.5vw, 2.75rem)` (section titles).
- **Body:** `1rem`, `leading-relaxed`.
- **Eyebrow:** `0.75rem`, mono, uppercase, `tracking-widest`, color `accent-2`.

### 5.3 Motion

- All animations respect `prefers-reduced-motion`. When set, gradient mesh becomes a static gradient; scroll reveals become instant opacity-1.
- **Gradient mesh:** 3 blurred radial blobs drift via pure CSS keyframes (~30 s loops). No requestAnimationFrame loop.
- **Scroll reveal:** 16 px translateY + opacity 0→1, 500 ms `cubic-bezier(0.22, 1, 0.36, 1)`, triggered once on first intersection.
- **Card hover:** `translateY(-2px)` + border lights up to `accent-1 @ 40%` opacity, 200 ms ease-out.

## 6. Section Blueprints

### 6.1 Nav (sticky, glass)

- `backdrop-blur-xl` over `bg/70`, hairline bottom border.
- Left: monogram "GR" with gradient fill.
- Right: anchor links + ⌘K hint pill (`<kbd>⌘</kbd> K`).
- Mobile: hamburger → full-screen glass menu.

### 6.2 Hero

- 12-column asymmetric grid.
- **Left (cols 1–7):**
  - Eyebrow `// software engineer`
  - Display name; surname in gradient.
  - Rotating subtitle: `Distributed Systems` / `AI Agents` / `Backend Engineering`, swap every 2.5 s with fade.
  - 2-line summary (from `hero.json` — rewrite if needed).
  - CTAs: primary `View work →`, secondary `Get resume`, ghost `Copy email`.
  - Social row (LinkedIn, GitHub, Email).
- **Right (cols 8–12):** glass card with avatar; violet→cyan ring gradient border; small "Open to work" badge (configurable via JSON).
- **Background:** animated gradient mesh + 32 px dot grid mask at low opacity.

### 6.3 About

- Two columns.
- **Left:** 2 short paragraphs (current `"Professional portfolio"` is a placeholder — rewrite during execution).
- **Right:** stack of small cards
  - "Currently" — 1 line (e.g., "Building distributed systems and AI agents").
  - `/uses` block — editor / shell / machine / theme (from `uses.json`).
  - 3 stat tiles — years experience, public repos, lifetime commits (live from GitHub API; static fallback).

### 6.4 Tech Stack marquee

- Infinite CSS-only marquee. Two rows scrolling opposite directions.
- Brand logos from 21st.dev `logo_search`, cached locally under `assets/images/logos/`.
- Logo set drawn from `skills.json` categories: Java, Spring, Python, C/C++, Docker, Kubernetes, AWS, Redis, MySQL, Node.js, TypeScript, Git, …

### 6.5 Featured Projects (curated)

- 2-column grid (1-col on mobile).
- 4–6 large cards. Each card:
  - Gradient cover (per-language hue) with project icon.
  - Title, 2-line description, tech badges.
  - **Live data line:** ⭐ stars · `last commit: 3d ago` (from `github-stats.js`, `sessionStorage` cache 1 h).
  - Links: `Repo →`, `Demo →` (omit if absent).
  - Hover lift.
- Below: collapsible **"All 23 repos →"** — compact table view (name · primary language · stars · updated · external link).

### 6.6 Experience

- Keep timeline metaphor; restyle to dark glass.
- Vertical rail in `accent-2`; glass card per role; subtle accent line on the left edge.

### 6.7 Education + Certifications

- Compact two-column band.
- Left: education items (degree · school · period).
- Right: certifications as a pill grid.

### 6.8 Contact

- Centered.
- Eyebrow `// reach out` → headline → email in mono with **Copy** button + toast confirmation → LinkedIn + GitHub buttons.
- **No contact form** (current one is non-functional demo).

### 6.9 Footer

- Minimal: `© 2026 Giridhar Reddy`, `built with Tailwind + ☕`, last-deployed timestamp (from a JSON value updated by hand or via a future Action).

### 6.10 404.html

- Mirrors dark-glass treatment.
- Mono headline `404 — route not found`.
- Gradient mesh background.
- "Back to home →" CTA.

### 6.11 ⌘K Command Palette

- Triggered by `⌘K` / `Ctrl+K` / clicking the nav pill.
- Modal with fuzzy filter over actions:
  - Goto Projects / About / Experience / Contact
  - Copy email
  - Open LinkedIn / GitHub
  - View resume
  - Toggle reduced motion
- Focus trap + Esc to close. Recently-used actions float to top (sessionStorage).

### 6.12 Scroll progress bar

- Fixed top, 2 px tall, gradient `accent-1 → accent-2`, width = `scrollY / (scrollHeight − viewportHeight)`.

## 7. 21st.dev Magic MCP Usage Strategy

The MCP outputs JSX + Tailwind — we **translate** during execution, never paste verbatim. Per-component workflow:

1. `21st_magic_component_inspiration` — query (e.g., `"dark glass hero asymmetric with avatar card"`). Pick a reference.
2. `21st_magic_component_builder` — pass our exact context (sectionType, design tokens, content slots). Get JSX + Tailwind.
3. Translate JSX → HTML: `className` → `class`; remove `{interpolation}` and bind via `main.js` from JSON; replace `useState` with DOM event handlers in `assets/js/lib/*.js`; remove imports.
4. Paste into `index.html`, wire data, verify in browser.

Components pulled this way: **hero**, **glass nav**, **project card**, **timeline item**, **command palette**, **marquee row**, **footer**. We **do not** ask the MCP for whole-page orchestration — we own layout and section choreography.

`logo_search` is invoked once during the marquee build to grab SVG logos for every tech in `skills.json`. Output is cached locally in `assets/images/logos/` to avoid runtime network calls.

## 8. Data Model Changes

### 8.1 `projects.json`

Structure unchanged. Add `"featured": true` flag on 4–6 entries. Owner confirms which during execution. Suggested defaults: Distributed URL Shortener, AI-Agents-for-Medical-Diagnostics, Elastic Cloud Image Recognition Service, AI-KNOWLEDGE-ASSISTANT, plus 1–2 owner-chosen.

### 8.2 `uses.json` (new)

```json
{
  "editor": "VS Code",
  "shell": "zsh + starship",
  "machine": "MacBook Pro M2",
  "theme": "Catppuccin Mocha",
  "terminal": "Ghostty"
}
```

Owner confirms / corrects defaults during execution.

### 8.3 `hero.json`

- Add `"rotatingSubtitles": ["Distributed Systems", "AI Agents", "Backend Engineering"]`.
- Update `avatarUrl` → `"assets/images/avatar.jpg"`.
- Add `"openToWork": true | false`.

### 8.4 `profile.json`

Replace placeholder `bio: "Professional portfolio"` with a single real sentence written during execution (owner reviews draft).

### 8.5 `site-config.json` (new keys)

```json
"deployTimestamp": "2026-05-20T00:00:00Z"
```

## 9. Performance & Accessibility

### 9.1 Targets

| Metric | Target |
|---|---|
| Lighthouse Performance | ≥ 90 |
| Lighthouse Accessibility | ≥ 95 |
| Lighthouse Best Practices | ≥ 95 |
| Lighthouse SEO | ≥ 95 |
| Total page weight (compressed) | < 600 KB |
| LCP | < 2.5 s on 3G fast |

### 9.2 Specifics

- **Avatar:** `.jpg` ≤ 200 KB; serve as `<picture>` with AVIF fallback if implementation time allows.
- **GitHub API:** single batched call for all featured repos at section reveal; `sessionStorage` 1 h cache; static badge fallback when rate-limited (`X-RateLimit-Remaining: 0`) or offline.
- **A11y:** keyboard reachable everywhere; ⌘K palette traps focus; reduced-motion respected; AA contrast verified on `text-mid` against `bg`; semantic landmarks (`<nav>`, `<main>`, `<section>` with `aria-labelledby`).
- **SEO:** updated `<title>`, `<meta description>`, `<meta keywords>`, OG image (gradient mesh + name), JSON-LD Person schema.

## 10. Implementation Phasing (rough — writing-plans will refine)

1. **Foundation** — Tailwind CDN setup, design tokens, base layout grid, font stack, color palette plumbing, gradient-mesh background, scroll-progress, scroll-reveal harness.
2. **Hero + Nav** — asymmetric hero, glass nav, avatar placement, rotating subtitle, social row.
3. **Section restyle (no new logic)** — About, Experience, Education, Contact restyled to dark glass with new data files.
4. **Tech Stack marquee** — 21st.dev `logo_search` calls, marquee component, dual-row scrolling.
5. **Featured Projects + All-repos collapsible** — `featured.json`, project card component, GitHub stats loader, all-repos compact list.
6. **⌘K command palette** — modal, fuzzy filter, focus trap, hotkey binding.
7. **404 page + footer polish + SEO metadata.**
8. **Verification pass** — Lighthouse, manual a11y, mobile QA, reduced-motion check, GitHub API rate-limit drill.

## 11. Open Items (resolved during execution, not now)

- Pick the 4–6 featured projects.
- Rewrite the bio paragraph(s) for About.
- Confirm `uses.json` values.
- Confirm `openToWork` flag.
- Confirm Lighthouse Performance ≥ 90 is hit on a real run; if not, defer AVIF or trim animations.

---

## Appendix A — Sources

- Brainstorming session 2026-05-20 in `~/giridhar248.github.io`.
- Current site code reviewed: `index.html`, `assets/css/styles.css`, all of `data/*.json`.
- 21st.dev Magic MCP tools available: `21st_magic_component_builder`, `21st_magic_component_inspiration`, `21st_magic_component_refiner`, `logo_search`.
