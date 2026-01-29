export function getNowMs(req?: Request): number {
  if (process.env.TEST_MODE === "1" && req) {
    const header = req.headers.get("x-test-now-ms");
    if (header) {
      const parsed = Number(header);
      if (!Number.isNaN(parsed)) return parsed;
    }
  }
  return Date.now();
}

export function computeExpiry(ttlMinutes: number, nowMs: number): Date {
  return new Date(nowMs + ttlMinutes * 60 * 1000);
}
