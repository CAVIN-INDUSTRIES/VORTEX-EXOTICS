const pilotEmailCodes = new Map<string, { code: string; exp: number }>();

const TTL_MS = 15 * 60_000;

export function storePilotEmailCode(email: string, code: string): void {
  pilotEmailCodes.set(email.toLowerCase().trim(), { code, exp: Date.now() + TTL_MS });
}

/** Validates code and consumes the entry (one-time). */
export function verifyAndConsumePilotEmailCode(email: string, code: string): boolean {
  const key = email.toLowerCase().trim();
  const row = pilotEmailCodes.get(key);
  if (!row || row.exp < Date.now()) {
    pilotEmailCodes.delete(key);
    return false;
  }
  if (row.code !== code.trim()) return false;
  pilotEmailCodes.delete(key);
  return true;
}
