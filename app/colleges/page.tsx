"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Search, Filter, MapPin, GraduationCap, ChevronDown, X } from "lucide-react";

const COLLEGES = [
  {
    id: 1,
    name: "Stanford University",
    location: "Stanford, CA",
    type: "Private",
    size: "Medium (7,000-15,000)",
    acceptanceRate: 4,
    tuition: "$58,416",
    selectivity: "Most Selective",
    setting: "Suburban",
    image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&q=80",
    rank: 3,
  },
  {
    id: 2,
    name: "Harvard University",
    location: "Cambridge, MA",
    type: "Private",
    size: "Medium (7,000-15,000)",
    acceptanceRate: 3,
    tuition: "$57,261",
    selectivity: "Most Selective",
    setting: "Urban",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
    rank: 1,
  },
  {
    id: 3,
    name: "MIT",
    location: "Cambridge, MA",
    type: "Private",
    size: "Small (<7,000)",
    acceptanceRate: 4,
    tuition: "$59,750",
    selectivity: "Most Selective",
    setting: "Urban",
    image: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=800&q=80",
    rank: 2,
  },
  {
    id: 4,
    name: "UC Berkeley",
    location: "Berkeley, CA",
    type: "Public",
    size: "Large (15,000+)",
    acceptanceRate: 14,
    tuition: "$14,253 (in-state)",
    selectivity: "Most Selective",
    setting: "Urban",
    image: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80",
    rank: 15,
  },
  {
    id: 5,
    name: "Yale University",
    location: "New Haven, CT",
    type: "Private",
    size: "Medium (7,000-15,000)",
    acceptanceRate: 5,
    tuition: "$62,250",
    selectivity: "Most Selective",
    setting: "Urban",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
    rank: 5,
  },
  {
    id: 6,
    name: "Princeton University",
    location: "Princeton, NJ",
    type: "Private",
    size: "Small (<7,000)",
    acceptanceRate: 4,
    tuition: "$59,710",
    selectivity: "Most Selective",
    setting: "Suburban",
    image: "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=800&q=80",
    rank: 1,
  },
  {
    id: 7,
    name: "University of Michigan",
    location: "Ann Arbor, MI",
    type: "Public",
    size: "Large (15,000+)",
    acceptanceRate: 18,
    tuition: "$17,786 (in-state)",
    selectivity: "Very Selective",
    setting: "Urban",
    image: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=800&q=80",
    rank: 21,
  },
  {
    id: 8,
    name: "Duke University",
    location: "Durham, NC",
    type: "Private",
    size: "Medium (7,000-15,000)",
    acceptanceRate: 6,
    tuition: "$63,450",
    selectivity: "Most Selective",
    setting: "Suburban",
    image: "https://images.unsplash.com/photo-1607013251379-e6eecfffe234?w=800&q=80",
    rank: 7,
  },
  {
    id: 9,
    name: "Northwestern University",
    location: "Evanston, IL",
    type: "Private",
    size: "Medium (7,000-15,000)",
    acceptanceRate: 7,
    tuition: "$63,468",
    selectivity: "Most Selective",
    setting: "Suburban",
    image: "https://images.unsplash.com/photo-1576495199011-eb94736d05d6?w=800&q=80",
    rank: 9,
  },
  {
    id: 10,
    name: "UCLA",
    location: "Los Angeles, CA",
    type: "Public",
    size: "Large (15,000+)",
    acceptanceRate: 9,
    tuition: "$13,804 (in-state)",
    selectivity: "Most Selective",
    setting: "Urban",
    image: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=800&q=80",
    rank: 20,
  },
  {
    id: 11,
    name: "Columbia University",
    location: "New York, NY",
    type: "Private",
    size: "Medium (7,000-15,000)",
    acceptanceRate: 4,
    tuition: "$66,139",
    selectivity: "Most Selective",
    setting: "Urban",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
    rank: 12,
  },
  {
    id: 12,
    name: "University of Virginia",
    location: "Charlottesville, VA",
    type: "Public",
    size: "Large (15,000+)",
    acceptanceRate: 19,
    tuition: "$19,698 (in-state)",
    selectivity: "Very Selective",
    setting: "Suburban",
    image: "https://images.unsplash.com/photo-1607013251379-e6eecfffe234?w=800&q=80",
    rank: 24,
  },
];

const FILTERS = {
  type: ["All", "Private", "Public"],
  size: ["All", "Small (<7,000)", "Medium (7,000-15,000)", "Large (15,000+)"],
  selectivity: ["All", "Most Selective", "Very Selective", "Selective", "Less Selective"],
  setting: ["All", "Urban", "Suburban", "Rural"],
  region: ["All", "Northeast", "South", "Midwest", "West"],
};

export default function Colleges() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("rank");
  
  const [filters, setFilters] = useState({
    type: "All",
    size: "All",
    selectivity: "All",
    setting: "All",
    region: "All",
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleComingSoon = (e: React.MouseEvent) => {
    e.preventDefault();
    alert("🚀 Coming Soon!\n\nClavisPrep launches April 2026.\nFull college database will be available soon!");
  };

  const handleFilterChange = (category: string, value: string) => {
    setFilters({ ...filters, [category]: value });
  };

  const clearFilters = () => {
    setFilters({
      type: "All",
      size: "All",
      selectivity: "All",
      setting: "All",
      region: "All",
    });
    setSearchQuery("");
  };

  const filteredColleges = COLLEGES.filter(college => {
    const matchesSearch = college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         college.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filters.type === "All" || college.type === filters.type;
    const matchesSize = filters.size === "All" || college.size === filters.size;
    const matchesSelectivity = filters.selectivity === "All" || college.selectivity === filters.selectivity;
    const matchesSetting = filters.setting === "All" || college.setting === filters.setting;
    
    return matchesSearch && matchesType && matchesSize && matchesSelectivity && matchesSetting;
  }).sort((a, b) => {
    if (sortBy === "rank") return a.rank - b.rank;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "acceptance") return a.acceptanceRate - b.acceptanceRate;
    return 0;
  });

  const activeFilterCount = Object.values(filters).filter(v => v !== "All").length;

  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-40">
            <Link href="/" className="flex items-center gap-2 group">
              <img src="/logo.png" alt="ClavisPrep Logo" className="h-40 w-auto group-hover:scale-105 transition-transform" />
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/#features" className="text-sm font-medium text-slate-600 hover:text-[#0a1628] transition-colors">Features</Link>
              <Link href="/how-it-works" className="text-sm font-medium text-slate-600 hover:text-[#0a1628] transition-colors">How It Works</Link>
              <Link href="/pricing" className="text-sm font-medium text-slate-600 hover:text-[#0a1628] transition-colors">Pricing</Link>
              <Link href="/blog" className="text-sm font-medium text-slate-600 hover:text-[#0a1628] transition-colors">Blog</Link>
              <a href="#" onClick={handleComingSoon} className="px-5 py-2 bg-gradient-to-r from-[#c88c24] to-[#91682b] text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-1.5">
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-slate-600 hover:text-[#0a1628]">
              <ChevronDown className={`w-5 h-5 transition-transform ${mobileMenuOpen ? "rotate-180" : ""}`} />
            </button>
          </div>
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-200 bg-white/95 backdrop-blur-xl">
              <div className="flex flex-col gap-3">
                <Link href="/#features" className="text-sm font-medium text-slate-600 hover:text-[#0a1628] px-4 py-2">Features</Link>
                <Link href="/how-it-works" className="text-sm font-medium text-slate-600 hover:text-[#0a1628] px-4 py-2">How It Works</Link>
                <Link href="/pricing" className="text-sm font-medium text-slate-600 hover:text-[#0a1628] px-4 py-2">Pricing</Link>
                <Link href="/blog" className="text-sm font-medium text-slate-600 hover:text-[#0a1628] px-4 py-2">Blog</Link>
                <a href="#" onClick={handleComingSoon} className="mx-4 px-5 py-2.5 bg-gradient-to-r from-[#c88c24] to-[#91682b] text-white text-sm font-semibold rounded-lg text-center">Get Started Free</a>
              </div>
            </div>
          )}
        </div>
      </nav>

      <section className="relative pt-48 pb-16 lg:pt-56 lg:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] to-[#0a1628]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#c88c24]/20 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="font-serif text-5xl lg:text-7xl font-bold text-white leading-tight mb-6">Explore 300+ Colleges</h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">Search our comprehensive database of colleges and universities. Filter by location, size, selectivity, and more to find your perfect match.</p>
          </div>
          <div className="max-w-3xl">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="text" placeholder="Search colleges by name or location..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl text-[#0a1628] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#c88c24] focus:border-transparent" />
              </div>
              <button onClick={() => setShowFilters(!showFilters)} className="px-6 py-4 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl hover:bg-white transition-colors flex items-center gap-2 font-semibold text-[#0a1628]">
                <Filter className="w-5 h-5" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-gradient-to-r from-[#c88c24] to-[#91682b] text-white text-xs font-bold rounded-full">{activeFilterCount}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {showFilters && (
        <section className="py-6 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-[#0a1628]">Filter Results</h3>
              <div className="flex items-center gap-3">
                <button onClick={clearFilters} className="text-sm text-slate-600 hover:text-[#0a1628] font-medium flex items-center gap-1">
                  <X className="w-4 h-4" />
                  Clear All
                </button>
                <button onClick={() => setShowFilters(false)} className="text-sm text-slate-600 hover:text-[#0a1628] font-medium">Close</button>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
              {Object.entries(FILTERS).map(([category, options]) => (
                <div key={category}>
                  <label className="block text-sm font-semibold text-[#0a1628] mb-2 capitalize">{category}</label>
                  <select value={filters[category as keyof typeof filters]} onChange={(e) => handleFilterChange(category, e.target.value)} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c88c24] focus:border-transparent">
                    {options.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-6 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-[#0a1628] font-semibold">{filteredColleges.length} {filteredColleges.length === 1 ? "College" : "Colleges"} Found</p>
              <p className="text-sm text-slate-600">Showing results for your search</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Sort by:</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#c88c24] focus:border-transparent">
                <option value="rank">Ranking</option>
                <option value="name">Name (A-Z)</option>
                <option value="acceptance">Acceptance Rate</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredColleges.map((college) => (
              <a key={college.id} href="#" onClick={handleComingSoon} className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                <div className="aspect-video overflow-hidden bg-slate-100">
                  <img src={college.image} alt={college.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-[#0a1628] mb-1 group-hover:text-[#c88c24] transition-colors">{college.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-slate-600">
                        <MapPin className="w-4 h-4" />
                        {college.location}
                      </div>
                    </div>
                    <div className="px-2 py-1 bg-gradient-to-r from-[#c88c24] to-[#91682b] text-white text-xs font-bold rounded">#{college.rank}</div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Type:</span>
                      <span className="font-medium text-[#0a1628]">{college.type}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Size:</span>
                      <span className="font-medium text-[#0a1628]">{college.size.split(" ")[0]}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Acceptance:</span>
                      <span className="font-medium text-[#0a1628]">{college.acceptanceRate}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Tuition:</span>
                      <span className="font-medium text-[#0a1628]">{college.tuition.split(",")[0]}</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#c88c24] uppercase tracking-wide">{college.selectivity}</span>
                    <ArrowRight className="w-5 h-5 text-[#c88c24] group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </a>
            ))}
          </div>

          {filteredColleges.length === 0 && (
            <div className="text-center py-20">
              <GraduationCap className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="font-serif text-2xl font-bold text-[#0a1628] mb-2">No colleges found</h3>
              <p className="text-slate-600 mb-6">Try adjusting your search or filters</p>
              <button onClick={clearFilters} className="px-6 py-3 bg-gradient-to-r from-[#c88c24] to-[#91682b] text-white font-semibold rounded-lg hover:shadow-lg transition-all">Clear All Filters</button>
            </div>
          )}

          {filteredColleges.length > 0 && (
            <div className="mt-16 text-center">
              <p className="text-slate-600 mb-6">This is a preview of our college database. The full version includes 300+ schools with detailed information.</p>
              <a href="#" onClick={handleComingSoon} className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#c88c24] to-[#91682b] text-white font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all">
                Access Full Database
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          )}
        </div>
      </section>

      <footer className="bg-[#0a1628] border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="ClavisPrep Logo" className="h-12 w-auto" />
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <Link href="/#features" className="text-sm text-slate-400 hover:text-[#e7bf69] transition-colors">Features</Link>
              <Link href="/how-it-works" className="text-sm text-slate-400 hover:text-[#e7bf69] transition-colors">How It Works</Link>
              <Link href="/pricing" className="text-sm text-slate-400 hover:text-[#e7bf69] transition-colors">Pricing</Link>
              <Link href="/blog" className="text-sm text-slate-400 hover:text-[#e7bf69] transition-colors">Blog</Link>
              <a href="#terms" className="text-sm text-slate-400 hover:text-[#e7bf69] transition-colors">Terms</a>
              <a href="#privacy" className="text-sm text-slate-400 hover:text-[#e7bf69] transition-colors">Privacy</a>
            </div>
          </div>
          <div className="text-center text-sm text-slate-500 border-t border-slate-800 pt-8">© 2026 ClavisPrep · The key to your college future</div>
        </div>
      </footer>

    </div>
  );
}