import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import Perplexity from '@perplexity-ai/perplexity_ai';

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function parseLocation(location) {
  const parts = location?.split(',').map(s => s.trim()) || [];
  if (parts.length >= 2) {
    return { city: parts[0], state: parts[1] };}
  // Handle "City ST" format with no comma
  const spaceIdx = location?.lastIndexOf(' ') ?? -1;
  if (spaceIdx > 0) {
    return { city: location.slice(0, spaceIdx).trim(), state: location.slice(spaceIdx + 1).trim() };
  }
  return { city: location || '', state: '' };
}

function getGraduationMonth(grade) {
  const now = new Date();
  const pastJune = now.getMonth() >= 6;
  const yearsLeft = { '8th': 4, '9th': 3, '10th': 2, '11th': 1, '12th': 0 };
  const gradYear = (pastJune ? now.getFullYear() + 1 : now.getFullYear()) + (yearsLeft[grade] ?? 0);
  return `${gradYear}-06`;
}

function monthKeyToLabel(key) {
  const [year, month] = key.split('-');
  return `${MONTH_NAMES[parseInt(month) - 1]} ${year}`;
}

function isValidMonthKey(value) {
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(value || '');
}

function normalizeTask(task) {
  if (!task || typeof task !== 'object') return null;
  const title = String(task.title || '').trim();
  const description = String(task.description || '').trim();
  if (!title || !description) return null;

  let url = typeof task.url === 'string' ? task.url.trim() : '';
  if (url && !/^https?:\/\//i.test(url)) url = '';

  return {
    title: title.slice(0, 160),
    description: description.slice(0, 1200),
    category: String(task.category || 'college-prep').trim().slice(0, 50),
    priority: ['high', 'medium', 'low'].includes(task.priority) ? task.priority : 'medium',
    due_date: /^\d{4}-\d{2}-\d{2}$/.test(task.due_date || '') ? task.due_date : null,
    estimated_time: String(task.estimated_time || '1-2 hours').trim().slice(0, 80),
    estimated_cost: String(task.estimated_cost || 'Free or varies').trim().slice(0, 80),
    why_recommended: String(task.why_recommended || 'This supports your college preparation goals.').trim().slice(0, 500),
    evidence: String(task.evidence || 'Write a short reflection when complete.').trim().slice(0, 300),
    alternative: String(task.alternative || '').trim().slice(0, 300),
    pathway: String(task.pathway || 'College readiness').trim().slice(0, 100),
    ...(url ? { url } : { search_query: String(task.search_query || title).trim().slice(0, 240) }),
    completed: false,
    status: 'active',
    outcome: null,
  };
}

async function verifyTaskLink(task) {
  if (!task?.url) return task;
  try {
    const response = await fetch(task.url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(3500), cache: 'no-store' });
    const reachable = response.status < 400 || [401, 403, 405, 429].includes(response.status);
    if (reachable) return { ...task, link_verified_at: new Date().toISOString() };
  } catch {
    // Replace unreachable links with a safe search action below.
  }
  const withoutUrl = { ...task };
  delete withoutUrl.url;
  return { ...withoutUrl, search_query: `${task.title} ${task.pathway || ''}`.trim(), link_status: 'unreachable' };
}

export async function POST(request) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { profile, startMonth: requestedStart, intent = 'initial' } = await request.json();
    if (!profile || typeof profile !== 'object') {
      return NextResponse.json({ error: 'A student profile is required.' }, { status: 400 });
    }

    // Rate limit gate — one regeneration per calendar month
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('last_roadmap_generated')
      .eq('user_id', user.id)
      .maybeSingle();
    if (intent === 'regenerate' && !profileError && userProfile?.last_roadmap_generated) {
      const lastGen = new Date(userProfile.last_roadmap_generated);
      const now = new Date();
      const sameMonth = lastGen.getFullYear() === now.getFullYear() &&
                        lastGen.getMonth() === now.getMonth();
      if (sameMonth) {
        return NextResponse.json(
          { error: 'rate_limited', message: 'Your roadmap can be regenerated once per month. Check back next month.' },
          { status: 429 }
        );
      }
    }

    const today = new Date().toISOString().split('T')[0];
    const startMonth = requestedStart || today.slice(0, 7);
    if (!isValidMonthKey(startMonth)) {
      return NextResponse.json({ error: 'Start month must use YYYY-MM format.' }, { status: 400 });
    }
    const graduationMonth = getGraduationMonth(profile.grade);
    if (startMonth > graduationMonth) {
      return NextResponse.json({ error: 'The roadmap cannot start after graduation.' }, { status: 400 });
    }
    const { city, state } = parseLocation(profile.location);
    const studentContext = profile.student_context || {};

    // Fetch curated activities (authenticated user can read via RLS)
    const { data: allActivities } = await supabase
      .from('curated_activities')
      .select('*')
      .or('verified_by_human.eq.true,and(link_status.eq.live,content_match.in.(yes,uncertain)),link_status.eq.no_url');

    const activities = allActivities || [];
    const { data: previousMonths } = await supabase
      .from('roadmap_activities')
      .select('month_label,tasks')
      .eq('user_id', user.id)
      .order('month_key', { ascending: false })
      .limit(6);
    const outcomeHistory = (previousMonths || []).flatMap(month => (month.tasks || [])
      .filter(task => task.outcome || task.completed || task.status === 'skipped')
      .map(task => ({
        month: month.month_label,
        title: task.title,
        status: task.status || (task.completed ? 'completed' : 'active'),
        enjoyment: task.outcome?.enjoyment,
        continue_interest: task.outcome?.continue_interest,
        blocker: task.outcome?.blocker,
        reflection: task.outcome?.reflection,
      }))).slice(0, 20);
    console.log(`[roadmap] DB fetch: ${activities.length} curated activities returned. User location: city="${city}" state="${state}" grade="${profile.grade}"`);

    // Filter by grade
    const gradeFiltered = activities.filter(a =>
      !a.grade_levels?.length || a.grade_levels.includes(profile.grade)
    );
    console.log(`[roadmap] After grade filter: ${gradeFiltered.length}/${activities.length} survived. Dropped:`, activities.filter(a => a.grade_levels?.length && !a.grade_levels.includes(profile.grade)).map(a => `${a.name} (grades: ${a.grade_levels?.join(',')})`));

    // Categorize
    const localSchoolYear = gradeFiltered.filter(a =>
      !a.residential && a.season !== 'summer' &&
      (a.location_city?.toLowerCase() === city.toLowerCase() ||
       a.location_state?.toLowerCase() === state.toLowerCase())
    );

    const regionalSchoolYear = gradeFiltered.filter(a =>
      !a.residential && a.season !== 'summer' &&
      a.location_state?.toLowerCase() === state.toLowerCase() &&
      a.location_city?.toLowerCase() !== city.toLowerCase()
    );

    const summerResidential = (profile.open_to_residential)
      ? gradeFiltered.filter(a => a.residential && (a.season === 'summer' || !a.season))
      : [];

    const summerLocal = gradeFiltered.filter(a =>
      !a.residential && a.season === 'summer' &&
      (a.location_city?.toLowerCase() === city.toLowerCase() ||
       a.location_state?.toLowerCase() === state.toLowerCase())
    );

    console.log(`[roadmap] Categorized — localSchoolYear: ${localSchoolYear.length} [${localSchoolYear.map(a=>a.name).join(', ')}] | regionalSchoolYear: ${regionalSchoolYear.length} [${regionalSchoolYear.map(a=>a.name).join(', ')}] | summerResidential: ${summerResidential.length} [${summerResidential.map(a=>a.name).join(', ')}] | summerLocal: ${summerLocal.length} [${summerLocal.map(a=>a.name).join(', ')}]`);
    // Log uncategorized activities that fell through all filters
    const categorized = new Set([...localSchoolYear, ...regionalSchoolYear, ...summerResidential, ...summerLocal].map(a => a.id));
    const uncategorized = gradeFiltered.filter(a => !categorized.has(a.id));
    if (uncategorized.length > 0) {
      console.log(`[roadmap] Uncategorized (fell through all filters):`, uncategorized.map(a => `${a.name} (season=${a.season}, residential=${a.residential}, city=${a.location_city}, state=${a.location_state})`));
    }

    function formatActivity(a) {
      const urlPart = a.content_match !== 'no' && a.url ? ` | URL: ${a.url}` : '';
      return `- ${a.name}: ${a.description || 'No description'}${urlPart} | Category: ${a.category || 'general'} | Season: ${a.season || 'year-round'}`;
    }

    let curatedSection = '';
    if (activities.length > 0) {
      curatedSection = `

=== CURATED VERIFIED ACTIVITIES ===
Use these real, verified programs when they match. Include their URL in a "url" field if one is listed. Fall back to your own suggestions with search_query when nothing matches.

LOCAL SCHOOL-YEAR PROGRAMS:
${localSchoolYear.length > 0 ? localSchoolYear.map(formatActivity).join('\n') : '(none available)'}

REGIONAL SCHOOL-YEAR PROGRAMS:
${regionalSchoolYear.length > 0 ? regionalSchoolYear.map(formatActivity).join('\n') : '(none available)'}

SUMMER RESIDENTIAL PROGRAMS:
${summerResidential.length > 0 ? summerResidential.map(formatActivity).join('\n') : profile.open_to_residential ? '(none available)' : '(student not open to residential programs)'}

SUMMER LOCAL PROGRAMS:
${summerLocal.length > 0 ? summerLocal.map(formatActivity).join('\n') : '(none available)'}`;
    } else {
      curatedSection = '\n\nNo curated activities are available yet. Use your own knowledge and include a search_query field for each task so users can find resources.';
    }

    const prompt = `You are a college prep advisor. Generate exactly 6 months of personalized activities for a student.

Grade: ${profile.grade}
Current School: ${profile.current_school || profile.currentSchool}
Location: ${profile.location}
GPA: ${profile.gpa}
Interests: ${profile.interests}
Target Schools: ${profile.target_schools || profile.targetSchools}
Extracurriculars: ${profile.extracurriculars}
Career Interests: ${studentContext.career_interests || 'not specified'}
Activities They Enjoy: ${studentContext.favorite_activities || 'not specified'}
Realistic Weekly Time: ${studentContext.weekly_hours || 'not specified'}
Work or Family Responsibilities: ${studentContext.responsibilities || 'not specified'}
Leadership Experience: ${studentContext.leadership || 'not specified'}
Achievements and Projects: ${studentContext.achievements || 'not specified'}
Strongest Subjects: ${studentContext.strongest_subjects || 'not specified'}
Most Challenging Subjects: ${studentContext.hardest_subjects || 'not specified'}
Test Scores and Targets: ${studentContext.test_scores || 'not specified'}
College Priorities: ${studentContext.college_priorities || 'not specified'}
Approximate Family Budget: ${studentContext.family_budget || 'not specified'}
Needs Substantial Financial Aid: ${studentContext.needs_financial_aid ? 'yes' : 'not specified'}
Decision Support: ${studentContext.decision_support || 'not specified'}
College-Prep Confidence (1-5): ${studentContext.confidence_level || 'not specified'}
Current Challenge: ${studentContext.current_challenge || 'not specified'}
Recent Win: ${studentContext.recent_win || 'not specified'}
Recent Roadmap Outcomes: ${outcomeHistory.length ? JSON.stringify(outcomeHistory) : 'No outcomes recorded yet'}
Max Commute: ${profile.max_commute_miles ? profile.max_commute_miles + ' miles' : 'not specified'}
Open to Residential Programs: ${profile.open_to_residential ? 'yes' : 'no'}
Today's Date: ${today}
Start Month: ${startMonth}
Graduation Month: ${graduationMonth}

Generate exactly 6 months of activities starting from ${monthKeyToLabel(startMonth)}. If graduation month (${monthKeyToLabel(graduationMonth)}) comes before all 6 months, stop at that month.

For the first month, provide 5-7 tasks. For other months, provide 3-5 tasks.

IMPORTANT RULES:
- The student attends "${profile.current_school || profile.currentSchool}". Always use this exact school name. Never invent or guess a school name.
- For summer months (June, July, August), provide summer-specific activities: camps, internships, summer programs, volunteering, test prep, pre-college programs.
- For school-year months (Sept-May), focus on academics, clubs, competitions, test prep, college research.
- Use your web search to find a real, currently active URL for every task where a specific program, resource, or website exists. Include it as a "url" field. Only use "search_query" for generic tasks like journaling or studying where no specific URL applies.
- Each task MUST have either a "url" field OR a "search_query" field, never both.
- Build a coherent student story. Prefer 1-3 pathways that deepen over time instead of unrelated activity collecting.
- Use the progression: explore, participate, build skills, create, lead, demonstrate impact.
- Every task needs a priority, realistic due date, estimated time, estimated cost, why it was recommended for this student, completion evidence, an easier alternative, and a pathway label.
- High-priority tasks should be few and should represent the student's next best actions.
- Learn from Recent Roadmap Outcomes: deepen activities the student enjoyed and wants to continue; reduce or replace tasks blocked by recurring time, cost, transportation, difficulty, or relevance constraints.
${curatedSection}

Format as JSON:
{
  "months": [
    {
      "month": "${monthKeyToLabel(startMonth)}",
      "grade": "${profile.grade}",
      "tasks": [
        {
          "title": "Task title",
          "description": "Detailed description",
          "category": "academics",
          "priority": "high",
          "due_date": "${startMonth}-28",
          "estimated_time": "2 hours",
          "estimated_cost": "Free",
          "why_recommended": "Why this task fits this student's goals and current situation",
          "evidence": "A specific artifact, result, or reflection that proves completion",
          "alternative": "A lower-cost or lower-time alternative",
          "pathway": "Computer science + community education",
          "search_query": "google search query for this resource"
        },
        {
          "title": "Verified program task",
          "description": "Description referencing a curated activity",
          "category": "program",
          "url": "https://verified-url.com"
        }
      ]
    }
  ]
}

Categories: academics, testing, exploration, leadership, volunteering, competition, program, summer, college-prep

Make tasks specific to their location (${profile.location}) — mention local opportunities, competitions, programs, etc.
Make tasks specific to their interests (${profile.interests}) — tailor recommendations.
Adjust difficulty/targets based on GPA (${profile.gpa}).
For 8th grade: exploring interests, building study habits, getting involved in activities, preparing for high school transition.
For 9th-12th grade: follow the standard college prep progression.`;

    const perplexity = new Perplexity({ apiKey: process.env.PERPLEXITY_API_KEY });
    const perplexityResponse = await perplexity.responses.create({
      preset: 'pro-search',
      input: prompt,
      tools: [{ type: 'web_search' }],
      instructions: 'You are a college prep advisor. Use web search to find real, currently active programs, scholarships, and resources with verified URLs. Never invent URLs. Always return valid JSON as specified in the prompt.'
    });

    if (!perplexityResponse || perplexityResponse.status !== 'completed') {
      console.error('Perplexity API error:', perplexityResponse);
      return NextResponse.json({ error: 'Failed to generate roadmap' }, { status: 500 });
    }

    console.log('[perplexity] raw response:', perplexityResponse.output_text?.slice(0, 2000));

    const roadmapText = perplexityResponse.output_text;

    let roadmapJSON;
    try {
      let cleaned = roadmapText
        .replace(/^```(?:json)?\s*\n?/gm, '')
        .replace(/\n?```\s*$/gm, '')
        .trim();

      const firstBrace = cleaned.indexOf('{');
      const lastBrace = cleaned.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        cleaned = cleaned.slice(firstBrace, lastBrace + 1);
      }

      roadmapJSON = JSON.parse(cleaned);
    } catch (parseError) {
      console.error('JSON parse error:', parseError.message);
      console.error('Raw response (first 500 chars):', roadmapText.slice(0, 500));
      console.error('Raw response (last 500 chars):', roadmapText.slice(-500));
      return NextResponse.json(
        { error: 'The AI returned an invalid response. Please try again.' },
        { status: 502 }
      );
    }

    // Save each month as a row
    const savedMonths = [];
    if (!Array.isArray(roadmapJSON.months)) {
      return NextResponse.json({ error: 'The AI response did not include roadmap months.' }, { status: 502 });
    }

    for (const month of roadmapJSON.months.slice(0, 6)) {
      const parts = month.month.match(/^(\w+)\s+(\d{4})$/);
      if (!parts) {
        console.error('Could not parse month label:', month.month);
        continue;
      }
      const monthIdx = MONTH_NAMES.indexOf(parts[1]) + 1;
      if (monthIdx === 0) {
        console.error('Unknown month name:', parts[1]);
        continue;
      }
      const monthKey = `${parts[2]}-${String(monthIdx).padStart(2, '0')}`;

      if (monthKey < startMonth || monthKey > graduationMonth || !Array.isArray(month.tasks)) continue;
      const normalizedTasks = month.tasks.map(normalizeTask).filter(Boolean).slice(0, 7);
      const tasks = await Promise.all(normalizedTasks.map(verifyTaskLink));
      if (tasks.length === 0) continue;

      const { data: saved, error: saveError } = await supabase
        .from('roadmap_activities')
        .upsert({
          user_id: user.id,
          month_key: monthKey,
          month_label: month.month,
          grade: month.grade,
          tasks
        }, { onConflict: 'user_id,month_key' })
        .select()
        .single();

      if (saveError) {
        console.error('Save month error:', JSON.stringify(saveError, null, 2));
      } else {
        savedMonths.push(saved);
      }
    }

    // Update last_roadmap_generated after successful generation
    if (savedMonths.length === 0) {
      return NextResponse.json({ error: 'No valid roadmap months were generated. Please try again.' }, { status: 502 });
    }

    if (intent !== 'extend') {
      await supabase
        .from('user_profiles')
        .update({ last_roadmap_generated: new Date().toISOString() })
        .eq('user_id', user.id);
    }

    return NextResponse.json({ success: true, months: savedMonths });

  } catch (error) {
    console.error('Generate roadmap error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: months, error } = await supabase
      .from('roadmap_activities')
      .select('*')
      .eq('user_id', user.id)
      .order('month_key', { ascending: true });

    if (error) {
      return NextResponse.json({ error: 'Failed to load roadmap' }, { status: 500 });
    }

    return NextResponse.json({ success: true, months: months || [] });

  } catch (error) {
    console.error('Get roadmap error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
