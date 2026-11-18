import fs from 'node:fs';
import path from 'node:path';
import {
  assert,
  assertCanonicalAndOgUrl,
  assertEqual,
  assertIncludes,
  assertNoAcademicJargon,
  assertNoCjkNoise,
  assertNoHeaderOverlap,
  assertNoHorizontalOverflow,
  assertNoPageErrors,
  assertNoRawCategorySlugs,
  assertNoRawResourceSlugs,
  assertNoStandaloneCoT,
  assertNoUntranslatedMicrocopy,
  clickButtonByPattern,
  extractMetaDescription,
  extractTitle,
  fetchRoute,
  FIND_PROMPT_BUILDER_MODAL_JS,
  FORBIDDEN_COMPARE_MICROCOPY,
  FORBIDDEN_ECOSYSTEM_MICROCOPY,
  FORBIDDEN_TOOLS_MICROCOPY,
  FORBIDDEN_WORKFLOW_MICROCOPY,
  stripHtml,
  withPage,
} from '../lib/assertions';
import type { TestCase } from '../lib/types';
import { resolveTagLabel, TAG_LABELS } from '../../../src/lib/constants';

async function auditRouteHttpAndCopy(
  baseUrl: string,
  routePath: string,
  extraForbidden: string[],
  label: string
): Promise<number> {
  const res = await fetchRoute(baseUrl, routePath);
  assertEqual(res.status, 200, `[${label}] Route ${routePath} must return HTTP 200`);
  const title = extractTitle(res.html);
  const metaDesc = extractMetaDescription(res.html);
  const bodyText = stripHtml(res.html);
  const combined = `${title} ${metaDesc} ${bodyText}`;
  assertNoAcademicJargon(combined, `${label}:${routePath}`);
  assertNoCjkNoise(combined, `${label}:${routePath}`);
  assertNoUntranslatedMicrocopy(combined, extraForbidden, `${label}:${routePath}`);
  return 4;
}

export const tier2Tests: TestCase[] = [
  // =========================================================================
  // FEATURE #1 BOUNDARIES: Fixed-Header & Viewport Extremes (5 tests)
  // =========================================================================
  {
    id: 'T2-F01-1',
    tier: 2,
    featureArea: 'F01-FixedHeaderLayout',
    name: 'Mobile 375x812 zero header overlap & zero overflow on Everyday routes',
    description: 'Checks /prompts, /categories, /category/cong-viec, /skill/soan-thao-email-chuyen-nghiep at 375x812.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 375, height: 812 }, async (page) => {
        const routes = ['/prompts', '/categories', '/category/cong-viec', '/skill/soan-thao-email-chuyen-nghiep'];
        for (let i = 0; i < routes.length; i++) {
          await page.goto(`${ctx.baseUrl}${routes[i]}`);
          await assertNoHeaderOverlap(page, `T2-F01-1:${routes[i]}`);
          await assertNoHorizontalOverflow(page, `T2-F01-1:${routes[i]}`);
        }
        return routes.length * 2;
      });
    },
  },
  {
    id: 'T2-F01-2',
    tier: 2,
    featureArea: 'F01-FixedHeaderLayout',
    name: 'Mobile 375x812 zero header overlap & zero overflow on Search/Resources/Favorites/Submit',
    description: 'Checks /search, /resources, /favorites, /submit, /learn/quiz at 375x812.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 375, height: 812 }, async (page) => {
        const routes = ['/search', '/resources', '/favorites', '/submit', '/learn/quiz'];
        for (let i = 0; i < routes.length; i++) {
          await page.goto(`${ctx.baseUrl}${routes[i]}`);
          await assertNoHeaderOverlap(page, `T2-F01-2:${routes[i]}`);
          await assertNoHorizontalOverflow(page, `T2-F01-2:${routes[i]}`);
        }
        return routes.length * 2;
      });
    },
  },
  {
    id: 'T2-F01-3',
    tier: 2,
    featureArea: 'F01-FixedHeaderLayout',
    name: 'Mobile 375x812 zero header overlap & zero overflow on Builder Tools',
    description: 'Checks /tools/prompt-optimizer, /tools/system-prompt-builder, /tools/token-calculator at 375x812.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 375, height: 812 }, async (page) => {
        const routes = ['/tools/prompt-optimizer', '/tools/system-prompt-builder', '/tools/token-calculator'];
        for (let i = 0; i < routes.length; i++) {
          await page.goto(`${ctx.baseUrl}${routes[i]}`);
          await assertNoHeaderOverlap(page, `T2-F01-3:${routes[i]}`);
          await assertNoHorizontalOverflow(page, `T2-F01-3:${routes[i]}`);
        }
        return routes.length * 2;
      });
    },
  },
  {
    id: 'T2-F01-4',
    tier: 2,
    featureArea: 'F01-FixedHeaderLayout',
    name: 'Mobile 375x812 zero header overlap & zero overflow on Compare/Agents/Workflows/Playground',
    description: 'Checks /compare, /agents, /workflows, /playground, /playbooks, /cheatsheet, /ecosystem at 375x812.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 375, height: 812 }, async (page) => {
        const routes = ['/compare', '/agents', '/workflows', '/playground', '/playbooks', '/cheatsheet', '/ecosystem'];
        for (let i = 0; i < routes.length; i++) {
          await page.goto(`${ctx.baseUrl}${routes[i]}`);
          await assertNoHeaderOverlap(page, `T2-F01-4:${routes[i]}`);
          await assertNoHorizontalOverflow(page, `T2-F01-4:${routes[i]}`);
        }
        return routes.length * 2;
      });
    },
  },
  {
    id: 'T2-F01-5',
    tier: 2,
    featureArea: 'F01-FixedHeaderLayout',
    name: 'Mobile 375x812 zero header overlap & zero overflow on static pages',
    description: 'Checks /about, /contact, /privacy, /terms at 375x812.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 375, height: 812 }, async (page) => {
        const routes = ['/about', '/contact', '/privacy', '/terms'];
        for (let i = 0; i < routes.length; i++) {
          await page.goto(`${ctx.baseUrl}${routes[i]}`);
          await assertNoHeaderOverlap(page, `T2-F01-5:${routes[i]}`);
          await assertNoHorizontalOverflow(page, `T2-F01-5:${routes[i]}`);
        }
        return routes.length * 2;
      });
    },
  },

  // =========================================================================
  // FEATURE #2 BOUNDARIES: Redirects, Invalid Routes & Chrome Audit (5 tests)
  // =========================================================================
  {
    id: 'T2-F02-1',
    tier: 2,
    featureArea: 'F02-HeaderFooterChrome',
    name: 'next.config.js permanent redirects /skills & /skill -> /categories (301/308)',
    description: 'Verifies /skills and /skill return 301/308 pointing to /categories.',
    run: async (ctx) => {
      const sources = ['/skills', '/skill'];
      for (let i = 0; i < sources.length; i++) {
        const res = await fetchRoute(ctx.baseUrl, sources[i], { redirect: 'manual' });
        assert(res.status === 301 || res.status === 308, `${sources[i]} must return 301/308, got ${res.status}`);
        assert(res.location && res.location.includes('/categories'), `${sources[i]} must redirect to /categories (got ${String(res.location)})`);
      }
      return 4;
    },
  },
  {
    id: 'T2-F02-2',
    tier: 2,
    featureArea: 'F02-HeaderFooterChrome',
    name: 'next.config.js permanent redirects /tools & /tool -> /tools/system-prompt-builder',
    description: 'Verifies /tools and /tool return 301/308 pointing to /tools/system-prompt-builder.',
    run: async (ctx) => {
      const sources = ['/tools', '/tool'];
      for (let i = 0; i < sources.length; i++) {
        const res = await fetchRoute(ctx.baseUrl, sources[i], { redirect: 'manual' });
        assert(res.status === 301 || res.status === 308, `${sources[i]} must return 301/308, got ${res.status}`);
        assert(
          res.location && res.location.includes('/tools/system-prompt-builder'),
          `${sources[i]} must redirect to /tools/system-prompt-builder (got ${String(res.location)})`
        );
      }
      return 4;
    },
  },
  {
    id: 'T2-F02-3',
    tier: 2,
    featureArea: 'F02-HeaderFooterChrome',
    name: 'next.config.js permanent redirects /quiz -> /learn/quiz & /arena -> /compare',
    description: 'Verifies /quiz and /arena return 301/308 to their canonical destinations.',
    run: async (ctx) => {
      const pairs: Array<[string, string]> = [
        ['/quiz', '/learn/quiz'],
        ['/arena', '/compare'],
      ];
      for (let i = 0; i < pairs.length; i++) {
        const [src, dst] = pairs[i];
        const res = await fetchRoute(ctx.baseUrl, src, { redirect: 'manual' });
        assert(res.status === 301 || res.status === 308, `${src} must return 301/308`);
        assert(res.location && res.location.includes(dst), `${src} must redirect to ${dst}`);
      }
      return 4;
    },
  },
  {
    id: 'T2-F02-4',
    tier: 2,
    featureArea: 'F02-HeaderFooterChrome',
    name: 'Header & Footer rendered DOM contain zero academic jargon or untranslated English chrome',
    description: 'Audits rendered <header> and <footer> innerText and aria-labels for English leaks.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/`);
        const chromeText = await page.evaluate<string>(`
          [document.querySelector('header')?.innerText || '', document.querySelector('footer')?.innerText || ''].join(' ')
        `);
        assertNoAcademicJargon(chromeText, 'T2-F02-4:chrome');
        assertNoUntranslatedMicrocopy(chromeText, [], 'T2-F02-4:chrome');
        assertNoCjkNoise(chromeText, 'T2-F02-4:chrome');
        return 3;
      });
    },
  },
  {
    id: 'T2-F02-5',
    tier: 2,
    featureArea: 'F02-HeaderFooterChrome',
    name: 'Invalid unknown route returns HTTP 404 with Vietnamese recovery UI',
    description: 'Requests /nonexistent-page-xyz-404 and checks HTTP 404 + Vietnamese home link.',
    run: async (ctx) => {
      const res = await fetchRoute(ctx.baseUrl, '/nonexistent-page-xyz-404');
      assertEqual(res.status, 404, 'Unknown route must return HTTP 404');
      const text = stripHtml(res.html);
      assertNoAcademicJargon(text, 'T2-F02-5:404');
      assert(res.html.includes('href="/"'), '404 page must offer link back to /');
      return 3;
    },
  },

  // =========================================================================
  // FEATURE #3 BOUNDARIES: Hero Jargon & Copy Boundaries (5 tests)
  // =========================================================================
  {
    id: 'T2-F03-1',
    tier: 2,
    featureArea: 'F03-HeroAudienceSplit',
    name: 'Homepage SSR HTML & metadata free of academic jargon, standalone CoT, and CJK noise',
    description: 'Scans / <title>, <meta description>, and body text against Dictionary A & standalone CoT.',
    run: async (ctx) => {
      const n = await auditRouteHttpAndCopy(ctx.baseUrl, '/', [], 'T2-F03-1');
      const res = await fetchRoute(ctx.baseUrl, '/');
      assertNoStandaloneCoT(stripHtml(res.html), 'T2-F03-1');
      return n + 1;
    },
  },
  {
    id: 'T2-F03-2',
    tier: 2,
    featureArea: 'F03-HeroAudienceSplit',
    name: 'Homepage Builder preview tab free of academic jargon and untranslated chrome',
    description: 'Switches Hero preview card to Builder tab via resilient regex and checks rendered DOM text.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/`);
        await clickButtonByPattern(page, 'main section:first-of-type', /lập trình|kỹ thuật|builder|kỹ sư/i);
        const text = await page.innerText('main section:first-of-type');
        assertNoAcademicJargon(text, 'T2-F03-2');
        assertNoUntranslatedMicrocopy(text, [], 'T2-F03-2');
        assertNoStandaloneCoT(text, 'T2-F03-2');
        return 3;
      });
    },
  },
  {
    id: 'T2-F03-3',
    tier: 2,
    featureArea: 'F03-HeroAudienceSplit',
    name: 'Homepage has single H1 (no duplicate H1s across Hero/sections)',
    description: 'Confirms document.querySelectorAll("h1").length === 1 on /.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/`);
        const h1Count = await page.count('h1');
        assertEqual(h1Count, 1, 'Homepage must have exactly 1 <h1> element');
        return 1;
      });
    },
  },
  {
    id: 'T2-F03-4',
    tier: 2,
    featureArea: 'F03-HeroAudienceSplit',
    name: 'Hero preview copy button exists and works reliably under repeated clicks',
    description: 'Asserts Hero copy button exists, clicks it twice, and verifies >= 2 clipboard writes with zero page errors.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/`);
        await clickButtonByPattern(page, 'main section:first-of-type', /sao chép/i);
        await clickButtonByPattern(page, 'main section:first-of-type', /sao chép/i);
        await page.waitForFunction(`(window.__e2eClipboardWrites || []).length >= 2`, 3000);
        const writes = await page.getCapturedClipboard();
        assert(writes.length >= 2 && writes[0].trim().length > 10, `Expected >= 2 Hero clipboard writes, got ${writes.length}`);
        assertNoPageErrors(page, 'T2-F03-4');
        return 3;
      });
    },
  },
  {
    id: 'T2-F03-5',
    tier: 2,
    featureArea: 'F03-HeroAudienceSplit',
    name: 'Hero dual-audience cards readable on narrow 375px mobile viewport',
    description: 'Verifies Everyday & Builder Hero CTAs and preview links have positive width and no clipping at 375x812.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 375, height: 812 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/`);
        const everydayRect = await page.getRect('main a[href="/prompts"]');
        const builderRect = await page.getRect(
          'main a[href="#audience-heading"], main a[href="/tools/system-prompt-builder"], main a[href="/compare"], main a[href="/agents"], main a[href="/tools/token-calculator"]'
        );
        assert(everydayRect && everydayRect.width > 40, 'Everyday CTA must be visible on 375px mobile');
        assert(builderRect && builderRect.width > 40, 'Builder CTA must be visible on 375px mobile');
        await clickButtonByPattern(page, 'main section:first-of-type', /lập trình|kỹ thuật|builder|kỹ sư/i);
        await page.waitForSelector('main section:first-of-type a[href="/tools/system-prompt-builder"]', 4000);
        const previewBuilderRect = await page.getRect('main section:first-of-type a[href="/tools/system-prompt-builder"]');
        assert(previewBuilderRect && previewBuilderRect.width > 40, 'Hero Builder preview link must be visible on 375px mobile');
        await assertNoHorizontalOverflow(page, 'T2-F03-5');
        return 4;
      });
    },
  },

  // =========================================================================
  // FEATURE #4 BOUNDARIES: Home Sections & Static Pages Audits (5 tests)
  // =========================================================================
  {
    id: 'T2-F04-1',
    tier: 2,
    featureArea: 'F04-HomeSectionsGlobalPages',
    name: 'Newsletter empty & malformed emails never trigger success state',
    description: 'Tests empty string, missing domain, and whitespace-only email inputs in NewsletterSignup.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/`);
        const badInputs = ['', '   ', 'abc@', '@domain.com', 'no-at-sign'];
        for (let i = 0; i < badInputs.length; i++) {
          await page.fill('#newsletter-email', badInputs[i]);
          await page.evaluate<void>(
            `document.querySelector('#newsletter-email').closest('form').querySelector('button[type="submit"]').click()`
          );
          const isInvalid = await page.evaluate<boolean>(
            `document.querySelector('#newsletter-email')?.getAttribute('aria-invalid') === 'true' || document.body.innerText.includes('Vui lòng nhập email') || document.body.innerText.includes('Email không hợp lệ')`
          );
          assert(isInvalid, `Bad newsletter email "${badInputs[i]}" must trigger error state`);
        }
        return badInputs.length;
      });
    },
  },
  {
    id: 'T2-F04-2',
    tier: 2,
    featureArea: 'F04-HomeSectionsGlobalPages',
    name: 'Featured CategoryGrid shows 6 real categories, zero raw slugs, and zero fake 0 counts',
    description: 'Checks home category cards for 6 non-empty Vietnamese cards, non-zero skill counts, and zero raw slugs.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/`);
        const texts = await page.evaluate<string[]>(`(() => {
          const scoped = Array.from(document.querySelectorAll('[aria-labelledby="categories-heading"] a[href^="/category/"], [aria-labelledby="categories-heading"] a[href^="/categories/"]'));
          const links = scoped.length > 0
            ? scoped
            : Array.from(document.querySelectorAll('main a[href^="/category/"], main a[href^="/categories/"]'))
                .filter(a => {
                  const h = a.getAttribute('href') || '';
                  return h !== '/categories' && h !== '/category';
                });
          return links.map(a => (a.innerText || '').trim());
        })()`);
        assertEqual(texts.length, 6, `Home featured CategoryGrid must render 6 non-empty cards (got ${texts.length})`);
        const tokens: string[] = [];
        for (let i = 0; i < texts.length; i++) {
          assert(texts[i].length > 5, `Category card #${i + 1} must be non-empty`);
          assert(!/^0\s*kỹ năng|\b0\s*kỹ năng\b/im.test(texts[i]), `Category card #${i + 1} must not display fake "0 kỹ năng": ${texts[i]}`);
          texts[i].split(/\r?\n/).forEach((line) => {
            if (line.trim()) tokens.push(line.trim());
          });
        }
        assertNoRawCategorySlugs(tokens, 'T2-F04-2:home-cats');
        return 3;
      });
    },
  },
  {
    id: 'T2-F04-3',
    tier: 2,
    featureArea: 'F04-HomeSectionsGlobalPages',
    name: '/about & /contact clean of academic jargon and untranslated chrome',
    description: 'Audits /about and /contact SSR HTML and metadata.',
    run: async (ctx) => {
      const a = await auditRouteHttpAndCopy(ctx.baseUrl, '/about', [], 'T2-F04-3');
      const b = await auditRouteHttpAndCopy(ctx.baseUrl, '/contact', [], 'T2-F04-3');
      return a + b;
    },
  },
  {
    id: 'T2-F04-4',
    tier: 2,
    featureArea: 'F04-HomeSectionsGlobalPages',
    name: '/privacy & /terms clean of academic jargon and untranslated chrome',
    description: 'Audits /privacy and /terms SSR HTML and metadata.',
    run: async (ctx) => {
      const a = await auditRouteHttpAndCopy(ctx.baseUrl, '/privacy', [], 'T2-F04-4');
      const b = await auditRouteHttpAndCopy(ctx.baseUrl, '/terms', [], 'T2-F04-4');
      return a + b;
    },
  },
  {
    id: 'T2-F04-5',
    tier: 2,
    featureArea: 'F04-HomeSectionsGlobalPages',
    name: '/contact rejects empty submission cleanly without writing invalid localStorage entry',
    description: 'Submits empty /contact form and confirms native/custom validation prevents fake submission.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/contact`);
        await page.click('main form button[type="submit"]');
        const stored = await page.getLocalStorage('ai_life_hub_feedback');
        assert(!stored, 'Empty /contact form submission must not write to ai_life_hub_feedback');
        assertNoPageErrors(page, 'T2-F04-5');
        return 2;
      });
    },
  },

  // =========================================================================
  // FEATURE #5 BOUNDARIES: /prompts Edge Cases & Audits (5 tests)
  // =========================================================================
  {
    id: 'T2-F05-1',
    tier: 2,
    featureArea: 'F05-EverydayPrompts',
    name: '/prompts SSR & rendered UI contain zero jargon, standalone CoT, raw slugs, or untranslated Copy/template labels',
    description: 'Audits /prompts rendered text and button/pill labels.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/prompts`);
        const text = await page.innerText('main');
        assertNoAcademicJargon(text, 'T2-F05-1');
        assertNoCjkNoise(text, 'T2-F05-1');
        assertNoStandaloneCoT(text, 'T2-F05-1');
        assert(!text.includes('prompt templates'), '/prompts must localize "prompt templates"');
        const btnTexts = await page.evaluate<string[]>(
          `Array.from(document.querySelectorAll('main button')).map(b => (b.innerText || '').trim())`
        );
        assert(!btnTexts.includes('Copy'), '/prompts must not have standalone English "Copy" button');
        assertNoRawCategorySlugs(btnTexts, 'T2-F05-1:pills');
        return 6;
      });
    },
  },
  {
    id: 'T2-F05-2',
    tier: 2,
    featureArea: 'F05-EverydayPrompts',
    name: '/prompts nonsense search query shows graceful empty state (0 cards, no crash)',
    description: 'Types "zzzzkhongtontai999" into /prompts search input and checks graceful empty state.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/prompts`);
        await page.fill('main input[type="text"]', 'zzzzkhongtontai999');
        await page.waitForFunction(`document.querySelectorAll('main h3').length === 0`, 4000);
        assertNoPageErrors(page, 'T2-F05-2');
        return 2;
      });
    },
  },
  {
    id: 'T2-F05-3',
    tier: 2,
    featureArea: 'F05-EverydayPrompts',
    name: '/prompts whitespace-only search restores all prompts cleanly',
    description: 'Enters spaces into /prompts search input and verifies prompts remain visible or reset cleanly.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/prompts`);
        await page.fill('main input[type="text"]', 'zzzzkhongtontai999');
        await page.fill('main input[type="text"]', '');
        await page.waitForFunction(`document.querySelectorAll('main h3').length >= 10`, 4000);
        assertNoPageErrors(page, 'T2-F05-3');
        return 2;
      });
    },
  },
  {
    id: 'T2-F05-4',
    tier: 2,
    featureArea: 'F05-EverydayPrompts',
    name: '/prompts card skill links all use valid /skill/<slug> format',
    description: 'Verifies skill links on /prompts point to single-segment /skill/<slug> routes.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/prompts`);
        const hrefs = await page.evaluate<string[]>(
          `Array.from(document.querySelectorAll('main a[href^="/skill"]')).map(a => a.getAttribute('href') || '')`
        );
        assert(hrefs.length >= 5, 'Expected skill links on /prompts');
        for (let i = 0; i < hrefs.length; i++) {
          assert(/^\/skills?\/[^/]+$/.test(hrefs[i]), `Invalid skill href "${hrefs[i]}" on /prompts`);
        }
        return 2;
      });
    },
  },
  {
    id: 'T2-F05-5',
    tier: 2,
    featureArea: 'F05-EverydayPrompts',
    name: '/prompts bookmark toggle removes item cleanly on second click',
    description: 'Clicks bookmark twice on /prompts and confirms item is removed from ai_life_hub_bookmarks.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/prompts`);
        await clickButtonByPattern(page, 'main', /lưu|bỏ lưu|bookmark|yêu thích/i);
        await page.waitForFunction(`(window.localStorage.getItem('ai_life_hub_bookmarks') || '').length > 5`, 3000);
        await clickButtonByPattern(page, 'main', /bỏ lưu|lưu|bookmark|yêu thích/i);
        await page.waitForFunction(`(window.localStorage.getItem('ai_life_hub_bookmarks') || '[]') === '[]'`, 3000);
        return 2;
      });
    },
  },

  // =========================================================================
  // FEATURE #6 BOUNDARIES: Skill/Category 404, Empty Categories & Modal Edge Cases (5 tests)
  // =========================================================================
  {
    id: 'T2-F06-1',
    tier: 2,
    featureArea: 'F06-SkillCategoryDetail',
    name: 'Invalid /skill/nonexistent-slug-xyz & /category/nonexistent-cat-xyz return HTTP 404',
    description: 'Verifies nonexistent skill and category slugs return HTTP 404 with Vietnamese recovery UI.',
    run: async (ctx) => {
      const s = await fetchRoute(ctx.baseUrl, '/skill/nonexistent-slug-xyz');
      const c = await fetchRoute(ctx.baseUrl, '/category/nonexistent-cat-xyz');
      assertEqual(s.status, 404, '/skill/nonexistent-slug-xyz must return 404');
      assertEqual(c.status, 404, '/category/nonexistent-cat-xyz must return 404');
      return 2;
    },
  },
  {
    id: 'T2-F06-2',
    tier: 2,
    featureArea: 'F06-SkillCategoryDetail',
    name: 'Empty categories (/category/giai-tri, /category/nghien-cuu) return HTTP 200 gracefully',
    description: 'Verifies 0-skill categories render cleanly without crashes or jargon.',
    run: async (ctx) => {
      const a = await auditRouteHttpAndCopy(ctx.baseUrl, '/category/giai-tri', [], 'T2-F06-2');
      const b = await auditRouteHttpAndCopy(ctx.baseUrl, '/category/nghien-cuu', [], 'T2-F06-2');
      return a + b;
    },
  },
  {
    id: 'T2-F06-3',
    tier: 2,
    featureArea: 'F06-SkillCategoryDetail',
    name: 'Category & Skill detail pages have zero untranslated UI micro-copy, academic jargon, Select example, or raw resource slugs',
    description: 'Checks /category/cong-viec and /skill/soan-thao-email-chuyen-nghiep + PromptBuilder for Collapse/Expand/Select example/CoT/academic jargon/CJK/raw badges.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/category/cong-viec`);
        const catText = await page.innerText('main');
        assertNoAcademicJargon(catText, 'T2-F06-3:/category/cong-viec');
        assertNoCjkNoise(catText, 'T2-F06-3:/category/cong-viec');
        assertNoUntranslatedMicrocopy(catText, [], 'T2-F06-3:/category/cong-viec');
        assertNoStandaloneCoT(catText, 'T2-F06-3:/category/cong-viec');
        const badges = await page.evaluate<string[]>(
          `Array.from(document.querySelectorAll('main span, main a')).map(e => (e.textContent || '').trim())`
        );
        assertNoRawResourceSlugs(badges, 'T2-F06-3:resource-badges');

        await page.goto(`${ctx.baseUrl}/skill/soan-thao-email-chuyen-nghiep`);
        const skillText = await page.innerText('main');
        assertNoStandaloneCoT(skillText, 'T2-F06-3:/skill/soan-thao-email-chuyen-nghiep');
        const skillHtml = await page.evaluate<string>('document.querySelector("main")?.innerHTML || ""');
        assert(!skillHtml.includes('aria-label="Collapse"') && !skillHtml.includes('aria-label="Expand"'), 'PromptCard aria-labels must be Vietnamese');

        await clickButtonByPattern(page, 'main', /tạo câu lệnh|tùy chỉnh/i);
        await page.waitForFunction(`Boolean((${FIND_PROMPT_BUILDER_MODAL_JS})?.querySelector('select'))`, 5000);
        const hasSelectExample = await page.evaluate<boolean>(
          `document.querySelector('[aria-label="Select example"]') !== null`
        );
        assert(!hasSelectExample, 'PromptBuilder must localize [aria-label="Select example"] to Vietnamese');
        const modalText = await page.evaluate<string>(`(${FIND_PROMPT_BUILDER_MODAL_JS})?.innerText || ''`);
        assertNoAcademicJargon(modalText, 'T2-F06-3:PromptBuilder');
        assertNoCjkNoise(modalText, 'T2-F06-3:PromptBuilder');
        assertNoUntranslatedMicrocopy(modalText, [], 'T2-F06-3:PromptBuilder');
        return 10;
      });
    },
  },
  {
    id: 'T2-F06-4',
    tier: 2,
    featureArea: 'F06-SkillCategoryDetail',
    name: 'PromptBuilder handles special characters & closes cleanly on backdrop/X click',
    description: 'Opens PromptBuilder, enters Vietnamese + punctuation characters, verifies escaping, and closes modal.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/skill/soan-thao-email-chuyen-nghiep`);
        await clickButtonByPattern(page, 'main', /tạo câu lệnh|tùy chỉnh/i);
        await page.waitForFunction(`Boolean((${FIND_PROMPT_BUILDER_MODAL_JS})?.querySelector('pre'))`, 5000);
        await page.evaluate<void>(`(() => {
          const modal = ${FIND_PROMPT_BUILDER_MODAL_JS};
          const inp = modal?.querySelector('input[type="text"]');
          if (!inp) throw new Error('PromptBuilder text input not found');
          Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(inp, 'Anh Bình <test@co.vn> & "Phòng KT"');
          inp.dispatchEvent(new Event('input', { bubbles: true }));
        })()`);
        const pre = await page.evaluate<string>(`(${FIND_PROMPT_BUILDER_MODAL_JS})?.querySelector('pre')?.textContent || ''`);
        assertIncludes(pre, 'Anh Bình <test@co.vn> & "Phòng KT"', 'Special chars must render safely in <pre>');
        await page.evaluate<void>(`(() => {
          const modal = ${FIND_PROMPT_BUILDER_MODAL_JS};
          const closeBtn = modal?.querySelector('button[aria-label*="Đóng" i], button[title*="Đóng" i]');
          if (!closeBtn) throw new Error('Close button not found in PromptBuilder modal');
          closeBtn.click();
        })()`);
        await page.waitForFunction(`!(${FIND_PROMPT_BUILDER_MODAL_JS})`, 3000);
        assertNoPageErrors(page, 'T2-F06-4');
        return 3;
      });
    },
  },
  {
    id: 'T2-F06-5',
    tier: 2,
    featureArea: 'F06-SkillCategoryDetail',
    name: 'CategorySidebar filters /category/cong-viec cleanly when interacting with difficulty/sort',
    description: 'Interacts with CategorySidebar difficulty <select> and sort radio buttons on /category/cong-viec and verifies real DOM filtering, empty-state/reset, sorting, and localized DIFFICULTY_LABELS.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/category/cong-viec`);
        const text = await page.innerText('main');
        assert(!/\b(beginner|intermediate|advanced)\b/i.test(text), 'Difficulty badges must use Vietnamese DIFFICULTY_LABELS');

        const readCardsJs = `Array.from(document.querySelectorAll('main a[href^="/skill/"]')).map((a) => ({
          title: (a.querySelector('h3')?.innerText || '').trim(),
          text: (a.innerText || '').trim()
        }))`;
        const initialCards = await page.evaluate<Array<{ title: string; text: string }>>(readCardsJs);
        assert(initialCards.length >= 2, `Expected >= 2 skill cards on /category/cong-viec (got ${initialCards.length})`);

        const hasSelect = await page.evaluate<boolean>(
          `document.querySelector('#difficulty-filter, aside select') instanceof HTMLSelectElement`
        );
        assert(hasSelect, 'CategorySidebar must render difficulty filter <select>');

        const applyDifficulty = async (val: string) => {
          const selected = await page.evaluate<string>(`(() => {
            const sel = document.querySelector('#difficulty-filter, aside select');
            if (!(sel instanceof HTMLSelectElement)) return '';
            Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set.call(sel, ${JSON.stringify(val)});
            sel.dispatchEvent(new Event('input', { bubbles: true }));
            sel.dispatchEvent(new Event('change', { bubbles: true }));
            return sel.value;
          })()`);
          assertEqual(selected, val, `Difficulty <select> must update to "${val}"`);
          await new Promise((r) => setTimeout(r, 120));
          return {
            cards: await page.evaluate<Array<{ title: string; text: string }>>(readCardsJs),
            mainText: (await page.innerText('main')).trim(),
          };
        };

        const advResult = await applyDifficulty('advanced');
        for (const card of advResult.cards) {
          assert(
            card.text.includes('Nâng cao') && !card.text.includes('Cơ bản') && !card.text.includes('Trung cấp'),
            `Difficulty "advanced" filter must only show Nâng cao skills, got: ${card.text}`
          );
        }
        if (advResult.cards.length === 0) {
          assert(
            /không có kỹ năng/i.test(advResult.mainText),
            'Empty difficulty filter state must show Vietnamese empty-state message'
          );
        }

        const begResult = await applyDifficulty('beginner');
        for (const card of begResult.cards) {
          assert(
            card.text.includes('Cơ bản') && !card.text.includes('Trung cấp') && !card.text.includes('Nâng cao'),
            `Difficulty "beginner" filter must only show Cơ bản skills, got: ${card.text}`
          );
        }
        if (begResult.cards.length === 0) {
          assert(
            /không có kỹ năng/i.test(begResult.mainText),
            'Empty difficulty filter state must show Vietnamese empty-state message'
          );
        }

        assert(
          advResult.cards.length < initialCards.length || begResult.cards.length < initialCards.length,
          'Changing #difficulty-filter must actively filter rendered skill cards in main'
        );

        await applyDifficulty('');
        await page.waitForFunction(
          `document.querySelectorAll('main a[href^="/skill/"]').length === ${initialCards.length}`,
          3000
        );

        const sortChecked = await page.evaluate<{ sortValue: string; sortChecked: boolean }>(`(() => {
          const radios = Array.from(document.querySelectorAll('aside input[type="radio"][name="sort"]'));
          const targetRadio = radios.find(r => r.value === 'name') || radios[1] || radios[0];
          if (!(targetRadio instanceof HTMLInputElement)) return { sortValue: '', sortChecked: false };
          targetRadio.click();
          return { sortValue: targetRadio.value, sortChecked: targetRadio.checked };
        })()`);
        assert(sortChecked.sortValue.length > 0 && sortChecked.sortChecked, 'CategorySidebar sort radio option must toggle cleanly');
        await new Promise((r) => setTimeout(r, 120));

        const sortedTitles = await page.evaluate<string[]>(
          `Array.from(document.querySelectorAll('main a[href^="/skill/"] h3')).map((h) => (h.innerText || '').trim())`
        );
        assertEqual(sortedTitles.length, initialCards.length, 'Sort radio must preserve all skill cards');
        if (sortChecked.sortValue === 'name') {
          for (let i = 1; i < sortedTitles.length; i++) {
            assert(
              sortedTitles[i - 1].localeCompare(sortedTitles[i], 'vi') <= 0,
              `Sort by name must order skill cards alphabetically: "${sortedTitles[i - 1]}" appeared before "${sortedTitles[i]}"`
            );
          }
        }
        assertNoPageErrors(page, 'T2-F06-5');
        return 8;
      });
    },
  },

  // =========================================================================
  // FEATURE #7 BOUNDARIES: Search, Resources, Favorites, Submit Edge Cases (5 tests)
  // =========================================================================
  {
    id: 'T2-F07-1',
    tier: 2,
    featureArea: 'F07-SearchResourcesFavorites',
    name: 'CommandPalette empty & zero-match search queries show graceful Vietnamese UI',
    description: 'Tests empty input and "zzzzkhongtontai999" in CommandPalette without English leaks or crashes.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/`);
        await page.pressKey('Control+k');
        await page.waitForSelector('[role="dialog"] input', 5000);
        await page.fill('[role="dialog"] input', 'zzzzkhongtontai999');
        await new Promise((r) => setTimeout(r, 300));
        const text = await page.innerText('[role="dialog"]');
        assertNoUntranslatedMicrocopy(text, [], 'T2-F07-1');
        assertNoPageErrors(page, 'T2-F07-1');
        return 2;
      });
    },
  },
  {
    id: 'T2-F07-2',
    tier: 2,
    featureArea: 'F07-SearchResourcesFavorites',
    name: '/search?q=zzzzkhongtontai999 and empty /search handle edge queries gracefully',
    description: 'Verifies /search with empty query and non-matching query renders cleanly in Vietnamese.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/search?q=zzzzkhongtontai999`);
        const text = await page.innerText('main');
        assertNoUntranslatedMicrocopy(text, [], 'T2-F07-2');
        await page.goto(`${ctx.baseUrl}/search`);
        assertNoPageErrors(page, 'T2-F07-2');
        return 2;
      });
    },
  },
  {
    id: 'T2-F07-3',
    tier: 2,
    featureArea: 'F07-SearchResourcesFavorites',
    name: '/resources contains zero raw English type badges ("article", "video", "course", "tool", "paper", "template")',
    description: 'Audits all filter pills and card type badges on /resources using textContent.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/resources`);
        await page.waitForFunction(`document.querySelectorAll('main article').length >= 1`, 6000);
        const labels = await page.evaluate<string[]>(
          `Array.from(document.querySelectorAll('main button, main article span')).map(e => (e.textContent || '').trim())`
        );
        assertNoRawResourceSlugs(labels, 'T2-F07-3');
        const mainText = await page.innerText('main');
        assertNoAcademicJargon(mainText, 'T2-F07-3:main');
        assertNoCjkNoise(mainText, 'T2-F07-3:main');
        return 4;
      });
    },
  },
  {
    id: 'T2-F07-4',
    tier: 2,
    featureArea: 'F07-SearchResourcesFavorites',
    name: '/favorites renders Vietnamese type & category labels when populated (no raw slugs)',
    description: 'Seeds a bookmark and verifies /favorites shows Vietnamese itemType & category labels.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/prompts`);
        await clickButtonByPattern(page, 'main', /lưu|bỏ lưu|bookmark|yêu thích/i);
        await page.goto(`${ctx.baseUrl}/favorites`);
        await page.waitForFunction(`document.querySelectorAll('main h3').length >= 1`, 5000);
        const badgeTexts = await page.evaluate<string[]>(
          `Array.from(document.querySelectorAll('main span, main p')).map(e => (e.innerText || '').trim())`
        );
        assertNoRawCategorySlugs(badgeTexts, 'T2-F07-4:cats');
        const cardBadges = await page.evaluate<string[]>(`(() => {
          const cards = Array.from(document.querySelectorAll('main h3')).map(h3 => h3.closest('article') || h3.parentElement?.parentElement).filter(Boolean);
          return cards.flatMap(card => Array.from(card.querySelectorAll('span')).map(s => (s.innerText || '').trim().toLowerCase()));
        })()`);
        assert(cardBadges.length >= 1, 'Expected favorite card badge elements on /favorites');
        assert(!cardBadges.includes('skill') && !cardBadges.includes('prompt') && !cardBadges.includes('resource'), '/favorites card badge must be Vietnamese');
        return 4;
      });
    },
  },
  {
    id: 'T2-F07-5',
    tier: 2,
    featureArea: 'F07-SearchResourcesFavorites',
    name: '/submit prevents empty submit and avoids raw category slugs in preview',
    description: 'Tests /submit empty validation and verifies Live Preview uses Vietnamese category name.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/submit`);
        await page.click('main form button[type="submit"]');
        const stored = await page.getLocalStorage('ai_life_hub_community_prompts');
        assert(!stored, 'Empty /submit form must not save to localStorage');
        const previewBadges = await page.evaluate<string[]>(
          `Array.from(document.querySelectorAll('main span')).map(s => (s.innerText || '').trim()).filter(t => t.length > 0 && t.length < 40)`
        );
        assertNoRawCategorySlugs(previewBadges, 'T2-F07-5:submit-preview');
        return 2;
      });
    },
  },

  // =========================================================================
  // FEATURE #8 BOUNDARIES: Prompt Optimizer Jargon & Input Edge Cases (5 tests)
  // =========================================================================
  {
    id: 'T2-F08-1',
    tier: 2,
    featureArea: 'F08-PromptOptimizer',
    name: '/tools/prompt-optimizer SSR & UI free of CoT/CREATE/Production-Ready/Anti-Hallucination jargon',
    description: 'Audits /tools/prompt-optimizer HTML, title, meta description, and visible DOM.',
    run: async (ctx) => auditRouteHttpAndCopy(ctx.baseUrl, '/tools/prompt-optimizer', FORBIDDEN_TOOLS_MICROCOPY, 'T2-F08-1'),
  },
  {
    id: 'T2-F08-2',
    tier: 2,
    featureArea: 'F08-PromptOptimizer',
    name: 'Prompt Optimizer whitespace-only input disables optimize button',
    description: 'Enters spaces/newlines only and checks submit button remains disabled.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/tools/prompt-optimizer`);
        await page.fill('main textarea', '   \n\t  ');
        const disabled = await page.evaluate<boolean>(`(() => {
          const b = Array.from(document.querySelectorAll('main button')).find(x => /nâng cấp|tối ưu.*ngay|tối ưu câu lệnh/i.test((x.innerText || '').trim()));
          return b ? b.disabled : false;
        })()`);
        assert(disabled, 'Whitespace-only input must keep optimize button disabled');
        return 1;
      });
    },
  },
  {
    id: 'T2-F08-3',
    tier: 2,
    featureArea: 'F08-PromptOptimizer',
    name: 'Prompt Optimizer frameworks #1 & #2 output zero English section headers or jargon',
    description: 'Runs optimization with frameworks 1 and 2 and audits generated output against Dictionaries A & B.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/tools/prompt-optimizer`);
        await page.fill('main textarea', 'Lập kế hoạch học tiếng Anh giao tiếp trong 3 tháng');
        for (let i = 0; i < 2; i++) {
          await page.evaluate<void>(
            `Array.from(document.querySelectorAll('main button')).filter(b => Boolean(b.querySelector('p')) && (b.innerText || '').trim().length > 20)[${i}]?.click()`
          );
          await clickButtonByPattern(page, 'main', /nâng cấp|tối ưu.*ngay|tối ưu câu lệnh/i);
          await page.waitForFunction(`Boolean(document.querySelector('main a[href="/playground"]'))`, 5000);
          const outText = await page.innerText('main');
          assertNoAcademicJargon(outText, `T2-F08-3:fw-${i}`);
          assertNoUntranslatedMicrocopy(outText, FORBIDDEN_TOOLS_MICROCOPY, `T2-F08-3:fw-${i}`);
        }
        return 4;
      });
    },
  },
  {
    id: 'T2-F08-4',
    tier: 2,
    featureArea: 'F08-PromptOptimizer',
    name: 'Prompt Optimizer frameworks #3 & #4 output zero Anti-Hallucination / Guardrails: Active leaks',
    description: 'Runs optimization with frameworks 3 and 4 and audits generated output.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/tools/prompt-optimizer`);
        await page.fill('main textarea', 'Tóm tắt hợp đồng thuê nhà và chỉ ra điều khoản rủi ro');
        for (let i = 2; i < 4; i++) {
          await page.evaluate<void>(
            `Array.from(document.querySelectorAll('main button')).filter(b => Boolean(b.querySelector('p')) && (b.innerText || '').trim().length > 20)[${i}]?.click()`
          );
          await clickButtonByPattern(page, 'main', /nâng cấp|tối ưu.*ngay|tối ưu câu lệnh/i);
          await page.waitForFunction(`Boolean(document.querySelector('main a[href="/playground"]'))`, 5000);
          const outText = await page.innerText('main');
          assertNoAcademicJargon(outText, `T2-F08-4:fw-${i}`);
          assertNoUntranslatedMicrocopy(outText, FORBIDDEN_TOOLS_MICROCOPY, `T2-F08-4:fw-${i}`);
        }
        return 4;
      });
    },
  },
  {
    id: 'T2-F08-5',
    tier: 2,
    featureArea: 'F08-PromptOptimizer',
    name: 'Prompt Optimizer handles long Vietnamese paragraph without crash or layout break',
    description: 'Submits a 1500-char Vietnamese prompt and checks horizontal overflow and clean output.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/tools/prompt-optimizer`);
        const longText = 'Phân tích chiến lược kinh doanh sản phẩm nông sản sạch tại Việt Nam. '.repeat(22);
        await page.fill('main textarea', longText);
        await clickButtonByPattern(page, 'main', /nâng cấp|tối ưu.*ngay|tối ưu câu lệnh/i);
        await page.waitForFunction(`Boolean(document.querySelector('main a[href="/playground"]'))`, 5000);
        await assertNoHorizontalOverflow(page, 'T2-F08-5');
        assertNoPageErrors(page, 'T2-F08-5');
        return 2;
      });
    },
  },

  // =========================================================================
  // FEATURE #9 BOUNDARIES: System Prompt Studio Edge Cases & Audits (5 tests)
  // =========================================================================
  {
    id: 'T2-F09-1',
    tier: 2,
    featureArea: 'F09-SystemPromptStudio',
    name: '/tools/system-prompt-builder SSR & UI free of Meta-Prompt/Identity/Prompt Preview leaks',
    description: 'Audits /tools/system-prompt-builder HTML, title, meta description, and visible DOM.',
    run: async (ctx) => auditRouteHttpAndCopy(ctx.baseUrl, '/tools/system-prompt-builder', FORBIDDEN_TOOLS_MICROCOPY, 'T2-F09-1'),
  },
  {
    id: 'T2-F09-2',
    tier: 2,
    featureArea: 'F09-SystemPromptStudio',
    name: 'Keyboard shortcuts 1-4 are ignored while typing inside input/textarea',
    description: 'Asserts <pre> has >20 chars, focuses Role textarea, sends key "2", and verifies preset does NOT accidentally switch.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/tools/system-prompt-builder`);
        const roleBefore = await page.evaluate<string>(`document.querySelector('#sp-role')?.value || ''`);
        assert(roleBefore.length > 20, `Expected populated #sp-role textarea, got ${roleBefore.length}`);
        await page.evaluate<void>(`document.querySelector('#sp-role')?.focus()`);
        await page.pressKey('2');
        const state = await page.evaluate<{
          roleAfter: string;
          preAfter: string;
          preset1Pressed: string | null;
          preset2Pressed: string | null;
        }>(`(() => {
          const btns = Array.from(document.querySelectorAll('main button[aria-pressed]'));
          return {
            roleAfter: document.querySelector('#sp-role')?.value || '',
            preAfter: document.querySelector('main pre')?.textContent || '',
            preset1Pressed: btns[0]?.getAttribute('aria-pressed') ?? null,
            preset2Pressed: btns[1]?.getAttribute('aria-pressed') ?? null,
          };
        })()`);
        assertEqual(state.preset1Pressed, 'true', 'Pressing "2" inside textarea must keep Preset #1 selected');
        assertEqual(state.preset2Pressed, 'false', 'Pressing "2" inside textarea must not switch to Preset #2');
        assertIncludes(state.roleAfter, '2', 'Pressing "2" inside textarea must type normally into #sp-role');
        assertIncludes(state.preAfter, 'Kiến trúc sư phần mềm', 'System Prompt preview must retain Preset #1 role');
        return 4;
      });
    },
  },
  {
    id: 'T2-F09-3',
    tier: 2,
    featureArea: 'F09-SystemPromptStudio',
    name: 'Removing all constraints and examples omits empty blocks cleanly',
    description: 'Deletes all constraints & examples and verifies constraint/example XML blocks disappear cleanly.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/tools/system-prompt-builder`);
        for (let pass = 0; pass < 12; pass++) {
          const clicked = await page.evaluate<boolean>(`(() => {
            const delBtn = Array.from(document.querySelectorAll('main button')).find(b => {
              const label = ((b.getAttribute('title') || '') + ' ' + (b.getAttribute('aria-label') || '')).trim();
              return /xóa ràng buộc|xóa ví dụ/i.test(label) || (/xóa/i.test(label) && !(b.innerText || '').trim());
            });
            if (!delBtn) return false;
            delBtn.click();
            return true;
          })()`);
          if (!clicked) break;
          await new Promise((r) => setTimeout(r, 60));
        }
        await page.waitForFunction(
          `!(/<(strict_constraints|rang_buoc|nguyen_tac|constraints)>/i.test(document.querySelector('main pre')?.textContent || ''))`,
          4000
        );
        const pre = await page.textContent('main pre');
        assert(!/<(examples|vi_du)>/i.test(pre) && !/^#\s*VÍ DỤ MẪU/im.test(pre), 'Empty examples must omit examples block');
        assertNoPageErrors(page, 'T2-F09-3');
        return 3;
      });
    },
  },
  {
    id: 'T2-F09-4',
    tier: 2,
    featureArea: 'F09-SystemPromptStudio',
    name: 'XSS-like <script>alert(1)</script> input renders safely as text without executing',
    description: 'Adds <script>alert(1)</script> into Role/Constraint and verifies zero alert/pageError and safe escaping.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/tools/system-prompt-builder`);
        await page.evaluate<void>(`window.__xssTriggered = false; window.alert = () => { window.__xssTriggered = true; };`);
        await page.fill('main textarea', '<script>alert(1)</script>');
        const pre = await page.textContent('main pre');
        assertIncludes(pre, '<script>alert(1)</script>', 'Script payload must be rendered literally in <pre>');
        const triggered = await page.evaluate<boolean>('Boolean(window.__xssTriggered)');
        assert(!triggered, 'XSS payload must never execute');
        return 2;
      });
    },
  },
  {
    id: 'T2-F09-5',
    tier: 2,
    featureArea: 'F09-SystemPromptStudio',
    name: 'Adding empty constraint or half-filled example is safely ignored',
    description: 'Clicks Thêm / Lưu ví dụ with empty fields and verifies no blank bullets are injected.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/tools/system-prompt-builder`);
        const beforePre = await page.textContent('main pre');
        await clickButtonByPattern(page, 'main', /^thêm$/i, { allowDisabled: true });
        await clickButtonByPattern(page, 'main', /lưu ví dụ/i, { allowDisabled: true });
        const afterPre = await page.textContent('main pre');
        assertEqual(afterPre, beforePre, 'Empty constraint/example submit must not alter compiled prompt');
        return 1;
      });
    },
  },

  // =========================================================================
  // FEATURE #10 BOUNDARIES: Token Calculator Numeric & Slider Extremes (5 tests)
  // =========================================================================
  {
    id: 'T2-F10-1',
    tier: 2,
    featureArea: 'F10-TokenCalculator',
    name: '/tools/token-calculator SSR & UI free of English badges & jargon',
    description: 'Audits /tools/token-calculator against Dictionary A & FORBIDDEN_TOOLS_MICROCOPY.',
    run: async (ctx) => auditRouteHttpAndCopy(ctx.baseUrl, '/tools/token-calculator', FORBIDDEN_TOOLS_MICROCOPY, 'T2-F10-1'),
  },
  {
    id: 'T2-F10-2',
    tier: 2,
    featureArea: 'F10-TokenCalculator',
    name: 'TokenCalculator minimum extreme (input=100, output=50, cache=0, req=100) has $0.00 savings & no NaN',
    description: 'Sets all 4 sliders to minimum boundary and checks zero NaN, zero negatives, and $0.00 caching savings.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/tools/token-calculator`);
        await page.evaluate<void>(`(() => {
          const sliders = document.querySelectorAll('main input[type="range"]');
          const vals = [100, 50, 0, 100];
          sliders.forEach((el, idx) => {
            Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, String(vals[idx]));
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          });
        })()`);
        await page.waitForFunction(`document.body.innerText.includes('$0.00')`, 4000);
        const text = await page.innerText('main');
        assert(!/\bNaN\b|\bInfinity\b/.test(text), 'Minimum boundary must never produce NaN or Infinity');
        assert(!/-\$\d/.test(text), 'Minimum boundary must never produce negative dollar amounts');
        assertIncludes(text, '$0.00', '0% caching must show $0.00 savings');
        return 3;
      });
    },
  },
  {
    id: 'T2-F10-3',
    tier: 2,
    featureArea: 'F10-TokenCalculator',
    name: 'TokenCalculator maximum extreme (input=20000, output=5000, cache=100, req=50000) stays finite & sorted',
    description: 'Sets all 4 sliders to maximum boundary and verifies positive savings, finite VNĐ, and ascending sort.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/tools/token-calculator`);
        await page.evaluate<void>(`(() => {
          const sliders = document.querySelectorAll('main input[type="range"]');
          const vals = [20000, 5000, 100, 50000];
          sliders.forEach((el, idx) => {
            Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, String(vals[idx]));
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          });
        })()`);
        await page.waitForFunction(`!document.body.innerText.includes('$0.00/tháng')`, 4000);
        const text = await page.innerText('main');
        assert(!/\bNaN\b|\bInfinity\b/.test(text), 'Maximum boundary must never produce NaN or Infinity');
        const monthlyCosts = await page.evaluate<number[]>(`
          Array.from(document.querySelectorAll('main table tbody tr')).map(tr => {
            const matches = (tr.innerText || '').match(/\\$([0-9,]+\\.\\d{2})/g);
            return matches && matches.length ? parseFloat(matches[matches.length - 1].replace('$', '').replace(/,/g, '')) : 0;
          })
        `);
        assert(monthlyCosts.length >= 9 && monthlyCosts[0] > 0, 'All model monthly costs must be > 0 at max workload');
        for (let i = 1; i < monthlyCosts.length; i++) {
          assert(monthlyCosts[i] >= monthlyCosts[i - 1], 'Models must remain sorted ascending at max workload');
        }
        return 3;
      });
    },
  },
  {
    id: 'T2-F10-4',
    tier: 2,
    featureArea: 'F10-TokenCalculator',
    name: 'TokenCalculator 100% cache produces strictly lower GPT-4o cost than 0% cache',
    description: 'Compares GPT-4o monthly cost at cache=0% vs cache=100% using semantic table row lookup.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/tools/token-calculator`);
        const readGpt4oCost = async () =>
          await page.evaluate<number>(`(() => {
            const rows = Array.from(document.querySelectorAll('main table tbody tr'));
            const row = rows.find(tr => (tr.innerText || '').includes('GPT-4o') && !(tr.innerText || '').includes('mini'));
            if (!row) return -1;
            const matches = row.innerText.match(/\\$([0-9,]+\\.\\d{2})/g);
            return matches && matches.length ? parseFloat(matches[matches.length - 1].replace('$', '').replace(/,/g, '')) : -1;
          })()`);
        await page.setRangeValue('main input[type="range"][max="100"]', 0);
        const cost0 = await readGpt4oCost();
        await page.setRangeValue('main input[type="range"][max="100"]', 100);
        const cost100 = await readGpt4oCost();
        assert(cost0 > 0 && cost100 > 0 && cost100 < cost0, `100% cache (${cost100}) must be cheaper than 0% cache (${cost0})`);
        return 1;
      });
    },
  },
  {
    id: 'T2-F10-5',
    tier: 2,
    featureArea: 'F10-TokenCalculator',
    name: 'TokenCalculator mobile card view displays valid VNĐ formatting for all 9 models',
    description: 'Switches to Thẻ view on 375x812 and checks all 9 model cards render without NaN.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 375, height: 812 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/tools/token-calculator`);
        await clickButtonByPattern(page, 'main', /^thẻ$/i);
        const text = await page.innerText('main');
        assert(!/\bNaN\b/.test(text), 'Mobile cards must contain zero NaN values');
        await assertNoHorizontalOverflow(page, 'T2-F10-5');
        return 2;
      });
    },
  },

  // =========================================================================
  // FEATURE #11 BOUNDARIES: /compare Edge Cases & Unit Formatting (5 tests)
  // =========================================================================
  {
    id: 'T2-F11-1',
    tier: 2,
    featureArea: 'F11-ModelComparison',
    name: '/compare SSR & Matrix free of Proprietary/Open Weights/Ultra-Fast/English bestFor',
    description: 'Audits /compare against Dictionary A & FORBIDDEN_COMPARE_MICROCOPY.',
    run: async (ctx) => auditRouteHttpAndCopy(ctx.baseUrl, '/compare', FORBIDDEN_COMPARE_MICROCOPY, 'T2-F11-1'),
  },
  {
    id: 'T2-F11-2',
    tier: 2,
    featureArea: 'F11-ModelComparison',
    name: 'ModelComparisonArena Advisor formats 2000k context cleanly as 2M (not 2000k)',
    description: 'Selects long-context goal in Advisor tab and checks Gemini 1.5 Pro context displays 2M, not 2000k.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/compare`);
        await clickButtonByPattern(page, 'main', /tư vấn|gợi ý/i);
        await clickButtonByPattern(page, 'main', /đọc tài liệu|tài liệu dài|ngữ cảnh/i);
        await page.waitForFunction(`document.body.innerText.includes('Gemini 1.5 Pro')`, 4000);
        const text = await page.innerText('main');
        assert(!text.includes('2000k'), 'Advisor must format 2000 context window as 2M, not 2000k');
        assertIncludes(text, '2M', 'Advisor must display 2M for Gemini 1.5 Pro context window');
        return 2;
      });
    },
  },
  {
    id: 'T2-F11-3',
    tier: 2,
    featureArea: 'F11-ModelComparison',
    name: '/compare zero-match search shows graceful empty state and resets cleanly',
    description: 'Searches "zzzz_no_model_999" on /compare Matrix and checks graceful empty state + clear.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/compare`);
        await page.fill('main input[type="text"]', 'zzzz_no_model_999');
        const vsBtns = await page.evaluate<number>(
          `Array.from(document.querySelectorAll('main button')).filter(b => b.getAttribute('role') !== 'tab' && /so sánh 1-đối-1|so sánh 1-vs-1|so sánh trực tiếp|đối chiếu/i.test((b.innerText || '').trim())).length`
        );
        assertEqual(vsBtns, 0, 'Zero-match search on /compare must show 0 model cards');
        await page.fill('main input[type="text"]', '');
        const restored = await page.evaluate<number>(
          `Array.from(document.querySelectorAll('main button')).filter(b => b.getAttribute('role') !== 'tab' && /so sánh 1-đối-1|so sánh 1-vs-1|so sánh trực tiếp|đối chiếu/i.test((b.innerText || '').trim())).length`
        );
        assertEqual(restored, 10, 'Clearing search must restore all 10 models');
        return 2;
      });
    },
  },
  {
    id: 'T2-F11-4',
    tier: 2,
    featureArea: 'F11-ModelComparison',
    name: '/compare Versus identical Model A and Model B renders safely without crash',
    description: 'Selects the same model for both Model A and Model B in Versus tab.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/compare`);
        await clickButtonByPattern(page, 'main [role="tablist"]', /so sánh 1-đối-1|so sánh trực diện|so sánh 1-vs-1/i);
        await page.waitForFunction(`document.querySelectorAll('main select').length === 2`, 4000);
        await page.evaluate<void>(`(() => {
          const selects = document.querySelectorAll('main select');
          Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set.call(selects[1], selects[0].value);
          selects[1].dispatchEvent(new Event('input', { bubbles: true }));
          selects[1].dispatchEvent(new Event('change', { bubbles: true }));
        })()`);
        assertNoPageErrors(page, 'T2-F11-4');
        return 1;
      });
    },
  },
  {
    id: 'T2-F11-5',
    tier: 2,
    featureArea: 'F11-ModelComparison',
    name: '/compare Versus & Advisor tabs clean of untranslated English micro-copy',
    description: 'Audits Versus and Advisor rendered DOM text against Dictionary A & FORBIDDEN_COMPARE_MICROCOPY.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/compare`);
        await clickButtonByPattern(page, 'main [role="tablist"]', /so sánh 1-đối-1|so sánh trực diện|so sánh 1-vs-1/i);
        const vText = await page.innerText('main');
        assertNoAcademicJargon(vText, 'T2-F11-5:versus');
        assertNoUntranslatedMicrocopy(vText, FORBIDDEN_COMPARE_MICROCOPY, 'T2-F11-5:versus');
        assert(!/\bN\/A\b/.test(vText), '/compare Versus tab must not display raw "N/A"');
        await clickButtonByPattern(page, 'main [role="tablist"]', /tư vấn|gợi ý/i);
        const aText = await page.innerText('main');
        assertNoAcademicJargon(aText, 'T2-F11-5:advisor');
        assertNoUntranslatedMicrocopy(aText, FORBIDDEN_COMPARE_MICROCOPY, 'T2-F11-5:advisor');
        assert(!/\bN\/A\b/.test(aText), '/compare Advisor tab must not display raw "N/A"');
        return 6;
      });
    },
  },

  // =========================================================================
  // FEATURE #12 BOUNDARIES: /agents Jargon Audit & Filter Edge Cases (5 tests)
  // =========================================================================
  {
    id: 'T2-F12-1',
    tier: 2,
    featureArea: 'F12-AgentBlueprints',
    name: '/agents SSR & DOM free of epistemic/Chernov/Boundary Engine/Dimensional Analysis/MAC/TE/sVirt',
    description: 'Audits /agents HTML, title, meta description, and visible DOM against Dictionary A & B.',
    run: async (ctx) => auditRouteHttpAndCopy(ctx.baseUrl, '/agents', [], 'T2-F12-1'),
  },
  {
    id: 'T2-F12-2',
    tier: 2,
    featureArea: 'F12-AgentBlueprints',
    name: '/agents zero-match search renders Vietnamese empty state and reset button restores all 14',
    description: 'Searches "zzzz_no_agent_999", verifies empty state, and clicks Xóa bộ lọc.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/agents`);
        await page.fill('main input[type="text"]', 'zzzz_no_agent_999');
        await page.waitForFunction(`document.body.innerText.includes('Không tìm thấy mẫu trợ lý phù hợp')`, 4000);
        await clickButtonByPattern(page, 'main', /xóa bộ lọc/i);
        await page.waitForFunction(`document.querySelectorAll('main a[href^="/playground?agent="]').length === 14`, 4000);
        return 2;
      });
    },
  },
  {
    id: 'T2-F12-3',
    tier: 2,
    featureArea: 'F12-AgentBlueprints',
    name: '/agents preserves all 14 AgentBlueprint IDs for Playground linking',
    description: 'Verifies all 14 preserved blueprint IDs are present in /playground?agent=<id> hrefs.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/agents`);
        const hrefs = await page.evaluate<string[]>(
          `Array.from(document.querySelectorAll('main a[href^="/playground?agent="]')).map(a => a.getAttribute('href') || '')`
        );
        const requiredIds = [
          'code-architect',
          'kiem-chung-khoa-hoc-agent',
          'database-performance-agent',
          'selinux-security-agent',
          'agile-testing-sdet-agent',
        ];
        for (let i = 0; i < requiredIds.length; i++) {
          assert(
            hrefs.some((h) => h.endsWith(`=${requiredIds[i]}`)),
            `Preserved AgentBlueprint ID "${requiredIds[i]}" missing from /agents links`
          );
        }
        // Verify legacy ?agent=epistemic-reality-agent alias normalizes URL cleanly without leaking academic jargon
        await page.goto(`${ctx.baseUrl}/playground?agent=epistemic-reality-agent`);
        await page.waitForFunction(
          `window.location.search.includes('kiem-chung-khoa-hoc-agent') && (document.querySelectorAll('main textarea')[0]?.value || '').length > 20`,
          5000
        );
        const pgText = await page.innerText('main');
        assertNoAcademicJargon(pgText, 'T2-F12-3:alias-playground');
        return requiredIds.length + 2;
      });
    },
  },
  {
    id: 'T2-F12-4',
    tier: 2,
    featureArea: 'F12-AgentBlueprints',
    name: '/agents search combined with category filter resets properly',
    description: 'Applies category pill + mismatching search, then clicks Xóa bộ lọc.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/agents`);
        await clickButtonByPattern(page, 'main', /pháp lý/i);
        await page.fill('main input[type="text"]', 'CryptoOnlyQuery');
        await page.waitForFunction(`document.body.innerText.includes('Không tìm thấy mẫu trợ lý phù hợp')`, 4000);
        await clickButtonByPattern(page, 'main', /xóa bộ lọc/i);
        const count = await page.count('main a[href^="/playground?agent="]');
        assertEqual(count, 14, 'Resetting combined filter must restore all 14 agents');
        return 2;
      });
    },
  },
  {
    id: 'T2-F12-5',
    tier: 2,
    featureArea: 'F12-AgentBlueprints',
    name: '/agents .cursorrules and CLAUDE.md blob URLs are non-empty',
    description: 'Verifies download triggers produce valid non-empty blob hrefs.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/agents`);
        await page.clickByText('main button', '.cursorrules');
        const downloads = await page.getCapturedDownloads();
        assert(downloads.length >= 1 && downloads[0].href.startsWith('blob:'), 'Download must generate a blob: URL');
        return 1;
      });
    },
  },
  {
    id: 'T2-F12-6',
    tier: 2,
    featureArea: 'F12-AgentBlueprints',
    name: 'All 14/14 /playground?agent=<id> blueprints + ?agent=nonexistent-agent-xyz fallback cleanly',
    description: 'Extracts all 14 blueprint IDs from /agents and loads each in /playground?agent=<id> plus unknown fallback.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/agents`);
        const agentLinks = await page.evaluate<string[]>(
          `Array.from(new Set(Array.from(document.querySelectorAll('main a[href^="/playground?agent="]')).map(a => a.getAttribute('href') || '')))`
        );
        assertEqual(agentLinks.length, 14, `Expected 14 unique /playground?agent=<id> blueprints, got ${agentLinks.length}`);

        for (let i = 0; i < agentLinks.length; i++) {
          const href = agentLinks[i];
          await page.goto(`${ctx.baseUrl}${href}`);
          await page.waitForFunction(
            `(document.querySelector('#pg-user-prompt')?.value || '').includes('[Yêu cầu mẫu cho ')`,
            5000
          );
          const state = await page.evaluate<{ sys: string; usr: string; mainText: string }>(`({
            sys: document.querySelector('#pg-system-prompt')?.value || '',
            usr: document.querySelector('#pg-user-prompt')?.value || '',
            mainText: document.querySelector('main')?.innerText || ''
          })`);
          assert(state.sys.trim().length > 30, `${href} must populate #pg-system-prompt`);
          assertIncludes(state.usr, '[Yêu cầu mẫu cho ', `${href} must populate #pg-user-prompt`);
          assertNoAcademicJargon(`${state.sys} ${state.usr} ${state.mainText}`, `T2-F12-6:${href}`);
          assertNoCjkNoise(`${state.sys} ${state.usr} ${state.mainText}`, `T2-F12-6:${href}`);
        }

        await page.goto(`${ctx.baseUrl}/playground?agent=nonexistent-agent-xyz`);
        await page.waitForFunction(
          `(document.querySelector('#pg-user-prompt')?.value || '').trim().length > 20`,
          5000
        );
        const fallbackUser = await page.evaluate<string>(`document.querySelector('#pg-user-prompt')?.value || ''`);
        assert(!fallbackUser.includes('nonexistent-agent-xyz'), 'Unknown ?agent= must fall back cleanly without leaking raw ID');
        assertNoPageErrors(page, 'T2-F12-6');
        return agentLinks.length * 3 + 2;
      });
    },
  },

  // =========================================================================
  // FEATURE #13 BOUNDARIES: Workflows & Playground Edge Cases (5 tests)
  // =========================================================================
  {
    id: 'T2-F13-1',
    tier: 2,
    featureArea: 'F13-WorkflowsPlayground',
    name: '/workflows SSR & UI free of Epistemic Auditor & English pipeline titles',
    description: 'Audits /workflows HTML, title, meta description, and visible DOM.',
    run: async (ctx) => auditRouteHttpAndCopy(ctx.baseUrl, '/workflows', FORBIDDEN_WORKFLOW_MICROCOPY, 'T2-F13-1'),
  },
  {
    id: 'T2-F13-2',
    tier: 2,
    featureArea: 'F13-WorkflowsPlayground',
    name: '/playground SSR & UI free of Interactive AI Sandbox / Temp: / (Run) / AI Output Terminal leaks',
    description: 'Audits /playground HTML, title, meta description, and visible DOM.',
    run: async (ctx) => auditRouteHttpAndCopy(ctx.baseUrl, '/playground', [], 'T2-F13-2'),
  },
  {
    id: 'T2-F13-3',
    tier: 2,
    featureArea: 'F13-WorkflowsPlayground',
    name: '/playground?agent=nonexistent-id-999 falls back gracefully with zero errors',
    description: 'Loads /playground with invalid ?agent= query and verifies fallback preset + zero uncaught errors.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/playground?agent=nonexistent-id-999`);
        const textareas = await page.evaluate<string[]>(
          `Array.from(document.querySelectorAll('main textarea')).map(t => t.value)`
        );
        assert(textareas.length >= 2 && textareas[1].trim().length > 0, 'Invalid ?agent= must fall back to default preset');
        assertNoPageErrors(page, 'T2-F13-3');
        return 2;
      });
    },
  },
  {
    id: 'T2-F13-4',
    tier: 2,
    featureArea: 'F13-WorkflowsPlayground',
    name: '/playground empty userPrompt blocks run and displays Vietnamese validation error',
    description: 'Clears User Prompt textarea, clicks Run, and verifies execution is prevented cleanly.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/playground`);
        await page.evaluate<void>(`(() => {
          const tas = document.querySelectorAll('main textarea');
          if (tas[1]) {
            Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set.call(tas[1], '   ');
            tas[1].dispatchEvent(new Event('input', { bubbles: true }));
          }
          const btn = Array.from(document.querySelectorAll('main button')).find(b => /chạy prompt|chạy thử|chạy mô phỏng|^chạy$/i.test((b.innerText || '').trim()));
          if (btn) btn.click();
        })()`);
        await page.waitForFunction(`document.body.innerText.includes('Vui lòng nhập nội dung câu lệnh')`, 4000);
        assertNoPageErrors(page, 'T2-F13-4');
        return 2;
      });
    },
  },
  {
    id: 'T2-F13-5',
    tier: 2,
    featureArea: 'F13-WorkflowsPlayground',
    name: '/workflows empty input disables "Chạy thử mô phỏng" button',
    description: 'Clears pipeline input on /workflows and confirms Run All button becomes disabled.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/workflows`);
        await page.fill('main input[type="text"]', '');
        const disabled = await page.evaluate<boolean>(`(() => {
          const btn = Array.from(document.querySelectorAll('main button')).find(b => /chạy thử mô phỏng|chạy toàn bộ/i.test((b.innerText || '').trim()));
          return btn ? btn.disabled : false;
        })()`);
        assert(disabled, 'Run All button on /workflows must be disabled when input is empty');
        return 1;
      });
    },
  },

  // =========================================================================
  // FEATURE #14 BOUNDARIES: Ecosystem, Playbooks, Cheatsheet & Quiz Audits (5 tests)
  // =========================================================================
  {
    id: 'T2-F14-1',
    tier: 2,
    featureArea: 'F14-ShowcaseQuiz',
    name: '/ecosystem SSR & UI free of Epistemic Science, D:\\ local-path framing & English status badges',
    description: 'Audits /ecosystem against Dictionary A & FORBIDDEN_ECOSYSTEM_MICROCOPY.',
    run: async (ctx) => auditRouteHttpAndCopy(ctx.baseUrl, '/ecosystem', FORBIDDEN_ECOSYSTEM_MICROCOPY, 'T2-F14-1'),
  },
  {
    id: 'T2-F14-2',
    tier: 2,
    featureArea: 'F14-ShowcaseQuiz',
    name: '/playbooks SSR & UI free of Chernov, raw LaTeX ($K_{cov}, W_{tc}$), and D:\\ paths',
    description: 'Audits /playbooks HTML and zero-match search empty state.',
    run: async (ctx) => {
      const n = await auditRouteHttpAndCopy(ctx.baseUrl, '/playbooks', [], 'T2-F14-2');
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/playbooks`);
        await page.fill('main input[type="text"]', 'zzzz_no_book_999');
        await page.waitForFunction(`document.body.innerText.includes('Không tìm thấy cẩm nang phù hợp')`, 4000);
        await clickButtonByPattern(page, 'main', /xóa bộ lọc/i);
        const restored = await page.count('main h3');
        assert(restored >= 10, 'Resetting /playbooks filter must restore all playbooks');
        return n + 2;
      });
    },
  },
  {
    id: 'T2-F14-3',
    tier: 2,
    featureArea: 'F14-ShowcaseQuiz',
    name: '/cheatsheet zero standalone "Copy" button, zero jargon, and zero-match filter safe',
    description: 'Audits /cheatsheet for standalone English Copy button and zero-match search behavior.',
    run: async (ctx) => {
      const n = await auditRouteHttpAndCopy(ctx.baseUrl, '/cheatsheet', [], 'T2-F14-3');
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/cheatsheet`);
        const cheatsheetText = await page.innerText('main');
        assert(!/\b(Input|Output):/i.test(cheatsheetText), '/cheatsheet must localize "Input:" and "Output:" labels');
        const btnTexts = await page.evaluate<string[]>(
          `Array.from(document.querySelectorAll('main button')).map(b => (b.innerText || '').trim())`
        );
        assert(!btnTexts.includes('Copy'), '/cheatsheet must localize standalone "Copy" button to Vietnamese');
        await page.fill('main input[type="text"]', 'zzzz_no_cheat_999');
        const cards = await page.count('main .card h3');
        assertEqual(cards, 0, 'Zero-match search on /cheatsheet must safely render 0 cards');
        await page.waitForFunction(`document.body.innerText.includes('Không tìm thấy mục tra cứu phù hợp')`, 4000);
        return n + 4;
      });
    },
  },
  {
    id: 'T2-F14-4',
    tier: 2,
    featureArea: 'F14-ShowcaseQuiz',
    name: '/learn/quiz free of Interactive Knowledge Assessment, hallucinate, and English rank badges',
    description: 'Audits /learn/quiz SSR & DOM text against Dictionary A & B.',
    run: async (ctx) => auditRouteHttpAndCopy(ctx.baseUrl, '/learn/quiz', [], 'T2-F14-4'),
  },
  {
    id: 'T2-F14-5',
    tier: 2,
    featureArea: 'F14-ShowcaseQuiz',
    name: '/learn/quiz prevents changing answer once option selected and blocks double-submit',
    description: 'Answers Q1 on /learn/quiz, verifies remaining option buttons are disabled after answer.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/learn/quiz`);
        await page.pressKey('1');
        await page.waitForFunction(
          `document.body.innerText.includes('Chính xác') || document.body.innerText.includes('Chưa đúng')`,
          4000
        );
        const allOptionsDisabled = await page.evaluate<boolean>(`(() => {
          const opts = Array.from(document.querySelectorAll('main button')).filter(b => /^[A-D]$/.test((b.querySelector('span')?.innerText || '').trim()));
          return opts.length === 4 && opts.every(b => b.disabled);
        })()`);
        assert(allOptionsDisabled, 'Option buttons must be disabled after selecting an answer');
        return 1;
      });
    },
  },

  // =========================================================================
  // FEATURE #15 BOUNDARIES: MDX & Search-Index Global Sweep (5 tests)
  // =========================================================================
  {
    id: 'T2-F15-1',
    tier: 2,
    featureArea: 'F15-MdxSearchIndex',
    name: 'chain-of-thought-reasoning.mdx free of hallucination, standalone CoT & raw English reasoning tags',
    description: 'Audits /skill/chain-of-thought-reasoning SSR HTML against Dictionary A, standalone CoT & raw headings.',
    run: async (ctx) => {
      const n = await auditRouteHttpAndCopy(ctx.baseUrl, '/skill/chain-of-thought-reasoning', [], 'T2-F15-1');
      const res = await fetchRoute(ctx.baseUrl, '/skill/chain-of-thought-reasoning');
      const text = stripHtml(res.html);
      assertNoStandaloneCoT(text, 'T2-F15-1');
      assert(!text.includes('Sanity Check'), 'CoT MDX should use Vietnamese instead of "Sanity Check"');
      return n + 2;
    },
  },
  {
    id: 'T2-F15-2',
    tier: 2,
    featureArea: 'F15-MdxSearchIndex',
    name: 'system-prompt-mastery.mdx free of academic jargon & raw uppercase English sections',
    description: 'Audits /skill/system-prompt-mastery SSR HTML against Dictionary A and uppercase English headers.',
    run: async (ctx) => {
      const n = await auditRouteHttpAndCopy(ctx.baseUrl, '/skill/system-prompt-mastery', [], 'T2-F15-2');
      const res = await fetchRoute(ctx.baseUrl, '/skill/system-prompt-mastery');
      const text = stripHtml(res.html);
      assert(!text.includes('GUARDRAILS & NEGATIVE CONSTRAINTS'), 'Must localize uppercase English section header');
      return n + 1;
    },
  },
  {
    id: 'T2-F15-3',
    tier: 2,
    featureArea: 'F15-MdxSearchIndex',
    name: 'soan-thao-email-chuyen-nghiep.mdx free of untranslated jargon (BLUF, tone of voice, Gentle nudge)',
    description: 'Audits /skill/soan-thao-email-chuyen-nghiep for everyday Vietnamese clarity.',
    run: async (ctx) => {
      const n = await auditRouteHttpAndCopy(ctx.baseUrl, '/skill/soan-thao-email-chuyen-nghiep', [], 'T2-F15-3');
      const res = await fetchRoute(ctx.baseUrl, '/skill/soan-thao-email-chuyen-nghiep');
      const text = stripHtml(res.html);
      assert(!/\bGentle nudge\b/i.test(text), 'Email MDX should explain gentle follow-up in Vietnamese');
      return n + 1;
    },
  },
  {
    id: 'T2-F15-4',
    tier: 2,
    featureArea: 'F15-MdxSearchIndex',
    name: 'quan-ly-man-hinh-con.mdx free of CJK noise (Ăn饭, Game暴力) & heavy English labels',
    description: 'Audits /skill/quan-ly-man-hinh-con for zero CJK characters and localized parenting terms.',
    run: async (ctx) => {
      const n = await auditRouteHttpAndCopy(ctx.baseUrl, '/skill/quan-ly-man-hinh-con', [], 'T2-F15-4');
      const res = await fetchRoute(ctx.baseUrl, '/skill/quan-ly-man-hinh-con');
      const text = stripHtml(res.html);
      assert(!/\bCo-viewing\b|\bDocking Station\b|\bTech contracts\b/i.test(text), 'Parenting MDX must localize English concepts');
      const extraM2Slugs = [
        '/skill/phong-cach-viet-copywriting-aida',
        '/skill/viet-bai-viet-seo-khoa-hoc',
        '/skill/biet-cach-doc-hop-dong',
        '/skill/ke-hoach-tai-chinh-gia-dinh',
        '/skill/xac-dinh-y-tuong-side-project',
      ];
      let extraChecks = 0;
      for (const slugRoute of extraM2Slugs) {
        extraChecks += await auditRouteHttpAndCopy(ctx.baseUrl, slugRoute, [], 'T2-F15-4');
      }
      return n + 1 + extraChecks;
    },
  },
  {
    id: 'T2-F15-5',
    tier: 2,
    featureArea: 'F15-MdxSearchIndex',
    name: 'public/search-index.json contains zero two-segment /skills/<cat>/<slug> broken URLs',
    description: 'Validates every internal URL in /search-index.json has valid route syntax and zero 404 patterns.',
    run: async (ctx) => {
      const idxRes = await fetchRoute(ctx.baseUrl, '/search-index.json');
      assertEqual(idxRes.status, 200, '/search-index.json must return HTTP 200');
      const parsed = JSON.parse(idxRes.html) as {
        documents: Array<{ id: string; type: string; url: string }>;
      };
      const broken: string[] = [];
      for (let i = 0; i < parsed.documents.length; i++) {
        const doc = parsed.documents[i];
        if (!doc.url || !doc.url.startsWith('/')) continue;
        if (/^\/skills?\/[^/]+\/[^/]+/.test(doc.url) || /^\/categories\/[^/]+/.test(doc.url)) {
          broken.push(`${doc.id} -> ${doc.url}`);
        }
      }
      assertEqual(
        broken.length,
        0,
        `search-index.json must not emit 2-segment /skills/<cat>/<slug> or /categories/<slug> 404 URLs (found ${broken.slice(0, 3).join(', ')})`
      );
      return 2;
    },
  },
  {
    id: 'T2-F15-6',
    tier: 2,
    featureArea: 'F15-MdxSearchIndex',
    name: 'Exhaustive sweep of 55/55 /skill/<slug> & 16/16 /category/<slug> routes (HTTP 200, canonical/og:url, localized tags, zero cot/jargon/CJK)',
    description: 'Audits every skill MDX slug and every category ID against live server HTML and SEO head metadata.',
    run: async (ctx) => {
      const skillsRoot = path.join(process.cwd(), 'src', 'content', 'skills');
      const skillSlugs: string[] = [];
      const walkSkills = (dir: string) => {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const full = path.join(dir, entry.name);
          if (entry.isDirectory()) walkSkills(full);
          else if (entry.name.endsWith('.mdx')) skillSlugs.push(entry.name.replace(/\.mdx$/, ''));
        }
      };
      walkSkills(skillsRoot);
      skillSlugs.sort();
      assertEqual(skillSlugs.length, 55, `Expected 55 skill MDX files, found ${skillSlugs.length}`);

      const categorySlugs = [
        'prompt-engineering',
        'learning',
        'work',
        'writing',
        'coding',
        'design',
        'finance',
        'health',
        'family',
        'travel',
        'home',
        'parenting',
        'legal',
        'sideproject',
        'research',
        'entertainment',
      ];
      assertEqual(categorySlugs.length, 16, 'Expected 16 canonical categories');

      let checks = 0;
      for (const slug of skillSlugs) {
        const routePath = `/skill/${slug}`;
        const res = await fetchRoute(ctx.baseUrl, routePath);
        assertEqual(res.status, 200, `${routePath} must return HTTP 200`);
        assertCanonicalAndOgUrl(res.html, routePath, `T2-F15-6:${routePath}`);
        const text = stripHtml(res.html);
        assertNoAcademicJargon(text, `T2-F15-6:${routePath}`);
        assertNoCjkNoise(text, `T2-F15-6:${routePath}`);
        assertNoStandaloneCoT(text, `T2-F15-6:${routePath}`);
        if (slug === 'chain-of-thought-reasoning') {
          assertIncludes(text, 'Suy luận từng bước', 'chain-of-thought-reasoning must render Vietnamese tag label');
        }
        if (slug === 'api-design-rest-graphql') {
          assert(!text.includes('Nghỉ ngơi phục hồi'), '/skill/api-design-rest-graphql must NOT display "Nghỉ ngơi phục hồi"');
          assertIncludes(text, 'Kiến trúc REST API', '/skill/api-design-rest-graphql must display "Kiến trúc REST API"');
        }
        checks += 5;
      }

      for (const catSlug of categorySlugs) {
        const routePath = `/category/${catSlug}`;
        const res = await fetchRoute(ctx.baseUrl, routePath);
        assertEqual(res.status, 200, `${routePath} must return HTTP 200`);
        assertCanonicalAndOgUrl(res.html, routePath, `T2-F15-6:${routePath}`);
        const text = stripHtml(res.html);
        assertNoAcademicJargon(text, `T2-F15-6:${routePath}`);
        assertNoCjkNoise(text, `T2-F15-6:${routePath}`);
        assertNoStandaloneCoT(text, `T2-F15-6:${routePath}`);
        if (catSlug === 'coding') {
          assert(!text.includes('Nghỉ ngơi phục hồi'), '/category/coding must NOT display "Nghỉ ngơi phục hồi"');
          assertIncludes(text, 'Kiến trúc REST API', '/category/coding must display "Kiến trúc REST API"');
        }
        checks += 5;
      }

      // Verify public/search-index.json documents have 0 unmapped tags (including category:*) in TAG_LABELS / resolveTagLabel
      const searchIdxRes = await fetchRoute(ctx.baseUrl, '/search-index.json');
      assertEqual(searchIdxRes.status, 200, 'T2-F15-6: /search-index.json must return HTTP 200');
      const searchIdx = JSON.parse(searchIdxRes.html) as {
        documents: Array<{ id: string; type: string; tags?: string[] }>;
      };
      const unmappedTags: string[] = [];
      for (const doc of searchIdx.documents) {
        for (const tag of doc.tags || []) {
          const trimmed = tag.trim();
          if (!trimmed) continue;
          const mapped = TAG_LABELS[trimmed] ?? TAG_LABELS[trimmed.toLowerCase()];
          if (!mapped) {
            unmappedTags.push(`${doc.id}:${tag}->${resolveTagLabel(tag)}`);
          }
        }
      }
      assertEqual(
        unmappedTags.length,
        0,
        `All search-index.json document tags (including category:*) must map in TAG_LABELS (unmapped: ${unmappedTags.slice(0, 5).join(', ')})`
      );
      checks += 2;

      // Also verify Homepage FeaturedPrompts renders Vietnamese tags instead of raw #tai-chinh / #ngan-sach
      const homeRes = await fetchRoute(ctx.baseUrl, '/');
      const homeText = stripHtml(homeRes.html);
      assert(!homeText.includes('#tai-chinh') && !homeText.includes('#ngan-sach'), 'Homepage FeaturedPrompts must render localized Vietnamese tags');
      assertIncludes(homeText, '#Tài chính cá nhân', 'Homepage FeaturedPrompts must display #Tài chính cá nhân');
      return checks + 2;
    },
  },
];
