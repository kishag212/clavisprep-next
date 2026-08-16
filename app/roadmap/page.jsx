'use client';

import { useState, useEffect, useMemo } from 'react';
import { createBrowserClient } from '@supabase/ssr';

export default function ActivityRoadmap() {
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [roadmapData, setRoadmapData] = useState(null); // array of month rows from DB
  const [userProfile, setUserProfile] = useState(null);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showRegenerateBanner, setShowRegenerateBanner] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [startPickerMode, setStartPickerMode] = useState(null); // 'initial' or 'regenerate'
  const [initialLoading, setInitialLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showCompleted, setShowCompleted] = useState(true);
  const [feedbackTarget, setFeedbackTarget] = useState(null);
  const [feedbackData, setFeedbackData] = useState({ status: 'completed', reflection: '', enjoyment: '3', continue_interest: 'unsure', blocker: '', evidence: '' });

  const supabase = useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ), []);

  const [formData, setFormData] = useState({
    grade: '',
    currentSchool: '',
    location: '',
    gpa: '',
    interests: '',
    targetSchools: '',
    extracurriculars: '',
    maxCommuteMiles: '',
    openToResidential: false,
    careerInterests: '',
    favoriteActivities: '',
    weeklyHours: '',
    responsibilities: '',
    leadership: '',
    achievements: '',
    strongestSubjects: '',
    hardestSubjects: '',
    testScores: '',
    collegePriorities: '',
    familyBudget: '',
    needsFinancialAid: false,
    decisionSupport: '',
    confidenceLevel: '3',
    currentChallenge: '',
    recentWin: ''
  });

  // --- Helpers ---

  function getNextMonthKey(monthKey) {
    const [year, month] = monthKey.split('-').map(Number);
    const d = new Date(year, month, 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }

  function getGraduationMonth(grade) {
    const now = new Date();
    const pastJune = now.getMonth() >= 6;
    const yearsLeft = { '8th': 4, '9th': 3, '10th': 2, '11th': 1, '12th': 0 };
    const gradYear = (pastJune ? now.getFullYear() + 1 : now.getFullYear()) + (yearsLeft[grade] ?? 0);
    return `${gradYear}-06`;
  }

  const MONTH_LABELS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  function getStartOptions() {
    const now = new Date();
    const curYear = now.getFullYear();
    const curMonth = now.getMonth(); // 0-indexed

    const fmt = (y, m) => ({
      key: `${y}-${String(m + 1).padStart(2, '0')}`,
      label: `${MONTH_LABELS[m]} ${y}`
    });

    const options = [];

    // This month
    const thisMonth = fmt(curYear, curMonth);
    options.push({ ...thisMonth, description: `Start this month (${thisMonth.label})` });

    // Next month
    const nextD = new Date(curYear, curMonth + 1, 1);
    const nextMonth = fmt(nextD.getFullYear(), nextD.getMonth());
    options.push({ ...nextMonth, description: `Start next month (${nextMonth.label})` });

    // Next summer (June) — only if before June
    if (curMonth < 5) {
      const summer = fmt(curYear, 5);
      options.push({ ...summer, description: `Start next summer (${summer.label})` });
    }

    // Next semester — Sept if before Sept, Feb if before Feb (and after Sept)
    if (curMonth < 8) {
      const fall = fmt(curYear, 8);
      options.push({ ...fall, description: `Start next semester (${fall.label})` });
    } else if (curMonth >= 8) {
      const spring = fmt(curYear + 1, 1);
      options.push({ ...spring, description: `Start next semester (${spring.label})` });
    }

    return options;
  }

  function openEditForm() {
    if (userProfile) {
      const context = userProfile.student_context || {};
      setFormData({
        grade: userProfile.grade || '',
        currentSchool: userProfile.current_school || '',
        location: userProfile.location || '',
        gpa: userProfile.gpa || '',
        interests: userProfile.interests || '',
        targetSchools: userProfile.target_schools || '',
        extracurriculars: userProfile.extracurriculars || '',
        maxCommuteMiles: userProfile.max_commute_miles ? String(userProfile.max_commute_miles) : '',
        openToResidential: userProfile.open_to_residential || false,
        careerInterests: context.career_interests || '',
        favoriteActivities: context.favorite_activities || '',
        weeklyHours: context.weekly_hours || '',
        responsibilities: context.responsibilities || '',
        leadership: context.leadership || '',
        achievements: context.achievements || '',
        strongestSubjects: context.strongest_subjects || '',
        hardestSubjects: context.hardest_subjects || '',
        testScores: context.test_scores || '',
        collegePriorities: context.college_priorities || '',
        familyBudget: context.family_budget || '',
        needsFinancialAid: context.needs_financial_aid || false,
        decisionSupport: context.decision_support || '',
        confidenceLevel: String(context.confidence_level || 3),
        currentChallenge: context.current_challenge || '',
        recentWin: context.recent_win || ''
      });
    }
    setShowProfileForm(true);
  }

  // --- Data loading ---

  async function loadUserProfile() {
    setInitialLoading(true);
    setErrorMessage('');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      window.location.replace('/login?next=/roadmap');
      return;
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!profile) {
      setShowProfileForm(true);
      setInitialLoading(false);
      return;
    }

    setUserProfile(profile);

    // Load existing roadmap months
    const { data: months } = await supabase
      .from('roadmap_activities')
      .select('*')
      .eq('user_id', user.id)
      .order('month_key', { ascending: true });

    if (months && months.length > 0) {
      setRoadmapData(months);
    } else {
      setStartPickerMode('initial');
      setShowStartPicker(true);
    }
    setInitialLoading(false);
  }

  useEffect(() => {
    loadUserProfile();
    // The browser client is memoized for the lifetime of this page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  async function parseRoadmapResponse(response) {
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.success) {
      throw new Error(data.message || data.error || 'Unable to generate your roadmap.');
    }
    return data;
  }

  async function saveProfile(e) {
    e.preventDefault();
    setLoading(true);

    setErrorMessage('');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setErrorMessage('Your session expired. Please sign in again.');
      setLoading(false);
      return;
    }

    const studentContext = {
      career_interests: formData.careerInterests,
      favorite_activities: formData.favoriteActivities,
      weekly_hours: formData.weeklyHours,
      responsibilities: formData.responsibilities,
      leadership: formData.leadership,
      achievements: formData.achievements,
      strongest_subjects: formData.strongestSubjects,
      hardest_subjects: formData.hardestSubjects,
      test_scores: formData.testScores,
      college_priorities: formData.collegePriorities,
      family_budget: formData.familyBudget,
      needs_financial_aid: formData.needsFinancialAid,
      decision_support: formData.decisionSupport,
      confidence_level: Number(formData.confidenceLevel),
      current_challenge: formData.currentChallenge,
      recent_win: formData.recentWin,
      captured_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: user.id,
        grade: formData.grade,
        current_school: formData.currentSchool,
        location: formData.location,
        gpa: formData.gpa,
        interests: formData.interests,
        target_schools: formData.targetSchools,
        extracurriculars: formData.extracurriculars,
        max_commute_miles: formData.maxCommuteMiles ? parseInt(formData.maxCommuteMiles) : null,
        open_to_residential: formData.openToResidential,
        student_context: studentContext,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) {
      console.error('Save profile error:', error);
      setErrorMessage(`Error saving profile: ${error.message}`);
      setLoading(false);
      return;
    }

    if (data) {
      const isNewUser = !userProfile;
      const fieldsToWatch = ['interests', 'target_schools', 'gpa', 'location', 'max_commute_miles', 'open_to_residential'];
      const changed = !isNewUser && (
        fieldsToWatch.some(f => String(data[f] ?? '') !== String(userProfile[f] ?? '')) ||
        JSON.stringify(data.student_context || {}) !== JSON.stringify(userProfile.student_context || {})
      );

      setUserProfile(data);
      setShowProfileForm(false);

      if (isNewUser || !roadmapData || roadmapData.length === 0) {
        setStartPickerMode('initial');
        setShowStartPicker(true);
      } else if (changed) {
        setShowRegenerateBanner(true);
      }
    }

    setLoading(false);
  }

  // --- Roadmap generation ---

  async function generateRoadmap(profile, startMonth) {
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/generate-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, startMonth, intent: 'initial' })
      });
      const data = await parseRoadmapResponse(response);
      setRoadmapData(data.months);
    } catch (error) {
      console.error('Error generating roadmap:', error);
      setErrorMessage(error.message);
    }

    setLoading(false);
  }

  function fullRegenerate() {
    setStartPickerMode('regenerate');
    setShowStartPicker(true);
  }

  async function executeFullRegenerate(startMonth) {
    setShowStartPicker(false);
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/generate-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: userProfile, startMonth, intent: 'regenerate' })
      });
      const data = await parseRoadmapResponse(response);
      setRoadmapData(data.months);
    } catch (error) {
      console.error('Error regenerating roadmap:', error);
      setErrorMessage(error.message);
    }

    setLoading(false);
  }

  async function onPickStart(startMonth) {
    if (startPickerMode === 'regenerate') {
      await executeFullRegenerate(startMonth);
    } else {
      setShowStartPicker(false);
      await generateRoadmap(userProfile, startMonth);
    }
  }

  async function regenerateFutureMonths() {
    setShowRegenerateBanner(false);
    setLoading(true);

    const now = new Date();
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Keep past and current months
    const pastMonths = roadmapData ? roadmapData.filter(m => m.month_key <= currentMonthKey) : [];

    const nextStart = getNextMonthKey(currentMonthKey);

    try {
      const response = await fetch('/api/generate-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: userProfile, startMonth: nextStart, intent: 'regenerate' })
      });
      const data = await parseRoadmapResponse(response);
      setRoadmapData([...pastMonths, ...data.months]);
    } catch (error) {
      console.error('Error regenerating future months:', error);
      setRoadmapData(pastMonths);
      setErrorMessage(error.message);
    }

    setLoading(false);
  }

  async function loadMoreMonths() {
    setLoadingMore(true);
    const lastMonth = roadmapData[roadmapData.length - 1];
    const nextStart = getNextMonthKey(lastMonth.month_key);

    try {
      const response = await fetch('/api/generate-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: userProfile, startMonth: nextStart, intent: 'extend' })
      });
      const data = await parseRoadmapResponse(response);
      setRoadmapData(prev => [...prev, ...data.months]);
    } catch (error) {
      console.error('Error loading more months:', error);
      setErrorMessage(error.message);
    }
    setLoadingMore(false);
  }

  // --- Task completion ---

  async function saveTasks(monthRow, updatedTasks) {
    setRoadmapData(prev => prev.map(m => m.id === monthRow.id ? { ...m, tasks: updatedTasks } : m));
    const { error } = await supabase.from('roadmap_activities').update({ tasks: updatedTasks }).eq('id', monthRow.id);
    if (error) {
      setRoadmapData(prev => prev.map(m => m.id === monthRow.id ? monthRow : m));
      setErrorMessage('That update could not be saved. Your previous progress was restored.');
      return false;
    }
    return true;
  }

  async function toggleTaskComplete(monthRow, taskIndex) {
    const updatedTasks = [...monthRow.tasks];
    updatedTasks[taskIndex] = {
      ...updatedTasks[taskIndex],
      completed: !updatedTasks[taskIndex].completed
    };

    await saveTasks(monthRow, updatedTasks);
  }

  function openTaskFeedback(monthRow, taskIndex, status) {
    setFeedbackTarget({ monthRow, taskIndex });
    setFeedbackData({ status, reflection: '', enjoyment: '3', continue_interest: 'unsure', blocker: '', evidence: '' });
  }

  async function submitTaskFeedback(e) {
    e.preventDefault();
    if (!feedbackTarget) return;
    const { monthRow, taskIndex } = feedbackTarget;
    const updatedTasks = [...monthRow.tasks];
    updatedTasks[taskIndex] = {
      ...updatedTasks[taskIndex],
      completed: feedbackData.status === 'completed',
      status: feedbackData.status,
      outcome: {
        reflection: feedbackData.reflection,
        enjoyment: Number(feedbackData.enjoyment),
        continue_interest: feedbackData.continue_interest,
        blocker: feedbackData.blocker,
        evidence: feedbackData.evidence,
        recorded_at: new Date().toISOString()
      }
    };
    const saved = await saveTasks(monthRow, updatedTasks);
    if (saved) setFeedbackTarget(null);
  }

  // --- Render: Profile Form ---

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" /><p className="text-gray-600">Loading your roadmap...</p></div>
      </div>
    );
  }

  if (showProfileForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {userProfile ? 'Edit Your Profile' : 'Create Your Profile'}
          </h1>
          <p className="text-gray-600 mb-8">
            Tell us about yourself so we can personalize your roadmap
          </p>

          <form onSubmit={saveProfile} className="space-y-6">
            {errorMessage && <div role="alert" className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{errorMessage}</div>}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Grade</label>
              <select
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select grade</option>
                <option value="8th">8th Grade</option>
                <option value="9th">9th Grade</option>
                <option value="10th">10th Grade</option>
                <option value="11th">11th Grade</option>
                <option value="12th">12th Grade</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current School Name</label>
              <input
                type="text"
                value={formData.currentSchool}
                onChange={(e) => setFormData({ ...formData, currentSchool: e.target.value })}
                placeholder="e.g., Orange High School"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location (City, State)</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Orange, NJ"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current GPA</label>
              <input
                type="text"
                value={formData.gpa}
                onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                placeholder="e.g., 3.8"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Academic Interests / Intended Major</label>
              <input
                type="text"
                value={formData.interests}
                onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                placeholder="e.g., Computer Science, Biology, Business"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target School Selectivity</label>
              <select
                value={formData.targetSchools}
                onChange={(e) => setFormData({ ...formData, targetSchools: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select target</option>
                <option value="Ivy League / Top 20">Ivy League / Top 20</option>
                <option value="Top 50">Top 50</option>
                <option value="Top 100">Top 100</option>
                <option value="State Universities">State Universities</option>
                <option value="Community College">Community College</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Extracurriculars</label>
              <textarea
                value={formData.extracurriculars}
                onChange={(e) => setFormData({ ...formData, extracurriculars: e.target.value })}
                placeholder="e.g., Robotics club, Varsity soccer, Volunteer at hospital"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">How far are you willing to travel for programs?</label>
              <select
                value={formData.maxCommuteMiles}
                onChange={(e) => setFormData({ ...formData, maxCommuteMiles: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Not specified</option>
                <option value="15">Up to 15 miles</option>
                <option value="30">Up to 30 miles</option>
                <option value="60">Up to 60 miles</option>
                <option value="100">Up to 100 miles</option>
                <option value="500">Any distance</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.openToResidential}
                  onChange={(e) => setFormData({ ...formData, openToResidential: e.target.checked })}
                  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Would you consider residential summer programs (away from home)?
                </span>
              </label>
            </div>

            <div className="border-t border-gray-200 pt-7">
              <h2 className="text-2xl font-bold text-gray-900">Your Student Story</h2>
              <p className="text-sm text-gray-600 mt-1">These answers help ClavisPrep learn what changes over time and recommend realistic next steps.</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              {[
                ['careerInterests', 'Career or subject interests', 'What careers or subjects currently interest you?'],
                ['favoriteActivities', 'Activities you enjoy', 'What do you enjoy doing outside school?'],
                ['weeklyHours', 'Time available each week', 'How many hours can you realistically commit?'],
                ['responsibilities', 'Work or family responsibilities', 'Jobs, caregiving, transportation, or other commitments'],
                ['leadership', 'Leadership experience', 'Roles you have held or want to pursue'],
                ['achievements', 'Achievements and projects', 'Awards, projects, certifications, or accomplishments'],
                ['strongestSubjects', 'Strongest subjects', 'Courses where you feel most confident'],
                ['hardestSubjects', 'Most challenging subjects', 'Courses where more support would help'],
                ['testScores', 'Scores and targets', 'PSAT, SAT, ACT, AP, or target scores'],
                ['decisionSupport', 'Who supports your decisions?', 'Parents, guardians, counselors, mentors, or others']
              ].map(([field, label, placeholder]) => (
                <label key={field} className="block text-sm font-medium text-gray-700">{label}
                  <textarea value={formData[field]} onChange={(e) => setFormData({ ...formData, [field]: e.target.value })} placeholder={placeholder} className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-24" />
                </label>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">What matters most in a college?</label>
              <input value={formData.collegePriorities} onChange={(e) => setFormData({ ...formData, collegePriorities: e.target.value })} placeholder="Cost, major, location, size, culture, selectivity..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <label className="block text-sm font-medium text-gray-700">Approximate annual family budget
                <input value={formData.familyBudget} onChange={(e) => setFormData({ ...formData, familyBudget: e.target.value })} placeholder="A range is fine" className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </label>
              <label className="block text-sm font-medium text-gray-700">College-prep confidence: {formData.confidenceLevel}/5
                <input type="range" min="1" max="5" value={formData.confidenceLevel} onChange={(e) => setFormData({ ...formData, confidenceLevel: e.target.value })} className="mt-4 w-full" />
              </label>
            </div>

            <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={formData.needsFinancialAid} onChange={(e) => setFormData({ ...formData, needsFinancialAid: e.target.checked })} className="h-5 w-5 rounded" /><span className="text-sm font-medium text-gray-700">We expect to need substantial financial aid</span></label>

            <div className="grid sm:grid-cols-2 gap-5">
              <label className="block text-sm font-medium text-gray-700">Current challenge
                <textarea value={formData.currentChallenge} onChange={(e) => setFormData({ ...formData, currentChallenge: e.target.value })} placeholder="What is getting in the way right now?" className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg h-24" />
              </label>
              <label className="block text-sm font-medium text-gray-700">Recent win
                <textarea value={formData.recentWin} onChange={(e) => setFormData({ ...formData, recentWin: e.target.value })} placeholder="What changed or went well this month?" className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg h-24" />
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : userProfile ? 'Save Profile' : 'Generate My Roadmap'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- Render: Start Month Picker ---

  if (showStartPicker) {
    const options = getStartOptions();
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {startPickerMode === 'regenerate' ? 'Regenerate Roadmap' : 'When should we start?'}
          </h1>
          <p className="text-gray-600 mb-6">
            Choose when to start your roadmap.
          </p>
          {errorMessage && <div role="alert" className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{errorMessage}</div>}

          <div className="space-y-3">
            {options.map(opt => (
              <button
                key={opt.key}
                onClick={() => onPickStart(opt.key)}
                className="w-full text-left px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                <span className="font-semibold text-gray-900">{opt.description}</span>
              </button>
            ))}
          </div>

          <p className="text-xs text-gray-400 mt-4">
            If today is late in a month or right before a major break, starting later gives you a full fresh block.
          </p>
        </div>
      </div>
    );
  }

  // --- Render: Loading ---

  if (loading && !roadmapData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700">Generating your personalized roadmap...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
        </div>
      </div>
    );
  }

  if (!roadmapData) {
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6"><div className="max-w-md bg-white rounded-xl shadow p-6 text-center"><p className="text-red-700 mb-4">{errorMessage || 'Your roadmap could not be loaded.'}</p><button onClick={loadUserProfile} className="px-5 py-2 bg-blue-600 text-white rounded-lg">Try again</button></div></div>;
  }

  // --- Render: Roadmap ---

  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const graduationMonth = getGraduationMonth(userProfile?.grade);
  const lastLoadedKey = roadmapData[roadmapData.length - 1]?.month_key;
  const nextMonthKey = lastLoadedKey ? getNextMonthKey(lastLoadedKey) : null;
  const hasMoreMonths = nextMonthKey && nextMonthKey <= graduationMonth;
  const categories = [...new Set(roadmapData.flatMap(month => (month.tasks || []).map(task => task.category)).filter(Boolean))].sort();
  const totalTasks = roadmapData.reduce((sum, month) => sum + (month.tasks || []).length, 0);
  const totalCompleted = roadmapData.reduce((sum, month) => sum + (month.tasks || []).filter(task => task.completed).length, 0);
  const progressPercent = totalTasks ? Math.round((totalCompleted / totalTasks) * 100) : 0;
  const activeTasks = roadmapData.flatMap(month => (month.tasks || []).map((task, taskIndex) => ({ task, taskIndex, month }))).filter(({ task }) => !task.completed && task.status !== 'skipped');
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  const nextBestAction = [...activeTasks].sort((a, b) => (priorityOrder[a.task.priority] ?? 1) - (priorityOrder[b.task.priority] ?? 1) || String(a.task.due_date || '9999').localeCompare(String(b.task.due_date || '9999')))[0];
  const pathways = [...new Set(roadmapData.flatMap(month => (month.tasks || []).map(task => task.pathway)).filter(Boolean))].slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Your College Prep Roadmap
              </h1>
              <p className="text-gray-600">
                {userProfile?.grade} &bull; {userProfile?.current_school} &bull; {userProfile?.location} &bull; {userProfile?.interests}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={openEditForm}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Edit Profile
              </button>
              <button
                onClick={fullRegenerate}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Regenerate Roadmap'}
              </button>
            </div>
          </div>

          <p className="text-sm text-gray-500">
            {roadmapData.length} months loaded &bull; Graduation: June {graduationMonth.split('-')[0]}
          </p>
        </div>

        {errorMessage && <div role="alert" className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 text-red-700 flex justify-between gap-4"><span>{errorMessage}</span><button onClick={() => setErrorMessage('')} className="font-semibold">Dismiss</button></div>}

        {nextBestAction && (
          <section className="bg-gradient-to-r from-[#0a1628] to-[#173154] text-white rounded-2xl shadow-xl p-7 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="max-w-3xl">
                <p className="text-xs uppercase tracking-[0.2em] text-amber-300 font-bold">Your next best action</p>
                <h2 className="text-3xl font-bold mt-2">{nextBestAction.task.title}</h2>
                <p className="text-slate-200 mt-2">{nextBestAction.task.description}</p>
                <div className="flex flex-wrap gap-2 mt-4 text-xs"><span className="bg-white/10 px-3 py-1 rounded-full">{nextBestAction.task.estimated_time || 'Time varies'}</span><span className="bg-white/10 px-3 py-1 rounded-full">{nextBestAction.task.estimated_cost || 'Cost varies'}</span>{nextBestAction.task.due_date && <span className="bg-white/10 px-3 py-1 rounded-full">Due {new Date(`${nextBestAction.task.due_date}T12:00:00`).toLocaleDateString()}</span>}<span className="bg-amber-300 text-slate-950 px-3 py-1 rounded-full font-bold">{nextBestAction.task.pathway || 'College readiness'}</span></div>
                <p className="mt-4 text-sm text-slate-300"><strong className="text-white">Why this:</strong> {nextBestAction.task.why_recommended}</p>
              </div>
              <div className="flex lg:flex-col gap-3 shrink-0"><button onClick={() => openTaskFeedback(nextBestAction.month, nextBestAction.taskIndex, 'completed')} className="px-5 py-3 bg-emerald-500 rounded-lg font-bold hover:bg-emerald-400">Mark complete</button><button onClick={() => openTaskFeedback(nextBestAction.month, nextBestAction.taskIndex, 'skipped')} className="px-5 py-3 bg-white/10 rounded-lg font-bold hover:bg-white/20">I can&apos;t do this</button></div>
            </div>
          </section>
        )}

        {pathways.length > 0 && <div className="bg-white rounded-xl shadow p-5 mb-6"><p className="text-sm font-bold text-gray-900">Your emerging pathways</p><div className="flex flex-wrap gap-2 mt-3">{pathways.map(pathway => <span key={pathway} className="px-3 py-2 rounded-full bg-purple-50 text-purple-800 text-sm font-semibold">{pathway}</span>)}</div></div>}

        <div className="bg-white rounded-xl shadow-lg p-5 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-2"><span className="font-semibold text-gray-800">Overall progress</span><span className="text-gray-600">{totalCompleted}/{totalTasks} tasks ({progressPercent}%)</span></div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-green-500 transition-all" style={{ width: `${progressPercent}%` }} /></div>
            </div>
            <div className="flex flex-wrap gap-3">
              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option value="all">All categories</option>
                {categories.map(category => <option key={category} value={category}>{category}</option>)}
              </select>
              <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={showCompleted} onChange={(e) => setShowCompleted(e.target.checked)} /> Show completed</label>
            </div>
          </div>
        </div>

        <div className="bg-[#0a1628] text-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-amber-300 font-bold">Living student profile</p>
              <h2 className="text-2xl font-bold mt-1">ClavisPrep learns with you</h2>
              <p className="text-slate-300 mt-2 max-w-2xl">Your interests, constraints, wins, and challenges shape the next roadmap recommendations. Update them whenever something changes.</p>
            </div>
            <button onClick={openEditForm} className="shrink-0 px-5 py-3 bg-amber-400 text-slate-950 rounded-lg font-bold hover:bg-amber-300">Monthly check-in</button>
          </div>
          <div className="grid sm:grid-cols-3 gap-3 mt-5">
            <div className="rounded-lg bg-white/10 p-4"><p className="text-xs text-slate-400">Confidence</p><p className="font-semibold mt-1">{userProfile?.student_context?.confidence_level || 'Not set'}{userProfile?.student_context?.confidence_level ? '/5' : ''}</p></div>
            <div className="rounded-lg bg-white/10 p-4"><p className="text-xs text-slate-400">Current challenge</p><p className="font-semibold mt-1 line-clamp-2">{userProfile?.student_context?.current_challenge || 'Add your current challenge'}</p></div>
            <div className="rounded-lg bg-white/10 p-4"><p className="text-xs text-slate-400">Recent win</p><p className="font-semibold mt-1 line-clamp-2">{userProfile?.student_context?.recent_win || 'Record a recent win'}</p></div>
          </div>
        </div>

        {/* Profile change banner */}
        {showRegenerateBanner && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-amber-800 font-medium">Your profile was updated. Regenerate future recommendations?</p>
            <div className="flex gap-3 shrink-0">
              <button
                onClick={() => setShowRegenerateBanner(false)}
                className="px-4 py-2 text-amber-600 hover:text-amber-800 font-medium"
              >
                Dismiss
              </button>
              <button
                onClick={regenerateFutureMonths}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
              >
                Regenerate
              </button>
            </div>
          </div>
        )}

        {/* Monthly Tasks */}
        <div className="space-y-6">
          {roadmapData.map((monthRow) => {
            const isCurrentMonth = monthRow.month_key === currentMonthKey;
            const allTasks = monthRow.tasks || [];
            const tasks = allTasks.map((task, originalIndex) => ({ ...task, originalIndex })).filter(task => (categoryFilter === 'all' || task.category === categoryFilter) && (showCompleted || !task.completed));
            const completedTasks = allTasks.filter(t => t.completed).length;

            return (
              <div
                key={monthRow.id || monthRow.month_key}
                className={`bg-white rounded-xl shadow-lg p-6 ${
                  isCurrentMonth ? 'ring-4 ring-blue-500' : ''
                }`}
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {monthRow.month_label}
                    </h2>
                    <p className="text-gray-600">{monthRow.grade} Grade</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {completedTasks}/{allTasks.length} tasks complete
                    </p>
                    {isCurrentMonth && (
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full mt-1">
                        Current Month
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div
                      key={taskIndex}
                      className={`flex items-start gap-3 p-4 rounded-lg border ${
                        task.completed
                          ? 'bg-green-50 border-green-200'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <button onClick={() => task.completed ? toggleTaskComplete(monthRow, task.originalIndex) : openTaskFeedback(monthRow, task.originalIndex, 'completed')} aria-label={task.completed ? 'Mark incomplete' : 'Complete task'} className={`mt-0.5 h-6 w-6 shrink-0 rounded-full border-2 flex items-center justify-center ${task.completed ? 'bg-green-600 border-green-600 text-white' : 'border-gray-300 bg-white'}`}>{task.completed ? '✓' : ''}</button>
                      <div className="flex-1">
                        <h3
                          className={`font-semibold ${
                            task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                          }`}
                        >
                          {task.title}
                        </h3>
                        <p
                          className={`text-sm mt-1 ${
                            task.completed ? 'text-gray-400' : 'text-gray-600'
                          }`}
                        >
                          {task.description}
                        </p>
                        <span className="inline-block mt-2 text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                          {task.category}
                        </span>
                        <span className={`inline-block mt-2 ml-2 text-xs px-2 py-1 rounded ${task.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>{task.priority || 'medium'} priority</span>
                        {task.pathway && <span className="inline-block mt-2 ml-2 text-xs px-2 py-1 rounded bg-purple-100 text-purple-700">{task.pathway}</span>}
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-gray-500"><span>Time: {task.estimated_time || 'varies'}</span><span>Cost: {task.estimated_cost || 'varies'}</span>{task.due_date && <span>Due: {new Date(`${task.due_date}T12:00:00`).toLocaleDateString()}</span>}</div>
                        {task.why_recommended && <p className="text-xs mt-3 text-indigo-700"><strong>Why this:</strong> {task.why_recommended}</p>}
                        {task.evidence && <p className="text-xs mt-2 text-gray-500"><strong>Complete by:</strong> {task.evidence}</p>}
                        {!task.completed && task.status !== 'skipped' && <div className="flex gap-2 mt-3"><button onClick={() => openTaskFeedback(monthRow, task.originalIndex, 'completed')} className="text-xs px-3 py-2 rounded bg-green-600 text-white font-semibold">I did this</button><button onClick={() => openTaskFeedback(monthRow, task.originalIndex, 'skipped')} className="text-xs px-3 py-2 rounded border border-gray-300 text-gray-700">Skip / blocked</button></div>}
                        {task.status === 'skipped' && <div className="mt-3 text-xs bg-amber-50 text-amber-800 rounded p-3"><strong>Blocked:</strong> {task.outcome?.blocker || 'No reason recorded.'}{task.alternative && <div className="mt-1"><strong>Alternative:</strong> {task.alternative}</div>}</div>}
                        {task.url && (
                          <a
                            href={task.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-2 ml-2 text-xs px-2 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                          >
                            Visit program &rarr;
                          </a>
                        )}
                        {!task.url && task.search_query && (
                          <a href={`https://www.google.com/search?q=${encodeURIComponent(task.search_query)}`} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 ml-2 text-xs px-2 py-1 rounded bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors">Find resources &rarr;</a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Load more / End of roadmap */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6 text-center">
          {hasMoreMonths ? (
            <button
              onClick={loadMoreMonths}
              disabled={loadingMore}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loadingMore ? 'Loading...' : 'Load next 6 months'}
            </button>
          ) : (
            <p className="text-gray-500 font-medium">You&apos;ve reached graduation - congrats!</p>
          )}
        </div>

        {feedbackTarget && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 p-4 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="feedback-title">
            <form onSubmit={submitTaskFeedback} className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
              <h2 id="feedback-title" className="text-2xl font-bold text-gray-900">{feedbackData.status === 'completed' ? 'Capture the outcome' : 'What got in the way?'}</h2>
              <p className="text-sm text-gray-600 mt-1 mb-5">Your answer helps ClavisPrep improve the next recommendation.</p>
              {feedbackData.status === 'completed' ? <>
                <label className="block text-sm font-medium text-gray-700 mb-4">What did you do or learn?<textarea required value={feedbackData.reflection} onChange={(e) => setFeedbackData({ ...feedbackData, reflection: e.target.value })} className="mt-2 w-full border rounded-lg p-3 h-24" /></label>
                <label className="block text-sm font-medium text-gray-700 mb-4">Evidence or result<input value={feedbackData.evidence} onChange={(e) => setFeedbackData({ ...feedbackData, evidence: e.target.value })} placeholder="Certificate, project, score, hours, link, or reflection" className="mt-2 w-full border rounded-lg p-3" /></label>
                <label className="block text-sm font-medium text-gray-700 mb-4">How much did you enjoy it? {feedbackData.enjoyment}/5<input type="range" min="1" max="5" value={feedbackData.enjoyment} onChange={(e) => setFeedbackData({ ...feedbackData, enjoyment: e.target.value })} className="mt-2 w-full" /></label>
                <label className="block text-sm font-medium text-gray-700 mb-4">Do you want to continue?<select value={feedbackData.continue_interest} onChange={(e) => setFeedbackData({ ...feedbackData, continue_interest: e.target.value })} className="mt-2 w-full border rounded-lg p-3"><option value="yes">Yes, go deeper</option><option value="unsure">Maybe</option><option value="no">No, try something else</option></select></label>
              </> : <label className="block text-sm font-medium text-gray-700 mb-4">Why could you not do this?<select required value={feedbackData.blocker} onChange={(e) => setFeedbackData({ ...feedbackData, blocker: e.target.value })} className="mt-2 w-full border rounded-lg p-3"><option value="">Choose a reason</option><option>No time</option><option>Too expensive</option><option>Transportation problem</option><option>Not interested</option><option>Missed deadline</option><option>Too difficult</option><option>Family or counselor decision</option><option>Recommendation was not relevant</option></select></label>}
              <div className="flex justify-end gap-3 mt-6"><button type="button" onClick={() => setFeedbackTarget(null)} className="px-4 py-2 border rounded-lg">Cancel</button><button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-lg font-bold">Save feedback</button></div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
