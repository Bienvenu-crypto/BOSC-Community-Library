'use client';

import React, { useEffect, useState } from 'react';
import { 
  History, 
  Terminal, 
  Clock,
  ShieldAlert,
  Search
} from 'lucide-react';
import { motion } from 'motion/react';

interface Log {
  id: string;
  action: string;
  details: string | null;
  adminId: string | null;
  createdAt: string;
}

export default function LogsManagement() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/logs')
      .then(res => res.json())
      .then(data => {
        setLogs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch logs:', err);
        setLoading(false);
      });
  }, []);

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
            <div className="p-2 rounded-lg bg-slate-500/10 text-slate-400">
               <History className="h-5 w-5" />
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Audit Trail</h2>
          </div>
          <p className="text-slate-400">System-wide logs and security event monitoring.</p>
        </div>
      </header>

      {/* Terminal Style Logs */}
      <div className="rounded-2xl border border-white/10 bg-[#020617] backdrop-blur-sm overflow-hidden shadow-2xl">
        <div className="bg-slate-900/50 px-4 py-3 border-b border-white/5 flex items-center justify-between">
           <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-slate-500" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">system.log</span>
           </div>
           <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-rose-500" />
              <div className="h-2 w-2 rounded-full bg-amber-500" />
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
           </div>
        </div>
        
        <div className="p-6 font-mono text-xs overflow-y-auto max-h-[60vh] custom-scrollbar space-y-4">
           {logs.length === 0 ? (
             <div className="text-slate-600">No logs found in current session.</div>
           ) : (
             logs.map((log, i) => (
               <motion.div 
                 key={log.id}
                 initial={{ opacity: 0, x: -5 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: i * 0.02 }}
                 className="flex gap-4 group"
               >
                 <span className="text-slate-600 shrink-0">[{new Date(log.createdAt).toLocaleTimeString()}]</span>
                 <span className={`shrink-0 font-bold ${
                   log.action.includes('CREATE') ? 'text-emerald-400' : 
                   log.action.includes('DELETE') ? 'text-rose-400' : 
                   'text-blue-400'
                 }`}>
                   {log.action}
                 </span>
                 <span className="text-slate-300 group-hover:text-white transition-colors">{log.details}</span>
                 {log.adminId && <span className="text-slate-600 italic ml-auto">(Admin: {log.adminId})</span>}
               </motion.div>
             ))
           )}
        </div>
      </div>

      <div className="flex items-center gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
         <ShieldAlert className="h-5 w-5 text-blue-400" />
         <p className="text-xs text-blue-300">
           Logs are immutable and retained for 90 days for compliance with public-sector audit requirements.
         </p>
      </div>
    </div>
  );
}
