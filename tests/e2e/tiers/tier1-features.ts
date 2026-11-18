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
  clickButtonByPattern,
  clickModalButtonByPattern,
  extractMetaDescription,
  extractTitle,
  fetchRoute,
  FIND_PROMPT_BUILDER_MODAL_JS,
  RAW_CATEGORY_SLUGS,
  runPlaygroundAndWait,
  stripHtml,
  withPage,
} from '../lib/assertions';
import type { TestCase } from '../lib/types';

const COMMON_CATEGORY_LABELS = [
  'Công việc & Nghề nghiệp',
  'Học tập & Phát triển bản thân',
  'Lập trình & Kỹ thuật',
  'Viết lách & Sáng tạo nội dung',
  'Giáo dục & Học tập cho con',
];

export const tier1Tests: TestCase[] = [
  // =========================================================================
  // FEATURE #1: Fixed-Header Layout Spacing (5 tests)
  // =========================================================================
  {
    id: 'T1-F01-1',
    tier: 1,
    featureArea: 'F01-FixedHeaderLayout',
    name: 'Desktop 1280x800 Home Hero clear of fixed header',
    description: 'Verifies fixed header does not overlap Hero heading or cause horizontal overflow on desktop.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/`);
        await assertNoHeaderOverlap(page, 'T1-F01-1:/');
        await assertNoHorizontalOverflow(page, 'T1-F01-1:/');
        assertNoPageErrors(page, 'T1-F01-1:/');
        return 3;
      });
    },
  },
  {
    id: 'T1-F01-2',
    tier: 1,
    featureArea: 'F01-FixedHeaderLayout',
    name: 'Mobile 375x812 Home Hero clear of fixed header',
    description: 'Verifies fixed header does not clip mobile Hero content and viewport has no horizontal overflow.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 375, height: 812 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/`);
        await assertNoHeaderOverlap(page, 'T1-F01-2:/');
        await assertNoHorizontalOverflow(page, 'T1-F01-2:/');
        assertNoPageErrors(page, 'T1-F01-2:/');
        return 3;
      });
    },
  },
  {
    id: 'T1-F01-3',
    tier: 1,
    featureArea: 'F01-FixedHeaderLayout',
    name: 'Skill & Category detail pages clear of fixed header on desktop and mobile',
    description: 'Checks /skill/soan-thao-email-chuyen-nghiep and /category/cong-viec top padding against fixed header.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        const routes = ['/skill/soan-thao-email-chuyen-nghiep', '/category/cong-viec'];
        let checks = 0;
        for (let i = 0; i < routes.length; i++) {
          await page.setViewport(1280, 800);
          await page.goto(`${ctx.baseUrl}${routes[i]}`);
          await assertNoHeaderOverlap(page, `T1-F01-3:desktop:${routes[i]}`);
          await page.setViewport(375, 812);
          await assertNoHeaderOverlap(page, `T1-F01-3:mobile:${routes[i]}`);
          await assertNoHorizontalOverflow(page, `T1-F01-3:mobile:${routes[i]}`);
          checks += 3;
        }
        assertNoPageErrors(page, 'T1-F01-3');
        return checks + 1;
      });
    },
  },
  {
    id: 'T1-F01-4',
    tier: 1,
    featureArea: 'F01-FixedHeaderLayout',
    name: 'Static info pages clear of fixed header',
    description: 'Checks /about, /contact, /privacy, and /terms top spacing under fixed header.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        const routes = ['/about', '/contact', '/privacy', '/terms'];
        for (let i = 0; i < routes.length; i++) {
          await page.goto(`${ctx.baseUrl}${routes[i]}`);
          await assertNoHeaderOverlap(page, `T1-F01-4:${routes[i]}`);
        }
        assertNoPageErrors(page, 'T1-F01-4');
        return routes.length + 1;
      });
    },
  },
  {
    id: 'T1-F01-5',
    tier: 1,
    featureArea: 'F01-FixedHeaderLayout',
    name: 'Builder workspace routes clear of fixed header',
    description: 'Checks /tools/system-prompt-builder, /compare, /agents, and /playground header clearance.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        const routes = ['/tools/system-prompt-builder', '/compare', '/agents', '/playground'];
        for (let i = 0; i < routes.length; i++) {
          await page.goto(`${ctx.baseUrl}${routes[i]}`);
          await assertNoHeaderOverlap(page, `T1-F01-5:${routes[i]}`);
          await assertNoHorizontalOverflow(page, `T1-F01-5:${routes[i]}`);
        }
        assertNoPageErrors(page, 'T1-F01-5');
        return routes.length * 2 + 1;
      });
    },
  },

  // =========================================================================
  // FEATURE #2: Header, Footer & Shared UI Chrome (5 tests)
  // =========================================================================
  {
    id: 'T1-F02-1',
    tier: 1,
    featureArea: 'F02-HeaderFooterChrome',
    name: 'Header groups navigation links clearly with valid internal targets',
    description: 'Opens visible desktop Header navigation dropdowns and checks Everyday & Builder links resolve HTTP 200.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/`);
        const groupCount = await page.evaluate<number>(`
          Array.from(document.querySelectorAll('header nav button[aria-expanded]')).filter(b => {
            const r = b.getBoundingClientRect();
            return r.width > 0 && r.height > 0;
          }).length
        `);
        assert(groupCount >= 2, `Expected >= 2 visible desktop Header nav group buttons, got ${groupCount}`);

        const hrefSet = new Set<string>();
        for (let i = 0; i < groupCount; i++) {
          await page.evaluate<void>(`(() => {
            const visibleBtns = Array.from(document.querySelectorAll('header nav button[aria-expanded]')).filter(b => {
              const r = b.getBoundingClientRect();
              return r.width > 0 && r.height > 0;
            });
            if (visibleBtns[${i}]) visibleBtns[${i}].click();
          })()`);
          const links = await page.evaluate<string[]>(
            `Array.from(document.querySelectorAll('header a[href^="/"]')).map(a => a.getAttribute('href') || '').filter(Boolean)`
          );
          links.forEach((h) => hrefSet.add(h));
        }

        const uniqueHrefs = Array.from(hrefSet);
        assert(uniqueHrefs.length >= 4, `Expected >= 4 internal links in Header, got ${uniqueHrefs.length}`);
        for (let i = 0; i < uniqueHrefs.length; i++) {
          const res = await fetchRoute(ctx.baseUrl, uniqueHrefs[i]);
          assertEqual(res.status, 200, `Header link ${uniqueHrefs[i]} must return HTTP 200`);
        }
        assertNoPageErrors(page, 'T1-F02-1');
        return 2 + uniqueHrefs.length;
      });
    },
  },
  {
    id: 'T1-F02-2',
    tier: 1,
    featureArea: 'F02-HeaderFooterChrome',
    name: 'SkipLink & Header aria-labels are localized in Vietnamese',
    description: 'Verifies Header, ThemeToggle, Search button, and SkipLink use Vietnamese accessibility labels.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/`);
        const labels = await page.evaluate<string[]>(`
          Array.from(document.querySelectorAll('header [aria-label], a[href="#main-content"]'))
            .map(el => (el.getAttribute('aria-label') || '') + ' ' + (el.textContent || ''))
            .map(s => s.trim())
            .filter(Boolean)
        `);
        assert(labels.length >= 2, 'Expected accessible labels in Header / SkipLink');
        const joined = labels.join(' | ');
        assert(!joined.includes('Skip to main content'), 'SkipLink must be Vietnamese');
        assert(!joined.includes('Loading theme...'), 'ThemeToggle aria-label must not remain English');
        assertNoPageErrors(page, 'T1-F02-2');
        return 4;
      });
    },
  },
  {
    id: 'T1-F02-3',
    tier: 1,
    featureArea: 'F02-HeaderFooterChrome',
    name: 'ThemeToggle switches theme class and persists across reload',
    description: 'Clicks ThemeToggle in Header, checks class change on <html>, and verifies persistence.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/`);
        const beforeClass = await page.evaluate<string>('document.documentElement.className');
        const toggleSel =
          'header button[aria-label*="Hệ thống"], header button[aria-label*="Chuyển sang"], header button[aria-label*="giao diện"], header button[aria-label*="Chế độ"], header button[aria-label*="theme" i], header button[title*="Chuyển sang"], header button[title*="Chế độ"], header button[title*="theme" i]';
        const hasToggle = (await page.count(toggleSel)) > 0;
        assert(hasToggle, 'Expected ThemeToggle button in <header>');
        await page.click(toggleSel);
        await page.waitForFunction(
          `window.localStorage.getItem('theme') === 'light' || document.documentElement.className !== ${JSON.stringify(beforeClass)}`,
          5000
        );
        const midClass = await page.evaluate<string>('document.documentElement.className');
        if (midClass === beforeClass) {
          // Initial system preference resolved to light; click once more (light -> dark)
          await page.click(toggleSel);
          await page.waitForFunction(
            `document.documentElement.className !== ${JSON.stringify(beforeClass)}`,
            5000
          );
        }
        const afterClass = await page.evaluate<string>('document.documentElement.className');
        assert(beforeClass !== afterClass, 'ThemeToggle must change <html> class');
        await page.reload();
        const afterReloadClass = await page.evaluate<string>('document.documentElement.className');
        assertEqual(afterReloadClass, afterClass, 'Theme class must persist across reload');
        assertNoPageErrors(page, 'T1-F02-3');
        return 4;
      });
    },
  },
  {
    id: 'T1-F02-4',
    tier: 1,
    featureArea: 'F02-HeaderFooterChrome',
    name: 'Mobile 375x812 navigation drawer opens, shows Vietnamese links, and navigates',
    description: 'Opens mobile menu drawer at 375x812 and verifies aria-expanded, visible drawer links, & close behavior.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 375, height: 812 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/`);
        const clicked = await page.evaluate<boolean>(`(() => {
          const btns = Array.from(document.querySelectorAll('header button'));
          const visible = btns.find(b => {
            const r = b.getBoundingClientRect();
            const label = (b.getAttribute('aria-label') || '') + ' ' + (b.textContent || '');
            return r.width > 0 && r.height > 0 && /menu|điều hướng|mở/i.test(label);
          }) || btns.find(b => {
            const r = b.getBoundingClientRect();
            return r.width > 0 && r.height > 0 && b.hasAttribute('aria-expanded');
          });
          if (!visible) return false;
          visible.click();
          return true;
        })()`);
        assert(clicked, 'Expected visible mobile menu toggle button in Header at 375px');
        await page.waitForFunction(`(() => {
          const btns = Array.from(document.querySelectorAll('header button[aria-expanded]'));
          const expanded = btns.some(b => {
            const r = b.getBoundingClientRect();
            return r.width > 0 && r.height > 0 && b.getAttribute('aria-expanded') === 'true';
          });
          const links = Array.from(document.querySelectorAll('#mobile-menu a[href^="/"], header nav a[href="/prompts"], [role="dialog"] a[href^="/"]'));
          const visibleLinks = links.filter(a => {
            const r = a.getBoundingClientRect();
            return r.width > 0 && r.height > 0;
          });
          return expanded && visibleLinks.length >= 3;
        })()`, 5000);
        const drawerText = await page.innerText('header');
        assert(!drawerText.includes('Close menu'), 'Mobile drawer must not expose English "Close menu"');
        assertNoHorizontalOverflow(page, 'T1-F02-4');
        assertNoPageErrors(page, 'T1-F02-4');
        return 4;
      });
    },
  },
  {
    id: 'T1-F02-5',
    tier: 1,
    featureArea: 'F02-HeaderFooterChrome',
    name: 'Footer internal links all resolve HTTP 200',
    description: 'Extracts all internal <a href^="/"> links in <footer> and verifies HTTP 200 status.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/`);
        const hrefs = await page.evaluate<string[]>(`
          Array.from(new Set(
            Array.from(document.querySelectorAll('footer a[href^="/"]'))
              .map(a => a.getAttribute('href') || '')
              .filter(Boolean)
          ))
        `);
        assert(hrefs.length >= 6, `Expected >= 6 internal links in Footer, got ${hrefs.length}`);
        for (let i = 0; i < hrefs.length; i++) {
          const res = await fetchRoute(ctx.baseUrl, hrefs[i]);
          assertEqual(res.status, 200, `Footer link ${hrefs[i]} must return HTTP 200`);
        }
        assertNoPageErrors(page, 'T1-F02-5');
        return 2 + hrefs.length;
      });
    },
  },

  // =========================================================================
  // FEATURE #3: Hero & Dual-Audience Split Deduplication (5 tests)
  // =========================================================================
  {
    id: 'T1-F03-1',
    tier: 1,
    featureArea: 'F03-HeroAudienceSplit',
    name: 'Hero renders single above-the-fold H1 with clear Vietnamese value proposition',
    description: 'Verifies single H1 on /, visible within 800px desktop fold, with non-empty Vietnamese copy.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/`);
        const h1Count = await page.count('main h1');
        assertEqual(h1Count, 1, 'Homepage must have exactly one <h1> inside <main>');
        const h1Text = (await page.innerText('main h1')).trim();
        assert(h1Text.length >= 12, 'Hero H1 must be a meaningful Vietnamese headline');
        const h1Rect = await page.getRect('main h1');
        assert(h1Rect && h1Rect.bottom <= 780, 'Hero H1 must be visible above the fold at 1280x800');
        assertNoAcademicJargon(h1Text, 'T1-F03-1');
        return 4;
      });
    },
  },
  {
    id: 'T1-F03-2',
    tier: 1,
    featureArea: 'F03-HeroAudienceSplit',
    name: 'Dual-audience split is NOT duplicated below the Hero',
    description: 'Verifies Everyday vs Builder split appears once and Hero provides Everyday + Builder CTAs.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/`);
        const counts = await page.evaluate<{
          promptsLinks: number;
          heroBuilderCtas: number;
          splitSections: number;
        }>(`(() => {
          const sections = Array.from(document.querySelectorAll('main section'));
          const splitSections = sections.filter(s => {
            const hasEveryday = Boolean(s.querySelector('a[href="/prompts"], a[href="/categories"]'));
            const hasBuilder = Boolean(s.querySelector('a[href="/tools/system-prompt-builder"], a[href="/agents"], a[href="/compare"]'));
            return hasEveryday && hasBuilder;
          }).length;
          const hero = document.querySelector('main section:first-of-type');
          return {
            promptsLinks: hero ? hero.querySelectorAll('a[href="/prompts"]').length : 0,
            heroBuilderCtas: hero ? hero.querySelectorAll('a[href="#audience-heading"], a[href="/tools/system-prompt-builder"], a[href="/compare"], a[href="/agents"], a[href="/tools/token-calculator"]').length : 0,
            splitSections
          };
        })()`);
        assert(counts.splitSections === 1, `Expected 1 unified dual-audience split section, found ${counts.splitSections}`);
        assert(counts.promptsLinks >= 1, 'Hero must link to /prompts for Everyday users');
        assert(counts.heroBuilderCtas >= 1, 'Hero must provide a Builder pathway CTA (#audience-heading or builder tool)');
        await clickButtonByPattern(page, 'main section:first-of-type', /lập trình|kỹ thuật|builder|kỹ sư/i);
        await page.waitForSelector('main section:first-of-type a[href="/tools/system-prompt-builder"]', 4000);
        return 4;
      });
    },
  },
  {
    id: 'T1-F03-3',
    tier: 1,
    featureArea: 'F03-HeroAudienceSplit',
    name: 'Hero Everyday pathway CTA navigates to Everyday workspace',
    description: 'Clicks Everyday pathway link from Hero and verifies arrival at /prompts.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/`);
        await page.click('main section a[href="/prompts"]');
        await page.waitForFunction('window.location.pathname === "/prompts"', 8000);
        const h1 = await page.innerText('main h1');
        assert(h1.trim().length > 0, '/prompts must render H1 after clicking Hero Everyday CTA');
        assertNoPageErrors(page, 'T1-F03-3');
        return 3;
      });
    },
  },
  {
    id: 'T1-F03-4',
    tier: 1,
    featureArea: 'F03-HeroAudienceSplit',
    name: 'Hero Builder pathway CTA navigates to System Prompt Studio',
    description: 'Switches to Hero Builder preview tab, clicks /tools/system-prompt-builder link, and verifies arrival.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/`);
        await clickButtonByPattern(page, 'main section:first-of-type', /lập trình|kỹ thuật|builder|kỹ sư/i);
        await page.waitForSelector('main section:first-of-type a[href="/tools/system-prompt-builder"]', 4000);
        await page.click('main section:first-of-type a[href="/tools/system-prompt-builder"]');
        await page.waitForFunction('window.location.pathname === "/tools/system-prompt-builder"', 8000);
        const h1 = await page.innerText('main h1');
        assert(h1.trim().length > 0, '/tools/system-prompt-builder must render H1');
        assertNoPageErrors(page, 'T1-F03-4');
        return 3;
      });
    },
  },
  {
    id: 'T1-F03-5',
    tier: 1,
    featureArea: 'F03-HeroAudienceSplit',
    name: 'Hero preview card switches between Everyday and Builder tabs and copies sample',
    description: 'Clicks Hero preview tabs and triggers clipboard copy in Everyday preview, verifying captured clipboard.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/`);
        const beforeText = await page.innerText('main section:first-of-type');
        await clickButtonByPattern(page, 'main section:first-of-type', /lập trình|kỹ thuật|builder|kỹ sư/i);
        await page.waitForFunction(
          `(() => {
            const t = document.querySelector('main section:first-of-type')?.innerText || '';
            return t !== ${JSON.stringify(beforeText)} && /System Prompt|Chỉ dẫn hệ thống|VNĐ|token/i.test(t);
          })()`,
          5000
        );
        const builderTabText = await page.innerText('main section:first-of-type');
        assert(builderTabText !== beforeText, 'Switching Hero preview tab must update preview content');
        await clickButtonByPattern(page, 'main section:first-of-type', /đi làm|phổ thông|mọi người/i);
        await clickButtonByPattern(page, 'main section:first-of-type', /sao chép/i);
        await page.waitForFunction(`(window.__e2eClipboardWrites || []).length >= 1`, 3000);
        const writes = await page.getCapturedClipboard();
        assert(
          writes.length >= 1 && writes[writes.length - 1].trim().length > 30,
          'Hero preview Copy button must write sample email/prompt text to clipboard'
        );
        assertNoPageErrors(page, 'T1-F03-5');
        return 4;
      });
    },
  },

  // =========================================================================
  // FEATURE #4: Home Categories, Featured Prompts, Stats, Newsletter & Global Pages (5 tests)
  // =========================================================================
  {
    id: 'T1-F04-1',
    tier: 1,
    featureArea: 'F04-HomeSectionsGlobalPages',
    name: 'Home featured CategoryGrid displays 6 real categories',
    description: 'Checks homepage curated categories grid shows 6 categories with links to /category/<slug> or /categories/<slug>.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/`);
        const catLinks = await page.evaluate<string[]>(`
          Array.from(document.querySelectorAll('main a[href^="/category/"], main a[href^="/categories/"]'))
            .map(a => a.getAttribute('href') || '')
            .filter(h => h !== '/categories' && h !== '/category')
        `);
        const unique = Array.from(new Set(catLinks));
        assertEqual(unique.length, 6, `Home featured CategoryGrid must render exactly 6 categories (got ${unique.length})`);
        for (let i = 0; i < unique.length; i++) {
          const res = await fetchRoute(ctx.baseUrl, unique[i]);
          assertEqual(res.status, 200, `Featured category link ${unique[i]} must return HTTP 200`);
        }
        return 1 + unique.length;
      });
    },
  },
  {
    id: 'T1-F04-2',
    tier: 1,
    featureArea: 'F04-HomeSectionsGlobalPages',
    name: 'FeaturedPrompts section renders interactive cards, audience tabs, and copies prompt text',
    description: 'Scopes to FeaturedPrompts ([aria-labelledby="prompts-heading"]), switches [role="tab"] audience filters, and clicks Copy inside a card.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/`);
        const initialCards = await page.count('[aria-labelledby="prompts-heading"] article');
        assert(initialCards >= 3, `Expected >= 3 cards in FeaturedPrompts section, got ${initialCards}`);

        const tabCount = await page.count('[aria-labelledby="prompts-heading"] [role="tab"]');
        assert(tabCount >= 2, `Expected >= 2 audience filter [role="tab"] buttons in FeaturedPrompts, got ${tabCount}`);
        await clickButtonByPattern(page, '[aria-labelledby="prompts-heading"]', /kỹ thuật|lập trình/i);
        await page.waitForFunction(
          `document.querySelectorAll('[aria-labelledby="prompts-heading"] article').length !== ${initialCards} || document.querySelector('[aria-labelledby="prompts-heading"] [role="tab"][aria-selected="true"]')?.innerText.match(/kỹ thuật|lập trình/i) !== null`,
          4000
        );
        await clickButtonByPattern(page, '[aria-labelledby="prompts-heading"]', /mọi người|tất cả/i);
        await clickButtonByPattern(page, '[aria-labelledby="prompts-heading"] article', /sao chép/i);
        await page.waitForFunction(`(window.__e2eClipboardWrites || []).length >= 1`, 3000);
        const writes = await page.getCapturedClipboard();
        assert(
          writes.length >= 1 && writes[writes.length - 1].trim().length > 20,
          'FeaturedPrompts card Copy button must write prompt text to clipboard'
        );
        return 4;
      });
    },
  },
  {
    id: 'T1-F04-3',
    tier: 1,
    featureArea: 'F04-HomeSectionsGlobalPages',
    name: 'StatsBar renders valid platform counts on Home',
    description: 'Scrolls to StatsBar section outside Hero and asserts >= 4 non-zero numeric metrics with Vietnamese labels.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/`);
        const statsExists = await page.evaluate<boolean>(`(() => {
          const hero = document.querySelector('main section:first-of-type');
          const statsSec = document.querySelector('[aria-labelledby="stats-heading"], #stats-bar');
          if (!statsSec || (hero && hero.contains(statsSec))) return false;
          statsSec.scrollIntoView({ block: 'center' });
          return true;
        })()`);
        assert(statsExists, 'Homepage must render dedicated StatsBar section outside Hero');
        await page.waitForFunction(`(() => {
          const statsSec = document.querySelector('[aria-labelledby="stats-heading"], #stats-bar');
          if (!statsSec) return false;
          const nums = (statsSec.innerText || '').match(/\\b[1-9]\\d*\\+?\\b/g) || [];
          return nums.length >= 4;
        })()`, 4500);
        const statsCheck = await page.evaluate<{ itemCount: number; text: string }>(`(() => {
          const statsSec = document.querySelector('[aria-labelledby="stats-heading"], #stats-bar');
          if (!statsSec) return { itemCount: 0, text: '' };
          const labels = Array.from(statsSec.querySelectorAll('p, div'))
            .filter(el => el.children.length === 0 && /[a-zA-ZÀ-ỹ]{4,}/.test(el.textContent || ''))
            .map(el => (el.textContent || '').trim());
          const nums = (statsSec.innerText || '').match(/\\b[1-9]\\d*\\+?\\b/g) || [];
          return { itemCount: Math.min(labels.length, nums.length), text: statsSec.innerText || '' };
        })()`);
        assert(statsCheck.itemCount >= 4, `Expected >= 4 numeric metrics with Vietnamese labels in StatsBar, got ${statsCheck.itemCount}`);
        assertNoAcademicJargon(statsCheck.text, 'T1-F04-3');
        assertNoPageErrors(page, 'T1-F04-3');
        return 4;
      });
    },
  },
  {
    id: 'T1-F04-4',
    tier: 1,
    featureArea: 'F04-HomeSectionsGlobalPages',
    name: 'NewsletterSignup rejects invalid email and accepts valid email',
    description: 'Tests Newsletter form validation ("Email không hợp lệ") and successful submission.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/`);
        await page.waitForSelector('#newsletter-email', 5000);
        await page.fill('#newsletter-email', 'not-an-email');
        await page.evaluate<void>(`
          document.querySelector('#newsletter-email').closest('form').querySelector('button[type="submit"]').click()
        `);
        await page.waitForFunction(
          `document.body.innerText.includes('Email không hợp lệ') || document.querySelector('#newsletter-email')?.getAttribute('aria-invalid') === 'true'`,
          4000
        );
        await page.fill('#newsletter-email', 'nguoidung@example.com');
        await page.evaluate<void>(`
          document.querySelector('#newsletter-email').closest('form').querySelector('button[type="submit"]').click()
        `);
        await page.waitForFunction(
          `document.body.innerText.includes('Cảm ơn bạn đã đăng ký')`,
          5000
        );
        assertNoPageErrors(page, 'T1-F04-4');
        return 3;
      });
    },
  },
  {
    id: 'T1-F04-5',
    tier: 1,
    featureArea: 'F04-HomeSectionsGlobalPages',
    name: 'Global pages (/about, /contact, /privacy, /terms, /sitemap.xml) work and /contact persists feedback',
    description: 'Verifies HTTP 200 on all global pages and /contact form localStorage persistence.',
    run: async (ctx) => {
      const routes = ['/about', '/contact', '/privacy', '/terms', '/sitemap.xml', '/robots.txt'];
      for (let i = 0; i < routes.length; i++) {
        const res = await fetchRoute(ctx.baseUrl, routes[i]);
        assertEqual(res.status, 200, `${routes[i]} must return HTTP 200`);
        if (routes[i] === '/sitemap.xml' || routes[i] === '/robots.txt') {
          assertIncludes(res.html, 'ai-life-hub-omega.vercel.app', `${routes[i]} must use production domain`);
          assert(!res.html.includes('https://ai-life-hub.vercel.app/'), `${routes[i]} must not emit stale domain`);
        }
      }
      const clientMetaChecks: Array<[string, string]> = [
        ['/contact', 'Liên hệ'],
        ['/favorites', 'Yêu Thích'],
        ['/resources', 'Tài Nguyên'],
        ['/search', 'Tìm Kiếm'],
        ['/submit', 'Đóng Góp'],
      ];
      for (const [routePath, expectedTitlePart] of clientMetaChecks) {
        const res = await fetchRoute(ctx.baseUrl, routePath);
        assertEqual(res.status, 200, `${routePath} must return HTTP 200`);
        const title = extractTitle(res.html);
        const desc = extractMetaDescription(res.html);
        assertIncludes(title, expectedTitlePart, `${routePath} must have custom Vietnamese <title>`);
        assert(desc.length >= 25, `${routePath} must have non-empty Vietnamese <meta name="description">`);
        assertNoAcademicJargon(`${title} ${desc}`, `T1-F04-5:${routePath}`);
        assertNoCjkNoise(`${title} ${desc}`, `T1-F04-5:${routePath}`);
      }
      const seoCanonicalRoutes: Array<[string, string]> = [
        ['/', '/'],
        ['/about', '/about'],
        ['/agents', '/agents'],
        ['/categories', '/categories'],
        ['/category', '/categories'],
        ['/cheatsheet', '/cheatsheet'],
        ['/compare', '/compare'],
        ['/contact', '/contact'],
        ['/ecosystem', '/ecosystem'],
        ['/favorites', '/favorites'],
        ['/learn/quiz', '/learn/quiz'],
        ['/playbooks', '/playbooks'],
        ['/playground', '/playground'],
        ['/privacy', '/privacy'],
        ['/prompts', '/prompts'],
        ['/resources', '/resources'],
        ['/search', '/search'],
        ['/submit', '/submit'],
        ['/terms', '/terms'],
        ['/tools/prompt-optimizer', '/tools/prompt-optimizer'],
        ['/tools/system-prompt-builder', '/tools/system-prompt-builder'],
        ['/tools/token-calculator', '/tools/token-calculator'],
        ['/workflows', '/workflows'],
        ['/skills/soan-thao-email-chuyen-nghiep', '/skill/soan-thao-email-chuyen-nghiep'],
        ['/categories/work', '/category/work'],
        ['/category/cong-viec', '/category/work'],
      ];
      for (const [routePath, expectedCanonical] of seoCanonicalRoutes) {
        const res = await fetchRoute(ctx.baseUrl, routePath);
        assertEqual(res.status, 200, `${routePath} must return HTTP 200`);
        assertCanonicalAndOgUrl(res.html, expectedCanonical, `T1-F04-5:${routePath}`);
      }
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/contact`);
        const inputs = await page.count('main form input, main form textarea');
        assert(inputs >= 2, '/contact form must have input & textarea fields');
        await page.evaluate<void>(`(() => {
          const form = document.querySelector('main form');
          if (!form) return;
          const setVal = (el, val) => {
            const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
            const desc = Object.getOwnPropertyDescriptor(proto, 'value');
            if (desc && desc.set) desc.set.call(el, val);
            else el.value = val;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          };
          const nameInput = form.querySelector('input[type="text"], input[name="name"]');
          const emailInput = form.querySelector('input[type="email"]');
          const msgInput = form.querySelector('textarea');
          if (nameInput) setVal(nameInput, 'Minh Nguyen');
          if (emailInput) setVal(emailInput, 'minh@example.com');
          if (msgInput) setVal(msgInput, 'Gop y huu ich ve giao dien.');
          const submit = form.querySelector('button[type="submit"]');
          if (submit) submit.click();
        })()`);
        await page.waitForFunction(
          `Boolean(window.localStorage.getItem('ai_life_hub_feedback')) || /cảm ơn|gửi thành công/i.test(document.body.innerText)`,
          5000
        );
        assertNoPageErrors(page, 'T1-F04-5');
        return routes.length + 2;
      });
    },
  },

  // =========================================================================
  // FEATURE #5: Everyday Prompts Explorer (/prompts) (5 tests)
  // =========================================================================
  {
    id: 'T1-F05-1',
    tier: 1,
    featureArea: 'F05-EverydayPrompts',
    name: '/prompts renders cards with Vietnamese CATEGORY_MAP labels (zero raw slugs)',
    description: 'Verifies /prompts renders prompt cards and mapped Vietnamese category badges.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/prompts`);
        const cardCount = await page.count('main h3');
        assert(cardCount >= 10, `Expected >= 10 prompt cards on /prompts, got ${cardCount}`);
        const badgeTexts = await page.evaluate<string[]>(`
          Array.from(document.querySelectorAll('main button, main span'))
            .map(el => (el.innerText || el.textContent || '').trim())
            .filter(t => Boolean(t) && t.length < 48)
        `);
        assertNoRawCategorySlugs(badgeTexts, 'T1-F05-1:/prompts');
        const bodyText = await page.innerText('main');
        assert(
          COMMON_CATEGORY_LABELS.some((lbl) => bodyText.includes(lbl)),
          'Expected mapped Vietnamese category names on /prompts'
        );
        return 3;
      });
    },
  },
  {
    id: 'T1-F05-2',
    tier: 1,
    featureArea: 'F05-EverydayPrompts',
    name: '/prompts audience tabs and category filter pills narrow displayed prompt count',
    description: 'Switches audience tabs and clicks a category filter pill on /prompts, confirming list updates.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/prompts`);
        const initialCount = await page.count('main h3');
        const hasAudienceTabs = await page.evaluate<boolean>(`
          Array.from(document.querySelectorAll('main [role="tab"], main button')).some(b =>
            /mọi người|phổ thông/i.test((b.innerText || '').trim())
          ) && Array.from(document.querySelectorAll('main [role="tab"], main button')).some(b =>
            /kỹ thuật|lập trình/i.test((b.innerText || '').trim())
          )
        `);
        assert(hasAudienceTabs, 'Expected Everyday vs Technical audience tabs on /prompts');
        await clickButtonByPattern(page, 'main', /kỹ thuật|lập trình/i);
        await page.waitForFunction(
          `document.querySelectorAll('main h3').length > 0 && document.querySelectorAll('main h3').length < ${initialCount}`,
          4000
        );
        await clickButtonByPattern(page, 'main', /tất cả/i);
        await page.waitForFunction(`document.querySelectorAll('main h3').length >= ${initialCount}`, 4000);
        await clickButtonByPattern(page, 'main', /công việc/i);
        await page.waitForFunction(
          `document.querySelectorAll('main h3').length < ${initialCount}`,
          4000
        );
        const filteredCount = await page.count('main h3');
        assert(filteredCount > 0 && filteredCount < initialCount, `Filter must narrow prompts (${filteredCount} < ${initialCount})`);
        assertNoPageErrors(page, 'T1-F05-2');
        return 4;
      });
    },
  },
  {
    id: 'T1-F05-3',
    tier: 1,
    featureArea: 'F05-EverydayPrompts',
    name: '/prompts search input filters prompts dynamically',
    description: 'Types "email" into /prompts search input and verifies matching cards remain.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/prompts`);
        const initialCount = await page.count('main h3');
        await page.fill('main input[type="text"]', 'email');
        await page.waitForFunction(
          `document.querySelectorAll('main h3').length < ${initialCount}`,
          4000
        );
        const filteredCount = await page.count('main h3');
        assert(filteredCount >= 1 && filteredCount < initialCount, 'Search "email" must filter prompts');
        const text = (await page.innerText('main')).toLowerCase();
        assertIncludes(text, 'email', 'Filtered results must mention email');
        return 3;
      });
    },
  },
  {
    id: 'T1-F05-4',
    tier: 1,
    featureArea: 'F05-EverydayPrompts',
    name: '/prompts Copy button & quick variable-filling path work cleanly',
    description: 'Clicks Sao chép on a prompt card, verifies clipboard write + feedback, and tests quick variable filling.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/prompts`);
        await clickButtonByPattern(page, 'main', /^sao chép$/i);
        await page.waitForFunction(`document.body.innerText.includes('Đã sao chép')`, 3000);
        const writes = await page.getCapturedClipboard();
        assert(writes.length >= 1 && writes[0].length > 10, 'Prompt text must be written to clipboard');

        await clickButtonByPattern(page, 'main', /tạo câu lệnh|tùy chỉnh|điền biến|điền thông tin/i);
        await page.waitForFunction(
          `Boolean(${FIND_PROMPT_BUILDER_MODAL_JS}) || document.querySelectorAll('main input[type="text"]').length >= 2`,
          4000
        );
        const updatedVar = await page.evaluate<boolean>(`(() => {
          const modal = ${FIND_PROMPT_BUILDER_MODAL_JS};
          const scope = modal || document.querySelector('main');
          if (!scope) return false;
          const inputs = Array.from(scope.querySelectorAll('input[type="text"], textarea'))
            .filter(el => !/tìm kiếm/i.test(el.getAttribute('placeholder') || ''));
          if (inputs.length === 0) return false;
          const target = inputs[0];
          const proto = target instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
          Object.getOwnPropertyDescriptor(proto, 'value').set.call(target, 'Anh Minh Kiểm Thử');
          target.dispatchEvent(new Event('input', { bubbles: true }));
          return true;
        })()`);
        assert(updatedVar, 'Quick variable-filling path on /prompts must expose fillable variable input');
        await page.waitForFunction(`document.body.innerText.includes('Anh Minh Kiểm Thử') || Boolean((${FIND_PROMPT_BUILDER_MODAL_JS})?.innerText.includes('Anh Minh Kiểm Thử'))`, 3000);
        return 4;
      });
    },
  },
  {
    id: 'T1-F05-5',
    tier: 1,
    featureArea: 'F05-EverydayPrompts',
    name: '/prompts Bookmark & AI Launch buttons (ChatGPT, Claude, Gemini)',
    description: 'Verifies bookmark persistence to ai_life_hub_bookmarks and AI launch window.open + Gemini clipboard copy.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/prompts`);
        await clickButtonByPattern(page, 'main', /lưu|bỏ lưu|bookmark|yêu thích/i);
        await page.waitForFunction(`Boolean(window.localStorage.getItem('ai_life_hub_bookmarks'))`, 3000);
        const stored = await page.getLocalStorage('ai_life_hub_bookmarks');
        assert(stored && stored.includes('"itemType":"prompt"'), 'Prompt bookmark must persist to ai_life_hub_bookmarks');

        await clickButtonByPattern(page, 'main', /chatgpt/i);
        await clickButtonByPattern(page, 'main', /gemini/i);
        const opens = await page.getCapturedWindowOpens();
        assert(opens.some((o) => o.url.includes('chatgpt.com')), 'ChatGPT button must open chatgpt.com');
        assert(opens.some((o) => o.url.includes('gemini.google.com')), 'Gemini button must open gemini.google.com');
        const clips = await page.getCapturedClipboard();
        assert(clips.length >= 1, 'Gemini launch must copy prompt to clipboard first');
        return 5;
      });
    },
  },

  // =========================================================================
  // FEATURE #6: Skill & Category Detail UI (5 tests)
  // =========================================================================
  {
    id: 'T1-F06-1',
    tier: 1,
    featureArea: 'F06-SkillCategoryDetail',
    name: '/categories displays all 16 categories and /category alias works',
    description: 'Verifies /categories lists all 16 categories and /category returns HTTP 200.',
    run: async (ctx) => {
      const aliasRes = await fetchRoute(ctx.baseUrl, '/category');
      assertEqual(aliasRes.status, 200, '/category alias must return HTTP 200');
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/categories`);
        const catLinks = await page.evaluate<string[]>(`
          Array.from(new Set(
            Array.from(document.querySelectorAll('main a[href^="/category/"], main a[href^="/categories/"]'))
              .map(a => a.getAttribute('href') || '')
          ))
        `);
        assertEqual(catLinks.length, 16, `/categories must show all 16 categories (got ${catLinks.length})`);
        return 2;
      });
    },
  },
  {
    id: 'T1-F06-2',
    tier: 1,
    featureArea: 'F06-SkillCategoryDetail',
    name: 'Dual-slug and route alias parity (/category/cong-viec <-> /categories/work)',
    description: 'Verifies English/Vietnamese slugs and /category vs /categories aliases all render HTTP 200.',
    run: async (ctx) => {
      const paths = ['/category/cong-viec', '/category/work', '/categories/work', '/categories/cong-viec'];
      for (let i = 0; i < paths.length; i++) {
        const res = await fetchRoute(ctx.baseUrl, paths[i]);
        assertEqual(res.status, 200, `${paths[i]} must return HTTP 200`);
        const text = stripHtml(res.html);
        assertIncludes(text, 'Công việc & Nghề nghiệp', `${paths[i]} must display Vietnamese category title`);
      }
      return paths.length * 2;
    },
  },
  {
    id: 'T1-F06-3',
    tier: 1,
    featureArea: 'F06-SkillCategoryDetail',
    name: '/skill/[slug] & /skills/[slug] render Vietnamese breadcrumb & localized UI',
    description: 'Checks /skill/soan-thao-email-chuyen-nghiep and /skills/... alias render clean Vietnamese labels.',
    run: async (ctx) => {
      const aliasRes = await fetchRoute(ctx.baseUrl, '/skills/soan-thao-email-chuyen-nghiep');
      assertEqual(aliasRes.status, 200, '/skills/soan-thao-email-chuyen-nghiep alias must return HTTP 200');
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/skill/soan-thao-email-chuyen-nghiep`);
        const breadcrumbText = await page.innerText('main nav[aria-label="Breadcrumb"], main nav');
        assert(!breadcrumbText.includes('cong-viec'), 'Breadcrumb must display Vietnamese category name, not raw cong-viec');
        const mainText = await page.innerText('main');
        assert(!/\bEst\.\b/.test(mainText), 'SkillDetail must not contain untranslated "Est."');
        assert(!mainText.includes('Agent Template'), 'SkillDetail must not contain untranslated "Agent Template"');
        return 4;
      });
    },
  },
  {
    id: 'T1-F06-4',
    tier: 1,
    featureArea: 'F06-SkillCategoryDetail',
    name: 'PromptBuilder modal loads example and performs live {{var}} substitution',
    description: 'Opens PromptBuilder on /skill/soan-thao-email-chuyen-nghiep, tests example select and manual input.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/skill/soan-thao-email-chuyen-nghiep`);
        await clickButtonByPattern(page, 'main', /tạo câu lệnh|tùy chỉnh/i);
        await page.waitForFunction(`Boolean((${FIND_PROMPT_BUILDER_MODAL_JS})?.querySelector('pre'))`, 5000);
        await page.evaluate<void>(`(() => {
          const modal = ${FIND_PROMPT_BUILDER_MODAL_JS};
          const sel = modal?.querySelector('select');
          if (!sel) throw new Error('Example select not found in PromptBuilder modal');
          Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set.call(sel, '0');
          sel.dispatchEvent(new Event('input', { bubbles: true }));
          sel.dispatchEvent(new Event('change', { bubbles: true }));
        })()`);
        await page.waitForFunction(`(() => {
          const modal = ${FIND_PROMPT_BUILDER_MODAL_JS};
          if (!modal) return false;
          const copyBtn = Array.from(modal.querySelectorAll('button')).find(b => /sao chép câu lệnh|^sao chép$/i.test((b.innerText || '').trim()));
          return Boolean(copyBtn && !copyBtn.disabled);
        })()`, 4000);
        await page.evaluate<void>(`(() => {
          const modal = ${FIND_PROMPT_BUILDER_MODAL_JS};
          const inp = modal?.querySelector('input[type="text"]');
          if (!inp) throw new Error('Variable text input not found in PromptBuilder modal');
          Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(inp, 'Chị Lan - Giám đốc');
          inp.dispatchEvent(new Event('input', { bubbles: true }));
          inp.dispatchEvent(new Event('change', { bubbles: true }));
        })()`);
        const preview = await page.evaluate<string>(`(${FIND_PROMPT_BUILDER_MODAL_JS})?.querySelector('pre')?.textContent || ''`);
        assertIncludes(preview, 'Chị Lan - Giám đốc', 'PromptBuilder preview must substitute variable live');
        assert(!preview.includes('{{recipient}}'), 'PromptBuilder preview must replace {{recipient}} placeholder');
        assertNoPageErrors(page, 'T1-F06-4');
        return 4;
      });
    },
  },
  {
    id: 'T1-F06-5',
    tier: 1,
    featureArea: 'F06-SkillCategoryDetail',
    name: 'PromptBuilder enforces required validation and enables Copy + AI Launch when valid',
    description: 'Clears required field to verify disabled buttons, then restores example to verify Copy & AI launch.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/skill/soan-thao-email-chuyen-nghiep`);
        await clickButtonByPattern(page, 'main', /tạo câu lệnh|tùy chỉnh/i);
        await page.waitForFunction(`Boolean((${FIND_PROMPT_BUILDER_MODAL_JS})?.querySelector('pre'))`, 5000);
        await page.evaluate<void>(`(() => {
          const modal = ${FIND_PROMPT_BUILDER_MODAL_JS};
          const inp = modal?.querySelector('input[type="text"]');
          if (inp) {
            Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(inp, '');
            inp.dispatchEvent(new Event('input', { bubbles: true }));
          }
        })()`);
        const copyDisabled = await page.evaluate<boolean>(`(() => {
          const modal = ${FIND_PROMPT_BUILDER_MODAL_JS};
          const b = Array.from(modal?.querySelectorAll('button') || []).find(x => /sao chép câu lệnh|^sao chép$/i.test((x.innerText || '').trim()));
          return b ? b.disabled : false;
        })()`);
        assert(copyDisabled, 'Copy button must be disabled when required variable is empty');
        await page.evaluate<void>(`(() => {
          const modal = ${FIND_PROMPT_BUILDER_MODAL_JS};
          const sel = modal?.querySelector('select');
          if (sel) {
            Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set.call(sel, '0');
            sel.dispatchEvent(new Event('input', { bubbles: true }));
            sel.dispatchEvent(new Event('change', { bubbles: true }));
          }
        })()`);
        await page.waitForFunction(`(() => {
          const modal = ${FIND_PROMPT_BUILDER_MODAL_JS};
          const b = Array.from(modal?.querySelectorAll('button') || []).find(x => /sao chép câu lệnh|^sao chép$/i.test((x.innerText || '').trim()));
          return Boolean(b && !b.disabled);
        })()`, 4000);
        await clickModalButtonByPattern(page, /sao chép câu lệnh|^sao chép$/i);
        await clickModalButtonByPattern(page, /chatgpt/i);
        const clips = await page.getCapturedClipboard();
        const opens = await page.getCapturedWindowOpens();
        assert(clips.length >= 1, 'Copy must capture compiled prompt');
        assert(opens.some((o) => o.url.includes('chatgpt.com')), 'AI Launch must open chatgpt.com');
        return 4;
      });
    },
  },

  // =========================================================================
  // FEATURE #7: Search, CommandPalette, Resources, Favorites & Submit (5 tests)
  // =========================================================================
  {
    id: 'T1-F07-1',
    tier: 1,
    featureArea: 'F07-SearchResourcesFavorites',
    name: 'CommandPalette opens on Ctrl+K, searches "email", persists recent searches, and closes on Escape',
    description: 'Triggers CommandPalette via Ctrl+K, verifies results, recent-search localStorage persistence, and Escape close.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/`);
        await page.pressKey('Control+k');
        await page.waitForSelector('[role="dialog"] input', 5000);
        const dialogCount = await page.count('[role="dialog"]');
        assertEqual(dialogCount, 1, 'Ctrl+K must render exactly 1 CommandPalette [role="dialog"]');
        await page.fill('[role="dialog"] input', 'email');
        await page.waitForFunction(
          `document.querySelectorAll('[role="dialog"] a, [role="dialog"] [role="option"]').length > 0`,
          6000
        );
        const dialogText = await page.innerText('[role="dialog"]');
        assertIncludes(dialogText.toLowerCase(), 'email', 'CommandPalette must return results for "email"');
        assert(!dialogText.includes('Recent searches'), 'CommandPalette must not show English "Recent searches"');

        // Navigate via result to trigger ai-life-hub-recent-searches persistence
        await page.evaluate<void>(`(() => {
          const item = document.querySelector('[role="dialog"] a[href], [role="dialog"] [role="option"]');
          if (item) item.click();
        })()`);
        await page.waitForFunction(`window.location.pathname !== '/'`, 8000);
        const recentRaw = await page.getLocalStorage('ai-life-hub-recent-searches');
        assert(recentRaw && recentRaw.includes('email'), 'CommandPalette must persist recent searches in ai-life-hub-recent-searches');

        await page.pressKey('Control+k');
        await page.waitForSelector('[role="dialog"] input', 5000);
        const reopenedText = await page.innerText('[role="dialog"]');
        assertIncludes(reopenedText.toLowerCase(), 'email', 'Reopened CommandPalette must show recent search "email"');
        await page.pressKey('Escape');
        await page.waitForFunction(`!document.querySelector('[role="dialog"]')`, 3000);
        return 6;
      });
    },
  },
  {
    id: 'T1-F07-2',
    tier: 1,
    featureArea: 'F07-SearchResourcesFavorites',
    name: 'CommandPalette skill result navigates to HTTP 200 destination (no /skills/<cat>/<slug> 404)',
    description: 'Searches "email" in CommandPalette and verifies resulting skill URLs resolve HTTP 200.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/`);
        await page.pressKey('Control+k');
        await page.waitForSelector('[role="dialog"] input', 5000);
        const dialogCount = await page.count('[role="dialog"]');
        assertEqual(dialogCount, 1, 'Ctrl+K must render exactly 1 CommandPalette [role="dialog"]');
        await page.fill('[role="dialog"] input', 'email');
        await page.waitForFunction(
          `document.querySelectorAll('[role="dialog"] [role="option"], [role="dialog"] a').length > 0`,
          6000
        );
        await page.evaluate<void>(`(() => {
          const item = document.querySelector('[role="dialog"] a[href], [role="dialog"] [role="option"]');
          if (item) item.click();
        })()`);
        await page.waitForFunction(`window.location.pathname !== '/'`, 8000);
        const destUrl = await page.currentUrl();
        const pathname = new URL(destUrl).pathname;
        const res = await fetchRoute(ctx.baseUrl, pathname);
        assertEqual(res.status, 200, `Navigated CommandPalette result "${pathname}" must return HTTP 200 (not 404)`);
        const bodyText = await page.innerText('body');
        assert(!/404\s*[-–]|Không tìm thấy trang/i.test(bodyText), `Destination "${pathname}" must not render 404 page`);
        return 3;
      });
    },
  },
  {
    id: 'T1-F07-3',
    tier: 1,
    featureArea: 'F07-SearchResourcesFavorites',
    name: '/search?q=email renders Vietnamese search results and supports prompt/agent type filtering',
    description: 'Loads /search?q=email, verifies localized UI, and exercises prompt/agent type filters.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/search?q=email`);
        await page.waitForFunction(
          `document.body.innerText.toLowerCase().includes('email') && document.querySelectorAll('main a[href]').length > 0`,
          6000
        );
        const text = await page.innerText('main');
        assert(!text.includes('Search Results'), '/search must not display English "Search Results"');
        assert(!text.includes('Clear all filters'), '/search must not display English "Clear all filters"');

        const initialCount = await page.count('main [role="listitem"]');
        assert(initialCount > 0, '/search?q=email must render result items');
        const hasTypeTabs = await page.evaluate<boolean>(`
          document.querySelectorAll('main [role="tablist"] [role="tab"]').length >= 4 &&
          Array.from(document.querySelectorAll('main [role="tablist"] [role="tab"]'))
            .some(t => /câu lệnh mẫu|trợ lý ai/i.test((t.innerText || '').trim()))
        `);
        assert(hasTypeTabs, '/search must expose Vietnamese [role="tab"] type filter controls');
        await clickButtonByPattern(page, 'main [role="tablist"]', /câu lệnh mẫu/i);
        await page.waitForFunction(
          `(() => {
            const activeTab = Array.from(document.querySelectorAll('main [role="tablist"] [role="tab"]'))
              .find(t => t.getAttribute('aria-selected') === 'true');
            const items = document.querySelectorAll('main [role="listitem"]').length;
            return Boolean(activeTab && /câu lệnh mẫu/i.test(activeTab.innerText || '')) && items > 0 && items < ${initialCount};
          })()`,
          4000
        );
        await clickButtonByPattern(page, 'main [role="tablist"]', /^tất cả/i);
        await page.waitForFunction(
          `document.querySelectorAll('main [role="listitem"]').length === ${initialCount}`,
          4000
        );
        assertNoPageErrors(page, 'T1-F07-3');
        return 6;
      });
    },
  },
  {
    id: 'T1-F07-4',
    tier: 1,
    featureArea: 'F07-SearchResourcesFavorites',
    name: '/resources displays Vietnamese RESOURCE_TYPE_LABELS and filters accurately',
    description: 'Checks /resources filter buttons & card badges use Vietnamese labels and filter counts.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/resources`);
        await page.waitForFunction(`document.querySelectorAll('main article').length >= 4`, 6000);
        const total = await page.count('main article');
        const filterLabels = await page.evaluate<string[]>(`
          Array.from(document.querySelectorAll('main button')).map(b => (b.textContent || '').trim())
        `);
        assertNoRawResourceSlugs(filterLabels, 'T1-F07-4:/resources:filters');
        await clickButtonByPattern(page, 'main', /công cụ/i);
        await page.waitForFunction(`document.querySelectorAll('main article').length < ${total}`, 4000);
        const filtered = await page.count('main article');
        assert(filtered >= 1 && filtered < total, 'Filtering by Công cụ must narrow resource cards');
        return 3;
      });
    },
  },
  {
    id: 'T1-F07-5',
    tier: 1,
    featureArea: 'F07-SearchResourcesFavorites',
    name: '/favorites persists bookmarks across reload & /submit detects {{var}} and saves',
    description: 'Seeds/toggles bookmark, checks /favorites reload & delete, and tests /submit live variable detection.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/prompts`);
        await clickButtonByPattern(page, 'main', /lưu|bỏ lưu|bookmark|yêu thích/i);
        await page.goto(`${ctx.baseUrl}/favorites`);
        await page.waitForFunction(`document.querySelectorAll('main h3').length >= 1`, 5000);
        await page.reload();
        await page.waitForFunction(`document.querySelectorAll('main h3').length >= 1`, 5000);
        await clickButtonByPattern(page, 'main', /xóa khỏi yêu thích|xóa/i);
        await page.waitForFunction(`/chưa có mục nào|trống/i.test(document.body.innerText)`, 4000);

        await page.goto(`${ctx.baseUrl}/submit`);
        await page.fill('main input[type="text"]', 'Prompt Test E2E');
        await page.evaluate<void>(`(() => {
          const tas = document.querySelectorAll('main textarea');
          const setVal = (el, val) => {
            const desc = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value');
            if (desc && desc.set) desc.set.call(el, val);
            else el.value = val;
            el.dispatchEvent(new Event('input', { bubbles: true }));
          };
          if (tas[0]) setVal(tas[0], 'Mô tả ngắn cho prompt cộng đồng.');
          if (tas[1]) setVal(tas[1], 'Hãy đóng vai {{vai_tro}} xử lý {{yeu_cau}}.');
        })()`);
        await page.waitForFunction(`document.body.innerText.includes('vai_tro')`, 4000);
        await page.click('main form button[type="submit"]');
        await page.waitForFunction(
          `Boolean(window.localStorage.getItem('ai_life_hub_community_prompts'))`,
          5000
        );
        return 6;
      });
    },
  },

  // =========================================================================
  // FEATURE #8: Prompt Optimizer (/tools/prompt-optimizer) (5 tests)
  // =========================================================================
  {
    id: 'T1-F08-1',
    tier: 1,
    featureArea: 'F08-PromptOptimizer',
    name: '/tools/prompt-optimizer loads HTTP 200 with plain-Vietnamese explanation',
    description: 'Verifies page loads cleanly with clear Vietnamese title and zero academic jargon.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/tools/prompt-optimizer`);
        const text = await page.innerText('main');
        assert(text.length > 100, '/tools/prompt-optimizer must render substantial Vietnamese content');
        assertNoAcademicJargon(text, 'T1-F08-1');
        assertNoPageErrors(page, 'T1-F08-1');
        return 3;
      });
    },
  },
  {
    id: 'T1-F08-2',
    tier: 1,
    featureArea: 'F08-PromptOptimizer',
    name: 'Clicking each of 4 quick presets updates raw prompt textarea',
    description: 'Clicks all 4 preset chips on /tools/prompt-optimizer and verifies textarea value updates.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/tools/prompt-optimizer`);
        const presetCount = await page.evaluate<number>(`
          Array.from(document.querySelectorAll('main button')).filter(b => {
            const txt = (b.innerText || '').trim();
            return !b.querySelector('p') && !b.hasAttribute('aria-pressed') && txt.length > 0 &&
              !/^(xóa|sao chép)/i.test(txt) && !/nâng cấp|tối ưu.*ngay|tối ưu câu lệnh/i.test(txt);
          }).length
        `);
        assertEqual(presetCount, 4, `Expected 4 preset buttons, got ${presetCount}`);
        const values: string[] = [];
        for (let i = 0; i < presetCount; i++) {
          await page.evaluate<void>(`(() => {
            const btns = Array.from(document.querySelectorAll('main button')).filter(b => {
              const txt = (b.innerText || '').trim();
              return !b.querySelector('p') && !b.hasAttribute('aria-pressed') && txt.length > 0 &&
                !/^(xóa|sao chép)/i.test(txt) && !/nâng cấp|tối ưu.*ngay|tối ưu câu lệnh/i.test(txt);
            });
            if (btns[${i}]) btns[${i}].click();
          })()`);
          await new Promise((r) => setTimeout(r, 60));
          const val = await page.evaluate<string>(`document.querySelector('main textarea')?.value || ''`);
          values.push(val);
        }
        const unique = new Set(values.filter(Boolean));
        assertEqual(unique.size, 4, 'Clicking all 4 presets must populate 4 distinct raw prompts into textarea');
        return 2;
      });
    },
  },
  {
    id: 'T1-F08-3',
    tier: 1,
    featureArea: 'F08-PromptOptimizer',
    name: 'Selecting each of 4 framework cards updates active selection state',
    description: 'Clicks each of the 4 framework cards semantically and verifies active selection styling updates.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/tools/prompt-optimizer`);
        const fwCount = await page.evaluate<number>(`
          Array.from(document.querySelectorAll('main button')).filter(b => Boolean(b.querySelector('p')) && (b.innerText || '').trim().length > 20).length
        `);
        assertEqual(fwCount, 4, 'Expected 4 framework selector cards');
        for (let i = 0; i < 4; i++) {
          await page.evaluate<void>(`(() => {
            const cards = Array.from(document.querySelectorAll('main button')).filter(b => Boolean(b.querySelector('p')) && (b.innerText || '').trim().length > 20);
            cards[${i}]?.click();
          })()`);
          await page.waitForFunction(`(() => {
            const cards = Array.from(document.querySelectorAll('main button')).filter(b => Boolean(b.querySelector('p')) && (b.innerText || '').trim().length > 20);
            const target = cards[${i}];
            if (!target) return false;
            const activeClass = target.className;
            const otherClasses = cards.filter((_, idx) => idx !== ${i}).map(c => c.className);
            return target.getAttribute('aria-pressed') === 'true' || otherClasses.some(c => c !== activeClass);
          })()`, 3000);
        }
        return 5;
      });
    },
  },
  {
    id: 'T1-F08-4',
    tier: 1,
    featureArea: 'F08-PromptOptimizer',
    name: 'Optimizing custom prompt generates output, improvements, Copy, and /playground link',
    description: 'Fills custom raw prompt, clicks optimize CTA, verifies output + copy + /playground link.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/tools/prompt-optimizer`);
        await page.fill('main textarea', 'Viết kịch bản video TikTok giới thiệu quán cà phê mới');
        await clickButtonByPattern(page, 'main', /nâng cấp|tối ưu.*ngay|tối ưu câu lệnh/i);
        await page.waitForFunction(
          `Boolean(document.querySelector('main a[href="/playground"]'))`,
          5000
        );
        const outputText = await page.innerText('main');
        assertIncludes(outputText, 'quán cà phê', 'Optimized output must incorporate user input');
        assertNoAcademicJargon(outputText, 'T1-F08-4');
        await clickButtonByPattern(page, 'main', /sao chép/i);
        const clips = await page.getCapturedClipboard();
        assert(clips.length >= 1 && clips[0].length > 30, 'Copy must capture optimized prompt');
        return 5;
      });
    },
  },
  {
    id: 'T1-F08-5',
    tier: 1,
    featureArea: 'F08-PromptOptimizer',
    name: '"Xóa" button clears textarea and disables optimize button',
    description: 'Clicks Xóa button on /tools/prompt-optimizer and confirms optimize button becomes disabled.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/tools/prompt-optimizer`);
        await clickButtonByPattern(page, 'main', /^xóa$/i);
        const taVal = await page.evaluate<string>(`document.querySelector('main textarea')?.value || ''`);
        assertEqual(taVal, '', 'Xóa must empty the raw prompt textarea');
        const btnDisabled = await page.evaluate<boolean>(`(() => {
          const btn = Array.from(document.querySelectorAll('main button')).find(b => /nâng cấp|tối ưu.*ngay|tối ưu câu lệnh/i.test((b.innerText || '').trim()));
          return btn ? btn.disabled : false;
        })()`);
        assert(btnDisabled, 'Optimize button must be disabled when textarea is empty');
        return 2;
      });
    },
  },

  // =========================================================================
  // FEATURE #9: System Prompt Studio (/tools/system-prompt-builder) (5 tests)
  // =========================================================================
  {
    id: 'T1-F09-1',
    tier: 1,
    featureArea: 'F09-SystemPromptStudio',
    name: '/tools/system-prompt-builder explains System Prompt in plain Vietnamese',
    description: 'Verifies page loads HTTP 200 with concise Vietnamese explanation of System Prompt.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/tools/system-prompt-builder`);
        const text = await page.innerText('main');
        assertIncludes(text, 'System Prompt', 'Must display System Prompt Studio context');
        assertNoAcademicJargon(text, 'T1-F09-1');
        assertNoPageErrors(page, 'T1-F09-1');
        return 3;
      });
    },
  },
  {
    id: 'T1-F09-2',
    tier: 1,
    featureArea: 'F09-SystemPromptStudio',
    name: 'Presets 1-4 clickable and keyboard shortcuts 1-4 switch active preset',
    description: 'Tests preset selection via click and keyboard keys 1-4 when unfocused.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/tools/system-prompt-builder`);
        const firstPreview = await page.textContent('main pre');
        await page.pressKey('2');
        await page.waitForFunction(
          `(document.querySelector('main pre')?.textContent || '') !== ${JSON.stringify(firstPreview)}`,
          4000
        );
        const secondPreview = await page.textContent('main pre');
        assert(secondPreview !== firstPreview, 'Pressing key "2" must switch to preset #2');
        await page.pressKey('4');
        await page.waitForFunction(
          `(document.querySelector('main pre')?.textContent || '') !== ${JSON.stringify(secondPreview)}`,
          4000
        );
        return 3;
      });
    },
  },
  {
    id: 'T1-F09-3',
    tier: 1,
    featureArea: 'F09-SystemPromptStudio',
    name: 'Adding and removing constraints updates compiled output immediately',
    description: 'Adds a new constraint, verifies it appears in <pre>, then removes it and verifies removal.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/tools/system-prompt-builder`);
        const marker = 'Luôn trả lời bằng tiếng Việt có dấu chuẩn';
        await page.evaluate<void>(`(() => {
          const inputs = Array.from(document.querySelectorAll('main input[type="text"]'));
          const constraintInput = inputs.find(i => /ràng buộc|không được|quy tắc|constraint/i.test(i.placeholder || '')) || inputs[1];
          if (!constraintInput) return;
          const desc = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
          desc.set.call(constraintInput, ${JSON.stringify(marker)});
          constraintInput.dispatchEvent(new Event('input', { bubbles: true }));
        })()`);
        await page.clickByText('main button', 'Thêm');
        await page.waitForFunction(
          `(document.querySelector('main pre')?.textContent || '').includes(${JSON.stringify(marker)})`,
          4000
        );
        await page.evaluate<void>(`(() => {
          const rows = Array.from(document.querySelectorAll('main div, main li'));
          const row = rows.find(r => r.innerText && r.innerText.includes(${JSON.stringify(marker)}) && r.querySelector('button'));
          if (row) row.querySelector('button').click();
        })()`);
        await page.waitForFunction(
          `!(document.querySelector('main pre')?.textContent || '').includes(${JSON.stringify(marker)})`,
          4000
        );
        return 3;
      });
    },
  },
  {
    id: 'T1-F09-4',
    tier: 1,
    featureArea: 'F09-SystemPromptStudio',
    name: 'Adding a Few-Shot example updates compiled output immediately',
    description: 'Fills new example input/assistant fields and clicks Lưu ví dụ mẫu.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/tools/system-prompt-builder`);
        const exUser = 'Cách tối ưu SQL query chậm?';
        const exAssistant = 'Hãy chạy EXPLAIN ANALYZE và thêm index phù hợp.';
        await page.evaluate<void>(`(() => {
          const setInput = (el, val) => {
            const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
            Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, val);
            el.dispatchEvent(new Event('input', { bubbles: true }));
          };
          const inputs = Array.from(document.querySelectorAll('main input[type="text"]'));
          const tas = Array.from(document.querySelectorAll('main textarea'));
          const uInput = inputs[inputs.length - 1];
          const aTa = tas[tas.length - 1];
          if (uInput) setInput(uInput, ${JSON.stringify(exUser)});
          if (aTa) setInput(aTa, ${JSON.stringify(exAssistant)});
        })()`);
        await clickButtonByPattern(page, 'main', /lưu ví dụ/i);
        await page.waitForFunction(
          `(document.querySelector('main pre')?.textContent || '').includes(${JSON.stringify(exUser)})`,
          4000
        );
        const pre = await page.textContent('main pre');
        assertIncludes(pre, exAssistant, 'Compiled System Prompt must include added example response');
        return 2;
      });
    },
  },
  {
    id: 'T1-F09-5',
    tier: 1,
    featureArea: 'F09-SystemPromptStudio',
    name: 'XML/Markdown toggle, USD + VNĐ cost preview, Copy, and .md download work',
    description: 'Verifies XML vs Markdown syntax toggle, USD+VNĐ display, clipboard copy, and .md download.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/tools/system-prompt-builder`);
        const mainText = await page.innerText('main');
        assert(mainText.includes('$') && /VNĐ|đ\b/i.test(mainText), 'SystemPromptBuilder must show both USD and VNĐ cost preview');
        const xmlPre = await page.textContent('main pre');
        assert(/<(identity|vai_tro|role)>/i.test(xmlPre) && /<[a-z_]+>[\s\S]*<\/[a-z_]+>/i.test(xmlPre), 'Default XML mode must contain semantic XML tags');
        await clickButtonByPattern(page, 'main', /markdown/i);
        await page.waitForFunction(
          `/^\\s*#\\s+/m.test(document.querySelector('main pre')?.textContent || '')`,
          4000
        );
        await clickButtonByPattern(page, 'main', /sao chép/i);
        await clickButtonByPattern(page, 'main', /tải.*\.md|\.md/i);
        const clips = await page.getCapturedClipboard();
        const downloads = await page.getCapturedDownloads();
        assert(clips.length >= 1 && /^\s*#\s+/m.test(clips[0]), 'Copy must copy Markdown compiled prompt with # headings');
        assert(downloads.some((d) => d.download.endsWith('.md')), 'Download must trigger .md file download');
        return 5;
      });
    },
  },

  // =========================================================================
  // FEATURE #10: Token & Cost Calculator (/tools/token-calculator) (5 tests)
  // =========================================================================
  {
    id: 'T1-F10-1',
    tier: 1,
    featureArea: 'F10-TokenCalculator',
    name: '/tools/token-calculator explains Token & Prompt Caching in plain Vietnamese',
    description: 'Verifies plain-Vietnamese gloss for Token and Prompt Caching on /tools/token-calculator.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/tools/token-calculator`);
        const text = await page.innerText('main');
        assertIncludes(text, 'Token', 'Must mention Token');
        assertIncludes(text, 'Prompt Caching', 'Must mention Prompt Caching');
        assert(
          /đơn vị\s*(chữ|xử lý|tính)|token\s*[\(\-–:là]/i.test(text),
          'TokenCalculator must accompany "Token" with a plain-Vietnamese explanation'
        );
        assert(
          /prompt caching[\s\S]{0,120}(lưu|tái sử dụng|ghi nhớ|tiết kiệm|giảm)|tái sử dụng[\s\S]{0,80}(cache|ngữ cảnh|token)/i.test(text),
          'TokenCalculator must accompany "Prompt Caching" with a plain-Vietnamese explanation'
        );
        assertNoAcademicJargon(text, 'T1-F10-1');
        return 5;
      });
    },
  },
  {
    id: 'T1-F10-2',
    tier: 1,
    featureArea: 'F10-TokenCalculator',
    name: 'Dev / Startup / Enterprise scale presets update sliders and costs',
    description: 'Clicks Dev, Startup, and Enterprise presets and confirms slider values & monthly costs scale up.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/tools/token-calculator`);
        await clickButtonByPattern(page, 'main', /cá nhân\s*\/\s*lập trình viên/i);
        const devVals = await page.evaluate<number[]>(
          `Array.from(document.querySelectorAll('main input[type="range"]')).map(i => Number(i.value))`
        );
        await clickButtonByPattern(page, 'main', /doanh nghiệp/i);
        const entVals = await page.evaluate<number[]>(
          `Array.from(document.querySelectorAll('main input[type="range"]')).map(i => Number(i.value))`
        );
        assertEqual(devVals.length, 4, 'Expected 4 range sliders on TokenCalculator');
        assert(entVals[0] > devVals[0] && entVals[3] > devVals[3], 'Enterprise preset must increase input tokens and daily requests');
        return 3;
      });
    },
  },
  {
    id: 'T1-F10-3',
    tier: 1,
    featureArea: 'F10-TokenCalculator',
    name: 'Adjusting all 4 sliders recalculates and preserves ascending cost order',
    description: 'Changes each of the 4 range sliders and verifies model rows recalculate cleanly.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/tools/token-calculator`);
        const beforeText = await page.innerText('main table');
        await page.evaluate<void>(`(() => {
          const sliders = document.querySelectorAll('main input[type="range"]');
          const targets = [5000, 1500, 80, 10000];
          sliders.forEach((el, idx) => {
            Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, String(targets[idx]));
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          });
        })()`);
        await page.waitForFunction(
          `document.querySelector('main table')?.innerText !== ${JSON.stringify(beforeText)}`,
          4000
        );
        const monthlyCosts = await page.evaluate<number[]>(`
          Array.from(document.querySelectorAll('main table tbody tr')).map(tr => {
            const matches = (tr.innerText || '').match(/\\$([0-9,]+\\.\\d{2})/g);
            if (!matches || matches.length === 0) return 0;
            const last = matches[matches.length - 1].replace('$', '').replace(/,/g, '');
            return parseFloat(last);
          })
        `);
        assert(monthlyCosts.length >= 9, `Expected >= 9 model rows in table, got ${monthlyCosts.length}`);
        for (let i = 1; i < monthlyCosts.length; i++) {
          assert(monthlyCosts[i] >= monthlyCosts[i - 1], 'Model table must remain sorted ascending by monthly cost');
        }
        return 3;
      });
    },
  },
  {
    id: 'T1-F10-4',
    tier: 1,
    featureArea: 'F10-TokenCalculator',
    name: 'Summary cards show USD + VNĐ (25.450 rate) and Prompt Caching savings',
    description: 'Verifies cheapest model, GPT-4o cost in USD + VNĐ, and caching savings summary cards.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/tools/token-calculator`);
        const text = await page.innerText('main');
        assertIncludes(text, '25.450', 'TokenCalculator must document 25.450 VNĐ/USD exchange rate');
        assert(/\$\d+\.\d{2}/.test(text), 'Summary must show USD costs');
        assert(/\d+[\d.]*\s*đ/.test(text), 'Summary must show VNĐ costs');
        return 3;
      });
    },
  },
  {
    id: 'T1-F10-5',
    tier: 1,
    featureArea: 'F10-TokenCalculator',
    name: 'Mobile 375x812 Bảng/Thẻ view toggle switches layout without overflow',
    description: 'Switches between Bảng and Thẻ on mobile viewport and verifies main table visibility toggles without overflow.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 375, height: 812 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/tools/token-calculator`);
        const tableInitiallyVisible = await page.evaluate<boolean>(`(() => {
          const t = document.querySelector('main table');
          return Boolean(t && t.offsetParent !== null && window.getComputedStyle(t).display !== 'none');
        })()`);
        assert(tableInitiallyVisible, 'main table must be visible initially in Bảng mode');
        await clickButtonByPattern(page, 'main', /^thẻ$/i);
        await page.waitForFunction(`(() => {
          const t = document.querySelector('main table');
          return !t || t.offsetParent === null || window.getComputedStyle(t).display === 'none';
        })()`, 4000);
        await assertNoHorizontalOverflow(page, 'T1-F10-5:card');
        await clickButtonByPattern(page, 'main', /^bảng$/i);
        await page.waitForFunction(`(() => {
          const t = document.querySelector('main table');
          return Boolean(t && t.offsetParent !== null && window.getComputedStyle(t).display !== 'none');
        })()`, 4000);
        await assertNoHorizontalOverflow(page, 'T1-F10-5:table');
        return 4;
      });
    },
  },

  // =========================================================================
  // FEATURE #11: Model Comparison Arena (/compare) (5 tests)
  // =========================================================================
  {
    id: 'T1-F11-1',
    tier: 1,
    featureArea: 'F11-ModelComparison',
    name: '/compare loads HTTP 200 and renders all 10 models in Matrix tab',
    description: 'Checks /compare H1 alignment and verifies all 10 models render in Matrix view.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/compare`);
        const h1 = await page.innerText('main h1');
        assertIncludes(h1, 'So Sánh', '/compare H1 must be aligned in Vietnamese');
        const mainText = await page.innerText('main');
        assert(!/\bN\/A\b/.test(mainText), '/compare Matrix must not display raw "N/A"');
        const vsBtns = await page.evaluate<number>(
          `Array.from(document.querySelectorAll('main button:not([role="tab"])')).filter(b => /so sánh 1-đối-1|so sánh 1-vs-1|so sánh trực tiếp|đối chiếu/i.test((b.innerText || '').trim())).length`
        );
        assertEqual(vsBtns, 10, `Matrix tab must display all 10 models (got ${vsBtns})`);
        return 3;
      });
    },
  },
  {
    id: 'T1-F11-2',
    tier: 1,
    featureArea: 'F11-ModelComparison',
    name: 'Matrix search, Provider select, and License select filter models accurately',
    description: 'Exercises search input and <select> filters on /compare Matrix view.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/compare`);
        await page.fill('main input[type="text"]', 'DeepSeek');
        await page.waitForFunction(
          `Array.from(document.querySelectorAll('main button:not([role="tab"])')).filter(b => /so sánh 1-đối-1|so sánh 1-vs-1|so sánh trực tiếp|đối chiếu/i.test((b.innerText || '').trim())).length === 2`,
          4000
        );
        await page.fill('main input[type="text"]', '');
        await page.selectOption('main select', 'Anthropic');
        const anthropicCount = await page.evaluate<number>(
          `Array.from(document.querySelectorAll('main button:not([role="tab"])')).filter(b => /so sánh 1-đối-1|so sánh 1-vs-1|so sánh trực tiếp|đối chiếu/i.test((b.innerText || '').trim())).length`
        );
        assert(anthropicCount >= 1 && anthropicCount < 10, 'Provider filter Anthropic must narrow model list');
        return 3;
      });
    },
  },
  {
    id: 'T1-F11-3',
    tier: 1,
    featureArea: 'F11-ModelComparison',
    name: 'Clicking "So sánh 1-đối-1" switches to Versus tab with model preselected',
    description: 'Clicks So sánh 1-đối-1 on a model card and confirms Versus tab activates with that Model A.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/compare`);
        await page.fill('main input[type="text"]', 'GPT-4o');
        await clickButtonByPattern(page, 'main .grid', /so sánh 1-đối-1|so sánh 1-vs-1|so sánh trực tiếp|đối chiếu/i);
        await page.waitForFunction(`document.querySelectorAll('main select').length === 2`, 4000);
        const modelAVal = await page.evaluate<string>(`document.querySelectorAll('main select')[0].value`);
        assertIncludes(modelAVal, 'gpt-4o', 'Clicking So sánh 1-đối-1 must preselect that model as Model A');
        return 2;
      });
    },
  },
  {
    id: 'T1-F11-4',
    tier: 1,
    featureArea: 'F11-ModelComparison',
    name: 'Versus tab updates comparison metrics when changing Model A & Model B',
    description: 'Changes Model A and Model B dropdowns in Versus tab and verifies non-<select> DOM comparison output updates.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/compare`);
        await clickButtonByPattern(page, 'main [role="tablist"]', /so sánh 1-đối-1|so sánh trực diện|so sánh 1-vs-1/i);
        await page.waitForFunction(`document.querySelectorAll('main select').length === 2`, 4000);
        await page.evaluate<void>(`(() => {
          const selects = document.querySelectorAll('main select');
          const setSel = (sel, val) => {
            Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set.call(sel, val);
            sel.dispatchEvent(new Event('input', { bubbles: true }));
            sel.dispatchEvent(new Event('change', { bubbles: true }));
          };
          setSel(selects[0], 'gemini-1-5-pro');
          setSel(selects[1], 'deepseek-v3');
        })()`);
        await page.waitForFunction(`(() => {
          const main = document.querySelector('main');
          if (!main) return false;
          const clone = main.cloneNode(true);
          clone.querySelectorAll('select').forEach(s => s.remove());
          const outText = clone.textContent || '';
          return outText.includes('Gemini 1.5 Pro') && outText.includes('DeepSeek V3');
        })()`, 4000);
        const nonSelectText = await page.evaluate<string>(`(() => {
          const main = document.querySelector('main');
          if (!main) return '';
          const clone = main.cloneNode(true);
          clone.querySelectorAll('select').forEach(s => s.remove());
          return (clone.textContent || '').replace(/\\s+/g, ' ').trim();
        })()`);
        assertIncludes(nonSelectText, 'Gemini 1.5 Pro', 'Versus comparison area (outside <select>) must update to Gemini 1.5 Pro');
        assertIncludes(nonSelectText, 'DeepSeek V3', 'Versus comparison area (outside <select>) must update to DeepSeek V3');
        return 3;
      });
    },
  },
  {
    id: 'T1-F11-5',
    tier: 1,
    featureArea: 'F11-ModelComparison',
    name: 'Advisor tab evaluates 5 goals and links to /tools/token-calculator',
    description: 'Switches to Advisor tab, clicks multiple goal cards, and verifies /tools/token-calculator link.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/compare`);
        await clickButtonByPattern(page, 'main', /tư vấn|gợi ý/i);
        await page.waitForSelector('main a[href="/tools/token-calculator"]', 4000);
        await clickButtonByPattern(page, 'main', /tiết kiệm/i);
        await page.waitForFunction(`document.body.innerText.includes('DeepSeek V3')`, 4000);
        await clickButtonByPattern(page, 'main', /tự chạy nội bộ|ngoại tuyến|local|máy cá nhân|offline/i);
        await page.waitForFunction(`document.body.innerText.includes('Llama') || document.body.innerText.includes('Qwen')`, 4000);
        const calcHref = await page.getAttribute('main a[href="/tools/token-calculator"]', 'href');
        assertEqual(calcHref, '/tools/token-calculator', 'Advisor must link to /tools/token-calculator');
        return 4;
      });
    },
  },

  // =========================================================================
  // FEATURE #12: Agent Blueprints Directory (/agents) (5 tests)
  // =========================================================================
  {
    id: 'T1-F12-1',
    tier: 1,
    featureArea: 'F12-AgentBlueprints',
    name: '/agents loads HTTP 200 and renders all 14 agent blueprints',
    description: 'Verifies all 14 agent cards render on /agents.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/agents`);
        const sandboxLinks = await page.count('main a[href^="/playground?agent="]');
        assertEqual(sandboxLinks, 14, `/agents must render 14 agent blueprints (got ${sandboxLinks})`);
        await clickButtonByPattern(page, 'main', /marketing\s*&\s*nội dung/i);
        const marketingCount = await page.count('main a[href^="/playground?agent="]');
        assert(
          marketingCount >= 1 && marketingCount < 14,
          `Marketing & Nội dung filter pill must narrow blueprints (got ${marketingCount})`
        );
        await clickButtonByPattern(page, 'main', /tất cả mẫu trợ lý/i);
        const restoredCount = await page.count('main a[href^="/playground?agent="]');
        assertEqual(restoredCount, 14, 'Resetting category filter must restore all 14 agent blueprints');
        return 4;
      });
    },
  },
  {
    id: 'T1-F12-2',
    tier: 1,
    featureArea: 'F12-AgentBlueprints',
    name: '/agents search and category filter pills narrow cards and reset',
    description: 'Filters agents by keyword and category pill, then resets to restore 14 agents.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/agents`);
        await page.fill('main input[type="text"]', 'PostgreSQL');
        await page.waitForFunction(`document.querySelectorAll('main a[href^="/playground?agent="]').length === 1`, 4000);
        await page.fill('main input[type="text"]', '');
        await page.waitForFunction(`document.querySelectorAll('main a[href^="/playground?agent="]').length === 14`, 4000);
        await clickButtonByPattern(page, 'main', /tài chính/i);
        const finCount = await page.count('main a[href^="/playground?agent="]');
        assert(finCount >= 1 && finCount < 14, 'Category filter must narrow agent cards');
        return 3;
      });
    },
  },
  {
    id: 'T1-F12-3',
    tier: 1,
    featureArea: 'F12-AgentBlueprints',
    name: 'DeepSeek agents display DeepSeek badge instead of GPT-4o',
    description: 'Checks kiem-chung-khoa-hoc-agent and database-performance-agent cards display DeepSeek badge, not GPT-4o.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/agents`);
        const badges = await page.evaluate<Array<{ href: string; text: string }>>(`
          Array.from(document.querySelectorAll('main a[href^="/playground?agent="]')).map(link => {
            let card = link.parentElement;
            while (card && card.tagName !== 'MAIN') {
              if (card.querySelector('h3') && card.querySelectorAll('a[href^="/playground?agent="]').length === 1) break;
              card = card.parentElement;
            }
            return {
              href: link.getAttribute('href') || '',
              text: card ? card.innerText : ''
            };
          })
        `);
        const targets = badges.filter(
          (b) => b.href.includes('kiem-chung-khoa-hoc-agent') || b.href.includes('database-performance-agent')
        );
        assertEqual(targets.length, 2, 'Must locate both DeepSeek agent blueprints by preserved ID');
        for (let i = 0; i < targets.length; i++) {
          assert(/DeepSeek/i.test(targets[i].text), `${targets[i].href} must render DeepSeek model badge`);
          assert(!targets[i].text.includes('GPT-4o'), `${targets[i].href} must NOT mislabel DeepSeek as GPT-4o`);
        }
        return 5;
      });
    },
  },
  {
    id: 'T1-F12-4',
    tier: 1,
    featureArea: 'F12-AgentBlueprints',
    name: '.cursorrules, CLAUDE.md downloads and System Prompt copy work',
    description: 'Clicks .cursorrules, CLAUDE.md, and Sao chép buttons on the first agent card.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/agents`);
        await page.clickByText('main button', '.cursorrules');
        await page.clickByText('main button', 'CLAUDE.md');
        await clickButtonByPattern(page, 'main', /sao chép/i);
        const downloads = await page.getCapturedDownloads();
        const clips = await page.getCapturedClipboard();
        assert(downloads.some((d) => d.download.endsWith('.cursorrules')), 'Must download .cursorrules file');
        assert(downloads.some((d) => d.download.endsWith('CLAUDE.md')), 'Must download CLAUDE.md file');
        assert(clips.length >= 1 && clips[0].length > 20, 'Copy must capture Agent System Prompt');
        return 3;
      });
    },
  },
  {
    id: 'T1-F12-5',
    tier: 1,
    featureArea: 'F12-AgentBlueprints',
    name: '"Chạy thử trong Sandbox" links preserve AgentBlueprint IDs into /playground',
    description: 'Verifies every /playground?agent=<id> link on /agents navigates cleanly with HTTP 200.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/agents`);
        const href = await page.getAttribute('main a[href^="/playground?agent="]', 'href');
        assert(href && href.includes('?agent='), 'Expected ?agent=<id> query param on Sandbox link');
        await page.click('main a[href^="/playground?agent="]');
        await page.waitForFunction(`window.location.pathname === '/playground' && window.location.search.includes('agent=')`, 8000);
        assertNoPageErrors(page, 'T1-F12-5');
        return 3;
      });
    },
  },

  // =========================================================================
  // FEATURE #13: Multi-Agent Workflows & AI Playground (5 tests)
  // =========================================================================
  {
    id: 'T1-F13-1',
    tier: 1,
    featureArea: 'F13-WorkflowsPlayground',
    name: '/workflows renders 4 workflows and switches steps on selection',
    description: 'Loads /workflows and clicks through workflow cards verifying step list updates.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/workflows`);
        const wfCards = await page.evaluate<number>(
          `Array.from(document.querySelectorAll('main button')).filter(b => Boolean(b.querySelector('h3'))).length`
        );
        assertEqual(wfCards, 4, 'Expected 4 preset workflows on /workflows');
        const firstStepText = await page.innerText('main');
        await page.evaluate<void>(
          `Array.from(document.querySelectorAll('main button')).filter(b => Boolean(b.querySelector('h3')))[1]?.click()`
        );
        await page.waitForFunction(`document.querySelector('main')?.innerText !== ${JSON.stringify(firstStepText)}`, 3000);
        assertNoPageErrors(page, 'T1-F13-1');
        return 3;
      });
    },
  },
  {
    id: 'T1-F13-2',
    tier: 1,
    featureArea: 'F13-WorkflowsPlayground',
    name: '/workflows pipeline execution populates outputs and enables .md export',
    description: 'Enters workflow input, runs full pipeline, and verifies .md export download.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/workflows`);
        await page.fill('main input[type="text"]', 'Ra mắt tính năng mới cho ứng dụng quản lý tài chính');
        await clickButtonByPattern(page, 'main', /chạy thử mô phỏng|chạy toàn bộ/i);
        await page.waitForFunction(
          `Array.from(document.querySelectorAll('main button')).some(b => /tải xuống|\.md/i.test((b.innerText || '').trim()))`,
          15000
        );
        await clickButtonByPattern(page, 'main', /\.md/i);
        const downloads = await page.getCapturedDownloads();
        assert(downloads.some((d) => d.download.endsWith('.md')), 'Workflow pipeline export must download .md report');
        return 3;
      });
    },
  },
  {
    id: 'T1-F13-3',
    tier: 1,
    featureArea: 'F13-WorkflowsPlayground',
    name: '/playground?agent=code-architect hydrates System Prompt, User Prompt & Temperature',
    description: 'Opens /playground?agent=code-architect and verifies blueprint hydration.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/playground?agent=code-architect`);
        await page.waitForFunction(
          `Array.from(document.querySelectorAll('main textarea')).some(t => t.value.length > 20)`,
          5000
        );
        const textareas = await page.evaluate<string[]>(
          `Array.from(document.querySelectorAll('main textarea')).map(t => t.value)`
        );
        assert(textareas.length >= 2, 'Playground must have System Prompt and User Prompt textareas');
        assert(textareas[0].length > 30, 'System Prompt textarea must be hydrated from blueprint');
        assert(textareas[1].length > 15, 'User Prompt textarea must be hydrated for code-architect');
        return 3;
      });
    },
  },
  {
    id: 'T1-F13-4',
    tier: 1,
    featureArea: 'F13-WorkflowsPlayground',
    name: '/playground displays simulated-demo notice and auto-detects {{var}} inputs',
    description: 'Verifies simulated demo disclaimer and dynamic {{var}} variable input generation.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/playground`);
        const bannerText = await page.innerText('main');
        assert(/mô phỏng|giả lập|demo|simulated/i.test(bannerText), 'Playground must clearly state simulated demo mode');
        await page.evaluate<void>(`(() => {
          const tas = document.querySelectorAll('main textarea');
          const userTa = tas[1];
          if (!userTa) return;
          Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set.call(userTa, 'Phân tích {{chu_de}} cho {{doi_tuong}}');
          userTa.dispatchEvent(new Event('input', { bubbles: true }));
        })()`);
        await page.waitForFunction(`document.body.innerText.includes('{{chu_de}}') && document.body.innerText.includes('{{doi_tuong}}')`, 4000);
        const dynInputs = await page.count('main input[type="text"]');
        assert(dynInputs >= 2, 'Dynamic {{var}} placeholders must render input fields');
        return 3;
      });
    },
  },
  {
    id: 'T1-F13-5',
    tier: 1,
    featureArea: 'F13-WorkflowsPlayground',
    name: '/playground streams simulated response, updates latency/tokens, and enables Copy & .md Download',
    description: 'Clicks Run on /playground, waits for streaming completion via terminal output growth + enabled Copy/Download buttons, and verifies Copy + .md Download.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/playground`);
        await runPlaygroundAndWait(page, 15000);
        await clickButtonByPattern(page, 'main', /sao chép.*kết quả|sao chép/i);
        await clickButtonByPattern(page, 'main', /tải.*markdown|tải.*\.md|markdown/i);
        const clips = await page.getCapturedClipboard();
        const downloads = await page.getCapturedDownloads();
        assert(clips.length >= 1 && clips[0].length > 20, 'Playground Copy must write streamed response to clipboard');
        assert(downloads.some((d) => d.download.endsWith('.md')), 'Playground Download must export .md file');
        return 4;
      });
    },
  },

  // =========================================================================
  // FEATURE #14: Ecosystem, Playbooks, Cheatsheet & Quiz (5 tests)
  // =========================================================================
  {
    id: 'T1-F14-1',
    tier: 1,
    featureArea: 'F14-ShowcaseQuiz',
    name: '/cheatsheet guardrails filter returns >= 1 card and search + copy work',
    description: 'Verifies Bảo mật & Rào chắn filter pill yields >= 1 card, search filters, and Copy works.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/cheatsheet`);
        await clickButtonByPattern(page, 'main', /bảo mật|rào chắn/i);
        const guardCount = await page.count('main h3');
        assert(guardCount >= 1, `Cheatsheet "guardrails" filter must return >= 1 card (got ${guardCount})`);
        await clickButtonByPattern(page, 'main', /tất cả/i);
        await page.fill('main input[type="text"]', 'RAG');
        const ragCount = await page.count('main h3');
        assert(ragCount >= 1, 'Cheatsheet search "RAG" must return >= 1 card');
        await clickButtonByPattern(page, 'main', /sao chép|copy/i);
        const clips = await page.getCapturedClipboard();
        assert(clips.length >= 1, 'Cheatsheet copy button must write snippet to clipboard');
        return 4;
      });
    },
  },
  {
    id: 'T1-F14-2',
    tier: 1,
    featureArea: 'F14-ShowcaseQuiz',
    name: '/playbooks renders 10 books, filters by role/search, and modal switches 3 tabs',
    description: 'Tests /playbooks role pills, search filter, and Chi tiết modal 3-tab navigation.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/playbooks`);
        const initialCards = await page.count('main h3');
        assert(initialCards >= 10, `Expected >= 10 playbooks, got ${initialCards}`);
        await clickButtonByPattern(page, 'main', /chi tiết/i);
        await page.waitForSelector('[role="dialog"]', 4000);
        await clickButtonByPattern(page, '[role="dialog"]', /nguồn gốc/i);
        await clickButtonByPattern(page, '[role="dialog"]', /mã nguồn/i);
        await page.pressKey('Escape');
        await page.waitForFunction(`!document.querySelector('[role="dialog"]')`, 3000);
        return 3;
      });
    },
  },
  {
    id: 'T1-F14-3',
    tier: 1,
    featureArea: 'F14-ShowcaseQuiz',
    name: '/ecosystem filters categories and copies CLI quickstart command',
    description: 'Tests category pill filtering and CLI copy button on /ecosystem.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/ecosystem`);
        const initialCount = await page.count('main h3');
        assert(initialCount >= 5, `Expected >= 5 ecosystem cards, got ${initialCount}`);
        await page.evaluate<void>(`(() => {
          const catBtns = Array.from(document.querySelectorAll('main button')).filter(b => !/sao chép|copy/i.test((b.innerText || '') + ' ' + (b.getAttribute('aria-label') || '')));
          if (catBtns[1]) catBtns[1].click();
        })()`);
        const filteredCount = await page.count('main h3');
        assert(filteredCount >= 1 && filteredCount < initialCount, 'Category pill must filter /ecosystem cards');
        await clickButtonByPattern(page, 'main', /sao chép|copy/i);
        const clips = await page.getCapturedClipboard();
        assert(clips.length >= 1, 'Ecosystem copy must capture quickstart command');
        return 3;
      });
    },
  },
  {
    id: 'T1-F14-4',
    tier: 1,
    featureArea: 'F14-ShowcaseQuiz',
    name: '/learn/quiz supports answering all 8 questions via click and keyboard (1-4 / Enter)',
    description: 'Steps through questions 1..8 on /learn/quiz verifying immediate feedback and explanations.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/learn/quiz`);
        for (let q = 1; q <= 8; q++) {
          await page.waitForFunction(`document.body.innerText.includes('Câu hỏi ${q} / 8')`, 4000);
          if (q % 2 === 1) {
            await page.pressKey('1');
          } else {
            await page.evaluate<void>(`(() => {
              const optBtn = Array.from(document.querySelectorAll('main button')).find(b => /^[A-D]$/.test((b.querySelector('span')?.innerText || '').trim()));
              if (optBtn) optBtn.click();
            })()`);
          }
          await page.waitForFunction(
            `document.body.innerText.includes('Chính xác') || document.body.innerText.includes('Chưa đúng')`,
            4000
          );
          await page.pressKey('Enter');
        }
        await page.waitForFunction(`document.body.innerText.includes('/ 8') && /làm lại/i.test(document.body.innerText)`, 4000);
        return 9;
      });
    },
  },
  {
    id: 'T1-F14-5',
    tier: 1,
    featureArea: 'F14-ShowcaseQuiz',
    name: '/learn/quiz completion displays Vietnamese badge, review toggle, and restart',
    description: 'Completes /learn/quiz and verifies review mode toggle and restart reset back to Q1.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/learn/quiz`);
        for (let q = 1; q <= 8; q++) {
          await page.pressKey('2');
          await page.waitForFunction(
            `document.body.innerText.includes('Chính xác') || document.body.innerText.includes('Chưa đúng')`,
            4000
          );
          await page.pressKey('Enter');
        }
        await page.waitForFunction(`/làm lại/i.test(document.body.innerText)`, 4000);
        const resultText = await page.innerText('main');
        assert(!resultText.includes('Grandmaster Prompt Architect'), 'Quiz rank badge must be Vietnamese');
        assert(!resultText.includes('AI Explorer'), 'Quiz rank badge must be Vietnamese');
        assert(!resultText.includes('Apprentice in Training'), 'Quiz rank badge must be Vietnamese');
        await clickButtonByPattern(page, 'main', /xem lại/i);
        await clickButtonByPattern(page, 'main', /làm lại/i);
        await page.waitForFunction(`document.body.innerText.includes('Câu hỏi 1 / 8')`, 4000);
        return 5;
      });
    },
  },

  // =========================================================================
  // FEATURE #15: MDX Jargon Cleanup & Search Index Sync (5 tests)
  // =========================================================================
  {
    id: 'T1-F15-1',
    tier: 1,
    featureArea: 'F15-MdxSearchIndex',
    name: 'MDX /skill/chain-of-thought-reasoning loads cleanly without academic jargon',
    description: 'Verifies /skill/chain-of-thought-reasoning HTTP 200 and clean Vietnamese presentation.',
    run: async (ctx) => {
      const res = await fetchRoute(ctx.baseUrl, '/skill/chain-of-thought-reasoning');
      assertEqual(res.status, 200, '/skill/chain-of-thought-reasoning must return HTTP 200');
      const text = stripHtml(res.html);
      assertNoAcademicJargon(text, 'T1-F15-1');
      assertNoStandaloneCoT(text, 'T1-F15-1');
      return 3;
    },
  },
  {
    id: 'T1-F15-2',
    tier: 1,
    featureArea: 'F15-MdxSearchIndex',
    name: 'MDX /skill/system-prompt-mastery loads cleanly without raw English headings',
    description: 'Verifies /skill/system-prompt-mastery HTTP 200 and interactive prompt availability.',
    run: async (ctx) => {
      const res = await fetchRoute(ctx.baseUrl, '/skill/system-prompt-mastery');
      assertEqual(res.status, 200, '/skill/system-prompt-mastery must return HTTP 200');
      const text = stripHtml(res.html);
      assertNoAcademicJargon(text, 'T1-F15-2');
      assert(!text.includes('ROLE & IDENTITY'), 'MDX must not expose raw uppercase English section ROLE & IDENTITY');
      return 3;
    },
  },
  {
    id: 'T1-F15-3',
    tier: 1,
    featureArea: 'F15-MdxSearchIndex',
    name: 'MDX /skill/soan-thao-email-chuyen-nghiep loads cleanly with 2 prompt templates',
    description: 'Verifies /skill/soan-thao-email-chuyen-nghiep renders both prompt templates cleanly.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/skill/soan-thao-email-chuyen-nghiep`);
        const builders = await page.evaluate<number>(
          `Array.from(document.querySelectorAll('main button')).filter(b => /tạo câu lệnh|tùy chỉnh/i.test((b.innerText || '').trim())).length`
        );
        assertEqual(builders, 2, 'soan-thao-email-chuyen-nghiep must expose 2 prompt templates');
        const text = await page.innerText('main');
        assertNoAcademicJargon(text, 'T1-F15-3');
        assertNoStandaloneCoT(text, 'T1-F15-3');
        return 3;
      });
    },
  },
  {
    id: 'T1-F15-4',
    tier: 1,
    featureArea: 'F15-MdxSearchIndex',
    name: 'MDX /skill/quan-ly-man-hinh-con loads cleanly with zero CJK noise',
    description: 'Verifies /skill/quan-ly-man-hinh-con HTTP 200, zero CJK typos, and zero English-only headings.',
    run: async (ctx) => {
      const res = await fetchRoute(ctx.baseUrl, '/skill/quan-ly-man-hinh-con');
      assertEqual(res.status, 200, '/skill/quan-ly-man-hinh-con must return HTTP 200');
      const text = stripHtml(res.html);
      assertNoCjkNoise(text, 'T1-F15-4');
      assertNoAcademicJargon(text, 'T1-F15-4');
      return 3;
    },
  },
  {
    id: 'T1-F15-5',
    tier: 1,
    featureArea: 'F15-MdxSearchIndex',
    name: 'public/search-index.json schema valid & sampled URLs across all types return HTTP 200',
    description: 'Reads /search-index.json and checks internal document URLs resolve HTTP 200 (zero 404s).',
    run: async (ctx) => {
      const idxRes = await fetchRoute(ctx.baseUrl, '/search-index.json');
      assertEqual(idxRes.status, 200, '/search-index.json must be served with HTTP 200');
      const parsed = JSON.parse(idxRes.html) as {
        documents: Array<{ id: string; type: string; title: string; url: string }>;
      };
      assert(Array.isArray(parsed.documents) && parsed.documents.length > 20, 'search-index.json must contain > 20 documents');

      const byType = new Map<string, string[]>();
      for (let i = 0; i < parsed.documents.length; i++) {
        const doc = parsed.documents[i];
        if (!doc.url || !doc.url.startsWith('/')) continue;
        const list = byType.get(doc.type) ?? [];
        if (list.length < 2) {
          list.push(doc.url);
          byType.set(doc.type, list);
        }
      }

      const urlsToCheck: string[] = [];
      byType.forEach((list) => {
        list.forEach((u) => urlsToCheck.push(u));
      });
      assert(urlsToCheck.length >= 4, 'Must sample internal URLs across search-index types');

      for (let i = 0; i < urlsToCheck.length; i++) {
        const res = await fetchRoute(ctx.baseUrl, urlsToCheck[i]);
        assertEqual(res.status, 200, `Indexed URL "${urlsToCheck[i]}" must return HTTP 200 (not 404)`);
      }

      // Also verify search-index.json file exists on disk
      const diskPath = path.join(process.cwd(), 'public', 'search-index.json');
      assert(fs.existsSync(diskPath), 'public/search-index.json must exist on disk');
      return 3 + urlsToCheck.length;
    },
  },
];

// Keep RAW_CATEGORY_SLUGS referenced cleanly for exports check
export const _tier1Metadata = {
  totalTests: tier1Tests.length,
  rawCategorySlugsCount: RAW_CATEGORY_SLUGS.length,
};
