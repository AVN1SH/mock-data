"use client";
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message, MessageRole } from '@/types';
import { Bot, User, AlertCircle } from 'lucide-react';

interface ChatBubbleProps {
  message: Message;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isBot = message.role === MessageRole.BOT;
  const isError = message.isError;

  return (
    <div className={`flex w-full ${isBot ? 'justify-start' : 'justify-end'} mb-4 animate-fade-in`}>
      <div className={`flex max-w-[85%] ${isBot ? 'flex-row' : 'flex-row-reverse'} gap-3`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
          isBot ? 'bg-indigo-100 text-indigo-600' : 'bg-blue-600 text-white'
        }`}>
          {isBot ? <Bot size={18} /> : <User size={18} />}
        </div>

        {/* Bubble */}
        <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
          isBot 
            ? 'bg-white text-slate-700 rounded-tl-none border border-slate-100' 
            : 'bg-blue-600 text-white rounded-tr-none'
        } ${isError ? 'bg-red-50 border-red-200 text-red-600' : ''}`}>
           {isError && <div className="flex items-center gap-2 mb-1 font-semibold"><AlertCircle size={14}/> Error</div>}
           <div className="markdown-body">
             <ReactMarkdown>{message.content}</ReactMarkdown>
           </div>
        </div>

      </div>
    </div>
  );
};
