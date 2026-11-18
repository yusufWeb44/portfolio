import crypto from 'crypto';

interface OtpEntry {
  code: string;
  expiresAt: number;
  attempts: number;
  phone: string;
}

// In-memory thread-safe OTP store
const otpStore = new Map<string, OtpEntry>();

// Cooldown tracker: adminId -> timestamp
const cooldownStore = new Map<string, number>();

const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes
const COOLDOWN_MS = 60 * 1000;     // 60 seconds between resends
const MAX_ATTEMPTS = 5;

/**
 * Generates and stores a cryptographically secure 6-digit OTP.
 */
export const issueOtp = (adminId: string, phone: string): { code: string; cooldownRemaining?: number } => {
  const now = Date.now();
  const lastRequest = cooldownStore.get(adminId) || 0;

  if (now - lastRequest < COOLDOWN_MS) {
    const remaining = Math.ceil((COOLDOWN_MS - (now - lastRequest)) / 1000);
    return { code: '', cooldownRemaining: remaining };
  }

  // Generate 6-digit number between 100000 and 999999
  const code = crypto.randomInt(100000, 999999).toString();
  const expiresAt = now + OTP_TTL_MS;

  otpStore.set(adminId, {
    code,
    expiresAt,
    attempts: 0,
    phone,
  });

  cooldownStore.set(adminId, now);

  return { code };
};

/**
 * Validates an input OTP code against the active store.
 * Burns OTP on success or maximum failed attempts.
 */
export const validateOtp = (adminId: string, inputCode: string): { valid: boolean; error?: string } => {
  const entry = otpStore.get(adminId);

  if (!entry) {
    return { valid: false, error: 'No verification code requested, or the code has expired. Please request a new code.' };
  }

  if (Date.now() > entry.expiresAt) {
    otpStore.delete(adminId);
    return { valid: false, error: 'Verification code has expired. Please request a new code.' };
  }

  if (entry.attempts >= MAX_ATTEMPTS) {
    otpStore.delete(adminId);
    return { valid: false, error: 'Maximum verification attempts exceeded. Code invalidated for security. Please request a new code.' };
  }

  if (entry.code !== inputCode.trim()) {
    entry.attempts += 1;
    const remaining = MAX_ATTEMPTS - entry.attempts;
    return {
      valid: false,
      error: `Invalid verification code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`,
    };
  }

  // Validated successfully -> burn immediately
  otpStore.delete(adminId);
  return { valid: true };
};

/**
 * Gets remaining cooldown in seconds (if any)
 */
export const getCooldownRemaining = (adminId: string): number => {
  const now = Date.now();
  const lastRequest = cooldownStore.get(adminId) || 0;
  if (now - lastRequest < COOLDOWN_MS) {
    return Math.ceil((COOLDOWN_MS - (now - lastRequest)) / 1000);
  }
  return 0;
};
