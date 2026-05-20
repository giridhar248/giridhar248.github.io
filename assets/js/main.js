// Orchestrates dynamic content loading + light interactions for the portfolio.
// Each render function is small and isolated.

import { mountMarquee } from './lib/marquee.js';

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

// Reusable export so later tasks can import it
export { $, $$, loadJSON, renderNav, renderHero };

const TECH_STACK = [
  { name: 'Java' },
  { name: 'Spring', logo: 'assets/images/logos/spring.svg' },
  { name: 'Python' },
  { name: 'Docker' },
  { name: 'Kubernetes', logo: 'assets/images/logos/kubernetes.svg' },
  { name: 'AWS' },
  { name: 'Redis' },
  { name: 'MySQL' },
  { name: 'Node' },
  { name: 'TypeScript' },
  { name: 'Git' },
  { name: 'GitHub', logo: 'assets/images/logos/github.svg' },
  { name: 'React' },
  { name: 'C++', logo: 'assets/images/logos/cpp.svg' },
  { name: 'FastAPI' },
  { name: 'LangChain' },
];

// Bootstrap on DOMContentLoaded
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const [nav, hero, about, uses] = await Promise.all([
      loadJSON('data/navigation.json'),
      loadJSON('data/hero.json'),
      loadJSON('data/about.json'),
      loadJSON('data/uses.json'),
    ]);
    renderNav(nav.menuItems ?? nav.items ?? nav);
    renderHero(hero);
    renderAbout(about, uses);
    mountMarquee(TECH_STACK);
  } catch (err) {
    console.error('Bootstrap failed:', err);
  }
});
