import { type OrganizerData } from './organizer';
import { grades, type Grade } from './progress';

export function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Please provide valid information.');
  return value as Record<string, unknown>;
}
export function text(value: unknown, max = 2000, required = false): string {
  if (typeof value !== 'string' || value.length > max || (required && !value.trim())) throw new Error(`Please enter ${required ? 'a value of ' : ''}up to ${max} characters.`);
  return value.trim();
}
export function date(value: unknown, optional = false): string {
  if (optional && value === '') return '';
  const s = text(value, 10, true);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s) || new Date(`${s}T12:00:00Z`).toISOString().slice(0, 10) !== s) throw new Error('Please choose a valid date.');
  return s;
}
export function number(value: unknown, max = 100000000): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > max) throw new Error('Please enter a valid positive number.');
  return value;
}
export function grade(value: unknown): Grade {
  if (!grades.includes(value as Grade)) throw new Error('Choose a grade from 8th through 12th.');
  return value as Grade;
}
const schema = {
  colleges: { strings: ['name', 'category', 'interest', 'applicationType', 'major', 'status', 'notes'], dates: ['deadline'], numbers: ['netPrice'], booleans: ['essays', 'recommendations', 'transcript', 'fafsa'] },
  accomplishments: { strings: ['title', 'category', 'impact', 'evidence'], dates: ['date'], numbers: [], booleans: [] },
  scholarships: { strings: ['name', 'status', 'url', 'requirements'], dates: ['deadline'], numbers: ['amount'], booleans: [] },
  aidOffers: { strings: ['college'], dates: [], numbers: ['grants', 'scholarships', 'loans', 'workStudy', 'totalCost'], booleans: [] },
  essays: { strings: ['college', 'prompt', 'draft', 'status'], dates: ['deadline'], numbers: ['wordLimit'], booleans: [] },
  collaborators: { strings: ['name', 'role', 'email'], dates: [], numbers: [], booleans: [] },
};
export function organizer(value: unknown): OrganizerData {
  const input = record(value);
  const result: Record<string, unknown> = {};
  for (const [key, fields] of Object.entries(schema)) {
    const items = input[key];
    if (!Array.isArray(items) || items.length > 500) throw new Error('Each organizer section supports up to 500 entries.');
    const ids = new Set<number>();
    result[key] = items.map(item => {
      const entry = record(item);
      const id = number(entry.id, Number.MAX_SAFE_INTEGER);
      if (!Number.isSafeInteger(id) || ids.has(id)) throw new Error('An organizer entry has a duplicate or invalid ID.');
      ids.add(id);
      const clean: Record<string, unknown> = { id };
      for (const field of fields.strings) clean[field] = text(entry[field] ?? '', field === 'draft' ? 50000 : 3000, ['name', 'title', 'college'].includes(field));
      for (const field of fields.dates) clean[field] = date(entry[field] ?? '', true);
      for (const field of fields.numbers) clean[field] = number(entry[field] ?? 0);
      for (const field of fields.booleans) { if (typeof entry[field] !== 'boolean') throw new Error('Invalid completion setting.'); clean[field] = entry[field]; }
      if (key === 'scholarships' && clean.url && !/^https?:\/\//i.test(String(clean.url))) throw new Error('Scholarship links must begin with https:// or http://.');
      if (key === 'colleges') clean.netPriceKnown = entry.netPriceKnown === true || Number(entry.netPrice) > 0;
      if (key === 'accomplishments') { clean.hours = number(entry.hours ?? 0, 100000); clean.shareWithFamily = entry.shareWithFamily === true; }
      return clean;
    });
  }
  return result as OrganizerData;
}
