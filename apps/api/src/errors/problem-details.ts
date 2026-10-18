import type { Context } from 'hono';
import { ProblemDetails } from '@openbarrio/core';

export class ProblemDetailsException extends Error {
  public readonly status: number;
  public readonly type: string;
  public readonly title: string;
  public readonly detail: string;
  public readonly instance?: string;
  public readonly invalidParams?: Array<{ name: string; reason: string }>;

  constructor(options: {
    status: number;
    type: string;
    title: string;
    detail: string;
    instance?: string;
    invalidParams?: Array<{ name: string; reason: string }>;
  }) {
    super(options.detail);
    this.name = 'ProblemDetailsException';
    this.status = options.status;
    this.type = options.type;
    this.title = options.title;
    this.detail = options.detail;
    this.instance = options.instance;
    this.invalidParams = options.invalidParams;
  }

  toJSON(): ProblemDetails {
    const payload: ProblemDetails = {
      type: this.type,
      title: this.title,
      status: this.status,
      detail: this.detail,
    };
    if (this.instance) {
      payload.instance = this.instance;
    }
    if (this.invalidParams && this.invalidParams.length > 0) {
      payload.invalidParams = this.invalidParams;
    }
    return payload;
  }
}

export class CadastralNotFoundError extends ProblemDetailsException {
  constructor(refcatOrCoordinates: string, instance?: string) {
    super({
      status: 404,
      type: 'https://openbarrio.org/errors/cadastral-not-found',
      title: 'Cadastral Property Not Found',
      detail: `No cadastral property matches identifier or location '${refcatOrCoordinates}'`,
      instance,
    });
  }
}

export class CensusTractNotFoundError extends ProblemDetailsException {
  constructor(censusSectionCode: string, instance?: string) {
    super({
      status: 404,
      type: 'https://openbarrio.org/errors/census-tract-not-found',
      title: 'Census Tract Not Found',
      detail: `No census tract income data found for section code '${censusSectionCode}'`,
      instance,
    });
  }
}

export class InvalidParametersError extends ProblemDetailsException {
  constructor(
    detail: string,
    invalidParams?: Array<{ name: string; reason: string }>,
    instance?: string
  ) {
    super({
      status: 400,
      type: 'https://openbarrio.org/errors/invalid-parameters',
      title: 'Invalid Request Parameters',
      detail,
      invalidParams,
      instance,
    });
  }
}

export class UpstreamProviderError extends ProblemDetailsException {
  constructor(providerName: string, detail: string, instance?: string) {
    super({
      status: 502,
      type: 'https://openbarrio.org/errors/upstream-provider-failure',
      title: 'Upstream Open Data Provider Failure',
      detail: `Failed communicating with ${providerName}: ${detail}`,
      instance,
    });
  }
}

export class RateLimitExceededError extends ProblemDetailsException {
  constructor(retryAfterSeconds: number, instance?: string) {
    super({
      status: 429,
      type: 'https://openbarrio.org/errors/rate-limit-exceeded',
      title: 'Rate Limit Exceeded',
      detail: `Rate limit exceeded. Please wait ${retryAfterSeconds} second${retryAfterSeconds === 1 ? '' : 's'} before retrying.`,
      instance,
    });
  }
}

/**
 * Hono error handler transforming exceptions and validation failures into RFC 7807 payloads.
 */
export function problemDetailsErrorHandler(error: Error, c: Context): Response {
  let instance: string;
  try {
    const url = new URL(c.req.url);
    instance = url.pathname + url.search;
  } catch {
    instance = c.req.path;
  }

  if (error instanceof ProblemDetailsException) {
    const body = error.toJSON();
    if (!body.instance) {
      body.instance = instance;
    }
    return c.json(body, error.status as any, {
      'content-type': 'application/problem+json',
    });
  }

  // Fallback 500 error
  console.error('Unhandled internal server error:', error);
  const internalProblem: ProblemDetails = {
    type: 'https://openbarrio.org/errors/internal-server-error',
    title: 'Internal Server Error',
    status: 500,
    detail: 'An unexpected internal error occurred while processing the due diligence request',
    instance,
  };

  return c.json(internalProblem, 500, {
    'content-type': 'application/problem+json',
  });
}
