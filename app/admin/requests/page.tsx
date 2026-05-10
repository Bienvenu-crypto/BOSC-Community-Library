'use client';

import React, { useEffect, useState } from 'react';
import { 
  MessageSquare, 
  Search, 
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MoreVertical,
  User
} from 'lucide-react';
import { motion } from 'motion/react';

interface ServiceRequest {
  id: string;
  memberId: string;
  type: string;
  status: string;
  details: string | null;
  createdAt: string;
  member: {
    name: string;
    email: string;
  };
}

export default function RequestsManagement() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/requests')
      .then(res => res.json())
      .then(data => {
        setRequests(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch requests:', err);
        setLoading(false);
      });
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20';
      case 'rejected': return 'bg-rose-400/10 text-rose-400 border-rose-400/20';
      default: return 'bg-amber-400/10 text-amber-400 border-amber-400/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle2 className="h-3 w-3" />;
      case 'rejected': return <XCircle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

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
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
               <MessageSquare className="h-5 w-5" />
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Service Requests</h2>
          </div>
          <p className="text-slate-400">Review and respond to incoming requests from library members.</p>
        </div>
      </header>

      {/* Requests List */}
      <div className="space-y-4">
        {requests.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/10">
             <AlertCircle className="h-12 w-12 text-slate-600 mx-auto mb-4" />
             <p className="text-slate-500">No requests found.</p>
          </div>
        ) : (
          requests.map((request, i) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="h-12 w-12 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400 shrink-0">
                  <User className="h-6 w-6" />
                </div>
                <div>
                   <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-white group-hover:text-indigo-400 transition-colors">{request.member.name}</h4>
                      <span className="text-[10px] text-slate-500 font-mono tracking-tighter">({request.id.slice(-6)})</span>
                   </div>
                   <p className="text-sm text-slate-300 font-medium">{request.type}</p>
                   {request.details && (
                     <p className="text-xs text-slate-500 mt-2 line-clamp-2 italic">"{request.details}"</p>
                   )}
                </div>
              </div>

              <div className="flex items-center gap-8 shrink-0">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Received</p>
                  <p className="text-xs text-slate-300">{new Date(request.createdAt).toLocaleDateString()}</p>
                </div>
                
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusStyle(request.status)}`}>
                   {getStatusIcon(request.status)}
                   {request.status}
                </div>

                <div className="flex items-center gap-2">
                   <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition-all">
                      Respond
                   </button>
                   <button className="p-2 rounded-lg hover:bg-white/5 text-slate-500 transition-colors">
                      <MoreVertical className="h-5 w-5" />
                   </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
