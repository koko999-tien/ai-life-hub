export type TestTier = 1 | 2 | 3 | 4;

export interface BrowserRect {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

export interface CapturedDownload {
  download: string;
  href: string;
  ts: number;
}

export interface CapturedWindowOpen {
  url: string;
  target: string;
  ts: number;
}

export interface PageSession {
  goto(url: string, options?: { timeoutMs?: number; settleMs?: number }): Promise<void>;
  reload(options?: { timeoutMs?: number; settleMs?: number }): Promise<void>;
  setViewport(width: number, height: number): Promise<void>;
  evaluate<T>(fnOrExpr: string): Promise<T>;
  waitForSelector(selector: string, timeoutMs?: number): Promise<void>;
  waitForFunction(expr: string, timeoutMs?: number): Promise<void>;
  click(selector: string): Promise<void>;
  clickByText(selector: string, textIncludes: string): Promise<void>;
  fill(selector: string, value: string): Promise<void>;
  selectOption(selector: string, value: string): Promise<void>;
  setRangeValue(selector: string, value: number | string): Promise<void>;
  pressKey(keyCombo: string): Promise<void>;
  textContent(selector?: string): Promise<string>;
  innerText(selector?: string): Promise<string>;
  getRect(selector: string): Promise<BrowserRect | null>;
  count(selector: string): Promise<number>;
  getAttribute(selector: string, attr: string): Promise<string | null>;
  isDisabled(selector: string): Promise<boolean>;
  getLocalStorage(key: string): Promise<string | null>;
  setLocalStorage(key: string, value: string): Promise<void>;
  clearStorage(): Promise<void>;
  currentUrl(): Promise<string>;
  getCapturedClipboard(): Promise<string[]>;
  getCapturedWindowOpens(): Promise<CapturedWindowOpen[]>;
  getCapturedDownloads(): Promise<CapturedDownload[]>;
  getConsoleErrors(): string[];
  getPageErrors(): string[];
  clearErrors(): void;
  close(): Promise<void>;
}

export interface BrowserManager {
  executablePath: string;
  userDataDir: string;
  newPage(options?: { width?: number; height?: number }): Promise<PageSession>;
  close(): Promise<void>;
}

export interface TestContext {
  baseUrl: string;
  browser: BrowserManager;
  timeoutMs: number;
  verbose: boolean;
}

export interface TestCase {
  id: string;
  tier: TestTier;
  featureArea: string;
  name: string;
  description: string;
  run: (ctx: TestContext) => Promise<number>;
}

export interface RunnerOptions {
  tiers: TestTier[];
  baseUrl?: string;
  dryRun: boolean;
  selfTest: boolean;
  timeoutMs: number;
  verbose: boolean;
  filter?: string;
}

export interface TestResult {
  id: string;
  tier: TestTier;
  featureArea: string;
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  durationMs: number;
  assertions: number;
  error?: string;
}

export interface TierSummary {
  tier: TestTier;
  total: number;
  passed: number;
  failed: number;
  assertions: number;
  durationMs: number;
}

export interface SuiteSummary {
  total: number;
  passed: number;
  failed: number;
  totalAssertions: number;
  durationMs: number;
  byTier: TierSummary[];
  results: TestResult[];
}
