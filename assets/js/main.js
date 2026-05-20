// Orchestrates dynamic content loading + light interactions for the portfolio.
// Each render function is small and isolated.

import { mountMarquee } from './lib/marquee.js';
import { hydrateGitHubStats } from './lib/github-stats.js';
import { mountCopyEmail } from './lib/copy-email.js';
import { mountCommandPalette } from './lib/command-palette.js';
import { mountScrollReveal } from './lib/scroll-reveal.js';

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

export function renderExperience(experience) {
  const items = experience.experiences ?? experience.items ?? experience ?? [];
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
    const [nav, hero, about, uses, featured, projects, experience, education, profile, siteConfig] = await Promise.all([
      loadJSON('data/navigation.json'),
      loadJSON('data/hero.json'),
      loadJSON('data/about.json'),
      loadJSON('data/uses.json'),
      loadJSON('data/featured.json'),
      loadJSON('data/projects.json'),
      loadJSON('data/experience.json'),
      loadJSON('data/education.json'),
      loadJSON('data/profile.json'),
      loadJSON('data/site-config.json'),
    ]);
    renderNav(nav.menuItems ?? nav.items ?? nav);
    renderHero(hero);
    renderAbout(about, uses);
    mountMarquee(TECH_STACK);
    renderFeaturedProjects(featured);
    hydrateGitHubStats();
    renderExperience(experience);
    renderEducation(education);
    // Dedupe by ORIGINAL projects.json title — these four entries in projects.json correspond to the featured cards above
    const FEATURED_PROJECTS_JSON_TITLES = [
      'url-shortener-service',
      'Medical-Diagnostics-With-Ai-Agent',
      'AWSight-Smart-Image-Classifier',
      'AI-KNOWLEDGE-ASSISTANT',
      'Distributed URL Shortener',
      'AI-Agents-for-Medical-Diagnostics',
      'Elastic Cloud Image Recognition Service',
    ];
    renderAllRepos(projects, FEATURED_PROJECTS_JSON_TITLES);

    // Copy-email behaviour
    mountCopyEmail(profile.contact.email);

    // Contact social icons (re-use hero socials minus the Email entry)
    $('#contactSocial').innerHTML = (hero.socialLinks ?? [])
      .filter((s) => s.platform !== 'Email')
      .map(
        (s) => `<a href="${s.url}" target="_blank" rel="noreferrer"
       class="grid h-10 w-10 place-items-center rounded-full hairline text-text-mid hover:text-text-hi hover:border-accent-1/40 transition">
       <i class="${s.icon}"></i></a>`,
      )
      .join('');

    // Footer year + deploy date
    $('#footerYear').textContent = String(siteConfig.settings?.year ?? new Date().getFullYear());
    $('#footerDeployed').textContent = (siteConfig.settings?.deployTimestamp ?? new Date().toISOString()).slice(0, 10);

    // Command palette
    const cmdkActions = [
      { label: 'Goto Projects', icon: 'fas fa-folder', hint: '#projects', run: () => { location.hash = '#projects'; } },
      { label: 'Goto About', icon: 'fas fa-circle-info', hint: '#about', run: () => { location.hash = '#about'; } },
      { label: 'Goto Experience', icon: 'fas fa-briefcase', hint: '#experience', run: () => { location.hash = '#experience'; } },
      { label: 'Goto Contact', icon: 'fas fa-envelope', hint: '#contact', run: () => { location.hash = '#contact'; } },
      { label: 'Copy email', icon: 'fas fa-copy', hint: '⏎', run: () => document.querySelector('[data-action="copy-email"]')?.click() },
      { label: 'Open GitHub', icon: 'fab fa-github', hint: '↗', run: () => window.open('https://github.com/giridhar248', '_blank') },
      { label: 'Open LinkedIn', icon: 'fab fa-linkedin', hint: '↗', run: () => window.open('https://linkedin.com/in/giridhar-reddy-46759b210/', '_blank') },
      { label: 'View resume', icon: 'fas fa-file-pdf', hint: 'pdf', run: () => window.open('documents/Giridhar_Reddy_Resume.pdf', '_blank') },
    ];
    mountCommandPalette(cmdkActions);
    mountScrollReveal();
  } catch (err) {
    console.error('Bootstrap failed:', err);
  }
});
