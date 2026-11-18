import { ChildProcess, execFile, spawn } from 'node:child_process';
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';

export interface RunningServer {
  baseUrl: string;
  port: number;
  pid: number;
  stop: () => Promise<void>;
}

export function findFreePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.unref();
    srv.on('error', (err) => reject(err));
    srv.listen(0, '127.0.0.1', () => {
      const addr = srv.address();
      if (!addr || typeof addr === 'string') {
        srv.close(() => reject(new Error('Failed to obtain an ephemeral TCP port')));
        return;
      }
      const port = addr.port;
      srv.close((closeErr) => {
        if (closeErr) reject(closeErr);
        else resolve(port);
      });
    });
  });
}

export function checkBuildReady(rootDir: string = process.cwd()): string {
  const buildIdPath = path.join(rootDir, '.next', 'BUILD_ID');
  if (!fs.existsSync(buildIdPath)) {
    throw new Error(
      `Missing .next/BUILD_ID at "${buildIdPath}". Build the project first (npm run build) or pass --base-url=<url>. The E2E runner never runs next build automatically.`
    );
  }
  const buildId = fs.readFileSync(buildIdPath, 'utf8').trim();
  if (!buildId) {
    throw new Error(`Empty .next/BUILD_ID at "${buildIdPath}". Rebuild the project before running E2E tests.`);
  }
  return buildId;
}

export function killProcessTree(pid: number): Promise<void> {
  return new Promise((resolve) => {
    if (!pid || pid <= 0) {
      resolve();
      return;
    }

    if (process.platform === 'win32') {
      execFile('taskkill', ['/PID', String(pid), '/T', '/F'], { windowsHide: true }, () => {
        resolve();
      });
      return;
    }

    try {
      process.kill(pid, 'SIGTERM');
    } catch {
      resolve();
      return;
    }

    setTimeout(() => {
      try {
        process.kill(pid, 'SIGKILL');
      } catch {
        // Already exited
      }
      resolve();
    }, 800);
  });
}

async function waitForHttpReady(baseUrl: string, proc: ChildProcess, logs: string[], timeoutMs: number): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  let exitedEarly = false;
  let exitCode: number | null = null;

  const onExit = (code: number | null) => {
    exitedEarly = true;
    exitCode = code;
  };
  proc.once('exit', onExit);

  try {
    while (Date.now() < deadline) {
      if (exitedEarly) {
        throw new Error(
          `Next.js server exited prematurely with code ${String(exitCode)}.\nLogs:\n${logs.join('')}`
        );
      }
      try {
        const res = await fetch(`${baseUrl}/`, { redirect: 'manual' });
        if (res.status >= 200 && res.status < 500) {
          return;
        }
      } catch {
        // Server not accepting connections yet
      }
      await new Promise((r) => setTimeout(r, 250));
    }
    throw new Error(
      `Timed out waiting ${timeoutMs}ms for Next.js server at ${baseUrl}.\nLogs:\n${logs.join('')}`
    );
  } finally {
    proc.removeListener('exit', onExit);
  }
}

export async function startNextServer(options?: {
  rootDir?: string;
  port?: number;
  timeoutMs?: number;
}): Promise<RunningServer> {
  const rootDir = options?.rootDir ?? process.cwd();
  checkBuildReady(rootDir);

  const nextBin = path.join(rootDir, 'node_modules', 'next', 'dist', 'bin', 'next');
  if (!fs.existsSync(nextBin)) {
    throw new Error(`Next.js binary not found at "${nextBin}". Ensure dependencies are installed.`);
  }

  const port = options?.port ?? (await findFreePort());
  const timeoutMs = options?.timeoutMs ?? 30000;
  const baseUrl = `http://127.0.0.1:${port}`;

  const logs: string[] = [];
  const pushLog = (chunk: Buffer) => {
    logs.push(chunk.toString('utf8'));
    if (logs.length > 60) logs.shift();
  };

  const proc = spawn(process.execPath, [nextBin, 'start', '-p', String(port), '-H', '127.0.0.1'], {
    cwd: rootDir,
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true,
    env: {
      ...process.env,
      NODE_ENV: 'production',
    },
  });

  proc.stdout?.on('data', pushLog);
  proc.stderr?.on('data', pushLog);

  const pid = proc.pid ?? 0;
  let stopped = false;

  const stop = async () => {
    if (stopped) return;
    stopped = true;
    await killProcessTree(pid);
  };

  const sigHandler = () => {
    if (!stopped && pid > 0) {
      if (process.platform === 'win32') {
        try {
          execFile('taskkill', ['/PID', String(pid), '/T', '/F'], { windowsHide: true });
        } catch {
          // ignore
        }
      } else {
        try {
          process.kill(pid, 'SIGTERM');
        } catch {
          // ignore
        }
      }
    }
  };

  process.once('SIGINT', sigHandler);
  process.once('SIGTERM', sigHandler);

  try {
    await waitForHttpReady(baseUrl, proc, logs, timeoutMs);
  } catch (err) {
    await stop();
    throw err;
  }

  return {
    baseUrl,
    port,
    pid,
    stop: async () => {
      process.removeListener('SIGINT', sigHandler);
      process.removeListener('SIGTERM', sigHandler);
      await stop();
    },
  };
}
