import { createHash, timingSafeEqual } from 'node:crypto';

export function validInvite(code: unknown, expectedHash: string | undefined, deadline: string | undefined, now = Date.now()) {
  if (typeof code !== 'string' || code.length > 200 || !expectedHash || !/^[a-f0-9]{64}$/.test(expectedHash)) return false;
  if (!deadline || !(Date.parse(deadline) > now)) return false;
  return timingSafeEqual(createHash('sha256').update(code.trim()).digest(), Buffer.from(expectedHash, 'hex'));
}
