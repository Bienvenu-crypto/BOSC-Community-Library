import React from 'react';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { 
  BookOpen, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

async function getMemberStats(memberId: string) {
  const stats = await prisma.request.groupBy({
    by: ['status'],
    where: { memberId },
    _count: true
  });

  return {
    pending: stats.find(s => s.status === 'pending')?._count || 0,
    approved: stats.find(s => s.status === 'approved')?._count || 0,
  };
}

export default async function MemberDashboard() {
  const session = await getSession('member');
  const stats = await getMemberStats(session.id);

  const recentResources = await prisma.resource.findMany({
    where: { isPublic: true },
    orderBy: { updatedAt: 'desc' },
    take: 3
  });

  return (
    <div className="space-y-10">
      <header>
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="h-6 w-6 text-emerald-400" />
          <h2 className="text-3xl font-bold text-white tracking-tight">Welcome back, {session.name}</h2>
        </div>
        <p className="text-slate-400 font-medium">Here's what's happening in your library account.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-emerald-600/10 border border-emerald-500/20 backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <CheckCircle2 className="h-24 w-24 text-emerald-400" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-1">Approved Requests</p>
            <h3 className="text-4xl font-black text-white">{stats.approved}</h3>
            <p className="text-xs text-slate-400 mt-4 font-medium">Resources successfully accessed</p>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-blue-600/10 border border-blue-500/20 backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Clock className="h-24 w-24 text-blue-400" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-1">Pending Requests</p>
            <h3 className="text-4xl font-black text-white">{stats.pending}</h3>
            <p className="text-xs text-slate-400 mt-4 font-medium">Awaiting administrator review</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Recent Resources */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Latest Resources</h3>
            <Link href="/portal/library" className="text-sm text-emerald-400 font-bold hover:underline flex items-center gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {recentResources.map(resource => (
              <div key={resource.id} className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center text-emerald-400">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white group-hover:text-emerald-400 transition-colors">{resource.title}</h4>
                    <p className="text-xs text-slate-500">{resource.category} • {resource.language}</p>
                  </div>
                </div>
                <Link href={resource.link} target="_blank" className="p-2 rounded-full bg-white/5 text-slate-400 hover:text-white transition-colors">
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white">Quick Actions</h3>
          <div className="space-y-3">
             <Link href="/portal/requests" className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                <MessageSquare className="h-5 w-5" />
                New Service Request
             </Link>
             <Link href="/portal/library" className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all">
                <BookOpen className="h-5 w-5 text-emerald-400" />
                Browse Library
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
