'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Scale, Users, CheckCircle, FileText, Code } from 'lucide-react';

export default function GovernanceDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-blue-900 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
           <Link href="/" className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors font-medium">
            <ArrowLeft className="h-5 w-5" /> Back to Library Base
          </Link>
          <h1 className="text-xl font-bold tracking-tight">Project Governance Hub</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <Shield className="h-16 w-16 text-blue-600 mx-auto" />
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Open Source Compliance</h2>
          <p className="text-lg text-slate-600">
            This repository is maintained as a transparent, legally compliant open-source public good. Below you will find our core doctrines, operational strategies, and required analyses for public-sector use.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {/* Section 1 */}
           <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 mb-6">
                <Scale className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Legal & Licensing</h3>
              <p className="text-slate-600 text-sm mb-6 flex-1">
                 Our GPLv3 structure guarantees the Ministry of Education retains data sovereignty and that the software remains forever free of proprietary lockdown.
              </p>
              <div className="space-y-3 mt-auto">
                 <Link href="/documents/LICENSE" className="flex items-center text-sm font-medium text-blue-700 hover:underline">
                    <FileText className="h-4 w-4 mr-2" /> Read the License
                 </Link>
                 <Link href="/documents/LEGAL_ANALYSIS.md" className="flex items-center text-sm font-medium text-blue-700 hover:underline">
                    <FileText className="h-4 w-4 mr-2" /> Read Legal Analysis
                 </Link>
              </div>
           </div>

           {/* Section 2 */}
           <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="h-12 w-12 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 mb-6">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Community Standards</h3>
              <p className="text-slate-600 text-sm mb-6 flex-1">
                 How we organize, who we are, and technical expectations for developers looking to add functionality to the platform.
              </p>
              <div className="space-y-3 mt-auto">
                 <Link href="/documents/CODE_OF_CONDUCT.md" className="flex items-center text-sm font-medium text-indigo-700 hover:underline">
                    <FileText className="h-4 w-4 mr-2" /> Code of Conduct
                 </Link>
                 <Link href="/documents/CONTRIBUTING.md" className="flex items-center text-sm font-medium text-indigo-700 hover:underline">
                    <Code className="h-4 w-4 mr-2" /> Contribution Guide
                 </Link>
              </div>
           </div>

           {/* Section 3 */}
           <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 mb-6">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Reports & Strategy</h3>
              <p className="text-slate-600 text-sm mb-6 flex-1">
                 Formal pitches to stakeholders, financial sustainability models, and tracking of completed roadmap items.
              </p>
              <div className="space-y-3 mt-auto">
                 <Link href="/documents/SUSTAINABILITY.md" className="flex items-center text-sm font-medium text-emerald-700 hover:underline">
                    <FileText className="h-4 w-4 mr-2" /> Sustainability Pitch
                 </Link>
                 <Link href="/documents/REFLECTIVE_JOURNAL.md" className="flex items-center text-sm font-medium text-emerald-700 hover:underline">
                    <FileText className="h-4 w-4 mr-2" /> Refelctive Journal
                 </Link>
                 <Link href="/documents/SUBMISSION_LOG.md" className="flex items-center text-sm font-medium text-emerald-700 hover:underline">
                    <CheckCircle className="h-4 w-4 mr-2" /> Mastery Issues Log
                 </Link>
              </div>
           </div>
        </div>

      </main>
    </div>
  );
}
