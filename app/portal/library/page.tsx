'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  Globe,
  Filter,
  ExternalLink,
  Loader2
} from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  language: string;
  link: string;
  type: string;
  isPublic: boolean;
  updatedAt: string;
}

const CATEGORIES = ['All', 'Math', 'Science', 'Literature', 'History', 'Computer Science'];
const LANGUAGES: Record<string, string> = { en: 'English', fr: 'French', es: 'Spanish', sw: 'Swahili' };

export default function MemberLibrary() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    fetch('/api/portal/resources')
      .then(res => res.json())
      .then(data => {
        setResources(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Feature Enhancement #1: client-side search + category filter
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return resources.filter(r => {
      const matchesSearch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q);
      const matchesCategory =
        activeCategory === 'All' || r.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [resources, search, activeCategory]);

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
               <BookOpen className="h-5 w-5" />
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Community Library</h2>
          </div>
          <p className="text-slate-400 font-medium">Explore educational materials and digital commons.</p>
        </div>
      </header>

      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 h-5 w-5" />
            <input 
              type="text" 
              placeholder="Search the library..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all placeholder:text-slate-600"
            />
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 text-sm">
            <Filter className="h-4 w-4" />
            <span className="font-semibold">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                activeCategory === cat
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/20'
                  : 'bg-white/5 text-slate-400 border-white/10 hover:text-white hover:border-emerald-500/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
        </div>
      ) : (
        <>
          {/* Resource Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((resource) => (
              <div
                key={resource.id}
                className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all group relative overflow-hidden flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {resource.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <Globe className="h-3 w-3" />
                    {LANGUAGES[resource.language] ?? resource.language}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                  {resource.title}
                </h3>
                <p className="text-sm text-slate-400 line-clamp-2 mb-8 flex-1">
                  {resource.description}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Material Type</span>
                    <span className="text-xs text-slate-300 capitalize">{resource.type}</span>
                  </div>
                  <a
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/10 text-emerald-400 text-xs font-bold border border-emerald-600/20 hover:bg-emerald-600/20 transition-all"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Open
                  </a>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
              <BookOpen className="h-12 w-12 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">
                {resources.length === 0
                  ? 'The library is currently being updated. Check back soon!'
                  : 'No resources match your search. Try a different query or category.'}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
