import {
  assert,
  assertEqual,
  assertIncludes,
  assertNoAcademicJargon,
  assertNoHeaderOverlap,
  assertNoPageErrors,
  clickButtonByPattern,
  clickModalButtonByPattern,
  fetchRoute,
  FIND_PROMPT_BUILDER_MODAL_JS,
  runPlaygroundAndWait,
  withPage,
} from '../lib/assertions';
import type { TestCase } from '../lib/types';

export const tier3Tests: TestCase[] = [
  {
    id: 'T3-01',
    tier: 3,
    featureArea: 'Cross-Home-Prompts-PromptBuilder',
    name: 'Home Everyday CTA -> /prompts -> Work filter -> PromptBuilder -> AI launch URLs',
    description: 'Navigates from Hero Everyday CTA to /prompts, filters Công việc, opens skill PromptBuilder, fills vars, and verifies AI launch.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/`);
        await page.click('main section a[href="/prompts"]');
        await page.waitForFunction(`window.location.pathname === '/prompts'`, 6000);
        await clickButtonByPattern(page, 'main', /công việc/i);
        await page.click('main a[href="/skill/soan-thao-email-chuyen-nghiep"]');
        await page.waitForFunction(`window.location.pathname === '/skill/soan-thao-email-chuyen-nghiep'`, 6000);
        await clickButtonByPattern(page, 'main', /tạo câu lệnh|tùy chỉnh/i);
        await page.waitForFunction(`Boolean((${FIND_PROMPT_BUILDER_MODAL_JS})?.querySelector('select'))`, 5000);
        await page.evaluate<void>(`(() => {
          const modal = ${FIND_PROMPT_BUILDER_MODAL_JS};
          const sel = modal?.querySelector('select');
          if (!sel) throw new Error('Example select missing in PromptBuilder modal');
          Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set.call(sel, '0');
          sel.dispatchEvent(new Event('input', { bubbles: true }));
          sel.dispatchEvent(new Event('change', { bubbles: true }));
        })()`);
        await clickModalButtonByPattern(page, /chatgpt/i);
        await clickModalButtonByPattern(page, /claude/i);
        await clickModalButtonByPattern(page, /gemini/i);
        const opens = await page.getCapturedWindowOpens();
        assert(opens.some((o) => o.url.includes('chatgpt.com')), 'Must open ChatGPT');
        assert(opens.some((o) => o.url.includes('claude.ai')), 'Must open Claude');
        assert(opens.some((o) => o.url.includes('gemini.google.com')), 'Must open Gemini');
        return 6;
      });
    },
  },
  {
    id: 'T3-02',
    tier: 3,
    featureArea: 'Cross-Home-SystemPromptBuilder-Playground',
    name: 'Home Builder CTA -> /tools/system-prompt-builder -> preset #2 -> /playground',
    description: 'Switches to Hero Builder preview tab, clicks /tools/system-prompt-builder link, selects preset #2, and follows Playground link.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/`);
        await clickButtonByPattern(page, 'main section:first-of-type', /lập trình|kỹ thuật|builder|kỹ sư/i);
        await page.waitForSelector('main section:first-of-type a[href="/tools/system-prompt-builder"]', 4000);
        await page.click('main section:first-of-type a[href="/tools/system-prompt-builder"]');
        await page.waitForFunction(`window.location.pathname === '/tools/system-prompt-builder'`, 6000);
        await page.pressKey('2');
        await page.click('main a[href="/playground"]');
        await page.waitForFunction(`window.location.pathname === '/playground'`, 6000);
        assertNoPageErrors(page, 'T3-02');
        return 3;
      });
    },
  },
  {
    id: 'T3-03',
    tier: 3,
    featureArea: 'Cross-Agents-Playground',
    name: '/agents (DeepSeek/Claude agent) -> Chạy thử trong Sandbox -> /playground?agent=<id> hydration',
    description: 'Locates an agent on /agents, opens Sandbox link, verifies hydration and executes simulated run.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/agents`);
        await page.fill('main input[type="text"]', 'Kiến trúc');
        await page.click('main a[href^="/playground?agent="]');
        await page.waitForFunction(`window.location.pathname === '/playground' && window.location.search.includes('agent=')`, 6000);
        await page.waitForFunction(`(document.querySelectorAll('main textarea')[0]?.value || '').length > 20`, 4000);
        await runPlaygroundAndWait(page, 15000);
        return 4;
      });
    },
  },
  {
    id: 'T3-04',
    tier: 3,
    featureArea: 'Cross-Compare-TokenCalculator',
    name: '/compare Advisor -> /tools/token-calculator cross-link & model parity',
    description: 'Selects budget goal in /compare Advisor, follows cross-link to /tools/token-calculator, and confirms DeepSeek V3 / GPT-4o presence.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/compare`);
        await clickButtonByPattern(page, 'main', /tư vấn|gợi ý/i);
        await clickButtonByPattern(page, 'main', /tiết kiệm/i);
        await page.waitForFunction(`document.body.innerText.includes('DeepSeek V3')`, 4000);
        await page.click('main a[href="/tools/token-calculator"]');
        await page.waitForFunction(`window.location.pathname === '/tools/token-calculator'`, 6000);
        const calcText = await page.innerText('main');
        assertIncludes(calcText, 'DeepSeek V3', 'TokenCalculator must also list recommended DeepSeek V3 model');
        assertIncludes(calcText, 'GPT-4o', 'TokenCalculator must list GPT-4o');
        return 4;
      });
    },
  },
  {
    id: 'T3-05',
    tier: 3,
    featureArea: 'Cross-Cheatsheet-Tools-Playground',
    name: '/cheatsheet guardrails filter -> /tools/system-prompt-builder & /playground links',
    description: 'Filters /cheatsheet by Bảo mật & Rào chắn and verifies links into System Prompt Studio and Playground.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/cheatsheet`);
        await clickButtonByPattern(page, 'main', /bảo mật|rào chắn/i);
        const count = await page.count('main h3');
        assert(count >= 1, 'Guardrails pill must yield >= 1 cheatsheet card');
        await page.click('main a[href="/tools/system-prompt-builder"]');
        await page.waitForFunction(`window.location.pathname === '/tools/system-prompt-builder'`, 6000);
        await page.goto(`${ctx.baseUrl}/cheatsheet`);
        await page.click('main a[href="/playground"]');
        await page.waitForFunction(`window.location.pathname === '/playground'`, 6000);
        return 4;
      });
    },
  },
  {
    id: 'T3-06',
    tier: 3,
    featureArea: 'Cross-CommandPalette-Search-Resources',
    name: 'CommandPalette (Ctrl+K) -> search "học tập" -> navigate -> /resources filter',
    description: 'Opens CommandPalette from /, searches "học tập", navigates to a 200 result, then checks /resources.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/`);
        await page.pressKey('Control+k');
        await page.waitForSelector('[role="dialog"] input', 4000);
        await page.fill('[role="dialog"] input', 'học tập');
        await page.waitForFunction(
          `document.querySelectorAll('[role="dialog"] a, [role="dialog"] [role="option"]').length > 0`,
          5000
        );
        await page.evaluate<void>(`document.querySelector('[role="dialog"] a, [role="dialog"] [role="option"]')?.click()`);
        await page.waitForFunction(`window.location.pathname !== '/'`, 6000);
        const dest = new URL(await page.currentUrl()).pathname;
        const res = await fetchRoute(ctx.baseUrl, dest);
        assertEqual(res.status, 200, `CommandPalette destination ${dest} must return HTTP 200`);
        await page.goto(`${ctx.baseUrl}/resources`);
        await page.waitForFunction(`document.querySelectorAll('main article').length >= 4`, 5000);
        return 4;
      });
    },
  },
  {
    id: 'T3-07',
    tier: 3,
    featureArea: 'Cross-Category-Bookmark-Favorites',
    name: '/category/cong-viec -> bookmark skill -> /favorites persistence -> skill link back',
    description: 'Bookmarks a skill from /category/cong-viec, verifies persistence in /favorites across reload, and clicks back to skill.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/category/cong-viec`);
        await clickButtonByPattern(page, 'main', /lưu|bỏ lưu|bookmark|yêu thích/i);
        await page.waitForFunction(`(window.localStorage.getItem('ai_life_hub_bookmarks') || '').includes('"itemType":"skill"')`, 4000);
        await page.goto(`${ctx.baseUrl}/favorites`);
        await page.reload();
        await page.waitForFunction(`document.querySelectorAll('main a[href^="/skill/"]').length >= 1`, 5000);
        await page.click('main a[href^="/skill/"]');
        await page.waitForFunction(`window.location.pathname.startsWith('/skill/')`, 6000);
        assertNoPageErrors(page, 'T3-07');
        return 4;
      });
    },
  },
  {
    id: 'T3-08',
    tier: 3,
    featureArea: 'Cross-Prompts-Favorites-Delete',
    name: '/prompts -> bookmark prompt -> /favorites -> delete -> reload stays empty',
    description: 'Bookmarks a prompt on /prompts, removes it on /favorites, and verifies removal persists across reload.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/prompts`);
        await clickButtonByPattern(page, 'main', /lưu|bỏ lưu|bookmark|yêu thích/i);
        await page.goto(`${ctx.baseUrl}/favorites`);
        await page.waitForFunction(`document.querySelectorAll('main h3').length >= 1`, 4000);
        await clickButtonByPattern(page, 'main', /xóa khỏi yêu thích|xóa/i);
        await page.waitForFunction(`/chưa có mục nào|trống/i.test(document.body.innerText)`, 4000);
        await page.reload();
        await page.waitForFunction(`/chưa có mục nào|trống/i.test(document.body.innerText)`, 4000);
        return 3;
      });
    },
  },
  {
    id: 'T3-09',
    tier: 3,
    featureArea: 'Cross-PromptOptimizer-Playground',
    name: '/tools/prompt-optimizer -> optimize -> /playground navigation',
    description: 'Optimizes a raw prompt on /tools/prompt-optimizer, verifies clean copy, and navigates to /playground.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/tools/prompt-optimizer`);
        await page.fill('main textarea', 'Lên thực đơn ăn sáng lành mạnh 7 ngày cho dân văn phòng');
        await clickButtonByPattern(page, 'main', /nâng cấp|tối ưu.*ngay|tối ưu câu lệnh/i);
        await page.waitForSelector('main a[href="/playground"]', 5000);
        const text = await page.innerText('main');
        assertNoAcademicJargon(text, 'T3-09');
        await page.click('main a[href="/playground"]');
        await page.waitForFunction(`window.location.pathname === '/playground'`, 6000);
        return 3;
      });
    },
  },
  {
    id: 'T3-10',
    tier: 3,
    featureArea: 'Cross-SystemPromptBuilder-Playground',
    name: '/tools/system-prompt-builder -> customize & copy XML -> /playground paste & run',
    description: 'Customizes System Prompt in Studio, copies compiled XML, navigates to Playground, pastes, and runs.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/tools/system-prompt-builder`);
        await clickButtonByPattern(page, 'main', /sao chép/i);
        const clips = await page.getCapturedClipboard();
        assert(
          clips.length >= 1 && /<(identity|vai_tro|role)>/i.test(clips[0]) && /<[a-z_]+>[\s\S]*<\/[a-z_]+>/i.test(clips[0]),
          'Studio copy must capture structured XML System Prompt'
        );
        await page.click('main a[href="/playground"]');
        await page.waitForFunction(`window.location.pathname === '/playground'`, 6000);
        await page.waitForSelector('main textarea', 5000);
        await page.fill('main textarea', clips[0]);
        await runPlaygroundAndWait(page, 15000);
        return 4;
      });
    },
  },
  {
    id: 'T3-11',
    tier: 3,
    featureArea: 'Cross-Categories-Parenting-PromptBuilder',
    name: '/categories -> /category/giao-duc-con -> /skill/quan-ly-man-hinh-con -> PromptBuilder',
    description: 'Walks from /categories into Parenting category, opens quan-ly-man-hinh-con, and launches PromptBuilder.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/categories`);
        await page.click('main a[href*="/parenting"], main a[href*="/giao-duc-con"]');
        await page.waitForFunction(`window.location.pathname.includes('parenting') || window.location.pathname.includes('giao-duc-con')`, 6000);
        await page.click('main a[href="/skill/quan-ly-man-hinh-con"]');
        await page.waitForFunction(`window.location.pathname === '/skill/quan-ly-man-hinh-con'`, 6000);
        await clickButtonByPattern(page, 'main', /tạo câu lệnh|tùy chỉnh/i);
        await page.waitForFunction(`Boolean((${FIND_PROMPT_BUILDER_MODAL_JS})?.querySelector('select'))`, 5000);
        await page.evaluate<void>(`(() => {
          const modal = ${FIND_PROMPT_BUILDER_MODAL_JS};
          const sel = modal?.querySelector('select');
          if (!sel) throw new Error('Example select missing in PromptBuilder modal');
          Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set.call(sel, '0');
          sel.dispatchEvent(new Event('input', { bubbles: true }));
          sel.dispatchEvent(new Event('change', { bubbles: true }));
        })()`);
        const pre = await page.evaluate<string>(`(${FIND_PROMPT_BUILDER_MODAL_JS})?.querySelector('pre')?.textContent || ''`);
        assert(pre.length > 50, 'Parenting PromptBuilder must render populated prompt preview');
        return 5;
      });
    },
  },
  {
    id: 'T3-12',
    tier: 3,
    featureArea: 'Cross-SearchPage-Skill-PromptBuilder',
    name: '/search?q=email -> navigate to skill -> PromptBuilder -> Sao chép .md',
    description: 'Executes search on /search?q=email, clicks skill link, opens PromptBuilder, expands dev options if collapsed, and copies .md export.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/search?q=email`);
        await page.waitForSelector('main a[href^="/skill/"]', 6000);
        await page.click('main a[href^="/skill/"]');
        await page.waitForFunction(`window.location.pathname.startsWith('/skill/')`, 6000);
        await clickButtonByPattern(page, 'main', /tạo câu lệnh|tùy chỉnh/i);
        await page.waitForFunction(`Boolean((${FIND_PROMPT_BUILDER_MODAL_JS})?.querySelector('select'))`, 5000);
        await page.evaluate<void>(`(() => {
          const modal = ${FIND_PROMPT_BUILDER_MODAL_JS};
          const sel = modal?.querySelector('select');
          if (!sel) throw new Error('Example select missing in PromptBuilder modal');
          Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set.call(sel, '0');
          sel.dispatchEvent(new Event('input', { bubbles: true }));
          sel.dispatchEvent(new Event('change', { bubbles: true }));
        })()`);
        await new Promise((r) => setTimeout(r, 80));
        await page.evaluate<void>(`(() => {
          const modal = ${FIND_PROMPT_BUILDER_MODAL_JS};
          if (!modal) return;
          modal.querySelectorAll('input[type="text"], textarea').forEach((el) => {
            if ((el.value || '').trim().length === 0) {
              const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
              Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, 'Thông tin mẫu kiểm thử');
              el.dispatchEvent(new Event('input', { bubbles: true }));
              el.dispatchEvent(new Event('change', { bubbles: true }));
            }
          });
        })()`);
        await page.evaluate<void>(`(() => {
          const modal = ${FIND_PROMPT_BUILDER_MODAL_JS};
          if (!modal) return;
          const isMdBtnVisible = () => Array.from(modal.querySelectorAll('button')).some(b => {
            const r = b.getBoundingClientRect();
            return r.width > 0 && r.height > 0 && /sao chép\\s*\\.md/i.test((b.innerText || '').trim());
          });
          if (!isMdBtnVisible()) {
            const details = modal.querySelector('details:not([open]) > summary');
            if (details) details.click();
            if (!isMdBtnVisible()) {
              const toggle =
                modal.querySelector('button[aria-expanded]') ||
                Array.from(modal.querySelectorAll('button, summary')).find(el =>
                  /tùy chọn|nâng cao|developer|json|markdown|xuất/i.test((el.innerText || '').trim())
                );
              if (toggle) toggle.click();
            }
          }
        })()`);
        await page.waitForFunction(`(() => {
          const modal = ${FIND_PROMPT_BUILDER_MODAL_JS};
          if (!modal) return false;
          return Array.from(modal.querySelectorAll('button')).some(b => {
            const r = b.getBoundingClientRect();
            return r.width > 0 && r.height > 0 && /sao chép\\s*\\.md/i.test((b.innerText || '').trim()) && !b.disabled;
          });
        })()`, 4000);
        await clickModalButtonByPattern(page, /sao chép\s*\.md/i);
        const clips = await page.getCapturedClipboard();
        assert(clips.length >= 1 && clips[0].includes('---'), 'Copy .md must include Markdown frontmatter');
        return 4;
      });
    },
  },
  {
    id: 'T3-13',
    tier: 3,
    featureArea: 'Cross-Prompts-Submit-LocalStorage',
    name: '/prompts -> Đóng góp Prompt mới -> /submit -> live {{var}} preview & save',
    description: 'Clicks Đóng góp Prompt mới CTA on /prompts, fills /submit form, and verifies persistence.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/prompts`);
        await page.click('main a[href="/submit"]');
        await page.waitForFunction(`window.location.pathname === '/submit'`, 6000);
        await page.fill('main input[type="text"]', 'Trợ lý tóm tắt biên bản họp');
        await page.evaluate<void>(`(() => {
          const tas = document.querySelectorAll('main textarea');
          const setVal = (el, val) => {
            Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set.call(el, val);
            el.dispatchEvent(new Event('input', { bubbles: true }));
          };
          if (tas[0]) setVal(tas[0], 'Tóm tắt các đầu việc và deadline từ biên bản họp.');
          if (tas[1]) setVal(tas[1], 'Hãy tóm tắt biên bản {{noi_dung_hop}} cho nhóm {{ten_nhom}}.');
        })()`);
        await page.waitForFunction(`document.body.innerText.includes('noi_dung_hop')`, 4000);
        await page.click('main form button[type="submit"]');
        await page.waitForFunction(`Boolean(window.localStorage.getItem('ai_life_hub_community_prompts'))`, 5000);
        return 4;
      });
    },
  },
  {
    id: 'T3-14',
    tier: 3,
    featureArea: 'Cross-Workflows-Agents',
    name: '/workflows step execution & .md export -> /agents navigation',
    description: 'Runs a single step in /workflows, verifies output, and navigates to /agents cleanly.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/workflows`);
        await page.fill('main input[type="text"]', 'Xây dựng API đặt lịch khám bệnh');
        await clickButtonByPattern(page, 'main', /chạy thử bước này|chạy bước này/i);
        await page.waitForFunction(`/chạy lại/i.test(document.body.innerText)`, 5000);
        await page.goto(`${ctx.baseUrl}/agents`);
        const count = await page.count('main a[href^="/playground?agent="]');
        assertEqual(count, 14, '/agents must render 14 blueprints after workflow run');
        return 3;
      });
    },
  },
  {
    id: 'T3-15',
    tier: 3,
    featureArea: 'Cross-Header-Navigation-Health',
    name: 'Header navigation links across /resources, /learn/quiz, /about, /contact maintain layout spacing',
    description: 'Asserts Header/Footer contain links to target routes, visits each route, and verifies header spacing and zero errors.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/`);
        const discoveredHrefs = await page.evaluate<string[]>(`(() => {
          const btns = Array.from(document.querySelectorAll('header nav button[aria-expanded]')).filter(b => {
            const r = b.getBoundingClientRect();
            return r.width > 0 && r.height > 0;
          });
          const set = new Set();
          btns.forEach(b => {
            b.click();
            document.querySelectorAll('header a[href^="/"], footer a[href^="/"]').forEach(a => {
              const h = a.getAttribute('href');
              if (h) set.add(h);
            });
          });
          document.querySelectorAll('header a[href^="/"], footer a[href^="/"]').forEach(a => {
            const h = a.getAttribute('href');
            if (h) set.add(h);
          });
          return Array.from(set);
        })()`);
        const routes = ['/resources', '/learn/quiz', '/about', '/contact'];
        for (let i = 0; i < routes.length; i++) {
          assert(
            discoveredHrefs.includes(routes[i]),
            `Expected Header/Footer on / to contain link to "${routes[i]}"`
          );
        }
        for (let i = 0; i < routes.length; i++) {
          await page.goto(`${ctx.baseUrl}${routes[i]}`);
          await assertNoHeaderOverlap(page, `T3-15:${routes[i]}`);
        }
        assertNoPageErrors(page, 'T3-15');
        return routes.length * 2 + 1;
      });
    },
  },
  {
    id: 'T3-16',
    tier: 3,
    featureArea: 'Cross-Footer-Navigation-Health',
    name: 'Footer navigation routes (/privacy, /terms, /playbooks, /ecosystem, /compare) load cleanly',
    description: 'Asserts <footer> contains links to all target routes, visits each, and verifies layout spacing and zero runtime errors.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/`);
        const footerHrefs = await page.evaluate<string[]>(
          `Array.from(document.querySelectorAll('footer a[href^="/"]')).map(a => a.getAttribute('href') || '').filter(Boolean)`
        );
        const routes = ['/privacy', '/terms', '/playbooks', '/ecosystem', '/compare'];
        for (let i = 0; i < routes.length; i++) {
          assert(
            footerHrefs.includes(routes[i]),
            `Expected <footer> on / to contain link to "${routes[i]}"`
          );
        }
        for (let i = 0; i < routes.length; i++) {
          await page.goto(`${ctx.baseUrl}${routes[i]}`);
          await assertNoHeaderOverlap(page, `T3-16:${routes[i]}`);
        }
        assertNoPageErrors(page, 'T3-16');
        return routes.length * 2 + 1;
      });
    },
  },
];
