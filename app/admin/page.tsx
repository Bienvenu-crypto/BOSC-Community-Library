'use client';

import React, { useEffect, useState } from 'react';
import { 
  Users, 
  BookOpen, 
  MessageSquare, 
  Activity,
  TrendingUp,
  ArrowRight,
  Plus
} from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';

interface Stats {
  members: number;
  resources: number;
  totalRequests: number;
  pendingRequests: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch stats:', err);
        setLoading(false);
      });
  }, []);

  const statCards = [
    { label: 'Total Members', value: stats?.members || 0, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Active Resources', value: stats?.resources || 0, icon: BookOpen, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Service Requests', value: stats?.totalRequests || 0, icon: MessageSquare, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
    { label: 'Pending Actions', value: stats?.pendingRequests || 0, icon: Activity, color: 'text-rose-400', bg: 'bg-rose-400/10' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="h-12 w-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">System Overview</h2>
          <p className="text-slate-400 mt-1">Welcome back, Admin. Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 active:scale-95">
            <Plus className="h-4 w-4" />
            <span>Add Resource</span>
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                <TrendingUp className="h-3 w-3" />
                +12%
              </div>
            </div>
            <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold text-white mt-1 tracking-tight">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Quick Actions / Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white tracking-tight">Recent Requests</h3>
              <Link href="/admin/requests" className="text-sm font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
           </div>
           
           <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
              <div className="divide-y divide-white/10">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="p-4 hover:bg-white/5 transition-colors flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 font-bold">
                        JD
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">John Doe</h4>
                        <p className="text-xs text-slate-500">Resource Access Request</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">Pending</p>
                      <p className="text-[10px] text-slate-500 mt-1">2 hours ago</p>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </div>

        {/* System Health */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white tracking-tight">System Status</h3>
          <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/20 backdrop-blur-sm space-y-6">
             <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Database Connection</span>
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
             </div>
             <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">File Storage</span>
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
             </div>
             <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">API Latency</span>
                <span className="text-xs font-mono text-emerald-400">12ms</span>
             </div>
             <div className="pt-4 border-t border-white/10">
                <p className="text-xs text-slate-400 leading-relaxed">
                   All systems are currently operational. Next scheduled maintenance in 4 days.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
