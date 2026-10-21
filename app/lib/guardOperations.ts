export function canManageGuardOps(role: unknown): boolean { return role === 'admin' || role === 'hr'; }
export function validDutyDate(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value + 'T00:00:00+05:30')) && new Date(value + 'T00:00:00Z').toISOString().slice(0, 10) === value;
}
export function dutyTimes(date: unknown, start: unknown, end: unknown) {
  if (!validDutyDate(date) || typeof start !== 'string' || typeof end !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(start) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(end)) throw new Error('Choose a valid duty date and start/end times.');
  const startsAt = new Date(`${date}T${start}:00+05:30`);
  let endsAt = new Date(`${date}T${end}:00+05:30`);
  if (endsAt <= startsAt) endsAt = new Date(endsAt.getTime() + 86400000);
  const hours = (endsAt.getTime() - startsAt.getTime()) / 3600000;
  if (hours > 18) throw new Error('A duty must be 18 hours or less. Choose different times.');
  return { date, start, end, startsAt, endsAt };
}
export function guardText(value: unknown, max: number, label: string, required = false): string {
  if (typeof value !== 'string' && value !== undefined) throw new Error(`Enter valid ${label}.`);
  const text = (value || '').trim();
  if ((required && !text) || text.length > max) throw new Error(`${label} ${required ? 'is required and ' : ''}must be ${max} characters or fewer.`);
  return text;
}
export const INCIDENT_STATUSES = ['Open', 'In review', 'Resolved'] as const;
export function validIncidentStatus(value: unknown): value is typeof INCIDENT_STATUSES[number] { return INCIDENT_STATUSES.includes(value as typeof INCIDENT_STATUSES[number]); }
export function validOpsOrigin(request: Request): boolean { return request.headers.get('origin') === new URL(process.env.IDENTITY_APP_ORIGIN || request.url).origin; }
export function phoneHref(phone: string): string | null { const digits = phone.replace(/[^+\d]/g, ''); return /^\+?\d{7,15}$/.test(digits) ? `tel:${digits}` : null; }
