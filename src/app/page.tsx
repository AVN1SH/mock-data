"use client";
import React, { useState, useRef, useEffect } from 'react';
import { SetupForm } from '@/components/SetupForm';
import { ChatBubble } from '@/components/ChatBubble';
import { PaperDisplay } from '@/components/PaperDisplay';
import { Message, MessageRole, PaperConfig } from '@/types';
import { generateQuestionPaper } from '@/services/geminiService';
import { Send, Sparkles, AlertCircle, Bot } from 'lucide-react';

const page = () => {
  const [hasSubmittedDetails, setHasSubmittedDetails] = useState(false);
  const [config, setConfig] = useState<PaperConfig | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [paperContent, setPaperContent] = useState<string>('');
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial Message Sequence
  useEffect(() => {
    const sequence = async () => {
      // Delay 1
      await new Promise(r => setTimeout(r, 600));
      setMessages(prev => [
        ...prev,
        {
          id: 'welcome-1',
          role: MessageRole.BOT,
          content: "👋 Hello! I am **ExamGen AI**. \n\nI can help you create comprehensive, professionally formatted question papers for any grade and subject in seconds."
        }
      ]);

      // Delay 2
      await new Promise(r => setTimeout(r, 1200));
      setMessages(prev => [
        ...prev,
        {
          id: 'welcome-2',
          role: MessageRole.BOT,
          content: "To get started, I need a few details. Please define the Class and Subject using the form below."
        }
      ]);

      // Delay 3 - Show Form
      await new Promise(r => setTimeout(r, 800));
      setMessages(prev => [
        ...prev,
        {
          id: 'setup-form',
          role: MessageRole.SYSTEM_FORM,
          content: ''
        }
      ]);
    };

    sequence();
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, hasSubmittedDetails]);

  const handleSetupSubmit = (newConfig: PaperConfig) => {
    setConfig(newConfig);
    setHasSubmittedDetails(true);
    
    // Remove the form message and add success message
    setMessages(prev => {
      const filtered = prev.filter(m => m.role !== MessageRole.SYSTEM_FORM);
      return [
        ...filtered,
        {
          id: Date.now().toString(),
          role: MessageRole.BOT,
          content: `Excellent! I've configured the session for **${newConfig.grade} - ${newConfig.subject}**.\n\nYou can now ask me to generate the full paper, specific sections (e.g., "Create 5 multiple choice questions on Algebra"), or set specific difficulty levels.`
        }
      ];
    });
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || !config) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: MessageRole.USER,
      content: inputValue
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsGenerating(true);

    try {
      // 1. Generate the paper content based on the request
      const newPaperContent = await generateQuestionPaper(config, userMsg.content, paperContent);
      setPaperContent(newPaperContent);

      // 2. Add bot confirmation
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: MessageRole.BOT,
        content: "I've updated the question paper on the left based on your request. Let me know if you need any other changes!"
      };
      setMessages(prev => [...prev, botMsg]);

    } catch (error) {
       const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: MessageRole.BOT,
        content: "I encountered an error while generating the content. Please check your connection or try a simpler prompt.",
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden relative">
      
      {/* LEFT PANEL: Question Paper Display */}
      <div 
        className={`
          transition-all duration-700 ease-in-out bg-white shadow-xl z-20 overflow-hidden
          ${hasSubmittedDetails 
            ? 'flex-1 lg:flex-[2] opacity-100 translate-x-0 border-r border-slate-200 min-w-[320px]' 
            : 'w-0 min-w-0 opacity-0 -translate-x-full border-none'}
        `}
      >
        {config && (
            <PaperDisplay 
                content={paperContent} 
                config={config} 
                isLoading={isGenerating && !paperContent} 
            />
        )}
      </div>

      {/* RIGHT PANEL: Chat Interface */}
      <div className={`flex flex-col h-full transition-all duration-700 ease-in-out flex-1`}>
        
        {/* Chat Header */}
        <div className="h-16 px-6 border-b border-slate-200 bg-white flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <Sparkles size={18} fill="currentColor" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">ExamGen AI</h1>
          </div>
          {hasSubmittedDetails && (
              <div className="text-xs font-medium px-3 py-1 bg-green-100 text-green-700 rounded-full">
                  Active Session
              </div>
          )}
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50 scroll-smooth">
          <div className="max-w-2xl mx-auto flex flex-col justify-end min-h-full">
            
            {/* Render Message History */}
            {messages.map((msg) => {
              if (msg.role === MessageRole.SYSTEM_FORM) {
                return (
                  <div key={msg.id} className="flex w-full justify-start mb-4 animate-fade-in">
                    <div className="flex flex-row gap-3 w-full">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-sm">
                        <Bot size={18} />
                      </div>
                      <SetupForm onSubmit={handleSetupSubmit} />
                    </div>
                  </div>
                );
              }
              return <ChatBubble key={msg.id} message={msg} />;
            })}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Chat Input Area */}
        <div className="p-4 bg-white border-t border-slate-200 shrink-0">
          <div className="max-w-2xl mx-auto">
             {!hasSubmittedDetails ? (
                 <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm animate-pulse">
                     <AlertCircle size={20} />
                     <p>Waiting for configuration...</p>
                 </div>
             ) : (
                <form onSubmit={handleSendMessage} className="relative">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Describe the questions you need..."
                        disabled={isGenerating}
                        className="w-full pl-5 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    />
                    <button
                        type="submit"
                        disabled={!inputValue.trim() || isGenerating}
                        className="absolute right-2 top-2 bottom-2 aspect-square bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-lg flex items-center justify-center transition-all shadow-sm hover:shadow-md"
                    >
                        {isGenerating ? (
                           <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                           <Send size={20} />
                        )}
                    </button>
                </form>
             )}
             <p className="text-center text-xs text-slate-400 mt-3">
                AI can make mistakes. Please review generated papers.
             </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default page;
