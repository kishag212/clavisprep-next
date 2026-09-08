import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  try {
    const { location_city, location_state, interests, grade } = await request.json();

    if (!location_city || !location_state || !interests?.length || !grade) {
      return NextResponse.json(
        { error: 'Missing required fields: location_city, location_state, interests[], grade' },
        { status: 400 }
      );
    }

    const prompt = `Generate 10-15 real extracurricular activities and programs for a ${grade} grade student in ${location_city}, ${location_state} interested in: ${interests.join(', ')}.

IMPORTANT: Only suggest programs, competitions, camps, and organizations that you are confident actually exist.

URL RULES:
- Only include HOMEPAGE-LEVEL URLs (e.g. "https://risd.edu", "https://interlochen.org", "https://questbridge.org") — never deep paths like "/academics/pre-college" or "/programs/summer-2026".
- If you are not 100% confident the homepage domain is correct, set url to null. A null URL is better than a wrong one.
- Prefer well-known, long-established organizations whose homepage domains are stable (Interlochen, RISD, QuestBridge, MATHCOUNTS, FIRST Robotics, etc.).

Provide a MIX of activity types following this rough distribution:
- 40% Summer residential programs (well-known national/regional programs matching their interests) — set residential=true, season="summer"
- 30% Local school-year programs (same city or adjacent cities/counties) — set residential=false, season="year-round" or specific season
- 20% Summer local day camps/programs — set residential=false, season="summer"
- 10% Regional school-year programs (statewide) — set residential=false

Format as JSON array:
[
  {
    "name": "Program Name",
    "description": "What this program offers and why it's good for this student",
    "url": "https://real-url.com or null if unsure",
    "location_city": "City",
    "location_state": "ST",
    "interest_tags": ["tag1", "tag2"],
    "grade_levels": ["9th", "10th", "11th", "12th"],
    "category": "competition",
    "season": "summer",
    "residential": true,
    "program_duration": "2 weeks"
  }
]

Categories: competition, camp, club, volunteer, program, contest, internship, research
Only include grade_levels that are actually eligible.
For location_city/state of residential programs, use the program's actual location.
For local programs, use ${location_city}, ${location_state}.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Claude API error:', error);
      return NextResponse.json({ error: 'Failed to generate activities' }, { status: 500 });
    }

    const data = await response.json();
    const text = data.content[0].text;

    let activities;
    try {
      let cleaned = text
        .replace(/^```(?:json)?\s*\n?/gm, '')
        .replace(/\n?```\s*$/gm, '')
        .trim();

      const firstBracket = cleaned.indexOf('[');
      const lastBracket = cleaned.lastIndexOf(']');
      if (firstBracket !== -1 && lastBracket !== -1) {
        cleaned = cleaned.slice(firstBracket, lastBracket + 1);
      }

      activities = JSON.parse(cleaned);
    } catch (parseError) {
      console.error('JSON parse error:', parseError.message);
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 502 });
    }

    // Insert into database using service role
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const rows = activities.map(a => ({
      name: a.name,
      description: a.description,
      url: a.url || null,
      location_city: a.location_city,
      location_state: a.location_state,
      interest_tags: a.interest_tags || [],
      grade_levels: a.grade_levels || [],
      category: a.category,
      season: a.season,
      residential: a.residential || false,
      program_duration: a.program_duration || null,
      link_status: 'unchecked',
      content_match: 'unchecked'
    }));

    const { data: inserted, error: dbError } = await supabaseAdmin
      .from('curated_activities')
      .insert(rows)
      .select();

    if (dbError) {
      console.error('DB insert error:', JSON.stringify(dbError));
      return NextResponse.json(
        { error: `Failed to save activities: ${dbError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      count: inserted.length,
      activities: inserted
    });

  } catch (error) {
    console.error('Generate activities error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
