'use client';

import { useState, useEffect, useRef } from 'react';
import { createBrowserClient } from '@supabase/ssr';

const CATEGORY_COLORS = {
  competition: 'bg-red-100 text-red-700',
  camp: 'bg-orange-100 text-orange-700',
  club: 'bg-blue-100 text-blue-700',
  volunteer: 'bg-green-100 text-green-700',
  program: 'bg-purple-100 text-purple-700',
  contest: 'bg-pink-100 text-pink-700',
  internship: 'bg-teal-100 text-teal-700',
  research: 'bg-indigo-100 text-indigo-700',
};

export default function ResourceList({ activities, allTags, allCategories, allSeasons, allStates }) {
  const [search, setSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSeasons, setSelectedSeasons] = useState([]);
  const [selectedStates, setSelectedStates] = useState([]);
  const [residentialFilter, setResidentialFilter] = useState('all'); // 'all', 'yes', 'no'

  const lastLoggedRef = useRef('');
  const logTimeoutRef = useRef(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const filtered = activities.filter(a => {
    if (search) {
      const q = search.toLowerCase();
      if (!a.name?.toLowerCase().includes(q) && !a.description?.toLowerCase().includes(q)) return false;
    }
    if (selectedTags.length > 0 && !selectedTags.some(t => a.interest_tags?.includes(t))) return false;
    if (selectedCategories.length > 0 && !selectedCategories.includes(a.category)) return false;
    if (selectedSeasons.length > 0 && !selectedSeasons.includes(a.season)) return false;
    if (selectedStates.length > 0 && !selectedStates.includes(a.location_state)) return false;
    if (residentialFilter === 'yes' && !a.residential) return false;
    if (residentialFilter === 'no' && a.residential) return false;
    return true;
  });

  // Log zero-result searches (debounced, fire-and-forget)
  useEffect(() => {
    if (logTimeoutRef.current) clearTimeout(logTimeoutRef.current);

    logTimeoutRef.current = setTimeout(() => {
      const hasFilters = search || selectedTags.length || selectedCategories.length || selectedSeasons.length || selectedStates.length || residentialFilter !== 'all';
      if (filtered.length === 0 && hasFilters) {
        const key = JSON.stringify({ search, selectedTags, selectedCategories, selectedSeasons, selectedStates, residentialFilter });
        if (key !== lastLoggedRef.current) {
          lastLoggedRef.current = key;
          supabase.from('resource_search_misses').insert({
            query: search || null,
            filters: { tags: selectedTags, categories: selectedCategories, seasons: selectedSeasons, states: selectedStates, residential: residentialFilter }
          }).then(() => {});
        }
      }
    }, 1500);

    return () => clearTimeout(logTimeoutRef.current);
  }, [search, selectedTags, selectedCategories, selectedSeasons, selectedStates, residentialFilter, filtered.length]);

  function toggleMulti(arr, setArr, value) {
    setArr(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
      {/* Search */}
      <div className="mb-8">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search programs by name or description..."
          className="w-full px-5 py-3 bg-white border border-slate-200 rounded-xl text-[#0a1628] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#c88c24] focus:border-transparent shadow-sm"
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filter sidebar */}
        <aside className="lg:w-64 shrink-0 space-y-6">
          <FilterSection title="Interest" options={allTags} selected={selectedTags} toggle={(v) => toggleMulti(selectedTags, setSelectedTags, v)} />
          <FilterSection title="Category" options={allCategories} selected={selectedCategories} toggle={(v) => toggleMulti(selectedCategories, setSelectedCategories, v)} />
          <FilterSection title="Season" options={allSeasons} selected={selectedSeasons} toggle={(v) => toggleMulti(selectedSeasons, setSelectedSeasons, v)} />
          <FilterSection title="State" options={allStates} selected={selectedStates} toggle={(v) => toggleMulti(selectedStates, setSelectedStates, v)} />

          <div>
            <h3 className="text-sm font-semibold text-[#0a1628] mb-2">Residential</h3>
            <div className="flex gap-2">
              {['all', 'yes', 'no'].map(opt => (
                <button
                  key={opt}
                  onClick={() => setResidentialFilter(opt)}
                  className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                    residentialFilter === opt
                      ? 'bg-[#c88c24] text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-[#c88c24]'
                  }`}
                >
                  {opt === 'all' ? 'All' : opt === 'yes' ? 'Residential' : 'Day only'}
                </button>
              ))}
            </div>
          </div>

          {(search || selectedTags.length > 0 || selectedCategories.length > 0 || selectedSeasons.length > 0 || selectedStates.length > 0 || residentialFilter !== 'all') && (
            <button
              onClick={() => { setSearch(''); setSelectedTags([]); setSelectedCategories([]); setSelectedSeasons([]); setSelectedStates([]); setResidentialFilter('all'); }}
              className="text-sm text-[#c88c24] font-semibold hover:text-[#91682b] transition-colors"
            >
              Clear all filters
            </button>
          )}
        </aside>

        {/* Results */}
        <div className="flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-slate-500 font-medium">No programs match your filters.</p>
              <p className="text-slate-400 mt-2">Try broadening your search.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-slate-500 mb-4">{filtered.length} program{filtered.length !== 1 ? 's' : ''} found</p>
              <div className="grid md:grid-cols-2 gap-6">
                {filtered.map(a => (
                  <div key={a.id} className="bg-white rounded-xl shadow-md border border-slate-200 p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="font-serif text-lg font-bold text-[#0a1628]">{a.name}</h3>
                      {a.category && (
                        <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[a.category] || 'bg-gray-100 text-gray-700'}`}>
                          {a.category}
                        </span>
                      )}
                    </div>

                    {a.description && (
                      <p className="text-sm text-slate-600 mb-3">{a.description}</p>
                    )}

                    <div className="flex flex-wrap gap-2 text-xs text-slate-500 mb-3">
                      {a.location_city && a.location_state && (
                        <span>{a.location_city}, {a.location_state}</span>
                      )}
                      {a.season && (
                        <span>&bull; {a.season}</span>
                      )}
                      {a.residential && (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-medium">Residential</span>
                      )}
                      {a.program_duration && (
                        <span>&bull; {a.program_duration}</span>
                      )}
                    </div>

                    {a.interest_tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {a.interest_tags.map(tag => (
                          <span key={tag} className="text-xs px-2 py-0.5 bg-[#f5f0e8] text-[#91682b] rounded-full">{tag}</span>
                        ))}
                      </div>
                    )}

                    {a.url && a.link_status === 'live' && (
                      <a
                        href={a.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-sm font-semibold text-[#c88c24] hover:text-[#91682b] transition-colors"
                      >
                        Visit program &rarr;
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterSection({ title, options, selected, toggle }) {
  if (!options.length) return null;
  return (
    <div>
      <h3 className="text-sm font-semibold text-[#0a1628] mb-2">{title}</h3>
      <div className="flex flex-wrap gap-1.5">
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => toggle(opt)}
            className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
              selected.includes(opt)
                ? 'bg-[#c88c24] text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-[#c88c24]'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
