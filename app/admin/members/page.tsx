'use client';

import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  UserPlus,
  Edit,
  Trash2,
  ShieldAlert,
  CheckCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import ActionMenu from '@/components/ActionMenu';
import Modal from '@/components/Modal';

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  status: string;
  createdAt: string;
  _count: {
    requests: number;
  };
}

export default function MembersManagement() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/admin/members')
      .then(res => res.json())
      .then(data => {
        setMembers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch members:', err);
        setLoading(false);
      });
  }, []);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const deleteMember = async (id: string) => {
    if (!confirm('Are you sure you want to delete this member?')) return;
    try {
      const res = await fetch(`/api/admin/members/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMembers(members.filter(m => m.id !== id));
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const updateMemberStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/members/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setMembers(members.map(m => m.id === id ? { ...m, status: newStatus } : m));
      }
    } catch (err) {
      console.error('Update status failed:', err);
    }
  };

  const handleEdit = (member: Member) => {
    setSelectedMember(member);
    setIsEditModalOpen(true);
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.email.toLowerCase().includes(search.toLowerCase())
  );

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
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
               <Users className="h-5 w-5" />
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Member Directory</h2>
          </div>
          <p className="text-slate-400">Manage access and review activity for {members.length} registered users.</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 text-white font-semibold hover:bg-slate-700 transition-all border border-slate-700">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20">
            <UserPlus className="h-4 w-4" />
            <span>Invite Member</span>
          </button>
        </div>
      </header>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 h-5 w-5" />
        <input 
          type="text" 
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all"
        />
      </div>

      {/* Members Table */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Member</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Role & Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Activity</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Joined</th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredMembers.map((member, i) => (
                <motion.tr 
                  key={member.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-white/5 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-600/10">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{member.name}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <Mail className="h-3 w-3" /> {member.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1.5">
                       <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                        <ShieldCheck className="h-3 w-3" /> {member.role}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`h-1.5 w-1.5 rounded-full ${member.status === 'active' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                        <span className="text-xs text-slate-400 capitalize">{member.status}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar className="h-4 w-4" />
                      <span className="text-xs">{member._count.requests} Requests</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-slate-500">
                      {new Date(member.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ActionMenu 
                      actions={[
                        { label: 'Edit Member', icon: Edit, onClick: () => handleEdit(member) },
                        { 
                          label: member.status === 'suspended' ? 'Activate Account' : 'Suspend Account', 
                          icon: ShieldAlert, 
                          onClick: () => updateMemberStatus(member.id, member.status === 'suspended' ? 'active' : 'suspended'),
                          variant: member.status === 'suspended' ? 'default' : 'danger'
                        },
                        { label: 'Mark as Verified', icon: CheckCircle, onClick: () => updateMemberStatus(member.id, 'verified') },
                        { label: 'Delete Record', icon: Trash2, onClick: () => deleteMember(member.id), variant: 'danger' },
                      ]} 
                    />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        title="Edit Member Information"
      >
        {selectedMember && (
          <form className="space-y-4" onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const data = {
              name: formData.get('name') as string,
              email: formData.get('email') as string,
              role: formData.get('role') as string,
            };
            try {
              const res = await fetch(`/api/admin/members/${selectedMember.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
              });
              if (res.ok) {
                setMembers(members.map(m => m.id === selectedMember.id ? { ...m, ...data } : m));
                setIsEditModalOpen(false);
              }
            } catch (err) {
              console.error('Update failed:', err);
            }
          }}>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Full Name</label>
              <input name="name" defaultValue={selectedMember.name} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:ring-2 focus:ring-blue-500/50" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
              <input name="email" defaultValue={selectedMember.email} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:ring-2 focus:ring-blue-500/50" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Role</label>
              <select name="role" defaultValue={selectedMember.role} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none">
                <option value="student" className="bg-slate-900">Student</option>
                <option value="teacher" className="bg-slate-900">Teacher</option>
                <option value="researcher" className="bg-slate-900">Researcher</option>
                <option value="librarian" className="bg-slate-900">Librarian</option>
              </select>
            </div>
            <div className="pt-4 flex gap-3">
              <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20">
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
