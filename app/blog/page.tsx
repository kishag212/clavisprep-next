"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Search, Calendar, Clock, TrendingUp, ChevronDown, BookOpen, Target, DollarSign, PenTool } from "lucide-react";

const BLOG_POSTS = [
  {
    id: 1,
    title: "How to Build the Perfect College List: Reach, Match, and Safety Schools Explained",
    excerpt: "Learn the art of balancing your college list with the right mix of reach, match, and safety schools. We break down the strategy that gets students accepted.",
    category: "College Selection",
    author: "Sarah Chen",
    authorRole: "College Counselor",
    date: "April 8, 2026",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
    featured: true,
  },
  {
    id: 2,
    title: "The Common App Essay Prompts 2026-2027: Complete Guide with Examples",
    excerpt: "All seven Common App essay prompts explained with real examples from successful applicants. Plus tips on choosing the right prompt for your story.",
    category: "Essays",
    author: "Marcus Johnson",
    authorRole: "Essay Coach",
    date: "April 5, 2026",
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80",
    featured: true,
  },
  {
    id: 3,
    title: "Understanding Your Expected Family Contribution (EFC): A Complete Guide",
    excerpt: "Demystifying the EFC calculation and what it means for your financial aid package.",
    category: "Financial Aid",
    author: "Jennifer Park",
    authorRole: "Financial Aid Expert",
    date: "April 3, 2026",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
    featured: false,
  },
  {
    id: 4,
    title: "College Application Timeline: When to Do What",
    excerpt: "A comprehensive year-by-year roadmap for high school students.",
    category: "Planning",
    author: "David Martinez",
    authorRole: "College Counselor",
    date: "April 1, 2026",
    readTime: "15 min read",
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&q=80",
    featured: false,
  },
  {
    id: 5,
    title: "How I Got Into Stanford: A Complete Strategy",
    excerpt: "One student's journey from 3.7 GPA to Stanford acceptance.",
    category: "Success Stories",
    author: "Alex Kim",
    authorRole: "Stanford '28",
    date: "March 28, 2026",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80",
    featured: false,
  },
];

const CATEGORIES = [
  { name: "All Posts", icon: BookOpen, count: 5 },
  { name: "College Selection", icon: Target, count: 1 },
  { name: "Essays", icon: PenTool, count: 1 },
  { name: "Financial Aid", icon: DollarSign, count: 1 },
  { name: "Success Stories", icon: TrendingUp, count: 1 },
];

export default function Blog() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Posts");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleComingSoon = (e: React.MouseEvent) => {
    e.preventDefault();
    alert("🚀 Coming Soon!\n\nClavisPrep launches April 2026.");
  };

  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesCategory = selectedCategory === "All Posts" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = BLOG_POSTS.filter(post => post.featured);

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
              <Link href="/blog" className="text-sm font-medium text-[#0a1628] border-b-2 border-[#c88c24]">Blog</Link>
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
                <Link href="/blog" className="text-sm font-medium text-[#0a1628] px-4 py-2">Blog</Link>
                <a href="#" onClick={handleComingSoon} className="mx-4 px-5 py-2.5 bg-gradient-to-r from-[#c88c24] to-[#91682b] text-white text-sm font-semibold rounded-lg text-center">Get Started Free</a>
              </div>
            </div>
          )}
        </div>
      </nav>

      <section className="relative pt-48 pb-20 lg:pt-56 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] to-[#0a1628]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#c88c24]/20 via-transparent to-transparent" />
        <div className="relative max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="font-serif text-5xl lg:text-7xl font-bold text-white leading-tight mb-6">College Prep Insights</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10">Expert advice on college applications, essays, financial aid, and everything you need to get accepted to your dream school.</p>
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="text" placeholder="Search articles..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl text-[#0a1628] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#c88c24] focus:border-transparent" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-12">
            <TrendingUp className="w-6 h-6 text-[#c88c24]" />
            <h2 className="font-serif text-3xl font-bold text-[#0a1628]">Featured Articles</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {featuredPosts.map((post) => (
              <a key={post.id} href="#" onClick={handleComingSoon} className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                <div className="aspect-video overflow-hidden bg-slate-100">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="inline-block px-3 py-1 bg-gradient-to-r from-[#c88c24] to-[#91682b] text-white text-xs font-bold rounded-full">{post.category}</span>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {post.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {post.readTime}
                      </div>
                    </div>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#0a1628] mb-3 group-hover:text-[#c88c24] transition-colors">{post.title}</h3>
                  <p className="text-slate-600 leading-relaxed mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div>
                      <div className="font-semibold text-sm text-[#0a1628]">{post.author}</div>
                      <div className="text-xs text-slate-500">{post.authorRole}</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-[#c88c24] group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-[#f5f0e8] border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-4">
            {CATEGORIES.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.name;
              return (
                <button key={category.name} onClick={() => setSelectedCategory(category.name)} className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all ${isActive ? "bg-gradient-to-r from-[#c88c24] to-[#91682b] text-white shadow-lg" : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"}`}>
                  <Icon className="w-4 h-4" />
                  {category.name}
                  <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${isActive ? "bg-white/20" : "bg-slate-100"}`}>{category.count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="font-serif text-3xl font-bold text-[#0a1628] mb-2">{selectedCategory === "All Posts" ? "All Articles" : selectedCategory}</h2>
            <p className="text-slate-600">{filteredPosts.length} {filteredPosts.length === 1 ? "article" : "articles"} found</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <a key={post.id} href="#" onClick={handleComingSoon} className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                <div className="aspect-video overflow-hidden bg-slate-100">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-block px-3 py-1 bg-[#f5f0e8] text-[#c88c24] text-xs font-bold rounded-full">{post.category}</span>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </div>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#0a1628] mb-2 group-hover:text-[#c88c24] transition-colors line-clamp-2">{post.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="text-xs text-slate-500">{post.date}</div>
                    <ArrowRight className="w-4 h-4 text-[#c88c24] group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </a>
            ))}
          </div>
          {filteredPosts.length === 0 && (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="font-serif text-2xl font-bold text-[#0a1628] mb-2">No articles found</h3>
              <p className="text-slate-600">Try a different search term or category</p>
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
              <Link href="/blog" className="text-sm text-[#e7bf69]">Blog</Link>
              <a href="#colleges" className="text-sm text-slate-400 hover:text-[#e7bf69] transition-colors">Colleges</a>
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