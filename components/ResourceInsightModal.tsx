'use client';

import React from 'react';
import { 
  X, 
  ExternalLink, 
  Download, 
  Share2, 
  ShieldCheck, 
  Globe, 
  Calendar,
  Lock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Resource } from '@/data/resources';

interface ResourceInsightModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: Resource | null;
}

export default function ResourceInsightModal({ isOpen, onClose, resource }: ResourceInsightModalProps) {
  if (!resource) return null;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] overflow-hidden"
          >
            {/* Top Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 z-10 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-all active:scale-90"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header / Preview Area */}
            <div className="relative h-64 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 flex items-center justify-center overflow-hidden">
               {/* Abstract pattern */}
               <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.4)_0%,transparent_50%)]" />
                  <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.3)_0%,transparent_50%)]" />
               </div>
               
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.2 }}
                 className="relative z-10 text-center px-10"
               >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest mb-4 border border-white/20">
                    <ShieldCheck className="h-3 w-3" /> Ministry Verified
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                    {resource.title}
                  </h2>
               </motion.div>
            </div>

            {/* Content Area */}
            <div className="p-8 sm:p-10 space-y-8">
               <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 border border-blue-100 text-blue-700">
                    <Globe className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-wide">{resource.language === 'en' ? 'English' : resource.language === 'fr' ? 'French' : resource.language === 'es' ? 'Spanish' : 'Swahili'}</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-600">
                    <Calendar className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-wide">Updated May 2026</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700">
                    <Lock className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-wide">GPLv3 License</span>
                  </div>
               </div>

               <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">Resource Insight</h3>
                  <p className="text-lg text-slate-700 leading-relaxed font-medium">
                    {resource.description} This module has been audited for compliance with the National Digital Curriculum standards. It provides interactive assessments and peer-reviewed content.
                  </p>
               </div>

               {/* Governance Notice */}
               <div className="p-5 rounded-2xl bg-amber-50 border border-amber-100 flex gap-4">
                  <AlertCircle className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-amber-900">External Gateway Notice</p>
                    <p className="text-xs text-amber-700 leading-relaxed">
                      You are about to access a resource hosted on an external BOSC-partner node. Your session remains protected under our sovereign data protocols.
                    </p>
                  </div>
               </div>

               {/* Action Grid */}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <a 
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
                  >
                    <ExternalLink className="h-5 w-5" />
                    Launch Resource
                  </a>
                  <div className="flex gap-4">
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-4 rounded-2xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-all active:scale-95">
                      <Download className="h-5 w-5" />
                      <span className="hidden sm:inline">Save</span>
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-4 rounded-2xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-all active:scale-95">
                      <Share2 className="h-5 w-5" />
                      <span className="hidden sm:inline">Share</span>
                    </button>
                  </div>
               </div>
            </div>

            {/* Verification Footer */}
            <div className="px-10 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
               <div className="flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Sovereignty Assured</span>
               </div>
               <span className="text-[10px] text-slate-400 font-mono tracking-tighter">RESOURCE_UUID: {resource.id.toUpperCase()}</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
