'use client';

import React, { useState } from 'react';
import { 
  Settings, 
  Shield, 
  Bell, 
  Save,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // State for settings
  const [config, setConfig] = useState({
    libraryName: 'BOSC Community Library',
    adminEmail: 'admin@bosc.library',
    phone: '+254 700 000 000',
    tfa: true,
    timeout: '2 Hours',
    emailAlerts: true,
    smsAlerts: false
  });

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1200);
  };

  const sections = [
    {
      title: 'General Configuration',
      icon: Settings,
      description: 'Global system settings and library identification.',
      fields: [
        { label: 'Library Name', value: config.libraryName, type: 'text', key: 'libraryName' },
        { label: 'Admin Email', value: config.adminEmail, type: 'email', key: 'adminEmail' },
        { label: 'Contact Phone', value: config.phone, type: 'text', key: 'phone' },
      ]
    },
    {
      title: 'Security & Access',
      icon: Shield,
      description: 'Manage authentication protocols and admin permissions.',
      fields: [
        { label: 'Two-Factor Authentication', value: config.tfa, type: 'toggle', key: 'tfa' },
        { label: 'Session Timeout', value: config.timeout, type: 'select', key: 'timeout' },
        { label: 'IP Whitelisting', value: 'Inactive', type: 'status', key: 'ip' },
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      description: 'Configure system alerts and member communication.',
      fields: [
        { label: 'Email Alerts', value: config.emailAlerts, type: 'toggle', key: 'emailAlerts' },
        { label: 'New Request SMS', value: config.smsAlerts, type: 'toggle', key: 'smsAlerts' },
      ]
    }
  ];

  return (
    <div className="space-y-8 max-w-4xl relative">
      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-10 right-10 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl bg-emerald-500 text-white shadow-2xl shadow-emerald-500/20 font-bold"
          >
            <CheckCircle2 className="h-5 w-5" />
            <span>Settings saved successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

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
                        <button 
                          onClick={() => setConfig(prev => ({ ...prev, [field.key]: !prev[field.key as keyof typeof config] }))}
                          className={`w-10 h-5 rounded-full transition-all relative ${field.value ? 'bg-blue-600' : 'bg-slate-700'}`}
                        >
                           <motion.div 
                             animate={{ x: field.value ? 20 : 0 }}
                             className="absolute top-1 left-1 w-3 h-3 rounded-full bg-white shadow-sm" 
                           />
                        </button>
                      ) : field.type === 'status' ? (
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{field.value as string}</span>
                      ) : (
                        <span className="text-sm text-slate-400">{field.value as string}</span>
                      )}
                      {field.type !== 'status' && (
                        <button 
                          onClick={() => {
                            const newVal = prompt(`Enter new value for ${field.label}:`, field.value as string);
                            if (newVal !== null) {
                              setConfig(prev => ({ ...prev, [field.key]: newVal }));
                            }
                          }}
                          className="text-xs font-bold text-blue-400 hover:text-blue-300 uppercase tracking-widest"
                        >
                          Edit
                        </button>
                      )}
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
         <button 
           onClick={handleSave}
           disabled={isSaving}
           className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed min-w-[180px] justify-center"
         >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>{isSaving ? 'Saving...' : 'Save Configuration'}</span>
         </button>
      </div>
    </div>
  );
}

