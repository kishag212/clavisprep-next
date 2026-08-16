import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST() {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // First: mark any unchecked entries with no URL as 'no_url'
    await supabaseAdmin
      .from('curated_activities')
      .update({ link_status: 'no_url', last_checked_at: new Date().toISOString() })
      .eq('link_status', 'unchecked')
      .is('url', null);

    // Fetch unchecked entries that have URLs
    const { data: entries, error } = await supabaseAdmin
      .from('curated_activities')
      .select('*')
      .eq('link_status', 'unchecked')
      .not('url', 'is', null)
      .limit(10);

    if (error || !entries?.length) {
      return NextResponse.json({
        success: true,
        message: 'No entries to verify',
        verified: 0
      });
    }

    const results = [];

    for (const entry of entries) {
      const update = { last_checked_at: new Date().toISOString() };

      // Step 1: Fetch the URL
      try {
        const response = await fetch(entry.url, {
          signal: AbortSignal.timeout(10000),
          headers: { 'User-Agent': 'ClavisPrep Link Checker/1.0' }
        });

        if (response.ok) {
          update.link_status = 'live';

          // Step 2: Extract content and verify with Claude
          const html = await response.text();
          const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
          const title = titleMatch ? titleMatch[1].trim() : 'No title found';
          const textContent = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
          const snippet = textContent.slice(0, 500);

          const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': process.env.ANTHROPIC_API_KEY,
              'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
              model: 'claude-sonnet-4-20250514',
              max_tokens: 10,
              messages: [{
                role: 'user',
                content: `Entry claims: ${entry.name} — ${entry.description}. Page contains: title='${title}', content='${snippet}'. Does this URL point to the correct organization? Reply YES, NO, or UNCERTAIN only.`
              }]
            })
          });

          if (claudeResponse.ok) {
            const claudeData = await claudeResponse.json();
            const answer = claudeData.content[0].text.trim().toUpperCase();
            if (answer.includes('YES')) update.content_match = 'yes';
            else if (answer.includes('NO')) update.content_match = 'no';
            else update.content_match = 'uncertain';
          }
        } else if (response.status === 404) {
          update.link_status = 'dead';
        } else {
          update.link_status = 'unreachable';
        }
      } catch (fetchError) {
        update.link_status = 'unreachable';
      }

      // Step 3: Update the row
      await supabaseAdmin
        .from('curated_activities')
        .update(update)
        .eq('id', entry.id);

      results.push({ id: entry.id, name: entry.name, ...update });
    }

    return NextResponse.json({ success: true, verified: results.length, results });

  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
