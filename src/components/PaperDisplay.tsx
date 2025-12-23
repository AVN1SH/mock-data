"use client";
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { FileText, Download, Copy } from 'lucide-react';
import { PaperConfig } from '@/types';

interface PaperDisplayProps {
  content: string;
  config: PaperConfig;
  isLoading: boolean;
}

export const PaperDisplay: React.FC<PaperDisplayProps> = ({ content, config, isLoading }) => {
  
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
  };

  if (!content && !isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center border-r border-slate-200 bg-white">
        <div className="bg-slate-50 p-6 rounded-full mb-4">
          <FileText size={48} className="text-slate-300" />
        </div>
        <h3 className="text-lg font-medium text-slate-600 mb-2">No Paper Generated Yet</h3>
        <p className="max-w-xs">Chat with the AI on the right to start building your question paper for {config.grade} - {config.subject}.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white border-r border-slate-200 shadow-sm relative">
      {/* Header */}
      <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between bg-white z-10">
        <div>
           <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
             <FileText className="text-indigo-600" size={20}/>
             Generated Paper
           </h2>
           <p className="text-xs text-slate-500 font-medium">{config.grade} • {config.subject}</p>
        </div>
        <div className="flex gap-2">
           <button onClick={handleCopy} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors" title="Copy Text">
             <Copy size={18} />
           </button>
           <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors" title="Download PDF (Demo)">
             <Download size={18} />
           </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
        <div className="bg-white shadow-sm border border-slate-200 min-h-[800px] p-8 max-w-3xl mx-auto rounded-sm">
             {isLoading && !content && (
                 <div className="animate-pulse space-y-4">
                     <div className="h-8 bg-slate-200 rounded w-1/3 mx-auto mb-8"></div>
                     <div className="h-4 bg-slate-200 rounded w-full"></div>
                     <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                     <div className="h-4 bg-slate-200 rounded w-4/6"></div>
                 </div>
             )}
             
             {content && (
                <article className="prose prose-slate max-w-none prose-headings:font-bold prose-h1:text-center prose-h1:text-2xl prose-h2:text-xl prose-h2:mt-6 prose-p:text-slate-700">
                    <ReactMarkdown>{content}</ReactMarkdown>
                </article>
             )}
        </div>
      </div>
    </div>
  );
};
