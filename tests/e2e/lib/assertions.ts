import fs from 'node:fs';
import { launchBrowser } from './cdp';
import type { PageSession, RunnerOptions, TestContext, TestTier } from './types';

export async function withPage<T>(
  ctx: TestContext,
  optionsOrFn: { width?: number; height?: number } | ((page: PageSession) => Promise<T>),
  maybeFn?: (page: PageSession) => Promise<T>
): Promise<T> {
  const opts = typeof optionsOrFn === 'function' ? undefined : optionsOrFn;
  const fn = typeof optionsOrFn === 'function' ? optionsOrFn : maybeFn!;
  const page = await ctx.browser.newPage(opts);
  try {
    return await fn(page);
  } finally {
    await page.close();
  }
}

export class E2EAssertionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'E2EAssertionError';
  }
}

export function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new E2EAssertionError(message);
  }
}

export function assertEqual<T>(actual: T, expected: T, message: string): void {
  if (actual !== expected) {
    throw new E2EAssertionError(`${message} (expected: ${String(expected)}, actual: ${String(actual)})`);
  }
}

export function assertIncludes(haystack: string, needle: string, message: string): void {
  if (!haystack.includes(needle)) {
    throw new E2EAssertionError(`${message} (missing "${needle}" in "${haystack.slice(0, 200)}")`);
  }
}

export function assertMatch(haystack: string, pattern: RegExp, message: string): void {
  if (!pattern.test(haystack)) {
    throw new E2EAssertionError(`${message} (pattern ${String(pattern)} did not match "${haystack.slice(0, 200)}")`);
  }
}

export function parseCliArgs(argv: string[]): RunnerOptions {
  const tierSet = new Set<TestTier>();
  let baseUrl: string | undefined;
  let dryRun = false;
  let selfTest = false;
  let timeoutMs = 45000;
  let verbose = false;
  let filter: string | undefined;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--dry-run') {
      dryRun = true;
    } else if (arg === '--self-test') {
      selfTest = true;
    } else if (arg === '--verbose' || arg === '-v') {
      verbose = true;
    } else if (arg.startsWith('--tier=')) {
      const raw = arg.slice('--tier='.length).trim();
      if (!raw) {
        throw new Error('Empty --tier= value. Expected 1, 2, 3, or 4.');
      }
      const parts = raw.split(',');
      for (let j = 0; j < parts.length; j++) {
        const num = Number(parts[j].trim());
        if (num !== 1 && num !== 2 && num !== 3 && num !== 4) {
          throw new Error(`Invalid tier "${parts[j]}". Allowed tiers: 1, 2, 3, 4.`);
        }
        tierSet.add(num);
      }
    } else if (arg.startsWith('--base-url=')) {
      baseUrl = arg.slice('--base-url='.length).trim().replace(/\/+$/, '');
      if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
        throw new Error(`Invalid --base-url="${baseUrl}". Must start with http:// or https://`);
      }
    } else if (arg.startsWith('--timeout=')) {
      const parsed = Number(arg.slice('--timeout='.length).trim());
      if (!Number.isFinite(parsed) || parsed <= 0) {
        throw new Error(`Invalid --timeout value in "${arg}". Must be a positive integer in ms.`);
      }
      timeoutMs = Math.floor(parsed);
    } else if (arg.startsWith('--filter=')) {
      filter = arg.slice('--filter='.length).trim();
    } else if (arg === '--help' || arg === '-h') {
      // Handled by caller if desired; keep parsing valid
    } else {
      throw new Error(`Unknown CLI flag: "${arg}"`);
    }
  }

  const tiers: TestTier[] =
    tierSet.size > 0 ? (Array.from(tierSet).sort() as TestTier[]) : [1, 2, 3, 4];

  return {
    tiers,
    baseUrl,
    dryRun,
    selfTest,
    timeoutMs,
    verbose,
    filter,
  };
}

export interface FetchedRoute {
  status: number;
  url: string;
  location: string | null;
  headers: Headers;
  html: string;
}

export async function fetchRoute(
  baseUrl: string,
  routePath: string,
  options?: { redirect?: 'manual' | 'follow'; timeoutMs?: number }
): Promise<FetchedRoute> {
  const normalizedBase = baseUrl.replace(/\/+$/, '');
  const normalizedPath = routePath.startsWith('/') ? routePath : `/${routePath}`;
  const targetUrl = `${normalizedBase}${normalizedPath}`;
  const controller = new AbortController();
  const timeoutMs = options?.timeoutMs ?? 15000;
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(targetUrl, {
      redirect: options?.redirect ?? 'follow',
      signal: controller.signal,
    });
    const html = await res.text();
    return {
      status: res.status,
      url: res.url,
      location: res.headers.get('location'),
      headers: res.headers,
      html,
    };
  } finally {
    clearTimeout(timer);
  }
}

export function decodeHtmlEntities(input: string): string {
  const named: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&#x27;': "'",
    '&apos;': "'",
    '&nbsp;': ' ',
  };

  return input
    .replace(/&(?:amp|lt|gt|quot|apos|nbsp|#39|#x27);/g, (m) => named[m] ?? m)
    .replace(/&#(\d+);/g, (_, dec) => {
      const code = Number(dec);
      return Number.isFinite(code) ? String.fromCharCode(code) : _;
    })
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
      const code = parseInt(hex, 16);
      return Number.isFinite(code) ? String.fromCharCode(code) : _;
    });
}

export function stripHtml(html: string): string {
  const withoutScripts = html
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, ' ');

  const withSpaces = withoutScripts
    .replace(/<\/(p|div|li|h[1-6]|section|article|header|footer|nav|tr|td|th|br|hr)>/gi, ' ')
    .replace(/<[^>]+>/g, ' ');

  return decodeHtmlEntities(withSpaces).replace(/\s+/g, ' ').trim();
}

export function extractTitle(html: string): string {
  const match = /<title\b[^>]*>([\s\S]*?)<\/title>/i.exec(html);
  return match ? decodeHtmlEntities(match[1]).replace(/\s+/g, ' ').trim() : '';
}

export function extractMetaDescription(html: string): string {
  const m1 = /<meta\b[^>]*name=["']description["'][^>]*content=["']([\s\S]*?)["'][^>]*>/i.exec(html);
  if (m1) return decodeHtmlEntities(m1[1]).replace(/\s+/g, ' ').trim();
  const m2 = /<meta\b[^>]*content=["']([\s\S]*?)["'][^>]*name=["']description["'][^>]*>/i.exec(html);
  return m2 ? decodeHtmlEntities(m2[1]).replace(/\s+/g, ' ').trim() : '';
}

export function extractCanonicalUrl(html: string): string {
  const m1 = /<link\b[^>]*rel=["']canonical["'][^>]*href=["']([\s\S]*?)["'][^>]*>/i.exec(html);
  if (m1) return decodeHtmlEntities(m1[1]).trim();
  const m2 = /<link\b[^>]*href=["']([\s\S]*?)["'][^>]*rel=["']canonical["'][^>]*>/i.exec(html);
  return m2 ? decodeHtmlEntities(m2[1]).trim() : '';
}

export function extractOgUrl(html: string): string {
  const m1 = /<meta\b[^>]*property=["']og:url["'][^>]*content=["']([\s\S]*?)["'][^>]*>/i.exec(html);
  if (m1) return decodeHtmlEntities(m1[1]).trim();
  const m2 = /<meta\b[^>]*content=["']([\s\S]*?)["'][^>]*property=["']og:url["'][^>]*>/i.exec(html);
  return m2 ? decodeHtmlEntities(m2[1]).trim() : '';
}

const PRODUCTION_SITE_ORIGIN = 'https://ai-life-hub-omega.vercel.app';

export function assertCanonicalAndOgUrl(
  html: string,
  expectedCanonicalPath: string,
  contextLabel: string
): void {
  const normalizedPath = expectedCanonicalPath === '/' ? '' : expectedCanonicalPath.replace(/\/+$/, '');
  const expectedUrl = `${PRODUCTION_SITE_ORIGIN}${normalizedPath}`;
  const canonical = extractCanonicalUrl(html).replace(/\/+$/, '');
  const ogUrl = extractOgUrl(html).replace(/\/+$/, '');

  assert(
    !html.includes('https://ai-life-hub.vercel.app/'),
    `[${contextLabel}] Must never emit stale non-omega domain https://ai-life-hub.vercel.app/`
  );
  assertEqual(
    canonical,
    expectedUrl,
    `[${contextLabel}] <link rel="canonical"> must match expected production URL`
  );
  assertEqual(
    ogUrl,
    expectedUrl,
    `[${contextLabel}] <meta property="og:url"> must match expected canonical URL`
  );
}

export interface JargonRule {
  label: string;
  pattern: RegExp;
}

export const FORBIDDEN_ACADEMIC_JARGON: JargonRule[] = [
  { label: 'epistemic', pattern: /\bepistemic\b/i },
  { label: 'dim analysis / dimensional analysis', pattern: /\bdim(?:ensional)?\s+analysis\b/i },
  { label: 'boundary engine', pattern: /\bboundary\s+engine\b/i },
  { label: 'reality constraint engine', pattern: /\breality\s+constraint\s+engine\b/i },
  { label: 'chernov', pattern: /\bchernov\b/i },
  { label: 'MAC/TE', pattern: /\bmac\/te\b/i },
  { label: 'sVirt', pattern: /\bsvirt\b/i },
  { label: 'audit2allow', pattern: /\baudit2allow\b/i },
  { label: 'k_cov / $K_{cov}$', pattern: /\bk_cov\b|\$k_\{cov\}\$/i },
  { label: 'w_tc / $W_{tc}$', pattern: /\bw_tc\b|\$w_\{tc\}\$/i },
  { label: 'anti-hallucination', pattern: /\banti-hallucination\b/i },
  { label: 'hallucination / hallucinate', pattern: /\bhallucinat(?:e|es|ed|ing|ion|ions)\b/i },
  { label: 'ăn饭', pattern: /ăn饭/iu },
  { label: 'game暴力', pattern: /game暴力/i },
];

export const FORBIDDEN_COMMON_MICROCOPY: string[] = [
  'Skip to main content',
  'Loading theme...',
  'Close menu',
  'Submit Tool',
  'My Favorites',
  'Search Results',
  'Recent searches',
  'Clear all filters',
  'No results found',
  'Interactive Knowledge Assessment',
  'Agent Template',
  'Select example',
  'Prompt Engineering Transformer',
  'Production-Ready',
  'Structure: Production-Ready',
  'Guardrails: Active',
  'CoT: Enabled',
  'CREATE: Full',
  'Meta-Prompt Engineering Suite',
  'System Prompt Studio & Architect',
  'System Prompt Studio & Generator',
  '(Identity / Persona)',
  '(Mission & Scope)',
  '(Tone & Style)',
  '(Negative Constraints / Guardrails)',
  '(Output Format)',
  'Prompt Preview',
  'Interactive LLM Cost Simulator',
  'AI Model Matrix & Comparison Arena',
  'AI Model Matrix & Benchmark Arena',
  'Enterprise AI Agent Blueprints & Templates',
  'Production AI Agent Blueprints',
  'Interactive AI Sandbox',
  'Chạy Prompt (Run)',
  'AI Output Terminal',
  'Multi-Agent Workflow Pipelines',
  'AI Engineering & Prompt Cheatsheet',
  'Master Playbooks',
  'Local Workstation Projects (Ổ D)',
  'Windows 11 Local-First',
  'D:\\AI_Knowledge_Lab',
  'D:\\Reality_Science',
  'D:\\Telegram_AI_Tool',
  'Grandmaster Prompt Architect',
  'Senior AI Practitioner',
  'AI Explorer',
  'Apprentice in Training',
];

export const FORBIDDEN_TOOLS_MICROCOPY: string[] = [
  'Production-Ready',
  'Chain-of-Thought (CoT)',
  'Popular',
  'High Value',
  'Top Reasoning',
  'Huge Context',
  'Ultra Cheap',
  'Budget Beast',
  'Open Reasoning',
  'Requests / Ngày',
];

export const FORBIDDEN_COMPARE_MICROCOPY: string[] = [
  'Proprietary',
  'Open Weights',
  'Ultra-Fast',
  'Deliberate (Reasoning)',
  'Software Engineering & Autonomous Agents',
  'High-Throughput APIs & Subagents',
  'Multimodal General Intelligence',
  'Deep Reasoning & Complex Math/Algorithms',
  'Best Value / Cost-Efficiency Champion',
  'Open-Weights Deep Reasoning',
  'Mega Context & Long Video/Document Analysis',
  'Real-time Agents & Sub-second Search',
  'Self-Hosted Private Deployments',
  'Local AI Coding Assistant',
];

export const FORBIDDEN_ECOSYSTEM_MICROCOPY: string[] = [
  'Production Ready',
  'Fully Verified',
  'Active Knowledge',
];

export const FORBIDDEN_WORKFLOW_MICROCOPY: string[] = [
  'Content Factory 360° Pipeline',
  'Full-Stack Feature Architecture',
  'Deep Research & Fact-Check Audit',
  'Product MVP & Go-To-Market Sprint',
  'Critical Reviewer',
];

export const RAW_CATEGORY_SLUGS: string[] = [
  'cong-viec',
  'giao-duc-con',
  'lap-trinh',
  'hoc-tap',
  'viet-lach',
  'tai-chinh',
  'suc-khoe',
  'phap-ly',
  'thiet-ke',
  'du-lich',
  'nha-cua',
  'gia-dinh',
  'side-project',
  'nghien-cuu',
  'giai-tri',
];

export const RAW_RESOURCE_SLUGS: string[] = [
  'article',
  'video',
  'course',
  'tool',
  'paper',
  'newsletter',
  'glossary',
  'template',
];

export function findAcademicJargonViolations(text: string): string[] {
  const hits: string[] = [];
  for (let i = 0; i < FORBIDDEN_ACADEMIC_JARGON.length; i++) {
    const rule = FORBIDDEN_ACADEMIC_JARGON[i];
    if (rule.pattern.test(text)) {
      hits.push(rule.label);
    }
  }
  return hits;
}

export function assertNoAcademicJargon(text: string, contextLabel: string): void {
  const hits = findAcademicJargonViolations(text);
  if (hits.length > 0) {
    throw new E2EAssertionError(
      `[${contextLabel}] Found forbidden academic jargon: ${hits.join(', ')}`
    );
  }
}

export function assertNoCjkNoise(text: string, contextLabel: string): void {
  const foreignMatch = /[\u4e00-\u9fff\uac00-\ud7af\u1100-\u11ff\u3130-\u318f\u3040-\u30ff\u0600-\u06ff\u0400-\u04ff\ufffd]+/u.exec(
    text
  );
  if (foreignMatch) {
    throw new E2EAssertionError(
      `[${contextLabel}] Found unexpected non-Vietnamese foreign/corrupted characters: "${foreignMatch[0]}"`
    );
  }
}

export function findUntranslatedMicrocopy(text: string, forbiddenList: string[]): string[] {
  const lower = text.toLowerCase();
  const hits: string[] = [];
  for (let i = 0; i < forbiddenList.length; i++) {
    const term = forbiddenList[i];
    if (term.length <= 12 && /^[A-Za-z0-9\s\-/]+$/.test(term)) {
      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = new RegExp(`(?:^|[^A-Za-z0-9])${escaped}(?:$|[^A-Za-z0-9])`, 'i');
      if (re.test(text)) hits.push(term);
    } else if (lower.includes(term.toLowerCase())) {
      hits.push(term);
    }
  }
  return hits;
}

export function assertNoUntranslatedMicrocopy(
  text: string,
  extraForbidden: string[],
  contextLabel: string
): void {
  const combined = FORBIDDEN_COMMON_MICROCOPY.concat(extraForbidden);
  const hits = findUntranslatedMicrocopy(text, combined);
  if (hits.length > 0) {
    throw new E2EAssertionError(
      `[${contextLabel}] Found untranslated English UI micro-copy: ${hits.join(', ')}`
    );
  }
}

export function assertNoRawCategorySlugs(visibleLabels: string[], contextLabel: string): void {
  const slugSet = new Set(RAW_CATEGORY_SLUGS);
  const bad: string[] = [];
  for (let i = 0; i < visibleLabels.length; i++) {
    const trimmed = visibleLabels[i].trim().toLowerCase();
    if (slugSet.has(trimmed)) {
      bad.push(trimmed);
    }
  }
  if (bad.length > 0) {
    throw new E2EAssertionError(
      `[${contextLabel}] Raw category slugs rendered in UI instead of Vietnamese labels: ${bad.join(', ')}`
    );
  }
}

export function assertNoStandaloneCoT(text: string, contextLabel: string): void {
  if (/\bcot\b/i.test(text)) {
    throw new E2EAssertionError(
      `[${contextLabel}] Found standalone technical abbreviation "CoT"/"cot" on Everyday route`
    );
  }
}

export function assertNoRawResourceSlugs(visibleLabels: string[], contextLabel: string): void {
  const nonVideoSlugs = new Set(RAW_RESOURCE_SLUGS.filter((s) => s !== 'video'));
  const bad: string[] = [];
  for (let i = 0; i < visibleLabels.length; i++) {
    const trimmed = visibleLabels[i].trim();
    if (!trimmed) continue;
    if (trimmed === 'Video') continue; // RESOURCE_TYPE_LABELS.video === 'Video'
    const lower = trimmed.toLowerCase();
    if (trimmed === 'video' || nonVideoSlugs.has(lower)) {
      bad.push(trimmed);
    }
  }
  if (bad.length > 0) {
    throw new E2EAssertionError(
      `[${contextLabel}] Raw resource type slugs rendered in UI instead of RESOURCE_TYPE_LABELS: ${bad.join(', ')}`
    );
  }
}

export async function assertNoHeaderOverlap(
  page: PageSession,
  contextLabel: string,
  targetSelector?: string
): Promise<void> {
  const selJson = targetSelector ? JSON.stringify(targetSelector) : 'null';
  const metrics = await page.evaluate<{
    hasHeader: boolean;
    headerBottom: number;
    hasTarget: boolean;
    targetTop: number;
    targetDesc: string;
  }>(`(() => {
    const header = document.querySelector('header');
    if (!header) {
      return { hasHeader: false, headerBottom: 0, hasTarget: false, targetTop: 0, targetDesc: '' };
    }
    const hRect = header.getBoundingClientRect();
    let target = ${selJson} ? document.querySelector(${selJson}) : null;
    if (!target) {
      const candidates = [
        'main nav[aria-label="Breadcrumb"]',
        'main nav[aria-label*="Điều hướng"]',
        'main header',
        'main h1',
        'main section > div',
        'main > div',
        'h1'
      ];
      for (let i = 0; i < candidates.length; i++) {
        const el = document.querySelector(candidates[i]);
        if (el) {
          const r = el.getBoundingClientRect();
          if (r.height > 0 && r.width > 0) {
            target = el;
            break;
          }
        }
      }
    }
    if (!target) {
      return { hasHeader: true, headerBottom: hRect.bottom, hasTarget: false, targetTop: 0, targetDesc: '' };
    }
    const tRect = target.getBoundingClientRect();
    return {
      hasHeader: true,
      headerBottom: hRect.bottom,
      hasTarget: true,
      targetTop: tRect.top,
      targetDesc: target.tagName + (target.className ? '.' + String(target.className).split(' ')[0] : '')
    };
  })()`);

  assert(metrics.hasHeader, `[${contextLabel}] Expected <header> element to be rendered`);
  assert(metrics.hasTarget, `[${contextLabel}] Expected visible main/heading target to measure header spacing`);
  assert(
    metrics.targetTop >= metrics.headerBottom - 2,
    `[${contextLabel}] Fixed header overlaps content (${metrics.targetDesc}): targetTop=${metrics.targetTop.toFixed(1)}px < headerBottom=${metrics.headerBottom.toFixed(1)}px`
  );
}

export async function assertNoHorizontalOverflow(page: PageSession, contextLabel: string): Promise<void> {
  const dims = await page.evaluate<{ scrollWidth: number; clientWidth: number; innerWidth: number }>(
    '({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth, innerWidth: window.innerWidth })'
  );
  const viewportWidth = Math.min(dims.clientWidth, dims.innerWidth);
  assert(
    dims.scrollWidth <= viewportWidth + 1,
    `[${contextLabel}] Horizontal overflow detected: scrollWidth=${dims.scrollWidth}px > viewportWidth=${viewportWidth}px (clientWidth=${dims.clientWidth}px, innerWidth=${dims.innerWidth}px)`
  );
}

export function assertNoPageErrors(page: PageSession, contextLabel: string): void {
  const pageErrors = page.getPageErrors();
  assert(
    pageErrors.length === 0,
    `[${contextLabel}] Uncaught runtime page errors: ${pageErrors.join(' | ')}`
  );
}

export const FIND_PROMPT_BUILDER_MODAL_JS = `(() => {
  const dialog = document.querySelector('[role="dialog"]');
  if (dialog && dialog.querySelector('pre, select')) return dialog;
  const fixedOverlays = Array.from(document.querySelectorAll('body > div, main div')).filter((el) => {
    const style = window.getComputedStyle(el);
    return style.position === 'fixed' && el.getBoundingClientRect().height > 100 && Boolean(el.querySelector('pre, select'));
  });
  return fixedOverlays[0] || dialog || null;
})()`;

export async function clickButtonByPattern(
  page: PageSession,
  containerSelector: string,
  pattern: RegExp,
  options?: { allowDisabled?: boolean }
): Promise<void> {
  const selJson = JSON.stringify(containerSelector);
  const srcJson = JSON.stringify(pattern.source);
  const flagsJson = JSON.stringify(pattern.flags.replace(/g/g, ''));
  const allowDisabled = Boolean(options?.allowDisabled);

  const res = await page.evaluate<{ ok: boolean; reason?: string }>(`(() => {
    const root = document.querySelector(${selJson});
    if (!root) return { ok: false, reason: 'Container not found: ' + ${selJson} };
    const re = new RegExp(${srcJson}, ${flagsJson});
    const btns = Array.from(root.querySelectorAll('button'));
    const matchesBtn = (b) => [
      b.innerText,
      b.textContent,
      b.getAttribute('aria-label'),
      b.getAttribute('title')
    ].some((s) => re.test((s || '').trim()));
    const labelOf = (b) => (b.innerText || b.textContent || b.getAttribute('aria-label') || b.getAttribute('title') || '').trim();
    const visible = btns.find((b) => {
      const r = b.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && matchesBtn(b);
    });
    const target = visible || btns.find((b) => matchesBtn(b));
    if (!target) {
      return { ok: false, reason: 'No button matching ' + ${srcJson} + ' inside ' + ${selJson} };
    }
    if (!${allowDisabled} && target.disabled) {
      return { ok: false, reason: 'Matched button is disabled (' + labelOf(target) + ')' };
    }
    target.scrollIntoView({ block: 'center', inline: 'center' });
    target.click();
    return { ok: true };
  })()`);

  if (!res.ok) {
    throw new E2EAssertionError(res.reason ?? `clickButtonByPattern failed for ${containerSelector}`);
  }
  await new Promise((r) => setTimeout(r, 80));
}

export async function clickModalButtonByPattern(page: PageSession, pattern: RegExp): Promise<void> {
  const srcJson = JSON.stringify(pattern.source);
  const flagsJson = JSON.stringify(pattern.flags.replace(/g/g, ''));

  const res = await page.evaluate<{ ok: boolean; reason?: string }>(`(() => {
    const modal = ${FIND_PROMPT_BUILDER_MODAL_JS};
    if (!modal) return { ok: false, reason: 'PromptBuilder modal not found' };
    const re = new RegExp(${srcJson}, ${flagsJson});
    const btns = Array.from(modal.querySelectorAll('button'));
    const matchesBtn = (b) => [
      b.innerText,
      b.textContent,
      b.getAttribute('aria-label'),
      b.getAttribute('title')
    ].some((s) => re.test((s || '').trim()));
    const labelOf = (b) => (b.innerText || b.textContent || b.getAttribute('aria-label') || b.getAttribute('title') || '').trim();
    const visible = btns.find((b) => {
      const r = b.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && matchesBtn(b);
    });
    const target = visible || btns.find((b) => matchesBtn(b));
    if (!target) {
      return { ok: false, reason: 'No modal button matching ' + ${srcJson} };
    }
    if (target.disabled) {
      return { ok: false, reason: 'Modal button is disabled: ' + labelOf(target) };
    }
    target.scrollIntoView({ block: 'center', inline: 'center' });
    target.click();
    return { ok: true };
  })()`);

  if (!res.ok) {
    throw new E2EAssertionError(res.reason ?? 'clickModalButtonByPattern failed');
  }
  await new Promise((r) => setTimeout(r, 80));
}

export async function runPlaygroundAndWait(page: PageSession, timeoutMs: number = 15000): Promise<void> {
  const initialMainLen = await page.evaluate<number>(
    `(document.querySelector('main')?.innerText || '').trim().length`
  );
  await clickButtonByPattern(page, 'main', /chạy prompt|chạy thử|chạy mô phỏng|^chạy$/i);
  await page.waitForFunction(
    `(() => {
      const btns = Array.from(document.querySelectorAll('main button'));
      const candidates = (b) => [
        b.innerText,
        b.textContent,
        b.getAttribute('aria-label'),
        b.getAttribute('title')
      ].map((s) => (s || '').trim());
      const matches = (b, re) => candidates(b).some((s) => re.test(s));
      const copyBtn = btns.find((b) => matches(b, /sao chép.*kết quả|sao chép/i) && !matches(b, /hệ thống/i));
      const dlBtn = btns.find((b) => matches(b, /tải.*markdown|tải.*\\.md|markdown/i));
      const runBtn = btns.find((b) => matches(b, /chạy prompt|chạy thử|chạy mô phỏng|^chạy$/i));
      const stillRunning = btns.some((b) => b.disabled && matches(b, /đang thực thi|đang chạy/i));
      const nowLen = (document.querySelector('main')?.innerText || '').trim().length;
      const hasReadyButtons = Boolean(copyBtn && !copyBtn.disabled && dlBtn && !dlBtn.disabled);
      const runReenabled = Boolean(runBtn && !runBtn.disabled) && !stillRunning;
      const hasSubstantialOutput = nowLen >= ${initialMainLen} + 50;
      return hasReadyButtons && runReenabled && hasSubstantialOutput;
    })()`,
    timeoutMs
  );
}

export async function runSelfTest(): Promise<void> {
  // 1. CLI flag parser checks
  const defOpts = parseCliArgs([]);
  assertEqual(defOpts.tiers.join(','), '1,2,3,4', 'Default tiers should be 1,2,3,4');
  assertEqual(defOpts.dryRun, false, 'Default dryRun should be false');

  const customOpts = parseCliArgs([
    '--tier=2,4',
    '--base-url=http://127.0.0.1:4123/',
    '--dry-run',
    '--timeout=60000',
  ]);
  assertEqual(customOpts.tiers.join(','), '2,4', 'Custom --tier=2,4 parsed');
  assertEqual(customOpts.baseUrl, 'http://127.0.0.1:4123', 'Trailing slash stripped from --base-url');
  assertEqual(customOpts.dryRun, true, '--dry-run flag parsed');
  assertEqual(customOpts.timeoutMs, 60000, '--timeout flag parsed');

  let invalidTierThrew = false;
  try {
    parseCliArgs(['--tier=9']);
  } catch {
    invalidTierThrew = true;
  }
  assert(invalidTierThrew, 'Invalid --tier=9 must throw');

  // 2. HTML extraction & entity decoding checks
  const sampleHtml = `<!doctype html><html><head><title>AI Life Hub &amp; Tools</title>
    <meta name="description" content="Hướng dẫn AI &quot;thực chiến&quot; cho mọi người">
    <style>.a{color:red}</style><script>const epistemic = "ignored";</script></head>
    <body><h1>Xin chào &amp; Chào mừng</h1><p>Công cụ hữu ích</p></body></html>`;
  assertEqual(extractTitle(sampleHtml), 'AI Life Hub & Tools', 'extractTitle decodes HTML entities');
  assertEqual(
    extractMetaDescription(sampleHtml),
    'Hướng dẫn AI "thực chiến" cho mọi người',
    'extractMetaDescription decodes quotes'
  );
  const stripped = stripHtml(sampleHtml);
  assert(!stripped.includes('ignored'), 'stripHtml removes <script> content');
  assert(!stripped.includes('color:red'), 'stripHtml removes <style> content');
  assertIncludes(stripped, 'Xin chào & Chào mừng', 'stripHtml preserves visible text');

  // 3. Jargon / micro-copy / raw slug detector checks (positive + negative)
  assertNoAcademicJargon(
    'Trợ lý AI dùng Next.js, ChatGPT, Claude, DeepSeek, System Prompt và Token có giải thích đơn giản.',
    'self-test-clean-jargon'
  );
  assertNoUntranslatedMicrocopy(
    'Trang chủ AI Life Hub hỗ trợ ChatGPT, Claude, XML, JSON và API chuẩn xác.',
    FORBIDDEN_TOOLS_MICROCOPY,
    'self-test-clean-microcopy'
  );
  assertNoRawCategorySlugs(['Công việc & Nghề nghiệp', 'Tất cả'], 'self-test-clean-slugs');
  assertNoRawResourceSlugs(['Video', 'Công cụ', 'Bài viết'], 'self-test-clean-resource-video');
  assertNoStandaloneCoT('Hướng dẫn suy luận từng bước dễ hiểu cho mọi người', 'self-test-clean-cot');

  let jargonCaught = false;
  try {
    assertNoAcademicJargon('Hệ thống Epistemic Boundary Engine và Chernov $K_{cov}$', 'self-test-bad-jargon');
  } catch {
    jargonCaught = true;
  }
  assert(jargonCaught, 'assertNoAcademicJargon must reject academic jargon');

  let capitalAnfanCaught = false;
  try {
    assertNoAcademicJargon('Ăn饭', 'self-test-capital-anfan');
  } catch {
    capitalAnfanCaught = true;
  }
  assert(capitalAnfanCaught, 'assertNoAcademicJargon must catch capitalized "Ăn饭"');

  let cjkCaught = false;
  try {
    assertNoCjkNoise('Thói quen ăn饭 và chơi Game暴力', 'self-test-cjk');
  } catch {
    cjkCaught = true;
  }
  assert(cjkCaught, 'assertNoCjkNoise must reject CJK characters');

  for (const [label, sample] of [
    ['Hangul', 'Sách tạp 넷'],
    ['Kana', 'Hướng dẫn テスト'],
    ['Arabic', 'Nội dung هنا mẫu'],
    ['Cyrillic', 'Chiến lược стратегия'],
    ['ReplacementChar', 'Ký tự lỗi \ufffd'],
  ] as const) {
    let caught = false;
    try {
      assertNoCjkNoise(sample, `self-test-${label}`);
    } catch {
      caught = true;
    }
    assert(caught, `assertNoCjkNoise must reject ${label} characters`);
  }
  assertNoCjkNoise('Phát âm chuẩn tiếng Việt có dấu ă â đ ê ô ơ ư và ö', 'self-test-clean-diacritics');

  let microcopyCaught = false;
  try {
    assertNoUntranslatedMicrocopy('Interactive LLM Cost Simulator & Popular', FORBIDDEN_TOOLS_MICROCOPY, 'self-test-micro');
  } catch {
    microcopyCaught = true;
  }
  assert(microcopyCaught, 'assertNoUntranslatedMicrocopy must reject untranslated UI strings');

  let aiExplorerCaught = false;
  try {
    assertNoUntranslatedMicrocopy('Danh hiệu: AI Explorer', [], 'self-test-ai-explorer');
  } catch {
    aiExplorerCaught = true;
  }
  assert(aiExplorerCaught, 'assertNoUntranslatedMicrocopy must reject "AI Explorer"');

  let prodReadyCaught = false;
  try {
    assertNoUntranslatedMicrocopy('Mẫu Production-Ready cho bạn', [], 'self-test-prod-ready');
  } catch {
    prodReadyCaught = true;
  }
  assert(prodReadyCaught, 'assertNoUntranslatedMicrocopy must reject "Production-Ready"');

  let cotCaught = false;
  try {
    assertNoStandaloneCoT('Kích hoạt kỹ thuật CoT ngay', 'self-test-bad-cot');
  } catch {
    cotCaught = true;
  }
  assert(cotCaught, 'assertNoStandaloneCoT must reject standalone "CoT"');

  let lowerCotCaught = false;
  try {
    assertNoStandaloneCoT('Kỹ năng cot reasoning', 'self-test-bad-lower-cot');
  } catch {
    lowerCotCaught = true;
  }
  assert(lowerCotCaught, 'assertNoStandaloneCoT must reject lowercase standalone "cot"');

  const sampleSeoHtml = `<head><link rel="canonical" href="https://ai-life-hub-omega.vercel.app/about"/><meta property="og:url" content="https://ai-life-hub-omega.vercel.app/about"/></head>`;
  assertCanonicalAndOgUrl(sampleSeoHtml, '/about', 'self-test-seo-ok');
  let badSeoCaught = false;
  try {
    assertCanonicalAndOgUrl(sampleSeoHtml, '/terms', 'self-test-seo-mismatch');
  } catch {
    badSeoCaught = true;
  }
  assert(badSeoCaught, 'assertCanonicalAndOgUrl must reject mismatched canonical/og:url path');

  let rawSlugCaught = false;
  try {
    assertNoRawCategorySlugs(['Tất cả', 'cong-viec'], 'self-test-raw-slug');
  } catch {
    rawSlugCaught = true;
  }
  assert(rawSlugCaught, 'assertNoRawCategorySlugs must reject raw slug cong-viec');

  let rawVideoCaught = false;
  try {
    assertNoRawResourceSlugs(['video'], 'self-test-raw-video');
  } catch {
    rawVideoCaught = true;
  }
  assert(rawVideoCaught, 'assertNoRawResourceSlugs must reject raw lowercase "video"');

  let rawArticleCaught = false;
  try {
    assertNoRawResourceSlugs(['article'], 'self-test-raw-article');
  } catch {
    rawArticleCaught = true;
  }
  assert(rawArticleCaught, 'assertNoRawResourceSlugs must reject raw "article"');

  // 4. Real headless CDP browser smoke check + mobile 375x812 overflow regression + temp-dir cleanup
  const browser = await launchBrowser();
  const tempDir = browser.userDataDir;
  assert(fs.existsSync(tempDir), 'Browser userDataDir must exist while running');

  try {
    const page = await browser.newPage({ width: 1280, height: 800 });
    const htmlDoc = `<!doctype html><html><head><style>
      body { margin: 0; font-family: sans-serif; }
      header { position: fixed; top: 0; left: 0; right: 0; height: 62px; background: #111; color: #fff; }
      main { padding-top: 96px; }
    </style></head><body>
      <header><nav>AI Life Hub</nav></header>
      <main>
        <h1>Xin chào Việt Nam</h1>
        <input id="txt" type="text" value="" />
        <input id="rng" type="range" min="0" max="100" value="20" />
        <button id="btn" onclick="document.getElementById('out').textContent = document.getElementById('txt').value + ':' + document.getElementById('rng').value">Chạy</button>
        <div id="out"></div>
        <button id="copy-btn" type="button" aria-label="Sao chép câu lệnh" onclick="document.getElementById('btn-out').textContent += 'copied;'">Sao chép</button>
        <button id="del-btn" type="button" onclick="document.getElementById('btn-out').textContent += 'deleted;'">Xóa</button>
        <div id="btn-out"></div>
      </main>
    </body></html>`;
    await page.goto(`data:text/html;charset=utf-8,${encodeURIComponent(htmlDoc)}`);
    await assertNoHeaderOverlap(page, 'self-test-cdp');
    await assertNoHorizontalOverflow(page, 'self-test-cdp');
    await page.fill('#txt', 'Kiểm thử');
    await page.setRangeValue('#rng', 75);
    await page.click('#btn');
    const out = await page.textContent('#out');
    assertEqual(out.trim(), 'Kiểm thử:75', 'CDP fill, setRangeValue, and click must update DOM');
    await clickButtonByPattern(page, 'main', /^sao chép$/i);
    await clickButtonByPattern(page, 'main', /^xóa$/i);
    const btnOut = await page.textContent('#btn-out');
    assertEqual(
      btnOut.trim(),
      'copied;deleted;',
      'clickButtonByPattern must match anchored ^...$ regexes against individual candidate labels'
    );
    assertNoPageErrors(page, 'self-test-cdp');
    await page.close();

    // Mobile 375x812 overflow regression check with viewport meta
    const mobilePage = await browser.newPage({ width: 375, height: 812 });
    const mobileOverflowHtml = `<!doctype html><html><head>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>body { margin: 0; }</style>
    </head><body>
      <main><div style="width: 520px; height: 24px;">Overflow 520px</div></main>
    </body></html>`;
    await mobilePage.goto(`data:text/html;charset=utf-8,${encodeURIComponent(mobileOverflowHtml)}`);
    let mobileOverflowCaught = false;
    try {
      await assertNoHorizontalOverflow(mobilePage, 'self-test-mobile-overflow');
    } catch {
      mobileOverflowCaught = true;
    }
    assert(
      mobileOverflowCaught,
      'assertNoHorizontalOverflow must throw on 375x812 viewport when a 520px element overflows'
    );
    await mobilePage.close();
  } finally {
    await browser.close();
  }

  assert(!fs.existsSync(tempDir), `Temp browser profile dir must be deleted on close: ${tempDir}`);
}
