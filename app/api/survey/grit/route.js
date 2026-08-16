import { NextResponse } from 'next/server';
import { supabaseClient } from '@/lib/supabaseClient';

export async function POST(request) {
  try {
    const supabase = supabaseClient;
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { responses, survey_type, week } = await request.json();

    if (!Array.isArray(responses) || responses.length !== 12) {
      return NextResponse.json({ error: 'Invalid responses format' }, { status: 400 });
    }

    // Validate responses are between 1-5
    for (let i = 0; i < responses.length; i++) {
      if (typeof responses[i] !== 'number' || responses[i] < 1 || responses[i] > 5) {
        return NextResponse.json({ error: `Invalid response at index ${i}` }, { status: 400 });
      }
    }

    // Calculate grit score with reverse scoring
    const gritScaleItems = [
      false, // Item 1
      true,  // Item 2 (reverse)
      false, // Item 3
      true,  // Item 4 (reverse)
      false, // Item 5
      true,  // Item 6 (reverse)
      false, // Item 7
      true,  // Item 8 (reverse)
      false, // Item 9
      true,  // Item 10 (reverse)
      true,  // Item 11 (reverse)
      false  // Item 12
    ];

    const processed = responses.map((v, i) =>
      gritScaleItems[i] ? 6 - v : v
    );

    const gritScore = processed.reduce((a, b) => a + b, 0) / processed.length;

    // Save to database
    const { data, error } = await supabase
      .from('grit_responses')
      .insert({
        user_id: user.id,
        survey_type,
        week,
        responses,
        grit_score: gritScore
      });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Survey error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
