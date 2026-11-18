import { parseCliArgs, runSelfTest } from './lib/assertions';
import { findBrowserBinary, launchBrowser } from './lib/cdp';
import { RunningServer, startNextServer } from './lib/server';
import type {
  BrowserManager,
  SuiteSummary,
  TestCase,
  TestContext,
  TestResult,
  TestTier,
  TierSummary,
} from './lib/types';
import { tier1Tests } from './tiers/tier1-features';
import { tier2Tests } from './tiers/tier2-boundaries';
import { tier3Tests } from './tiers/tier3-cross-feature';
import { tier4Tests } from './tiers/tier4-journeys';

const ALL_TESTS: TestCase[] = [
  ...tier1Tests,
  ...tier2Tests,
  ...tier3Tests,
  ...tier4Tests,
];

function printUsage(): void {
  console.log(`AI Life Hub Opaque-Box E2E Test Runner
Usage:
  npx tsx tests/e2e/run.ts [options]

Options:
  --tier=1[,2,3,4]     Run specific tier(s) (default: 1,2,3,4)
  --base-url=<url>     Use an already-running server instead of spawning next start
  --dry-run            Enumerate planned tests for selected tier(s) and exit 0
  --self-test          Run unit checks + live data:text/html CDP smoke test and exit 0
  --timeout=<ms>       Per-test timeout in milliseconds (default: 45000)
  --filter=<substr>    Run only tests whose id/name/featureArea matches <substr>
  --verbose, -v        Print extra diagnostic details
  --help, -h           Show this help message
`);
}

function selectTests(tiers: TestTier[], filter?: string): TestCase[] {
  const tierSet = new Set<TestTier>(tiers);
  return ALL_TESTS.filter((tc) => {
    if (!tierSet.has(tc.tier)) return false;
    if (filter) {
      const q = filter.toLowerCase();
      return (
        tc.id.toLowerCase().includes(q) ||
        tc.name.toLowerCase().includes(q) ||
        tc.featureArea.toLowerCase().includes(q)
      );
    }
    return true;
  });
}

function buildDryRunReport(selected: TestCase[], tiers: TestTier[]): void {
  let browserInfo = 'Not checked';
  try {
    browserInfo = findBrowserBinary();
  } catch (err) {
    browserInfo = `Unavailable (${err instanceof Error ? err.message : String(err)})`;
  }

  console.log('=== AI Life Hub E2E Dry Run ===');
  console.log(`Selected Tiers: ${tiers.join(', ')}`);
  console.log(`Browser Binary: ${browserInfo}`);
  console.log('');

  for (let t = 0; t < tiers.length; t++) {
    const tierNum = tiers[t];
    const items = selected.filter((tc) => tc.tier === tierNum);
    console.log(`--- Tier ${tierNum} (${items.length} tests) ---`);
    for (let i = 0; i < items.length; i++) {
      const tc = items[i];
      console.log(`  [${tc.id}] (${tc.featureArea}) ${tc.name}`);
    }
    console.log('');
  }

  console.log(`Total Enumerated Tests: ${selected.length}`);
}

async function runWithTimeout<T>(promise: Promise<T>, timeoutMs: number, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => {
          reject(new Error(`Test "${label}" timed out after ${timeoutMs}ms`));
        }, timeoutMs);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

function summarizeResults(results: TestResult[], tiers: TestTier[], totalDurationMs: number): SuiteSummary {
  const byTier: TierSummary[] = [];
  let totalAssertions = 0;
  let passed = 0;
  let failed = 0;

  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    totalAssertions += r.assertions;
    if (r.status === 'passed') passed++;
    else if (r.status === 'failed') failed++;
  }

  for (let t = 0; t < tiers.length; t++) {
    const tierNum = tiers[t];
    const items = results.filter((r) => r.tier === tierNum);
    let tierPassed = 0;
    let tierFailed = 0;
    let tierAssertions = 0;
    let tierDuration = 0;
    for (let i = 0; i < items.length; i++) {
      if (items[i].status === 'passed') tierPassed++;
      else if (items[i].status === 'failed') tierFailed++;
      tierAssertions += items[i].assertions;
      tierDuration += items[i].durationMs;
    }
    byTier.push({
      tier: tierNum,
      total: items.length,
      passed: tierPassed,
      failed: tierFailed,
      assertions: tierAssertions,
      durationMs: tierDuration,
    });
  }

  return {
    total: results.length,
    passed,
    failed,
    totalAssertions,
    durationMs: totalDurationMs,
    byTier,
    results,
  };
}

function printSummary(summary: SuiteSummary): void {
  console.log('\n=== E2E Execution Summary ===');
  for (let i = 0; i < summary.byTier.length; i++) {
    const ts = summary.byTier[i];
    console.log(
      `Tier ${ts.tier}: ${ts.passed}/${ts.total} passed, ${ts.failed} failed, ${ts.assertions} assertions (${ts.durationMs}ms)`
    );
  }
  console.log(
    `TOTAL: ${summary.passed}/${summary.total} passed, ${summary.failed} failed, ${summary.totalAssertions} assertions in ${summary.durationMs}ms`
  );

  const failures = summary.results.filter((r) => r.status === 'failed');
  if (failures.length > 0) {
    console.log('\n=== Failures ===');
    for (let i = 0; i < failures.length; i++) {
      const f = failures[i];
      console.log(`- [${f.id}] ${f.name}\n  Error: ${f.error ?? 'Unknown error'}`);
    }
  }
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  if (argv.includes('--help') || argv.includes('-h')) {
    printUsage();
    process.exit(0);
  }

  const options = parseCliArgs(argv);

  if (options.selfTest) {
    console.log('Running E2E runner self-test...');
    await runSelfTest();
    console.log('PASS: E2E self-test completed cleanly (unit checks + live CDP smoke + temp dir cleanup).');
    process.exit(0);
  }

  const selected = selectTests(options.tiers, options.filter);

  if (options.dryRun) {
    buildDryRunReport(selected, options.tiers);
    process.exit(0);
  }

  if (selected.length === 0) {
    console.error('No test cases matched the selected tier(s)/filter.');
    process.exit(1);
  }

  const suiteStart = Date.now();
  let server: RunningServer | null = null;
  let browser: BrowserManager | null = null;
  const results: TestResult[] = [];

  try {
    const baseUrl = options.baseUrl
      ? options.baseUrl
      : ((server = await startNextServer({ timeoutMs: 30000 })).baseUrl);

    browser = await launchBrowser();
    console.log(`Running ${selected.length} E2E test(s) against ${baseUrl} using ${browser.executablePath}`);

    const ctx: TestContext = {
      baseUrl,
      browser,
      timeoutMs: options.timeoutMs,
      verbose: options.verbose,
    };

    for (let i = 0; i < selected.length; i++) {
      const tc = selected[i];
      const t0 = Date.now();
      try {
        const assertions = await runWithTimeout(tc.run(ctx), options.timeoutMs, `${tc.id} ${tc.name}`);
        const dur = Date.now() - t0;
        results.push({
          id: tc.id,
          tier: tc.tier,
          featureArea: tc.featureArea,
          name: tc.name,
          status: 'passed',
          durationMs: dur,
          assertions,
        });
        console.log(`PASS [${tc.id}] ${tc.name} (${assertions} assertions, ${dur}ms)`);
      } catch (err) {
        const dur = Date.now() - t0;
        const msg = err instanceof Error ? err.message : String(err);
        results.push({
          id: tc.id,
          tier: tc.tier,
          featureArea: tc.featureArea,
          name: tc.name,
          status: 'failed',
          durationMs: dur,
          assertions: 0,
          error: msg,
        });
        console.error(`FAIL [${tc.id}] ${tc.name} (${dur}ms)\n  ${msg}`);
      }
    }
  } finally {
    if (browser) {
      await browser.close();
    }
    if (server) {
      await server.stop();
    }
  }

  const summary = summarizeResults(results, options.tiers, Date.now() - suiteStart);
  printSummary(summary);
  process.exit(summary.failed === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(`Fatal E2E runner error: ${err instanceof Error ? err.stack || err.message : String(err)}`);
  process.exit(1);
});
