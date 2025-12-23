"use client";
import React, { useState } from 'react';
import { PaperConfig } from '@/types';
import { Send, BookOpen, GraduationCap } from 'lucide-react';

interface SetupFormProps {
  onSubmit: (config: PaperConfig) => void;
}

export const SetupForm: React.FC<SetupFormProps> = ({ onSubmit }) => {
  const [grade, setGrade] = useState('');
  const [subject, setSubject] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (grade.trim() && subject.trim()) {
      onSubmit({ grade, subject });
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden animate-fade-in-up">
      <div className="bg-slate-100 p-4 border-b border-slate-200 flex items-center gap-2">
        <div className="bg-blue-600 p-1.5 rounded-md text-white">
          <BookOpen size={16} />
        </div>
        <h3 className="font-semibold text-slate-800">Exam Configuration</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
            <GraduationCap size={16} className="text-blue-500" />
            Class / Grade level
          </label>
          <input
            type="text"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            placeholder="e.g., 10th Grade, University Year 1"
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
            <BookOpen size={16} className="text-blue-500" />
            Subject
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g., Mathematics, Physics, History"
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200 shadow-md hover:shadow-lg mt-2"
        >
          <span>Initialize Session</span>
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};
