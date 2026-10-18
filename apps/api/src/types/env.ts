/**
 * Cloudflare Workers Runtime Environment & Bindings.
 */

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  all<T = unknown>(): Promise<{ results: T[]; success: boolean }>;
  run(): Promise<{ success: boolean; meta?: unknown }>;
}

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<T[]>;
  exec(query: string): Promise<unknown>;
}

export interface R2ObjectBody {
  body: ReadableStream;
  arrayBuffer(): Promise<ArrayBuffer>;
  text(): Promise<string>;
  json<T = unknown>(): Promise<T>;
  blob(): Promise<Blob>;
  httpEtag?: string;
  size: number;
}

export interface R2Bucket {
  get(key: string): Promise<R2ObjectBody | null>;
  put(key: string, value: unknown, options?: unknown): Promise<unknown>;
  delete(key: string | string[]): Promise<void>;
}

export interface CloudflareEnv {
  DB?: D1Database;
  TILES_BUCKET?: R2Bucket;
  ENVIRONMENT?: string;
  ALLOWED_ORIGINS?: string;
}

export type AppBindings = CloudflareEnv;
