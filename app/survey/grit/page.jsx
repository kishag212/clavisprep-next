'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

const GritScaleItems = [
  { id: 1, text: "I don't give up easily." },
  { id: 2, text: "I have difficulty maintaining my focus on projects that take more than a few months to complete.", reverse: true },
  { id: 3, text: "I finish whatever I begin." },
  { id: 4, text: "My interests change from year to year.", reverse: true },
  { id: 5, text: "I am a hard worker." },
  { id: 6, text: "I often set a goal but later choose to pursue a different one.", reverse: true },
  { id: 7, text: "I have achieved a goal that took years of work to reach." },
  { id: 8, text: "I have been obsessed with a certain idea or project for a short time but later lost interest.", reverse: true },
  { id: 9, text: "I am diligent." },
  { id: 10, text: "I sometimes have difficulty keeping my attention on activities that require more than a few months to complete.", reverse: true },
  { id: 11, text: "New ideas and projects sometimes distract me from previous ones.", reverse: true },
  { id: 12, text: "Setbacks don't discourage me." }
];

export default function GritSurvey() {
  const supabase = createClient();
  const router = useRouter();
  const [responses, setResponses] = useState(new Array(13).fill(0));
  const [hasTaken, setHasTaken] = useState(false);

  useEffect(() => {
    checkExistingSurvey();
  }, []);

  async function checkExistingSurvey() {
    const { data: existing } = await supabase
      .from('grit_responses')
      .select('id')
      .eq('user_id', supabase.auth.user()?.id)
      .eq('survey_type', 'pre')
      .single();
    if (existing) setHasTaken(true);
  }

  const handleSubmit = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    const processed = responses.slice(1).map((v, i) =>
      GritScaleItems[i].reverse ? 6 - v : v
    );
    const gritScore = processed.reduce((a, b) => a + b, 0) / processed.length;

    const { data, error } = await supabase.from('grit_responses').insert({
      user_id: user?.id,
      survey_type: 'pre',
      week: 0,
      responses,
      grit_score: gritScore
    });
    if (error) console.error('Grit save error:', error);
    else console.log('Grit saved:', data);

    router.replace('/roadmap');
  };

  // if (hasTaken) return <Navigate href="/roadmap" replace />; // pre-survey redirect check removed

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-4">Before We Begin</h1>
      <p className="text-gray-600 mb-6">Answer honestly — there are no right or wrong answers.</p>

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
        {GritScaleItems.map(({ id, text, reverse }) => (
          <div key={id} className="border border-gray-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-medium mb-3">{`Item ${id}: ${text}`}</h3>
            <div className="space-y-2">
              {['Not at all like me', 'Not much like me', 'Somewhat like me', 'Mostly like me', 'Very much like me'].map((label, i) => (
                <label key={i} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`item${id}`}
                    checked={responses[id] === i + 1}
                    onChange={(e) => {
                      const newResponses = [...responses];
                      newResponses[id] = i + 1;
                      setResponses(newResponses);
                    }}
                    className="form-radio"
                  />
                  <span>{label} ({i + 1})</span>
                </label>
              ))}
            </div>
          </div>
        ))}
        <button type="button" onClick={handleSubmit} className="mt-6 bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600">
          Submit
        </button>
      </form>
    </div>
  );
}
