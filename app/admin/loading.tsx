'use client';

import React from 'react';

export default function AdminLoading() {
  return (
    <div className="space-y-10 animate-pulse">
      <div className="space-y-4">
        <div className="h-8 w-64 bg-white/5 rounded-lg" />
        <div className="h-4 w-96 bg-white/5 rounded-lg" />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-32 bg-white/5 rounded-2xl border border-white/10" />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 h-64 bg-white/5 rounded-2xl border border-white/10" />
        <div className="h-64 bg-white/5 rounded-2xl border border-white/10" />
      </div>
    </div>
  );
}
