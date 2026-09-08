import { createClient } from '@/utils/supabase/server';
import { allSteps, dateInZone, initialProgress, plusDays, weekKey, type ProgressState, type RoadmapRow } from '@/lib/progress';
import * as validate from '@/lib/progress-validation';

export const dynamic = 'force-dynamic';
const reply = (body: unknown, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'private, no-store' } });

async function load() {
  const db = await createClient();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return { error: reply({ error: 'Please sign in to save your progress.' }, 401) };
  const [profileResult, roadmapResult] = await Promise.all([
    db.from('user_profiles').select('user_id,grade,interests,student_context,updated_at').eq('user_id', user.id).maybeSingle(),
    db.from('roadmap_activities').select('id,month_key,tasks').eq('user_id', user.id).order('month_key'),
  ]);
  if (profileResult.error || roadmapResult.error) {
    for (const [source, error] of [['profile', profileResult.error], ['roadmap', roadmapResult.error]] as const) {
      if (error) console.error('Progress load failed', source, error.code, ['42703', 'PGRST204', '42P01', 'PGRST205'].includes(error.code) ? error.message : 'Database request failed');
    }
    return { error: reply({ error: 'Your saved plan could not be loaded. Please try again.' }, 503) };
  }
  const profile = profileResult.data;
  const context = profile?.student_context || {};
  const state: ProgressState = context.progress_v1 || initialProgress(profile?.grade, profile?.interests || '');
  // Profile edits on the roadmap remain authoritative.
  if (context.progress_v1 && profile?.grade) state.grade = validate.grade(profile.grade);
  if (context.progress_v1) state.interests = profile?.interests || '';
  return { db, user, profile, context, state, roadmap: (roadmapResult.data || []) as RoadmapRow[] };
}

export async function GET() {
  try {
    const loaded = await load();
    if (loaded.error) return loaded.error;
    return reply({ ownerId: loaded.user.id, state: loaded.state, roadmap: loaded.roadmap, profileExists: !!loaded.profile, configured: loaded.state.setupCompleted });
  } catch { return reply({ error: 'Your saved plan is temporarily unavailable. Please try again.' }, 503); }
}

export async function POST(request: Request) {
  if (request.headers.get('origin') && request.headers.get('origin') !== new URL(request.url).origin) return reply({ error: 'This request is not allowed.' }, 403);
  let input: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (raw.length > 1000000) return reply({ error: 'This update is too large. Save fewer entries at once.' }, 413);
    input = validate.record(JSON.parse(raw));
  } catch { return reply({ error: 'Please provide a valid update.' }, 400); }
  try {
    const loaded = await load();
    if (loaded.error) return loaded.error;
    const { db, user, profile, context, state, roadmap } = loaded;
    if (input.ownerId !== user.id) return reply({ error: 'The signed-in account changed. Reload before saving.' }, 409);
    if (input.version !== state.version) return reply({ error: 'Your plan changed in another tab. Reload before saving again.' }, 409);
    const next = structuredClone(state);
    const now = new Date();
    const today = dateInZone(now, state.timeZone);
    const at = now.toISOString();
    const action = input.action;
    try {
      if (action === 'review') {
        next.grade = validate.grade(input.grade);
        next.setupCompleted = true;
        next.timeZone = validate.text(input.timeZone, 100, true);
        new Intl.DateTimeFormat('en-US', { timeZone: next.timeZone }).format(now);
        next.interests = validate.text(input.interests, 500);
        next.weeklyMinutes = validate.number(input.weeklyMinutes, 180);
        if (next.weeklyMinutes < 15) throw new Error('Choose at least 15 minutes per week.');
        const win = validate.text(input.win, 1000);
        const challenge = validate.text(input.challenge, 1000);
        next.reviews = [{ at, grade: next.grade, interests: next.interests, weeklyMinutes: next.weeklyMinutes, win, challenge }, ...next.reviews].slice(0, 120);
      } else if (action === 'organizer') {
        next.organizer = validate.organizer(input.organizer);
      } else if (action === 'complete' || action === 'undo' || action === 'defer' || action === 'resume') {
        const id = validate.text(input.id, 200, true);
        const task = allSteps(state, roadmap, today).find(t => t.id === id);
        if (action === 'resume' && state.deferred[id]) { delete next.deferred[id]; }
        else if (action === 'undo' && state.completions[id]) { delete next.completions[id]; }
        else {
          if (!task) throw new Error('This step is no longer in your current plan. Reload your plan.');
          if (action === 'complete') {
            if (task.source === 'roadmap') throw new Error('Record this activity in your roadmap so both views stay in sync.');
            next.completions[id] = { title: task.title, at, reflection: validate.text(input.reflection, 2000, true) };
            delete next.deferred[id];
          } else if (action === 'defer') {
            const due = validate.date(input.date);
            if (due <= today || due > plusDays(today, 365)) throw new Error('Choose a future date within the next year.');
            next.deferred[id] = due;
          } else throw new Error('This step has no saved completion to undo.');
        }
      } else throw new Error('Choose a supported update.');
    } catch (error) { return reply({ error: error instanceof Error ? error.message : 'Please check the information you entered.' }, 400); }

    next.version += 1;
    next.activeWeeks = [...new Set([...next.activeWeeks, weekKey(new Date(`${today}T12:00:00`))])].slice(-260);
    const updatedContext = { ...context, progress_v1: next, ...(action === 'review' ? { planning_minutes_per_week: next.weeklyMinutes, current_challenge: next.reviews[0].challenge, recent_win: next.reviews[0].win, captured_at: at } : {}) };
    const values = { grade: next.grade, interests: next.interests, student_context: updatedContext, updated_at: at };
    // Compare the revision and profile timestamp without putting private JSON in a URL.
    let write;
    if (profile) {
      write = db.from('user_profiles').update(values).eq('user_id', user.id);
      write = profile.updated_at ? write.eq('updated_at', profile.updated_at) : write.is('updated_at', null);
      write = context.progress_v1
        ? write.eq('student_context->progress_v1->>version', String(state.version))
        : write.is('student_context->progress_v1', null);
    } else {
      // A student can use the journal before completing the full roadmap profile.
      // Legacy required text fields stay blank until the student supplies them.
      write = db.from('user_profiles').insert({ user_id: user.id, location: '', gpa: '', target_schools: '', extracurriculars: '', ...values });
    }
    const result = await write.select('user_id');
    if (result.error) {
      console.error('Progress save failed', result.error.code, ['23502', '42703', 'PGRST204'].includes(result.error.code) ? result.error.message : 'Database write failed');
      return reply({ error: result.error.code === '23505' ? 'A profile was created in another tab. Reload before saving.' : 'Your changes could not be saved. Please try again.' }, result.error.code === '23505' ? 409 : 503);
    }
    if (!result.data?.length) return reply({ error: 'Your profile changed in another tab. Reload before saving again.' }, 409);
    return reply({ ownerId: user.id, state: next, roadmap, profileExists: true, configured: next.setupCompleted });
  } catch { return reply({ error: 'Your changes could not be saved. Please try again.' }, 503); }
}
