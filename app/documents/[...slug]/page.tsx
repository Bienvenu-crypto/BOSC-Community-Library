import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { notFound } from 'next/navigation';
import { ArrowLeft, FileText } from 'lucide-react';

export default async function DocumentViewer({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  const { slug } = await params;
  const fileName = slug.join('/');
  const validFiles = [
    'CODE_OF_CONDUCT.md',
    'CONTRIBUTING.md',
    'LICENSE',
    'LEGAL_ANALYSIS.md',
    'SUSTAINABILITY.md',
    'REFLECTIVE_JOURNAL.md',
    'SUBMISSION_LOG.md',
  ];

  if (!validFiles.includes(fileName)) {
    notFound();
  }

  // Determine path. Root level files or in a subfolder structure if we made one, 
  // but they are all written to root '/' or their respective docs.
  let filePath = path.join(process.cwd(), fileName);
  
  if (!fs.existsSync(filePath)) {
    // try to see if it's an extensionless file like LICENSE
    filePath = path.join(process.cwd(), fileName);
    if (!fs.existsSync(filePath)) {
        notFound();
    }
  }

  const content = fs.readFileSync(filePath, 'utf8');

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-blue-900 text-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors font-medium">
            <ArrowLeft className="h-5 w-5" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-2">
             <FileText className="h-5 w-5 text-blue-400" />
             <span className="font-mono text-sm">{fileName}</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <article className="prose prose-slate prose-blue max-w-none bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200">
           {fileName === 'LICENSE' ? (
               <pre className="whitespace-pre-wrap font-mono text-xs text-slate-700 bg-slate-50 p-6 rounded-lg border border-slate-200">{content}</pre>
           ) : (
             <ReactMarkdown>{content}</ReactMarkdown>
           )}
        </article>
      </main>
    </div>
  );
}
