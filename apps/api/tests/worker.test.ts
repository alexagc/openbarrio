import { describe, it, expect, vi } from 'vitest';
import worker from '../src/worker.js';

describe('Cloudflare Worker Scheduled Cron & HTTP Handler', () => {
  it('serves HTTP requests through fetch handler', async () => {
    const req = new Request('http://localhost:3001/health');
    const res = await worker.fetch(req, {} as any, {} as any);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe('ok');
    expect(data.service).toBe('openbarrio-api');
  });

  it('triggers CadastralCache.pruneExpired via ctx.waitUntil on cron trigger', async () => {
    let executedDeleteSql = '';
    const mockDb: any = {
      prepare: vi.fn((sql: string) => {
        if (sql.includes('DELETE FROM cadastral_cache')) {
          executedDeleteSql = sql;
        }
        return {
          bind: vi.fn(() => ({
            run: vi.fn(async () => ({ success: true, meta: { changes: 5 } })),
          })),
        };
      }),
    };

    const waitUntilPromises: Promise<unknown>[] = [];
    const mockCtx: any = {
      waitUntil: vi.fn((promise: Promise<unknown>) => {
        waitUntilPromises.push(promise);
      }),
    };

    const mockController: any = {
      scheduledTime: Date.now(),
      cron: '0 3 1 * *',
      noRetry: vi.fn(),
    };

    await worker.scheduled(mockController, { DB: mockDb }, mockCtx);

    expect(mockCtx.waitUntil).toHaveBeenCalledTimes(1);
    await Promise.all(waitUntilPromises);

    expect(executedDeleteSql).toContain('DELETE FROM cadastral_cache');
    expect(executedDeleteSql).toContain('expires_at <= ?');
  });

  it('handles gracefully when DB binding is absent', async () => {
    const mockCtx: any = {
      waitUntil: vi.fn(),
    };
    const mockController: any = {
      scheduledTime: Date.now(),
      cron: '0 3 1 * *',
      noRetry: vi.fn(),
    };

    await worker.scheduled(mockController, {}, mockCtx);
    expect(mockCtx.waitUntil).not.toHaveBeenCalled();
  });
});
