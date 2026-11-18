import { ChildProcess, spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { killProcessTree } from './server';
import type {
  BrowserManager,
  BrowserRect,
  CapturedDownload,
  CapturedWindowOpen,
  PageSession,
} from './types';

interface CdpMessage {
  id?: number;
  method?: string;
  params?: Record<string, unknown>;
  result?: Record<string, unknown>;
  error?: { code?: number; message?: string };
  sessionId?: string;
}

interface PendingCommand {
  resolve: (value: Record<string, unknown>) => void;
  reject: (reason: Error) => void;
}

type EventListener = (method: string, params: Record<string, unknown>) => void;

const SPY_INIT_SCRIPT = `
(() => {
  if (window.__e2eHooksInstalled) return;
  window.__e2eHooksInstalled = true;
  window.__e2eOpenCalls = [];
  window.__e2eClipboardWrites = [];
  window.__e2eDownloads = [];

  const origOpen = window.open ? window.open.bind(window) : null;
  window.open = function(url, target, features) {
    try {
      window.__e2eOpenCalls.push({
        url: String(url || ''),
        target: String(target || ''),
        ts: Date.now()
      });
    } catch (_) {}
    return { closed: false, focus: function() {}, close: function() {}, opener: window, origOpen: !!origOpen };
  };

  const origClipboard = navigator.clipboard;
  const origWriteText = origClipboard && origClipboard.writeText ? origClipboard.writeText.bind(origClipboard) : null;
  try {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: function(text) {
          try {
            window.__e2eClipboardWrites.push(String(text || ''));
          } catch (_) {}
          if (origWriteText) {
            return origWriteText(text).catch(function() { return undefined; });
          }
          return Promise.resolve();
        },
        readText: function() {
          const writes = window.__e2eClipboardWrites || [];
          return Promise.resolve(writes.length ? writes[writes.length - 1] : '');
        }
      }
    });
  } catch (_) {
    if (origClipboard && origWriteText) {
      origClipboard.writeText = function(text) {
        try {
          window.__e2eClipboardWrites.push(String(text || ''));
        } catch (_) {}
        return origWriteText(text).catch(function() { return undefined; });
      };
    }
  }

  const origAnchorClick = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function() {
    try {
      if (this.hasAttribute('download') || this.download) {
        window.__e2eDownloads.push({
          download: String(this.download || this.getAttribute('download') || ''),
          href: String(this.href || ''),
          ts: Date.now()
        });
        return;
      }
    } catch (_) {}
    return origAnchorClick.apply(this, arguments);
  };
})();
`;

function collectVersionDirs(baseDir: string, prefix: string): string[] {
  if (!fs.existsSync(baseDir)) return [];
  try {
    return fs
      .readdirSync(baseDir, { withFileTypes: true })
      .filter((d) => d.isDirectory() && d.name.startsWith(prefix))
      .map((d) => d.name)
      .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))
      .map((name) => path.join(baseDir, name));
  } catch {
    return [];
  }
}

export function findBrowserBinary(overridePath?: string): string {
  const candidates: string[] = [];

  if (overridePath) candidates.push(overridePath);
  if (process.env.E2E_BROWSER_PATH) candidates.push(process.env.E2E_BROWSER_PATH);

  const localAppData = process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local');
  const msPlaywrightDir = path.join(localAppData, 'ms-playwright');

  const headlessShellDirs = collectVersionDirs(msPlaywrightDir, 'chromium_headless_shell-');
  headlessShellDirs.forEach((dir) => {
    candidates.push(path.join(dir, 'chrome-headless-shell-win64', 'chrome-headless-shell.exe'));
    candidates.push(path.join(dir, 'chrome-headless-shell-linux', 'chrome-headless-shell'));
  });

  const chromiumDirs = collectVersionDirs(msPlaywrightDir, 'chromium-');
  chromiumDirs.forEach((dir) => {
    candidates.push(path.join(dir, 'chrome-win64', 'chrome.exe'));
    candidates.push(path.join(dir, 'chrome-win', 'chrome.exe'));
    candidates.push(path.join(dir, 'chrome-linux', 'chrome'));
  });

  const programFiles = process.env.ProgramFiles || 'C:\\Program Files';
  const programFilesX86 = process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)';

  candidates.push(
    path.join(programFiles, 'Google', 'Chrome', 'Application', 'chrome.exe'),
    path.join(programFilesX86, 'Google', 'Chrome', 'Application', 'chrome.exe'),
    path.join(localAppData, 'Google', 'Chrome', 'Application', 'chrome.exe'),
    path.join(programFilesX86, 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
    path.join(programFiles, 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser'
  );

  for (let i = 0; i < candidates.length; i++) {
    const candidate = candidates[i];
    if (candidate && fs.existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error(
    `No Chromium-family browser binary found. Checked E2E_BROWSER_PATH, "${msPlaywrightDir}", Chrome, and Edge. Set E2E_BROWSER_PATH to a valid browser executable.`
  );
}

class CdpConnection {
  private ws: WebSocket;
  private nextId = 1;
  private pending = new Map<number, PendingCommand>();
  private sessionListeners = new Map<string, Set<EventListener>>();
  private closed = false;

  constructor(ws: WebSocket) {
    this.ws = ws;
    this.ws.onmessage = (event: MessageEvent) => {
      const raw = typeof event.data === 'string' ? event.data : String(event.data);
      let msg: CdpMessage;
      try {
        msg = JSON.parse(raw) as CdpMessage;
      } catch {
        return;
      }

      if (typeof msg.id === 'number') {
        const pending = this.pending.get(msg.id);
        if (pending) {
          this.pending.delete(msg.id);
          if (msg.error) {
            pending.reject(new Error(`CDP error ${String(msg.error.code ?? '')}: ${msg.error.message ?? 'Unknown'}`));
          } else {
            pending.resolve(msg.result ?? {});
          }
        }
        return;
      }

      if (msg.method && msg.sessionId) {
        const listeners = this.sessionListeners.get(msg.sessionId);
        if (listeners) {
          const params = msg.params ?? {};
          const method = msg.method;
          listeners.forEach((fn) => fn(method, params));
        }
      }
    };

    this.ws.onclose = () => {
      this.closed = true;
      this.pending.forEach((p) => {
        p.reject(new Error('CDP WebSocket connection closed'));
      });
      this.pending.clear();
    };
  }

  onSessionEvent(sessionId: string, listener: EventListener): () => void {
    let set = this.sessionListeners.get(sessionId);
    if (!set) {
      set = new Set<EventListener>();
      this.sessionListeners.set(sessionId, set);
    }
    set.add(listener);
    return () => {
      const current = this.sessionListeners.get(sessionId);
      if (current) {
        current.delete(listener);
        if (current.size === 0) {
          this.sessionListeners.delete(sessionId);
        }
      }
    };
  }

  send(method: string, params?: Record<string, unknown>, sessionId?: string): Promise<Record<string, unknown>> {
    if (this.closed) {
      return Promise.reject(new Error(`Cannot send CDP command "${method}" on closed WebSocket`));
    }
    const id = this.nextId++;
    const payload: Record<string, unknown> = { id, method };
    if (params) payload.params = params;
    if (sessionId) payload.sessionId = sessionId;

    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      try {
        this.ws.send(JSON.stringify(payload));
      } catch (err) {
        this.pending.delete(id);
        reject(err instanceof Error ? err : new Error(String(err)));
      }
    });
  }

  close(): void {
    if (!this.closed) {
      this.closed = true;
      try {
        this.ws.close();
      } catch {
        // ignore
      }
    }
  }
}

function getKeySpec(keyCombo: string): {
  key: string;
  code: string;
  keyCode: number;
  modifiers: number;
  text?: string;
} {
  const parts = keyCombo.split('+');
  let modifiers = 0;
  let mainKey = parts[parts.length - 1] ?? '';

  for (let i = 0; i < parts.length - 1; i++) {
    const mod = parts[i].toLowerCase();
    if (mod === 'alt') modifiers |= 1;
    else if (mod === 'control' || mod === 'ctrl') modifiers |= 2;
    else if (mod === 'meta' || mod === 'cmd' || mod === 'command') modifiers |= 4;
    else if (mod === 'shift') modifiers |= 8;
  }

  if (mainKey === 'Escape') {
    return { key: 'Escape', code: 'Escape', keyCode: 27, modifiers };
  }
  if (mainKey === 'Enter') {
    return { key: 'Enter', code: 'Enter', keyCode: 13, modifiers, text: '\r' };
  }
  if (mainKey === 'Tab') {
    return { key: 'Tab', code: 'Tab', keyCode: 9, modifiers };
  }
  if (mainKey.length === 1) {
    const upper = mainKey.toUpperCase();
    const charCode = upper.charCodeAt(0);
    const isDigit = mainKey >= '0' && mainKey <= '9';
    const isAlpha = upper >= 'A' && upper <= 'Z';
    const code = isDigit ? `Digit${mainKey}` : isAlpha ? `Key${upper}` : mainKey;
    const text = (modifiers & 2) === 0 && (modifiers & 4) === 0 ? mainKey : undefined;
    return { key: mainKey, code, keyCode: charCode, modifiers, text };
  }

  mainKey = mainKey || 'Unidentified';
  return { key: mainKey, code: mainKey, keyCode: 0, modifiers };
}

class CdpPageSession implements PageSession {
  private conn: CdpConnection;
  private sessionId: string;
  private targetId: string;
  private browserContextId: string | undefined;
  private consoleErrors: string[] = [];
  private pageErrors: string[] = [];
  private loadResolvers: Array<() => void> = [];
  private detachListener: () => void;
  private closed = false;

  constructor(
    conn: CdpConnection,
    sessionId: string,
    targetId: string,
    browserContextId?: string
  ) {
    this.conn = conn;
    this.sessionId = sessionId;
    this.targetId = targetId;
    this.browserContextId = browserContextId;

    this.detachListener = this.conn.onSessionEvent(sessionId, (method, params) => {
      if (method === 'Page.loadEventFired') {
        const pending = this.loadResolvers.splice(0, this.loadResolvers.length);
        pending.forEach((fn) => fn());
      } else if (method === 'Runtime.exceptionThrown') {
        const details = params.exceptionDetails as Record<string, unknown> | undefined;
        const exc = details?.exception as Record<string, unknown> | undefined;
        const text = String(exc?.description || details?.text || 'Uncaught page exception');
        this.pageErrors.push(text);
      } else if (method === 'Runtime.consoleAPICalled') {
        if (params.type === 'error') {
          const args = Array.isArray(params.args) ? params.args : [];
          const msg = args
            .map((a) => {
              const rec = a as Record<string, unknown>;
              return String(rec.value ?? rec.description ?? '');
            })
            .filter(Boolean)
            .join(' ');
          if (msg) this.consoleErrors.push(msg);
        }
      } else if (method === 'Log.entryAdded') {
        const entry = params.entry as Record<string, unknown> | undefined;
        if (entry?.level === 'error') {
          this.consoleErrors.push(String(entry.text ?? 'Console error'));
        }
      }
    });
  }

  async init(width: number, height: number): Promise<void> {
    await this.conn.send('Page.enable', undefined, this.sessionId);
    await this.conn.send('Runtime.enable', undefined, this.sessionId);
    await this.conn.send('DOM.enable', undefined, this.sessionId);
    await this.conn.send('Log.enable', undefined, this.sessionId);
    await this.conn.send(
      'Page.addScriptToEvaluateOnNewDocument',
      { source: SPY_INIT_SCRIPT },
      this.sessionId
    );
    await this.setViewport(width, height);
  }

  async setViewport(width: number, height: number): Promise<void> {
    await this.conn.send(
      'Emulation.setDeviceMetricsOverride',
      {
        width,
        height,
        deviceScaleFactor: 1,
        mobile: width < 640,
      },
      this.sessionId
    );
  }

  private waitForLoadEvent(timeoutMs: number): Promise<void> {
    return new Promise((resolve) => {
      let settled = false;
      const timer = setTimeout(() => {
        if (!settled) {
          settled = true;
          resolve();
        }
      }, timeoutMs);

      this.loadResolvers.push(() => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          resolve();
        }
      });
    });
  }

  private async grantClipboardForOrigin(targetUrl: string): Promise<void> {
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) return;
    try {
      const origin = new URL(targetUrl).origin;
      await this.conn.send('Browser.grantPermissions', {
        origin,
        permissions: ['clipboardReadWrite', 'clipboardSanitizedWrite'],
      });
    } catch {
      // Optional permission grant; spy script already captures clipboard writes
    }
  }

  async goto(url: string, options?: { timeoutMs?: number; settleMs?: number }): Promise<void> {
    const timeoutMs = options?.timeoutMs ?? 20000;
    const settleMs = options?.settleMs ?? 250;

    await this.grantClipboardForOrigin(url);
    const loadPromise = this.waitForLoadEvent(timeoutMs);
    await this.conn.send('Page.navigate', { url }, this.sessionId);
    await loadPromise;

    await this.waitForFunction('document.readyState === "complete"', Math.min(timeoutMs, 10000));
    // Allow React 18 hydration & useEffect mounts to settle
    await this.evaluate<void>(
      'new Promise(r => requestAnimationFrame(() => requestAnimationFrame(() => r())))'
    );
    if (settleMs > 0) {
      await new Promise((r) => setTimeout(r, settleMs));
    }
  }

  async reload(options?: { timeoutMs?: number; settleMs?: number }): Promise<void> {
    const timeoutMs = options?.timeoutMs ?? 20000;
    const settleMs = options?.settleMs ?? 250;
    const loadPromise = this.waitForLoadEvent(timeoutMs);
    await this.conn.send('Page.reload', { ignoreCache: false }, this.sessionId);
    await loadPromise;
    await this.waitForFunction('document.readyState === "complete"', Math.min(timeoutMs, 10000));
    await this.evaluate<void>(
      'new Promise(r => requestAnimationFrame(() => requestAnimationFrame(() => r())))'
    );
    if (settleMs > 0) {
      await new Promise((r) => setTimeout(r, settleMs));
    }
  }

  async evaluate<T>(fnOrExpr: string): Promise<T> {
    const trimmed = fnOrExpr.trim();
    const isUninvokedFunction =
      trimmed.startsWith('function') ||
      trimmed.startsWith('async function');
    const expression = isUninvokedFunction ? `(${trimmed})()` : trimmed;

    const res = await this.conn.send(
      'Runtime.evaluate',
      {
        expression,
        awaitPromise: true,
        returnByValue: true,
      },
      this.sessionId
    );

    const exceptionDetails = res.exceptionDetails as Record<string, unknown> | undefined;
    if (exceptionDetails) {
      const exc = exceptionDetails.exception as Record<string, unknown> | undefined;
      const msg = String(exc?.description || exceptionDetails.text || 'Evaluation failed');
      throw new Error(`Page evaluation error: ${msg}`);
    }

    const resultObj = res.result as Record<string, unknown> | undefined;
    return resultObj?.value as T;
  }

  async waitForSelector(selector: string, timeoutMs: number = 10000): Promise<void> {
    const deadline = Date.now() + timeoutMs;
    const escaped = JSON.stringify(selector);
    while (Date.now() < deadline) {
      const found = await this.evaluate<boolean>(`Boolean(document.querySelector(${escaped}))`);
      if (found) return;
      await new Promise((r) => setTimeout(r, 80));
    }
    throw new Error(`Timed out waiting for selector: ${selector}`);
  }

  async waitForFunction(expr: string, timeoutMs: number = 10000): Promise<void> {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      try {
        const ok = await this.evaluate<boolean>(`Boolean(${expr})`);
        if (ok) return;
      } catch {
        // Retry until timeout
      }
      await new Promise((r) => setTimeout(r, 80));
    }
    throw new Error(`Timed out waiting for condition: ${expr}`);
  }

  async click(selector: string): Promise<void> {
    const escaped = JSON.stringify(selector);
    const result = await this.evaluate<{ ok: boolean; reason?: string }>(`(() => {
      const el = document.querySelector(${escaped});
      if (!el) return { ok: false, reason: 'Element not found: ' + ${escaped} };
      if (el instanceof HTMLButtonElement && el.disabled) {
        return { ok: false, reason: 'Button is disabled: ' + ${escaped} };
      }
      el.scrollIntoView({ block: 'center', inline: 'center' });
      if (typeof el.click === 'function') {
        el.click();
      } else {
        el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      }
      return { ok: true };
    })()`);

    if (!result.ok) {
      throw new Error(result.reason ?? `Click failed for ${selector}`);
    }
    await new Promise((r) => setTimeout(r, 80));
  }

  async clickByText(selector: string, textIncludes: string): Promise<void> {
    const selJson = JSON.stringify(selector);
    const textJson = JSON.stringify(textIncludes);
    const result = await this.evaluate<{ ok: boolean; reason?: string }>(`(() => {
      const nodes = Array.from(document.querySelectorAll(${selJson}));
      const target = nodes.find((el) => {
        const txt = (el.innerText || el.textContent || '').trim();
        const rect = el.getBoundingClientRect();
        return txt.includes(${textJson}) && rect.width > 0 && rect.height > 0;
      }) || nodes.find((el) => (el.innerText || el.textContent || '').includes(${textJson}));
      if (!target) {
        return { ok: false, reason: 'No element matching ' + ${selJson} + ' with text ' + ${textJson} };
      }
      if (target instanceof HTMLButtonElement && target.disabled) {
        return { ok: false, reason: 'Matched button is disabled: ' + ${textJson} };
      }
      target.scrollIntoView({ block: 'center', inline: 'center' });
      if (typeof target.click === 'function') {
        target.click();
      } else {
        target.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      }
      return { ok: true };
    })()`);

    if (!result.ok) {
      throw new Error(result.reason ?? `clickByText failed for ${selector} ("${textIncludes}")`);
    }
    await new Promise((r) => setTimeout(r, 80));
  }

  async fill(selector: string, value: string): Promise<void> {
    const selJson = JSON.stringify(selector);
    const valJson = JSON.stringify(value);
    const result = await this.evaluate<{ ok: boolean; reason?: string }>(`(() => {
      const el = document.querySelector(${selJson});
      if (!el) return { ok: false, reason: 'Input not found: ' + ${selJson} };
      el.scrollIntoView({ block: 'center', inline: 'center' });
      el.focus();
      const proto = el instanceof HTMLTextAreaElement
        ? HTMLTextAreaElement.prototype
        : HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(proto, 'value');
      if (descriptor && descriptor.set) {
        descriptor.set.call(el, ${valJson});
      } else {
        el.value = ${valJson};
      }
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      return { ok: true };
    })()`);

    if (!result.ok) {
      throw new Error(result.reason ?? `fill failed for ${selector}`);
    }
    await new Promise((r) => setTimeout(r, 60));
  }

  async selectOption(selector: string, value: string): Promise<void> {
    const selJson = JSON.stringify(selector);
    const valJson = JSON.stringify(value);
    const result = await this.evaluate<{ ok: boolean; reason?: string }>(`(() => {
      const el = document.querySelector(${selJson});
      if (!el || !(el instanceof HTMLSelectElement)) {
        return { ok: false, reason: 'Select element not found: ' + ${selJson} };
      }
      const hasOption = Array.from(el.options).some((opt) => opt.value === ${valJson});
      if (!hasOption) {
        return { ok: false, reason: 'Option value ' + ${valJson} + ' not found in ' + ${selJson} };
      }
      const descriptor = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
      if (descriptor && descriptor.set) {
        descriptor.set.call(el, ${valJson});
      } else {
        el.value = ${valJson};
      }
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      return { ok: true };
    })()`);

    if (!result.ok) {
      throw new Error(result.reason ?? `selectOption failed for ${selector}`);
    }
    await new Promise((r) => setTimeout(r, 60));
  }

  async setRangeValue(selector: string, value: number | string): Promise<void> {
    const selJson = JSON.stringify(selector);
    const valJson = JSON.stringify(String(value));
    const result = await this.evaluate<{ ok: boolean; reason?: string }>(`(() => {
      const el = document.querySelector(${selJson});
      if (!el || !(el instanceof HTMLInputElement)) {
        return { ok: false, reason: 'Range input not found: ' + ${selJson} };
      }
      const descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
      if (descriptor && descriptor.set) {
        descriptor.set.call(el, ${valJson});
      } else {
        el.value = ${valJson};
      }
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      return { ok: true };
    })()`);

    if (!result.ok) {
      throw new Error(result.reason ?? `setRangeValue failed for ${selector}`);
    }
    await new Promise((r) => setTimeout(r, 60));
  }

  async pressKey(keyCombo: string): Promise<void> {
    const spec = getKeySpec(keyCombo);
    await this.conn.send(
      'Input.dispatchKeyEvent',
      {
        type: 'rawKeyDown',
        key: spec.key,
        code: spec.code,
        modifiers: spec.modifiers,
        windowsVirtualKeyCode: spec.keyCode,
        nativeVirtualKeyCode: spec.keyCode,
      },
      this.sessionId
    );
    if (spec.text) {
      await this.conn.send(
        'Input.dispatchKeyEvent',
        {
          type: 'char',
          key: spec.key,
          code: spec.code,
          modifiers: spec.modifiers,
          text: spec.text,
          unmodifiedText: spec.text,
        },
        this.sessionId
      );
    }
    await this.conn.send(
      'Input.dispatchKeyEvent',
      {
        type: 'keyUp',
        key: spec.key,
        code: spec.code,
        modifiers: spec.modifiers,
        windowsVirtualKeyCode: spec.keyCode,
        nativeVirtualKeyCode: spec.keyCode,
      },
      this.sessionId
    );
    await new Promise((r) => setTimeout(r, 80));
  }

  async textContent(selector?: string): Promise<string> {
    if (!selector) {
      return (await this.evaluate<string>('document.body ? document.body.textContent || "" : ""')) ?? '';
    }
    const selJson = JSON.stringify(selector);
    return (
      (await this.evaluate<string>(
        `(() => { const el = document.querySelector(${selJson}); return el ? (el.textContent || '') : ''; })()`
      )) ?? ''
    );
  }

  async innerText(selector?: string): Promise<string> {
    if (!selector) {
      return (await this.evaluate<string>('document.body ? document.body.innerText || "" : ""')) ?? '';
    }
    const selJson = JSON.stringify(selector);
    return (
      (await this.evaluate<string>(
        `(() => { const el = document.querySelector(${selJson}); return el ? (el.innerText || el.textContent || '') : ''; })()`
      )) ?? ''
    );
  }

  async getRect(selector: string): Promise<BrowserRect | null> {
    const selJson = JSON.stringify(selector);
    return await this.evaluate<BrowserRect | null>(`(() => {
      const el = document.querySelector(${selJson});
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { top: r.top, left: r.left, right: r.right, bottom: r.bottom, width: r.width, height: r.height };
    })()`);
  }

  async count(selector: string): Promise<number> {
    const selJson = JSON.stringify(selector);
    return (await this.evaluate<number>(`document.querySelectorAll(${selJson}).length`)) ?? 0;
  }

  async getAttribute(selector: string, attr: string): Promise<string | null> {
    const selJson = JSON.stringify(selector);
    const attrJson = JSON.stringify(attr);
    return await this.evaluate<string | null>(
      `(() => { const el = document.querySelector(${selJson}); return el ? el.getAttribute(${attrJson}) : null; })()`
    );
  }

  async isDisabled(selector: string): Promise<boolean> {
    const selJson = JSON.stringify(selector);
    return await this.evaluate<boolean>(
      `(() => { const el = document.querySelector(${selJson}); return el ? Boolean(el.disabled) : false; })()`
    );
  }

  async getLocalStorage(key: string): Promise<string | null> {
    const keyJson = JSON.stringify(key);
    return await this.evaluate<string | null>(`window.localStorage.getItem(${keyJson})`);
  }

  async setLocalStorage(key: string, value: string): Promise<void> {
    const keyJson = JSON.stringify(key);
    const valJson = JSON.stringify(value);
    await this.evaluate<void>(`window.localStorage.setItem(${keyJson}, ${valJson})`);
  }

  async clearStorage(): Promise<void> {
    await this.evaluate<void>(
      'try { window.localStorage.clear(); window.sessionStorage.clear(); } catch (_) {}'
    );
  }

  async currentUrl(): Promise<string> {
    return await this.evaluate<string>('window.location.href');
  }

  async getCapturedClipboard(): Promise<string[]> {
    return (await this.evaluate<string[]>('Array.from(window.__e2eClipboardWrites || [])')) ?? [];
  }

  async getCapturedWindowOpens(): Promise<CapturedWindowOpen[]> {
    return (await this.evaluate<CapturedWindowOpen[]>('Array.from(window.__e2eOpenCalls || [])')) ?? [];
  }

  async getCapturedDownloads(): Promise<CapturedDownload[]> {
    return (await this.evaluate<CapturedDownload[]>('Array.from(window.__e2eDownloads || [])')) ?? [];
  }

  getConsoleErrors(): string[] {
    return this.consoleErrors.slice();
  }

  getPageErrors(): string[] {
    return this.pageErrors.slice();
  }

  clearErrors(): void {
    this.consoleErrors = [];
    this.pageErrors = [];
  }

  async close(): Promise<void> {
    if (this.closed) return;
    this.closed = true;
    this.detachListener();
    try {
      await this.conn.send('Target.closeTarget', { targetId: this.targetId });
    } catch {
      // ignore
    }
    if (this.browserContextId) {
      try {
        await this.conn.send('Target.disposeBrowserContext', {
          browserContextId: this.browserContextId,
        });
      } catch {
        // ignore
      }
    }
  }
}

async function waitForDevToolsWsUrl(proc: ChildProcess, logs: string[], timeoutMs: number): Promise<string> {
  return new Promise((resolve, reject) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        reject(new Error(`Timed out waiting for Chromium DevTools WebSocket URL.\nLogs:\n${logs.join('')}`));
      }
    }, timeoutMs);

    const checkChunk = (chunk: Buffer) => {
      const text = chunk.toString('utf8');
      logs.push(text);
      if (logs.length > 50) logs.shift();
      const match = /DevTools listening on (ws:\/\/[^\s]+)/.exec(text);
      if (match && !settled) {
        settled = true;
        clearTimeout(timer);
        resolve(match[1]);
      }
    };

    proc.stderr?.on('data', checkChunk);
    proc.stdout?.on('data', checkChunk);
    proc.once('exit', (code) => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        reject(new Error(`Browser exited early with code ${String(code)}.\nLogs:\n${logs.join('')}`));
      }
    });
  });
}

async function openWebSocket(wsUrl: string): Promise<WebSocket> {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    const timer = setTimeout(() => {
      try {
        ws.close();
      } catch {
        // ignore
      }
      reject(new Error(`Timed out connecting to DevTools WebSocket: ${wsUrl}`));
    }, 10000);

    ws.onopen = () => {
      clearTimeout(timer);
      resolve(ws);
    };
    ws.onerror = () => {
      clearTimeout(timer);
      reject(new Error(`Failed to connect to DevTools WebSocket: ${wsUrl}`));
    };
  });
}

async function removeDirWithRetries(dirPath: string): Promise<void> {
  for (let attempt = 0; attempt < 6; attempt++) {
    try {
      if (fs.existsSync(dirPath)) {
        fs.rmSync(dirPath, { recursive: true, force: true });
      }
      if (!fs.existsSync(dirPath)) return;
    } catch {
      await new Promise((r) => setTimeout(r, 120));
    }
  }
}

export async function launchBrowser(options?: { browserPath?: string }): Promise<BrowserManager> {
  const executablePath = findBrowserBinary(options?.browserPath);
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-life-hub-e2e-'));
  const isHeadlessShell = executablePath.toLowerCase().includes('headless-shell');

  const args = [
    isHeadlessShell ? '--headless' : '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--remote-debugging-port=0',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-background-networking',
    '--disable-sync',
    `--user-data-dir=${userDataDir}`,
    'about:blank',
  ];

  const logs: string[] = [];
  const proc = spawn(executablePath, args, {
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true,
  });

  const pid = proc.pid ?? 0;
  let conn: CdpConnection | null = null;
  let closed = false;

  const cleanupProcess = async () => {
    if (closed) return;
    closed = true;
    if (conn) {
      try {
        await Promise.race([
          conn.send('Browser.close'),
          new Promise((r) => setTimeout(r, 1000)),
        ]);
      } catch {
        // ignore
      }
      conn.close();
    }
    await killProcessTree(pid);
    await removeDirWithRetries(userDataDir);
  };

  try {
    const wsUrl = await waitForDevToolsWsUrl(proc, logs, 15000);
    const ws = await openWebSocket(wsUrl);
    conn = new CdpConnection(ws);
  } catch (err) {
    await cleanupProcess();
    throw err;
  }

  return {
    executablePath,
    userDataDir,
    newPage: async (pageOpts?: { width?: number; height?: number }): Promise<PageSession> => {
      if (!conn || closed) {
        throw new Error('Browser is closed');
      }
      const width = pageOpts?.width ?? 1280;
      const height = pageOpts?.height ?? 800;

      let browserContextId: string | undefined;
      try {
        const ctxRes = await conn.send('Target.createBrowserContext', {
          disposeOnDetach: true,
        });
        browserContextId = typeof ctxRes.browserContextId === 'string' ? ctxRes.browserContextId : undefined;
      } catch {
        browserContextId = undefined;
      }

      const targetParams: Record<string, unknown> = { url: 'about:blank' };
      if (browserContextId) targetParams.browserContextId = browserContextId;

      const targetRes = await conn.send('Target.createTarget', targetParams);
      const targetId = String(targetRes.targetId ?? '');
      if (!targetId) {
        throw new Error('CDP Target.createTarget did not return targetId');
      }

      const attachRes = await conn.send('Target.attachToTarget', {
        targetId,
        flatten: true,
      });
      const sessionId = String(attachRes.sessionId ?? '');
      if (!sessionId) {
        throw new Error('CDP Target.attachToTarget did not return sessionId');
      }

      const session = new CdpPageSession(conn, sessionId, targetId, browserContextId);
      await session.init(width, height);
      return session;
    },
    close: cleanupProcess,
  };
}
