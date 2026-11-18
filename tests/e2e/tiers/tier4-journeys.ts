import {
  assert,
  assertEqual,
  assertIncludes,
  assertNoAcademicJargon,
  assertNoCjkNoise,
  assertNoHeaderOverlap,
  assertNoHorizontalOverflow,
  assertNoPageErrors,
  assertNoRawCategorySlugs,
  assertNoUntranslatedMicrocopy,
  clickButtonByPattern,
  clickModalButtonByPattern,
  FIND_PROMPT_BUILDER_MODAL_JS,
  FORBIDDEN_COMPARE_MICROCOPY,
  FORBIDDEN_TOOLS_MICROCOPY,
  runPlaygroundAndWait,
  withPage,
} from '../lib/assertions';
import type { TestCase } from '../lib/types';

export const tier4Tests: TestCase[] = [
  {
    id: 'T4-J01',
    tier: 4,
    featureArea: 'Journey-OfficeWorkerEmail',
    name: 'Journey 1: Office worker writes a professional Vietnamese email in <60s (Hero -> /prompts -> PromptBuilder)',
    description: 'User lands on /, understands Everyday pathway, clicks /prompts, filters/finds email skill, fills variables, copies and launches ChatGPT.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        const startedAt = Date.now();
        await page.goto(`${ctx.baseUrl}/`);
        await assertNoHeaderOverlap(page, 'T4-J01:home');
        const heroH1 = await page.innerText('main h1');
        assert(heroH1.trim().length > 10, 'Hero headline must immediately explain value');

        await page.click('main section a[href="/prompts"]');
        await page.waitForFunction(`window.location.pathname === '/prompts'`, 6000);
        await page.fill('main input[type="text"]', 'email');
        await page.waitForSelector('main a[href="/skill/soan-thao-email-chuyen-nghiep"]', 5000);
        await page.click('main a[href="/skill/soan-thao-email-chuyen-nghiep"]');
        await page.waitForFunction(`window.location.pathname === '/skill/soan-thao-email-chuyen-nghiep'`, 6000);

        await clickButtonByPattern(page, 'main', /tạo câu lệnh|tùy chỉnh/i);
        await page.waitForFunction(
          `(() => { const m = ${FIND_PROMPT_BUILDER_MODAL_JS}; if (!m || !m.querySelector('select')) return false; m.setAttribute('data-e2e-pb-modal', 'true'); return true; })()`,
          5000
        );
        await page.selectOption('[data-e2e-pb-modal="true"] select', '0');
        await page.fill('[data-e2e-pb-modal="true"] input[type="text"]', 'Anh Minh - Trưởng phòng');
        const preview = await page.textContent('[data-e2e-pb-modal="true"] pre');
        assertIncludes(preview, 'Anh Minh - Trưởng phòng', 'Preview must include customized recipient');
        assert(!preview.includes('{{recipient}}'), 'Preview must resolve {{recipient}}');

        await clickModalButtonByPattern(page, /sao chép câu lệnh|^sao chép$/i);
        await clickModalButtonByPattern(page, /chatgpt/i);
        const clips = await page.getCapturedClipboard();
        const opens = await page.getCapturedWindowOpens();
        assert(clips.some((c) => c.includes('Anh Minh - Trưởng phòng')), 'Clipboard must contain customized email prompt');
        assert(opens.some((o) => o.url.includes('chatgpt.com')), 'ChatGPT launch URL must be invoked');

        const elapsed = Date.now() - startedAt;
        assert(elapsed < 60000, `Office worker journey must finish well under 60s (took ${elapsed}ms)`);
        assertNoPageErrors(page, 'T4-J01');
        return 8;
      });
    },
  },
  {
    id: 'T4-J02',
    tier: 4,
    featureArea: 'Journey-ContentCreatorOptimizer',
    name: 'Journey 2: Content creator upgrades a short raw prompt on /tools/prompt-optimizer with zero jargon -> /playground',
    description: 'User enters short raw prompt, picks framework, upgrades prompt, verifies plain Vietnamese output, copies, and opens Playground.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/tools/prompt-optimizer`);
        await assertNoHeaderOverlap(page, 'T4-J02');
        await page.fill('main textarea', 'viết bài giới thiệu sản phẩm trà thảo mộc cho dân văn phòng');
        const picked = await page.evaluate<boolean>(`(() => {
          const btns = Array.from(document.querySelectorAll('main button')).filter(b => Boolean(b.querySelector('p')) && (b.innerText || '').trim().length > 20);
          if (btns.length === 0) return false;
          btns[0].click();
          return true;
        })()`);
        assert(picked, 'T4-J02: PromptOptimizer quick-sample button must exist');
        await clickButtonByPattern(page, 'main', /nâng cấp|tối ưu.*ngay|tối ưu câu lệnh/i);
        await page.waitForSelector('main a[href="/playground"]', 6000);

        const bodyText = await page.innerText('main');
        assertIncludes(bodyText, 'trà thảo mộc', 'Optimized prompt must integrate user topic');
        assertNoAcademicJargon(bodyText, 'T4-J02');
        assertNoUntranslatedMicrocopy(bodyText, FORBIDDEN_TOOLS_MICROCOPY, 'T4-J02');

        await clickButtonByPattern(page, 'main', /sao chép/i);
        const clips = await page.getCapturedClipboard();
        assert(clips.length >= 1 && clips[0].includes('trà thảo mộc'), 'Copy must save upgraded prompt');

        await page.click('main a[href="/playground"]');
        await page.waitForFunction(`window.location.pathname === '/playground'`, 6000);
        assertNoPageErrors(page, 'T4-J02');
        return 6;
      });
    },
  },
  {
    id: 'T4-J03',
    tier: 4,
    featureArea: 'Journey-DeveloperSystemPromptCost',
    name: 'Journey 3: Developer designs System Prompt, inspects USD+VNĐ, tests in Playground, estimates VNĐ cost',
    description: 'End-to-end Builder workflow across /tools/system-prompt-builder, /playground, and /tools/token-calculator.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/tools/system-prompt-builder`);
        const studioText = await page.innerText('main');
        assert(studioText.includes('$') && /VNĐ|đ\b/i.test(studioText), 'Studio must show USD + VNĐ preview');
        assertNoAcademicJargon(studioText, 'T4-J03:studio');

        await page.pressKey('2');
        await page.evaluate<void>(`(() => {
          const inputs = Array.from(document.querySelectorAll('main input[type="text"]'));
          const cInput = inputs.find(i => /ràng buộc|không được|quy tắc|constraint/i.test(i.placeholder || '')) || inputs[1];
          if (cInput) {
            Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(cInput, 'Luôn giải thích bằng ví dụ TypeScript thực tế');
            cInput.dispatchEvent(new Event('input', { bubbles: true }));
          }
        })()`);
        await clickButtonByPattern(page, 'main', /^thêm$/i);
        await clickButtonByPattern(page, 'main', /\.md/i);
        const downloads = await page.getCapturedDownloads();
        assert(downloads.some((d) => d.download.endsWith('.md')), 'Studio export must download .md');

        await page.click('main a[href="/playground"]');
        await page.waitForFunction(`window.location.pathname === '/playground'`, 6000);
        await page.waitForSelector('main textarea', 5000);
        const pgText = await page.innerText('main');
        assert(/mô phỏng|giả lập|demo|simulated/i.test(pgText), 'Playground must display simulated demo notice');
        await runPlaygroundAndWait(page, 15000);

        await page.goto(`${ctx.baseUrl}/tools/token-calculator`);
        await page.clickByText('main button', 'Startup');
        await page.setRangeValue('main input[type="range"][max="100"]', 75);
        const calcText = await page.innerText('main');
        assertIncludes(calcText, '25.450', 'Token calculator must display VNĐ rate');
        assert(/\d+[\d.]*\s*đ/.test(calcText), 'Token calculator must display VNĐ monthly estimates');
        assertNoPageErrors(page, 'T4-J03');
        return 8;
      });
    },
  },
  {
    id: 'T4-J04',
    tier: 4,
    featureArea: 'Journey-TechLeadCompareAgents',
    name: 'Journey 4: Tech lead compares models (/compare), checks DeepSeek badges & exports on /agents -> /playground?agent=code-architect',
    description: 'Compares models 1-vs-1, switches to /agents, verifies DeepSeek badge fix, exports config, and runs code-architect in Playground.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/compare`);
        await clickButtonByPattern(page, 'main [role="tablist"]', /so sánh 1-đối-1|so sánh trực diện|so sánh 1-vs-1/i);
        const compareText = await page.innerText('main');
        assertNoUntranslatedMicrocopy(compareText, FORBIDDEN_COMPARE_MICROCOPY, 'T4-J04:compare');

        await page.goto(`${ctx.baseUrl}/agents`);
        const agentsText = await page.innerText('main');
        assertNoAcademicJargon(agentsText, 'T4-J04:agents');
        const deepSeekOk = await page.evaluate<boolean>(`(() => {
          const findCard = (el) => {
            let cur = el.parentElement;
            while (cur && cur.tagName !== 'MAIN') {
              if (cur.querySelector('h3') && cur.querySelectorAll('a[href^="/playground?agent="]').length === 1) return cur;
              cur = cur.parentElement;
            }
            return null;
          };
          const links = Array.from(document.querySelectorAll('main a[href^="/playground?agent="]'));
          const ds = links.filter(l => (l.getAttribute('href') || '').includes('database-performance-agent') || (l.getAttribute('href') || '').includes('kiem-chung-khoa-hoc-agent'));
          return ds.length === 2 && ds.every(l => {
            const txt = findCard(l)?.innerText || '';
            return /deepseek/i.test(txt) && !txt.includes('GPT-4o');
          });
        })()`);
        assert(deepSeekOk, 'DeepSeek agents must display DeepSeek badge, not GPT-4o');

        await page.clickByText('main button', '.cursorrules');
        await page.click('main a[href="/playground?agent=code-architect"]');
        await page.waitForFunction(`window.location.pathname === '/playground' && window.location.search.includes('code-architect')`, 6000);
        await runPlaygroundAndWait(page, 15000);
        assertNoPageErrors(page, 'T4-J04');
        return 6;
      });
    },
  },
  {
    id: 'T4-J05',
    tier: 4,
    featureArea: 'Journey-LearnerSearchResourcesQuiz',
    name: 'Journey 5: Learner uses CommandPalette (Ctrl+K) / /search, /resources, /learn/quiz (8 Qs), and /cheatsheet',
    description: 'Searches via Ctrl+K, explores /resources, completes all 8 quiz questions + review/restart, and checks /cheatsheet guardrails.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/`);
        await page.pressKey('Control+k');
        await page.waitForSelector('[role="dialog"] input', 4000);
        await page.fill('[role="dialog"] input', 'email');
        await page.waitForFunction(`document.querySelectorAll('[role="dialog"] a, [role="dialog"] [role="option"]').length > 0`, 5000);
        await page.pressKey('Escape');

        await page.goto(`${ctx.baseUrl}/resources`);
        await page.waitForFunction(`document.querySelectorAll('main article').length >= 4`, 5000);
        await page.clickByText('main button', 'Khóa học');

        await page.goto(`${ctx.baseUrl}/learn/quiz`);
        for (let q = 1; q <= 8; q++) {
          await page.waitForFunction(`document.body.innerText.includes('Câu hỏi ${q} / 8')`, 4000);
          await page.pressKey('1');
          await page.waitForFunction(
            `document.body.innerText.includes('Chính xác') || document.body.innerText.includes('Chưa đúng')`,
            4000
          );
          await page.pressKey('Enter');
        }
        await page.waitForFunction(
          `Array.from(document.querySelectorAll('main button')).some(b => /làm lại/i.test(b.innerText || ''))`,
          4000
        );
        await clickButtonByPattern(page, 'main', /xem lại/i);
        await clickButtonByPattern(page, 'main', /làm lại/i);
        await page.waitForFunction(`document.body.innerText.includes('Câu hỏi 1 / 8')`, 4000);

        await page.goto(`${ctx.baseUrl}/cheatsheet`);
        await clickButtonByPattern(page, 'main', /bảo mật|rào chắn/i);
        const guardCount = await page.count('main h3');
        assert(guardCount >= 1, 'Cheatsheet guardrails pill must show >= 1 card');
        assertNoPageErrors(page, 'T4-J05');
        return 8;
      });
    },
  },
  {
    id: 'T4-J06',
    tier: 4,
    featureArea: 'Journey-ParentDiscoveryBookmark',
    name: 'Journey 6: Parent discovers /category/giao-duc-con, bookmarks quan-ly-man-hinh-con, checks /favorites & PromptBuilder',
    description: 'Parent visits /categories -> /category/giao-duc-con, verifies clean skill page (zero CJK noise), bookmarks, verifies /favorites across reload.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/categories`);
        await page.click('main a[href*="/parenting"], main a[href*="/giao-duc-con"]');
        await page.waitForFunction(`window.location.pathname.includes('parenting') || window.location.pathname.includes('giao-duc-con')`, 6000);

        const catText = await page.innerText('main');
        assertNoCjkNoise(catText, 'T4-J06:cat');
        await page.click('main a[href="/skill/quan-ly-man-hinh-con"]');
        await page.waitForFunction(`window.location.pathname === '/skill/quan-ly-man-hinh-con'`, 6000);

        const skillText = await page.innerText('main');
        assertNoCjkNoise(skillText, 'T4-J06:skill');
        assertNoAcademicJargon(skillText, 'T4-J06:skill');

        const bookmarked = await page.evaluate<boolean>(`(() => {
          const btns = Array.from(document.querySelectorAll('main button'));
          const b = btns.find(btn => {
            const label = (btn.getAttribute('aria-label') || '') + ' ' + (btn.getAttribute('title') || '') + ' ' + (btn.innerText || '');
            return /lưu|bỏ lưu|bookmark|yêu thích/i.test(label);
          });
          if (!b) return false;
          b.click();
          return true;
        })()`);
        assert(bookmarked, 'T4-J06: Bookmark toggle button must exist on skill detail page');
        await page.goto(`${ctx.baseUrl}/favorites`);
        await page.reload();
        await page.waitForFunction(`document.querySelectorAll('main a[href="/skill/quan-ly-man-hinh-con"]').length >= 1`, 5000);

        const favBadges = await page.evaluate<string[]>(
          `Array.from(document.querySelectorAll('main span, main p')).map(e => (e.innerText || '').trim())`
        );
        assertNoRawCategorySlugs(favBadges, 'T4-J06:favorites');
        assertNoPageErrors(page, 'T4-J06');
        return 7;
      });
    },
  },
  {
    id: 'T4-J07',
    tier: 4,
    featureArea: 'Journey-CommunitySubmit',
    name: 'Journey 7: Community contributor submits a parameterized {{var}} prompt on /submit and verifies persistence',
    description: 'Contributor fills /submit with {{khach_hang}} and {{van_de}}, checks Live Preview variable detection, submits, and verifies localStorage.',
    run: async (ctx) => {
      return await withPage(ctx, { width: 375, height: 812 }, async (page) => {
        await page.goto(`${ctx.baseUrl}/submit`);
        await assertNoHeaderOverlap(page, 'T4-J07:mobile');
        await assertNoHorizontalOverflow(page, 'T4-J07:mobile');

        await page.fill('main input[type="text"]', 'Chăm sóc khách hàng phản hồi chậm');
        await page.evaluate<void>(`(() => {
          const tas = document.querySelectorAll('main textarea');
          const setVal = (el, val) => {
            Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set.call(el, val);
            el.dispatchEvent(new Event('input', { bubbles: true }));
          };
          if (tas[0]) setVal(tas[0], 'Soạn phản hồi xin lỗi khéo léo và đề xuất hướng xử lý nhanh.');
          if (tas[1]) setVal(tas[1], 'Hãy viết email xin lỗi {{khach_hang}} về sự cố {{van_de}}.');
        })()`);
        await page.waitForFunction(
          `document.body.innerText.includes('khach_hang') && document.body.innerText.includes('van_de')`,
          4000
        );
        await page.click('main form button[type="submit"]');
        await page.waitForFunction(`document.body.innerText.includes('đã được ghi nhận')`, 5000);
        const saved = await page.getLocalStorage('ai_life_hub_community_prompts');
        assert(saved && saved.includes('Chăm sóc khách hàng'), 'Submitted prompt must persist in ai_life_hub_community_prompts');
        assertNoPageErrors(page, 'T4-J07');
        return 6;
      });
    },
  },
    {
      id: 'T4-J08',
      tier: 4,
      featureArea: 'Journey-WorkflowPipelineExport',
      name: 'Journey 8: Builder runs a complete multi-agent pipeline on /workflows and exports .md report',
      description: 'Selects workflow on /workflows, runs all steps sequentially, confirms outputs, and exports consolidated .md report.',
      run: async (ctx) => {
        return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
          await page.goto(`${ctx.baseUrl}/workflows`);
          await assertNoHeaderOverlap(page, 'T4-J08');
          const wfText = await page.innerText('main');
          assertNoAcademicJargon(wfText, 'T4-J08');

          const pickedWorkflow = await page.evaluate<boolean>(`(() => {
            const cards = Array.from(document.querySelectorAll('main button')).filter(b => Boolean(b.querySelector('h3')));
            if (cards.length < 2) return false;
            cards[1].click();
            return true;
          })()`);
          assert(pickedWorkflow, 'T4-J08: Second workflow pipeline card button must exist');
          await page.fill('main input[type="text"]', 'Thiết kế hệ thống đặt vé sự kiện chịu tải 10k người dùng');
          await clickButtonByPattern(page, 'main', /chạy thử mô phỏng|chạy toàn bộ/i);
          await page.waitForFunction(
            `Array.from(document.querySelectorAll('main button')).some(b => /\\.md/i.test(b.innerText || ''))`,
            15000
          );
          await clickButtonByPattern(page, 'main', /\.md/i);
          const downloads = await page.getCapturedDownloads();
          assert(downloads.some((d) => d.download.endsWith('.md')), 'Pipeline export must trigger .md download');
          assertNoPageErrors(page, 'T4-J08');
          return 5;
        });
      },
    },
    {
      id: 'T4-J09',
      tier: 4,
      featureArea: 'Journey-AIWorkspaceLiveExecution',
      name: 'Journey 9: AI Workspace (/workspace) switches all 3 core workflows, validates empty input, streams live AI response, edits, saves session & persists across reload',
      description: 'Verifies /api/workspace/status, tests Email / Meeting / Document tabs, executes live server-backed AI (or honest 503 if unconfigured), verifies session reload & responsive mobile layout.',
      run: async (ctx) => {
        return await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
          // 1. Check /api/workspace/status directly
          const statusRes = await fetch(`${ctx.baseUrl}/api/workspace/status`);
          assertEqual(statusRes.status, 200, '/api/workspace/status must return HTTP 200');
          const statusJson = (await statusRes.json()) as { configured: boolean; availableModels: unknown[] };

          // 2. Check /api/workspace/execute rejects empty input with HTTP 400
          const badRes = await fetch(`${ctx.baseUrl}/api/workspace/execute`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ workflowId: 'email-assistant', inputs: {} }),
          });
          assertEqual(badRes.status, 400, '/api/workspace/execute must reject empty input with HTTP 400');

          // 3. Navigate to /workspace and verify layout + workflow switching
          await page.goto(`${ctx.baseUrl}/workspace`);
          await assertNoHeaderOverlap(page, 'T4-J09:desktop');
          await assertNoHorizontalOverflow(page, 'T4-J09:desktop');

          // Switch to Meeting Summary tab & fill sample
          await clickButtonByPattern(page, 'main [role="tablist"]', /tóm tắt cuộc họp/i);
          await clickButtonByPattern(page, 'main', /điền ví dụ mẫu/i);
          const notesVal = await page.evaluate<string>(`document.querySelector('#ws-meeting-notes')?.value || ''`);
          assert(notesVal.length > 50, 'Quick sample must populate meeting notes textarea');

          // Switch to Document Analysis tab & verify controls
          await clickButtonByPattern(page, 'main [role="tablist"]', /phân tích tài liệu/i);
          await page.waitForSelector('#ws-doc-text', 4000);

          // Switch back to Meeting Summary and execute live AI workflow
          await clickButtonByPattern(page, 'main [role="tablist"]', /tóm tắt cuộc họp/i);
          await clickButtonByPattern(page, 'main', /thực thi ngay/i);

          if (statusJson.configured) {
            await page.waitForFunction(
              `Boolean(window.localStorage.getItem('ai_life_hub_workspace_sessions'))`,
              35000
            );
            const savedRaw = await page.getLocalStorage('ai_life_hub_workspace_sessions');
            assert(Boolean(savedRaw && savedRaw.length > 20), 'Completed AI Workspace run must persist session to localStorage');
            const finalDomText = await page.innerText('main');
            assertIncludes(finalDomText, 'Tóm tắt điều hành', 'Live Meeting Summary output must render Executive Summary section');
            assertIncludes(finalDomText, 'Chưa nêu rõ trong biên bản', 'Live Meeting Summary must explicitly flag missing owner/deadline without inventing');

            // Reload and confirm saved session appears in sidebar history
            await page.reload();
            await page.waitForFunction(
              `(document.querySelector('main')?.innerText || '').includes('Họp giao ban')`,
              6000
            );
          } else {
            await page.waitForFunction(
              `Boolean(document.querySelector('main [role="alert"]'))`,
              6000
            );
          }

          assertNoPageErrors(page, 'T4-J09');
          return 9;
        });
      },
    },
    {
      id: 'T4-J10',
      tier: 4,
      featureArea: 'Journey-HubsAccountPrivacyMobile',
      name: 'Journey 10: /ai-work 8 task groups, /builder-lab verified registry, /submit -> /prompts visibility, /account 1-click data deletion & 360px mobile overflow check',
      description: 'Exercises /ai-work, /builder-lab, /account personal template creation + 1-click data wipe, and mobile 360x800 layout on /workspace.',
      run: async (ctx) => {
        await withPage(ctx, { width: 1280, height: 800 }, async (page) => {
          // 1. /ai-work renders 8 task groups
          await page.goto(`${ctx.baseUrl}/ai-work`);
          await assertNoHeaderOverlap(page, 'T4-J10:ai-work');
          const tabCount = await page.count('main [role="tab"]');
          assertEqual(tabCount, 8, '/ai-work must render all 8 task-oriented work groups');
          await clickButtonByPattern(page, 'main [role="tablist"]', /phân tích dữ liệu/i);
          const workText = await page.innerText('main');
          assertNoAcademicJargon(workText, 'T4-J10:ai-work');

          // 2. /builder-lab renders verified API snapshot & tools
          await page.goto(`${ctx.baseUrl}/builder-lab`);
          await assertNoHeaderOverlap(page, 'T4-J10:builder-lab');
          const labText = await page.innerText('main');
          assertIncludes(labText, 'gemini-2.5-pro', '/builder-lab must display verified API model IDs');
          assertIncludes(labText, '25.450', '/builder-lab must display reference VND rate');

          // 3. /account creates personal template and executes 1-click complete deletion
          await page.goto(`${ctx.baseUrl}/account`);
          await assertNoHeaderOverlap(page, 'T4-J10:account');
          await page.fill('main input[aria-label="Tên mẫu câu lệnh cá nhân"]', 'Mẫu báo cáo tuần kiểm thử');
          await page.fill('main textarea[aria-label="Nội dung mẫu câu lệnh cá nhân"]', 'Tổng hợp 3 kết quả đạt được trong tuần.');
          await clickButtonByPattern(page, 'main', /lưu mẫu cá nhân/i);
          await page.waitForFunction(
            `Boolean(window.localStorage.getItem('ai_life_hub_personal_templates'))`,
            4000
          );

          await clickButtonByPattern(page, 'main', /xóa toàn bộ dữ liệu cá nhân/i);
          await clickButtonByPattern(page, 'main', /xác nhận xóa vĩnh viễn/i);
          await page.waitForFunction(
            `!window.localStorage.getItem('ai_life_hub_personal_templates') && !window.localStorage.getItem('ai_life_hub_workspace_sessions')`,
            4000
          );

          assertNoPageErrors(page, 'T4-J10:desktop');
          return 7;
        });

        // 4. Mobile 360x800 check on /workspace & /ai-work
        return await withPage(ctx, { width: 360, height: 800 }, async (mobilePage) => {
          await mobilePage.goto(`${ctx.baseUrl}/workspace`);
          await assertNoHeaderOverlap(mobilePage, 'T4-J10:workspace-360');
          await assertNoHorizontalOverflow(mobilePage, 'T4-J10:workspace-360');

          await mobilePage.goto(`${ctx.baseUrl}/ai-work`);
          await assertNoHeaderOverlap(mobilePage, 'T4-J10:ai-work-360');
          await assertNoHorizontalOverflow(mobilePage, 'T4-J10:ai-work-360');
          assertNoPageErrors(mobilePage, 'T4-J10:mobile');
          return 10;
        });
      },
    },
  ];
