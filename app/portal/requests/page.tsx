'use client';

import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Plus, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Send,
  Loader2,
  RefreshCw,
  TriangleAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Modal from '@/components/Modal';

interface ServiceRequest {
  id: string;
  type: string;
  status: string;
  details: string | null;
  createdAt: string;
}

export default function MemberRequests() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/portal/requests')
      .then(async res => {
        if (!res.ok) throw new Error('Failed to load requests');
        return res.json();
      })
      .then(data => {
        setRequests(data);
        setLoading(false);
      })
      .catch(() => {
        setFetchError('Could not load your requests. Please refresh the page.');
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    const formData = new FormData(e.currentTarget);
    const data = {
      type: formData.get('type'),
      details: formData.get('details'),
    };

    try {
      const res = await fetch('/api/portal/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const newRequest = await res.json();
        setRequests([newRequest, ...requests]);
        setIsModalOpen(false);
      } else {
        const errorData = await res.json().catch(() => ({}));
        setSubmitError(errorData.error || 'Submission failed. Please try again.');
      }
    } catch {
      setSubmitError('Network error. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-rose-400" />;
      default: return <Clock className="h-4 w-4 text-blue-400" />;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20';
      case 'rejected': return 'bg-rose-400/10 text-rose-400 border-rose-400/20';
      default: return 'bg-blue-400/10 text-blue-400 border-blue-400/20';
    }
  };

  return (
    <div className="space-y-8">
      {fetchError && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
          <TriangleAlert className="h-5 w-5 shrink-0" />
          <span className="text-sm font-medium">{fetchError}</span>
          <button
            onClick={() => {
              setFetchError(null);
              setLoading(true);
              fetch('/api/portal/requests')
                .then(r => r.json())
                .then(d => { setRequests(d); setLoading(false); })
                .catch(() => { setFetchError('Could not load your requests. Please refresh the page.'); setLoading(false); });
            }}
            className="ml-auto flex items-center gap-1 text-xs font-bold hover:text-rose-300 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Retry
          </button>
        </div>
      )}

      <header className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
               <MessageSquare className="h-5 w-5" />
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Service Requests</h2>
          </div>
          <p className="text-slate-400 font-medium">Manage your assistance and resource requests.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-bold shadow-lg shadow-emerald-600/20 hover:scale-[1.02] transition-all"
        >
          <Plus className="h-5 w-5" />
          New Request
        </button>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
              <AlertCircle className="h-12 w-12 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">You haven't submitted any requests yet.</p>
            </div>
          ) : (
            requests.map((request, i) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h4 className="font-bold text-white text-lg">{request.type}</h4>
                    <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusStyle(request.status)}`}>
                       {getStatusIcon(request.status)}
                       {request.status}
                    </div>
                  </div>
                  <p className="text-sm text-slate-400">{request.details || 'No additional details provided.'}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Submitted On</p>
                  <p className="text-sm text-slate-300">{new Date(request.createdAt).toLocaleDateString()}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Submit New Request"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Request Type</label>
            <select 
              name="type" 
              required
              className="w-full px-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none"
            >
              <option value="Research Assistance" className="bg-slate-900">Research Assistance</option>
              <option value="Tutoring Session" className="bg-slate-900">Tutoring Session</option>
              <option value="Resource Request" className="bg-slate-900">Special Resource Request</option>
              <option value="Technical Support" className="bg-slate-900">Technical Support</option>
              <option value="Other" className="bg-slate-900">Other Inquiry</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Details & Message</label>
            <textarea 
              name="details" 
              required
              placeholder="How can we help you? Please be as specific as possible."
              className="w-full px-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:ring-2 focus:ring-emerald-500/50 h-32 resize-none placeholder:text-slate-600"
            />
          </div>
          {submitError && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
              <TriangleAlert className="h-4 w-4 shrink-0" />
              {submitError}
            </div>
          )}
          <button 
            type="submit" 
            disabled={submitting}
            className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 group hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <span>Submit Request</span>
                <Send className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </Modal>
    </div>
  );
}
