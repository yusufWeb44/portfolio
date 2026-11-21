import { Response } from 'express';

/**
 * Neutralizes HTML angle brackets and executable URI schemes to prevent Stored XSS.
 */
export const sanitizeText = (input: string): string => {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/data\s*:\s*text\/html/gi, '')
    .trim();
};

/**
 * Sanitizes an optional text field while distinguishing undefined (not provided)
 * from null/empty string (explicitly cleared).
 */
export const sanitizeOptionalText = (input: unknown): string | null | undefined => {
  if (input === undefined) return undefined;
  if (input === null) return null;
  const cleaned = sanitizeText(String(input));
  return cleaned.length > 0 ? cleaned : null;
};

/**
 * Validates and sanitizes a URL field, permitting safe web, relative, mailto, and tel URIs.
 * Blocks javascript:, vbscript:, and unsafe data: schemes.
 */
export const sanitizeUrl = (input: unknown): string | null | undefined => {
  if (input === undefined) return undefined;
  if (input === null) return null;
  const trimmed = String(input).trim();
  if (!trimmed) return null;

  const normalized = trimmed.toLowerCase().replace(/\s+/g, '');
  if (
    normalized.startsWith('javascript:') ||
    normalized.startsWith('vbscript:') ||
    (normalized.startsWith('data:') && !normalized.startsWith('data:image/'))
  ) {
    return null;
  }

  return trimmed;
};

interface PrismaKnownError {
  code?: string;
  meta?: Record<string, unknown>;
}

/**
 * Sends a consistent JSON error structure without leaking stack traces or
 * internal database details in production.
 */
export const sendSafeError = (
  res: Response,
  status: number,
  publicMessage: string,
  error?: unknown,
  validationErrors?: unknown
): Response => {
  if (error) {
    console.error(`[API Error ${status}] ${publicMessage}:`, error);
  }

  const payload: { success: false; message: string; errors?: unknown } = {
    success: false,
    message: publicMessage,
  };

  if (validationErrors !== undefined) {
    payload.errors = validationErrors;
  }

  return res.status(status).json(payload);
};

/**
 * Maps common Prisma error codes (e.g. P2025 Not Found, P2002 Duplicate)
 * into clean client-safe HTTP status codes without leaking schema internals.
 */
export const handlePrismaError = (
  res: Response,
  error: unknown,
  fallbackMessage: string
): Response => {
  const prismaErr = error as PrismaKnownError | undefined;
  if (prismaErr?.code === 'P2025') {
    return sendSafeError(res, 404, 'Requested resource was not found');
  }
  if (prismaErr?.code === 'P2002') {
    return sendSafeError(res, 409, 'A record with this unique value already exists');
  }
  if (prismaErr?.code === 'P2003') {
    return sendSafeError(res, 400, 'Invalid reference to a related record');
  }
  return sendSafeError(res, 500, fallbackMessage, error);
};
