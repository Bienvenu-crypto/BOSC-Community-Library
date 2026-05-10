'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Library, 
  LayoutDashboard, 
  BookOpen, 
  MessageSquare, 
  User, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isAuthPage = pathname === '/portal/login' || pathname === '/portal/signup';

  if (isAuthPage) {
    return <>{children}</>;
  }

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/portal' },
    { name: 'Library', icon: BookOpen, href: '/portal/library' },
    { name: 'My Requests', icon: MessageSquare, href: '/portal/requests' },
    { name: 'Profile', icon: User, href: '/portal/profile' },
  ];

  const handleLogout = async () => {
    await fetch('/api/auth/member/logout', { method: 'POST' });
    router.push('/portal/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans">
      {/* Mobile Nav */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-slate-900/50 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center">
            <Library className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-lg text-white">BOSC Portal</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-400">
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className={cn(
          "fixed lg:static inset-y-0 left-0 z-40 w-64 bg-slate-900/50 backdrop-blur-xl border-r border-white/5 flex flex-col h-screen transition-transform duration-300 lg:translate-x-0",
          !isSidebarOpen && "-translate-x-full lg:translate-x-0"
        )}>
          <div className="p-8 hidden lg:block">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Library className="h-6 w-6 text-white" />
              </div>
              <h1 className="font-bold text-xl text-white tracking-tight">BOSC Portal</h1>
            </div>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
                  pathname === item.href 
                    ? "bg-emerald-600/10 text-emerald-400 border border-emerald-500/20" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className={cn("h-5 w-5", pathname === item.href ? "text-emerald-400" : "group-hover:text-emerald-400 transition-colors")} />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="p-6 border-t border-white/5">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-400/10 transition-all group"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 h-screen overflow-y-auto relative">
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-600/5 blur-[120px] rounded-full pointer-events-none" />
           <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
           
           <div className="max-w-6xl mx-auto p-6 lg:p-12 relative z-10">
              {children}
           </div>
        </main>
      </div>
    </div>
  );
}
