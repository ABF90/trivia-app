/** Local calendar date as YYYY-MM-DD. */
export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function fromDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y!, (m ?? 1) - 1, d ?? 1);
}

export function addDays(key: string, days: number): string {
  const date = fromDateKey(key);
  date.setDate(date.getDate() + days);
  return toDateKey(date);
}

export function daysBetween(fromKey: string, toKey: string): number {
  const ms = fromDateKey(toKey).getTime() - fromDateKey(fromKey).getTime();
  return Math.round(ms / 86_400_000);
}

/** Milliseconds until the next local midnight. */
export function msUntilMidnight(now: Date): number {
  const next = new Date(now);
  next.setHours(24, 0, 0, 0);
  return next.getTime() - now.getTime();
}

export function formatDuration(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const parts = [Math.floor(total / 3600), Math.floor((total % 3600) / 60), total % 60];
  return parts.map((n) => String(n).padStart(2, "0")).join(":");
}

const WEEKDAYS = ["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];

/** The Saturday→Friday week containing `key`, as date keys. */
export function weekOf(key: string): { key: string; label: string }[] {
  const date = fromDateKey(key);
  const sinceSaturday = (date.getDay() + 1) % 7;
  const start = addDays(key, -sinceSaturday);
  return Array.from({ length: 7 }, (_, i) => {
    const dayKey = addDays(start, i);
    return { key: dayKey, label: WEEKDAYS[fromDateKey(dayKey).getDay()]! };
  });
}
