import fs from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import type { D1Database, D1PreparedStatement } from '../types/env.js';

/**
 * Native Node 22 SQLite adapter providing full D1Database interface parity
 * for zero-dependency local development and testing.
 */
export function createNodeSqliteD1(dbPath: string): D1Database | undefined {
  if (!fs.existsSync(dbPath)) {
    return undefined;
  }

  const db = new DatabaseSync(dbPath);

  return {
    prepare(query: string): D1PreparedStatement {
      const stmt = db.prepare(query);
      let boundValues: unknown[] = [];

      const prepared: D1PreparedStatement = {
        bind(...values: unknown[]) {
          boundValues = values;
          return prepared;
        },
        async first<T = unknown>(colName?: string): Promise<T | null> {
          const row = stmt.get(...(boundValues as any)) as Record<string, any> | undefined;
          if (!row) return null;
          if (colName) return (row[colName] as T) ?? null;
          return row as unknown as T;
        },
        async all<T = unknown>(): Promise<{ results: T[]; success: boolean }> {
          const results = stmt.all(...(boundValues as any)) as T[];
          return { results, success: true };
        },
        async run(): Promise<{ success: boolean; meta?: unknown }> {
          const meta = stmt.run(...(boundValues as any));
          return { success: true, meta };
        },
      };

      return prepared;
    },
    async batch<T = unknown>(statements: D1PreparedStatement[]): Promise<T[]> {
      const results: T[] = [];
      for (const statement of statements) {
        results.push((await statement.all()) as unknown as T);
      }
      return results;
    },
    async exec(query: string): Promise<unknown> {
      return db.exec(query);
    },
  };
}
