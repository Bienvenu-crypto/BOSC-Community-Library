'use client';

import React, { useEffect, useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  MoreVertical,
  Globe,
  ExternalLink,
  Plus,
  Trash2,
  Edit
} from 'lucide-react';
import { motion } from 'motion/react';

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

export default function ResourcesManagement() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/admin/resources')
      .then(res => res.json())
      .then(data => {
        setResources(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch resources:', err);
        setLoading(false);
      });
  }, []);

  const filteredResources = resources.filter(r => 
    r.title.toLowerCase().includes(search.toLowerCase()) || 
    r.category.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="h-12 w-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
               <BookOpen className="h-5 w-5" />
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Resource Library</h2>
          </div>
          <p className="text-slate-400">Catalog and manage educational materials, textbooks, and digital commons.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20">
            <Plus className="h-4 w-4" />
            <span>Add New Resource</span>
          </button>
        </div>
      </header>

      {/* Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 h-5 w-5" />
          <input 
            type="text" 
            placeholder="Search resources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
           {['All', 'Math', 'Science', 'CS'].map(cat => (
             <button key={cat} className="px-4 py-2 rounded-lg bg-white/5 text-xs font-bold text-slate-400 hover:text-white transition-all border border-white/5 hover:border-emerald-500/30">
               {cat}
             </button>
           ))}
        </div>
      </div>

      {/* Resource Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredResources.map((resource, i) => (
          <motion.div
            key={resource.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
               <button className="p-2 rounded-lg bg-white/10 text-slate-300 hover:text-emerald-400">
                  <Edit className="h-4 w-4" />
               </button>
               <button className="p-2 rounded-lg bg-white/10 text-slate-300 hover:text-rose-400">
                  <Trash2 className="h-4 w-4" />
               </button>
            </div>

            <div className="flex justify-between items-start mb-4">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {resource.category}
              </span>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <Globe className="h-3 w-3" /> {resource.language}
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
              {resource.title}
            </h3>
            <p className="text-sm text-slate-400 line-clamp-2 mb-6">
              {resource.description}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex items-center gap-4">
                 <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Type</span>
                    <span className="text-xs text-slate-300 capitalize">{resource.type}</span>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Visibility</span>
                    <span className="text-xs text-slate-300">{resource.isPublic ? 'Public' : 'Internal'}</span>
                 </div>
              </div>
              <a 
                href={resource.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all shadow-lg shadow-emerald-500/0 hover:shadow-emerald-500/20"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
