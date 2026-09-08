import { createClient } from '@/utils/supabase/server';
import ResourceList from './resource-list';

export const metadata = {
  title: 'Curated College Prep Programs & Activities | ClavisPrep',
  description: 'Browse verified extracurricular programs, summer camps, competitions, and volunteer opportunities for college-bound students. Filter by interest, location, season, and more.',
  openGraph: {
    title: 'Curated College Prep Programs & Activities | ClavisPrep',
    description: 'Browse verified extracurricular programs, summer camps, competitions, and volunteer opportunities for college-bound students.',
    type: 'website',
  },
};

export default async function ResourcesPage() {
  const supabase = await createClient();

  const { data: activities } = await supabase
    .from('curated_activities')
    .select('*')
    .in('link_status', ['live', 'no_url'])
    .neq('content_match', 'no')
    .order('name', { ascending: true });

  // Extract unique filter values for the sidebar
  const allTags = [...new Set((activities || []).flatMap(a => a.interest_tags || []))].sort();
  const allCategories = [...new Set((activities || []).map(a => a.category).filter(Boolean))].sort();
  const allSeasons = [...new Set((activities || []).map(a => a.season).filter(Boolean))].sort();
  const allStates = [...new Set((activities || []).map(a => a.location_state).filter(Boolean))].sort();

  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <h1 className="font-serif text-4xl lg:text-5xl font-bold text-[#0a1628] mb-3">
            College Prep Programs & Activities
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl">
            Browse verified extracurricular programs, summer camps, competitions, and volunteer opportunities for college-bound students.
          </p>
        </div>
      </header>

      <ResourceList
        activities={activities || []}
        allTags={allTags}
        allCategories={allCategories}
        allSeasons={allSeasons}
        allStates={allStates}
      />

      <div className="bg-gradient-to-r from-[#c88c24] to-[#91682b] py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl font-bold text-white mb-4">
            Want a personalized roadmap using these programs?
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Get a month-by-month activity plan tailored to your profile, interests, and target schools.
          </p>
          <a
            href="/pricing"
            className="inline-block px-8 py-4 bg-white text-[#0a1628] font-bold text-lg rounded-xl hover:shadow-2xl hover:scale-105 transition-all"
          >
            Get Pro &mdash; $19.99/month
          </a>
        </div>
      </div>
    </div>
  );
}
