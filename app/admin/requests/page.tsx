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
  User,
  Edit,
  Trash2,
  CheckCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import ActionMenu from '@/components/ActionMenu';
import Modal from '@/components/Modal';

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

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);

  const deleteRequest = async (id: string) => {
    if (!confirm('Are you sure you want to delete this request?')) return;
    try {
      const res = await fetch(`/api/admin/requests/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setRequests(requests.filter(r => r.id !== id));
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const updateRequestStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setRequests(requests.map(r => r.id === id ? { ...r, status } : r));
      }
    } catch (err) {
      console.error('Update status failed:', err);
    }
  };

  const handleEdit = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setIsEditModalOpen(true);
  };

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
                   <button 
                     onClick={() => updateRequestStatus(request.id, 'approved')}
                     className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition-all"
                   >
                      Approve
                   </button>
                   <ActionMenu 
                     actions={[
                       { label: 'Reject Request', icon: XCircle, onClick: () => updateRequestStatus(request.id, 'rejected'), variant: 'danger' },
                       { label: 'Edit Details', icon: Edit, onClick: () => handleEdit(request) },
                       { label: 'Archive Record', icon: Trash2, onClick: () => deleteRequest(request.id), variant: 'danger' },
                     ]} 
                   />
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        title="Edit Request Details"
      >
        {selectedRequest && (
          <form className="space-y-4" onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const data = {
              type: formData.get('type') as string,
              details: formData.get('details') as string,
            };
            try {
              const res = await fetch(`/api/admin/requests/${selectedRequest.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
              });
              if (res.ok) {
                setRequests(requests.map(r => r.id === selectedRequest.id ? { ...r, ...data } : r));
                setIsEditModalOpen(false);
              }
            } catch (err) {
              console.error('Update failed:', err);
            }
          }}>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Request Type</label>
              <input name="type" defaultValue={selectedRequest.type} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:ring-2 focus:ring-indigo-500/50" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Additional Details</label>
              <textarea name="details" defaultValue={selectedRequest.details || ''} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:ring-2 focus:ring-indigo-500/50 h-24" />
            </div>
            <div className="pt-4 flex gap-3">
              <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/20">
                Save Changes
              </button>
              <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-all border border-white/10">
                Cancel
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
