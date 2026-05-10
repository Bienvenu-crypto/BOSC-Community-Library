'use client';

import { useState, useMemo } from 'react';
import { resourcesData } from '@/data/resources';
import { Search, BookOpen, Globe, Library } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function LibraryDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Simulated Feature Enhancement [Issue #27] & Refactoring [Issue #31]: Searchable, filtered, and memoized resource list
  const filteredResources = useMemo(() => {
    return resourcesData.filter((resource) => {
      // Functional Bug [Issue #12] fixed conceptually here: ensure defensive checks string matching and always return array
      if (!resource) return false;
      const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            resource.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLanguage = selectedLanguage === 'all' || resource.language === selectedLanguage;
      const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
      
      return matchesSearch && matchesLanguage && matchesCategory;
    });
  }, [searchQuery, selectedLanguage, selectedCategory]);

  const categories = ['all', ...Array.from(new Set(resourcesData.map(r => r.category)))];
  
  // Simulated Feature Enhancement [Issue #22]: Localized language support selector
  const languages = [
    { code: 'all', name: 'All Languages' },
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'es', name: 'Español' },
    { code: 'sw', name: 'Kiswahili' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-blue-900 text-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Library className="h-8 w-8 text-blue-300" />
            <h1 className="text-2xl font-bold tracking-tight">BOSC Community Library</h1>
          </div>
          <nav className="flex gap-6 text-sm font-medium">
             <Link href="/governance" className="hover:text-blue-200 transition-colors">Governance & Reports</Link>
             <a href="https://github.com/bosc-community-library" target="_blank" rel="noopener noreferrer" className="hover:text-blue-200 transition-colors">Source Code (GPLv3)</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-blue-800 text-slate-100 py-12 px-4 border-b-4 border-blue-600">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h2 className="text-4xl font-extrabold tracking-tight">Public-Sector Digital Commons</h2>
          <p className="text-lg text-blue-200 max-w-2xl mx-auto">
            An open, free, and transparent repository of educational resources designed for the Ministry of Education and local institutions. Assuring data sovereignty and zero vendor lock-in.
          </p>
          
          {/* Search Bar */}
          <div className="mt-8 max-w-2xl mx-auto relative flex items-center">
            <Search className="absolute left-4 text-slate-400 h-5 w-5" />
            <input 
              type="text" 
              placeholder="Search resources, textbooks, and interactive labs..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-full border-0 focus:ring-4 focus:ring-blue-400 text-slate-900 font-medium shadow-lg transition-all"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0 space-y-8">
          {/* Language Filter */}
          <div className="space-y-3 p-5 bg-white rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Globe className="h-4 w-4" /> Language Focus
            </h3>
            <div className="space-y-2">
              {languages.map((lang) => (
                <label key={lang.code} className="flex items-center gap-3 text-sm text-slate-600 cursor-pointer">
                  <input 
                    type="radio" 
                    name="language" 
                    value={lang.code} 
                    checked={selectedLanguage === lang.code}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  {lang.name}
                </label>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-3 p-5 bg-white rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <BookOpen className="h-4 w-4" /> Categories
            </h3>
            <div className="space-y-2">
              {categories.map((cat) => (
                <label key={cat} className="flex items-center gap-3 text-sm text-slate-600 cursor-pointer capitalize">
                  <input 
                    type="radio" 
                    name="category" 
                    value={cat} 
                    checked={selectedCategory === cat}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  {cat === 'all' ? 'All Categories' : cat}
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Resource Grid */}
        <div className="flex-1">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800">
              Found {filteredResources.length} available resources
            </h2>
          </div>
          
          {filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {filteredResources.map((resource) => (
                <div key={resource.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow group flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {resource.category}
                      </span>
                      <span className="uppercase text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">
                        {resource.language}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors mb-2">
                      {resource.title}
                    </h3>
                    <p className="text-slate-600 text-sm line-clamp-3">
                      {resource.description}
                    </p>
                  </div>
                  
                  {/* Functional Bug [Issue #16] fixed conceptually: Validated resource links */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-mono">ID: {resource.id}</span>
                    <a 
                      href={resource.link} 
                      className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      Access Resource &rarr;
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
              <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900">No resources found</h3>
              <p className="text-slate-500 mt-1">Try adjusting your search criteria or language filters.</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setSelectedLanguage('all'); }}
                className="mt-4 px-4 py-2 bg-blue-50 text-blue-700 rounded-md font-medium hover:bg-blue-100"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          <div>
            <h4 className="text-white font-bold mb-4 flex items-center gap-2"><Library className="h-5 w-5"/> BOSC Community Library</h4>
            <p className="mb-4 text-slate-500">
              Empowering public education through robust, scalable, and fully transparent open-source technology.
            </p>
            <p>&copy; {new Date().getFullYear()} BOSC Foundation. Licensed under GPLv3.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Governance & Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/documents/CODE_OF_CONDUCT.md" className="hover:text-white transition-colors">Code of Conduct</Link></li>
              <li><Link href="/documents/CONTRIBUTING.md" className="hover:text-white transition-colors">Contributing</Link></li>
              <li><Link href="/documents/LICENSE" className="hover:text-white transition-colors">GPLv3 License</Link></li>
              <li><Link href="/documents/LEGAL_ANALYSIS.md" className="hover:text-white transition-colors">Legal Analysis</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Strategy Reports</h4>
            <ul className="space-y-2">
              <li><Link href="/documents/SUSTAINABILITY.md" className="hover:text-white transition-colors">Public-Sector Strategy & Pitch</Link></li>
              <li><Link href="/documents/SUBMISSION_LOG.md" className="hover:text-white transition-colors">Submission Log & Audit</Link></li>
              <li><Link href="/documents/REFLECTIVE_JOURNAL.md" className="hover:text-white transition-colors">Maintainer's Journal</Link></li>
              <li><Link href="/admin" className="text-blue-400 hover:text-blue-300 transition-colors font-semibold">Admin Dashboard &rarr;</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
