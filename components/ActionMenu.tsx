'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Edit, Trash2, ShieldAlert, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Action {
  label: string;
  icon: React.ElementType;
  onClick: () => void;
  variant?: 'danger' | 'default';
}

interface ActionMenuProps {
  actions: Action[];
}

export default function ActionMenu({ actions }: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`p-2 rounded-lg transition-all ${isOpen ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-800 hover:text-white'}`}
      >
        <MoreVertical className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-900 border border-white/10 shadow-2xl z-50 overflow-hidden backdrop-blur-xl"
          >
            <div className="py-1">
              {actions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => {
                    action.onClick();
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium transition-colors hover:bg-white/5 ${
                    action.variant === 'danger' ? 'text-rose-400 hover:text-rose-300' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <action.icon className="h-4 w-4" />
                  {action.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
