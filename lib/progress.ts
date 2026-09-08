import { emptyOrganizer, type OrganizerData } from './organizer';

export const grades = ['8th', '9th', '10th', '11th', '12th'] as const;
export type Grade = typeof grades[number];
export type Step = { id: string; title: string; why: string; done: string; minutes: number; href?: string; due?: string; source: 'plan' | 'roadmap' | 'college'; completedAt?: string; reflection?: string };
export type ProgressState = {
  version: number; setupCompleted: boolean; timeZone: string; grade: Grade; interests: string; weeklyMinutes: number;
  completions: Record<string, { title: string; at: string; reflection: string }>;
  deferred: Record<string, string>;
  reviews: { at: string; grade: Grade; interests: string; weeklyMinutes: number; win: string; challenge: string }[];
  organizer: OrganizerData;
  activeWeeks: string[];
};
export type RoadmapRow = { id: string | number; month_key: string; tasks: { title?: string; description?: string; why_recommended?: string; evidence?: string; completed?: boolean; status?: string; outcome?: { recorded_at?: string; reflection?: string } }[] };
export type ProgressPayload = { ownerId: string; state: ProgressState; roadmap: RoadmapRow[]; profileExists: boolean; configured: boolean };
export function initialProgress(grade: string = '9th', interests = ''): ProgressState {
  return { version: 0, setupCompleted: false, timeZone: 'America/New_York', grade: grades.includes(grade as Grade) ? grade as Grade : '9th', interests, weeklyMinutes: 45, completions: {}, deferred: {}, reviews: [], organizer: structuredClone(emptyOrganizer), activeWeeks: [] };
}
// Date-only strings use local noon to avoid UTC shifting a student's due date.
export function dayKey(date = new Date()) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; }
export function dateInZone(date: Date, timeZone: string) { return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(date); }
export function weekKey(date = new Date()) { const d = new Date(date); d.setDate(d.getDate() - (d.getDay() + 6) % 7); return dayKey(d); }
export function plusDays(day: string, count: number) { const d = new Date(`${day}T12:00:00`); d.setDate(d.getDate() + count); return dayKey(d); }

const gradeSteps: Record<Grade, [string, string, string, number][]> = {
  '8th': [
    ['Explore two interests', 'Learning what you enjoy helps you choose activities that fit.', 'Write two interests and one activity you could try for each.', 15],
    ['Prepare for high-school courses', 'A little preparation makes the transition easier.', 'Save three questions about next year’s courses for your counselor.', 15],
    ['Choose one study habit', 'A manageable routine gives you room to explore.', 'Describe one habit and when you will try it this week.', 10],
  ],
  '9th': [
    ['Explore two school clubs', 'Trying activities helps you discover where you want to contribute.', 'Record two clubs and the next meeting or contact for each.', 15],
    ['Prepare three counselor questions', 'Course planning works best when you ask early.', 'Save three questions about courses, interests, or support.', 10],
    ['Plan one small contribution', 'Consistent participation is the foundation for future leadership.', 'Describe one useful thing you can do for a club or your community.', 15],
  ],
  '10th': [
    ['Plan a project you care about', 'A focused project lets you deepen an existing interest.', 'Write a small project goal, first action, and a realistic finish date.', 20],
    ['Explore one career path', 'Connecting interests to careers makes college research more useful.', 'Save one career, relevant skills, and a question to investigate.', 15],
    ['Review next year’s courses', 'You can balance challenge with the time you actually have.', 'List potential courses and one question for your counselor.', 15],
  ],
  '11th': [
    ['Research two colleges', 'A useful college list reflects fit and affordability.', 'Save two colleges with a reason each could fit.', 20],
    ['Make a testing decision', 'Testing requirements vary by college and can change.', 'Check official admissions pages and record your testing next step.', 15],
    ['Prepare a college-visit question list', 'Specific questions help you learn more than a campus tour alone.', 'Save three questions about academics, support, or costs.', 10],
  ],
  '12th': [
    ['Verify your next application deadline', 'Official deadlines keep your application plan grounded.', 'Check an official admissions page and save the date in your college list.', 10],
    ['Outline one essay story', 'Specific experiences help you write in your own voice.', 'Save a short outline: what happened, what you did, and what you learned.', 20],
    ['Prepare financial-aid questions', 'Understanding required forms helps your family plan.', 'Check a college’s official aid page and record required forms and dates.', 15],
  ],
};

export function allSteps(state: ProgressState, roadmap: RoadmapRow[], today: string): Step[] {
  const week = weekKey(new Date(`${today}T12:00:00`));
  const own: Step[] = gradeSteps[state.grade].map(([title, why, done, minutes], i) => ({ id: `grade:${state.grade}:${i}`, title, why, done, minutes, source: 'plan' }));
  own.push({ id: `journal:${week}`, title: 'Capture one thing you learned this week', why: 'Small experiences become a useful record over time.', done: 'Describe an activity, your contribution, and what you learned. You can also add it to your journal.', minutes: 5, href: '/progress#journal', source: 'plan' });
  own.push({ id: `reflect:${week}`, title: 'Choose your next small step', why: 'A short reflection keeps your plan realistic.', done: `Write one action${state.interests ? ` connected to ${state.interests}` : ''} you want to take next week.`, minutes: 5, source: 'plan' });
  // A postponed recurring step keeps its original identity after the week changes.
  const retainedIds = new Set([...Object.keys(state.deferred), ...Object.keys(state.completions)]);
  for (const id of retainedIds) {
    if (own.some(t => t.id === id) || !/^(journal|reflect):\d{4}-\d{2}-\d{2}$/.test(id)) continue;
    const template = own.find(t => t.id.startsWith(id.split(':')[0] + ':'));
    if (template) own.unshift({ ...template, id });
  }
  const activities: Step[] = roadmap.filter(r => r.month_key <= today.slice(0, 7)).flatMap(r => (Array.isArray(r.tasks) ? r.tasks : []).flatMap((t, i): Step[] => {
    if (!t.title || ['skipped', 'not_interested', 'blocked'].includes(t.status || '')) return [];
    // Undated historical completions stay completed; never invent a completion date.
    if (t.completed && !t.outcome?.recorded_at) return [];
    return [{ id: `roadmap:${r.id}:${i}`, title: t.title, why: t.why_recommended || 'This activity is part of your personalized roadmap.', done: t.evidence || t.description || 'Record the result in your roadmap.', minutes: 15, href: '/roadmap', source: 'roadmap', completedAt: t.completed ? t.outcome?.recorded_at : undefined, reflection: t.outcome?.reflection }];
  }));
  const colleges: Step[] = state.organizer.colleges.filter(c => c.deadline && !['Submitted', 'Accepted', 'Denied', 'Waitlisted'].includes(c.status)).map(c => ({ id: `college:${c.id}`, title: `Review ${c.name} application`, why: `Your saved deadline is ${c.deadline}. Verify it with the college.`, done: 'Review outstanding requirements in your organizer and record your next action.', minutes: 10, href: '/organizer', due: c.deadline, source: 'college' }));
  return [...colleges.sort((a, b) => a.due!.localeCompare(b.due!)), ...activities, ...own].map(t => ({ ...t, completedAt: t.source === 'roadmap' ? t.completedAt : state.completions[t.id]?.at, reflection: t.source === 'roadmap' ? t.reflection : state.completions[t.id]?.reflection }));
}

export function weeklySteps(state: ProgressState, roadmap: RoadmapRow[], today: string): Step[] {
  const week = weekKey(new Date(`${today}T12:00:00`));
  const steps = allSteps(state, roadmap, today);
  const completed = steps.filter(t => t.completedAt && dateInZone(new Date(t.completedAt), state.timeZone) >= week && dateInZone(new Date(t.completedAt), state.timeZone) <= today);
  const available = steps.filter(t => !t.completedAt && (!state.deferred[t.id] || state.deferred[t.id] <= today) && (!t.due || t.due <= plusDays(today, 14)));
  // Keep a completed week's wins visible. New work arrives next week, not after each click.
  const selected = completed.slice(0, 3);
  let minutes = selected.reduce((sum, t) => sum + t.minutes, 0);
  for (const task of available) {
    if (selected.length >= 3) break;
    if (minutes + task.minutes <= state.weeklyMinutes) { selected.push(task); minutes += task.minutes; }
  }
  return selected;
}

export function reviewDue(state: ProgressState, today: string) {
  return !state.reviews[0] || dateInZone(new Date(state.reviews[0].at), state.timeZone).slice(0, 7) !== today.slice(0, 7);
}

export function familyDigest(state: ProgressState, roadmap: RoadmapRow[], today: string) {
  const since = plusDays(today, -30);
  const own = Object.values(state.completions).filter(c => dateInZone(new Date(c.at), state.timeZone) >= since && dateInZone(new Date(c.at), state.timeZone) <= today).map(c => c.title);
  const activity = allSteps(state, roadmap, today).filter(t => t.source === 'roadmap' && t.completedAt && dateInZone(new Date(t.completedAt), state.timeZone) >= since && dateInZone(new Date(t.completedAt), state.timeZone) <= today).map(t => t.title);
  const shared = state.organizer.accomplishments.filter(a => a.shareWithFamily && a.date >= since && a.date <= today).map(a => a.title);
  const upcoming = state.organizer.colleges.filter(c => c.deadline >= today && c.deadline <= plusDays(today, 30) && !['Submitted', 'Accepted', 'Denied', 'Waitlisted'].includes(c.status)).map(c => `${c.name}: ${c.deadline}`);
  return [`Clavis Prep · Family progress`, `${since} to ${today} · Grade ${state.grade}`, '', 'Completed steps', ...([...new Set([...own, ...activity])].map(t => `• ${t}`)), ...(!own.length && !activity.length ? ['No completed steps recorded in this period.'] : []), '', 'Journal highlights selected by the student', ...(shared.length ? shared.map(t => `• ${t}`) : ['No highlights selected.']), '', 'Upcoming saved college deadlines', ...(upcoming.length ? upcoming.map(t => `• ${t}`) : ['No upcoming deadlines saved.']), '', 'One way to help', 'Set aside ten minutes together to ask which next step would benefit from your support.'].join('\n');
}
