'use client';

import React from 'react';
import { 
  Settings, 
  Shield, 
  Bell, 
  Database, 
  Globe, 
  User,
  Lock,
  Mail,
  Save
} from 'lucide-react';
import { motion } from 'motion/react';

export default function SettingsPage() {
  const sections = [
    {
      title: 'General Configuration',
      icon: Settings,
      description: 'Global system settings and library identification.',
      fields: [
        { label: 'Library Name', value: 'BOSC Community Library', type: 'text' },
        { label: 'Admin Email', value: 'admin@bosc.library', type: 'email' },
        { label: 'Contact Phone', value: '+254 700 000 000', type: 'text' },
      ]
    },
    {
      title: 'Security & Access',
      icon: Shield,
      description: 'Manage authentication protocols and admin permissions.',
      fields: [
        { label: 'Two-Factor Authentication', value: 'Enabled', type: 'toggle' },
        { label: 'Session Timeout', value: '2 Hours', type: 'select' },
        { label: 'IP Whitelisting', value: 'Inactive', type: 'status' },
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      description: 'Configure system alerts and member communication.',
      fields: [
        { label: 'Email Alerts', value: 'Active', type: 'toggle' },
        { label: 'New Request SMS', value: 'Disabled', type: 'toggle' },
      ]
    }
  ];

  return (
    <div className="space-y-8 max-w-4xl">
      <header>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
             <Settings className="h-5 w-5" />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">System Settings</h2>
        </div>
        <p className="text-slate-400">Configure your platform environment and administrative preferences.</p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {sections.map((section, i) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="p-2 rounded-lg bg-slate-800 text-slate-400">
                <section.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{section.title}</h3>
                <p className="text-sm text-slate-500">{section.description}</p>
              </div>
            </div>

            <div className="space-y-4">
               {section.fields.map((field) => (
                 <div key={field.label} className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-t border-white/5 gap-2">
                   <span className="text-sm font-medium text-slate-300">{field.label}</span>
                   <div className="flex items-center gap-4">
                      {field.type === 'toggle' ? (
                        <button className={`w-10 h-5 rounded-full transition-colors relative ${field.value === 'Enabled' || field.value === 'Active' ? 'bg-blue-600' : 'bg-slate-700'}`}>
                           <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${field.value === 'Enabled' || field.value === 'Active' ? 'right-1' : 'left-1'}`} />
                        </button>
                      ) : field.type === 'status' ? (
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{field.value}</span>
                      ) : (
                        <span className="text-sm text-slate-400">{field.value}</span>
                      )}
                      <button className="text-xs font-bold text-blue-400 hover:text-blue-300 uppercase tracking-widest">Edit</button>
                   </div>
                 </div>
               ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center justify-end gap-4 pt-6">
         <button className="px-6 py-3 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10 transition-all border border-white/10">
            Discard Changes
         </button>
         <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 active:scale-95">
            <Save className="h-4 w-4" />
            <span>Save Configuration</span>
         </button>
      </div>
    </div>
  );
}
