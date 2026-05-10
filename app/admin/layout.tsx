'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  MessageSquare, 
  History, 
  Settings, 
  LogOut,
  Menu,
  X,
  Library
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { name: 'Members', icon: Users, href: '/admin/members' },
    { name: 'Resources', icon: BookOpen, href: '/admin/resources' },
    { name: 'Requests', icon: MessageSquare, href: '/admin/requests' },
    { name: 'Audit Logs', icon: History, href: '/admin/logs' },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-blue-500/30">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Library className="h-6 w-6 text-blue-400" />
          <span className="font-bold text-xl tracking-tight text-white">BOSC Admin</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <AnimatePresence mode="wait">
          {isSidebarOpen && (
            <motion.aside
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className={cn(
                "fixed lg:static inset-y-0 left-0 z-40 w-72 bg-slate-900/40 backdrop-blur-xl border-r border-slate-800/50 flex flex-col h-screen transition-all duration-300",
                !isSidebarOpen && "lg:w-0 lg:overflow-hidden lg:opacity-0"
              )}
            >
              <div className="p-8">
                <Link href="/admin" className="flex items-center gap-3 group">
                  <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
                    <Library className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="font-bold text-lg text-white tracking-tight">BOSC Library</h1>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Admin Console</p>
                  </div>
                </Link>
              </div>

              <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
                <div className="px-4 py-2">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Management</p>
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all group"
                    >
                      <item.icon className="h-5 w-5 group-hover:text-blue-400 transition-colors" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  ))}
                </div>

                <div className="px-4 py-2 mt-8">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">System</p>
                  <Link
                    href="/admin/settings"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all group"
                  >
                    <Settings className="h-5 w-5 group-hover:text-blue-400 transition-colors" />
                    <span className="font-medium">Settings</span>
                  </Link>
                </div>
              </nav>

              <div className="p-6 border-t border-slate-800/50 mt-auto">
                <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-400/10 transition-all group">
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 h-screen overflow-y-auto bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="max-w-7xl mx-auto p-4 lg:p-10 relative z-10">
            {children}
          </div>
        </main>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
