import React from 'react';

interface TypingIndicatorProps {
  statusText: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ statusText }) => {
  return (
    <div className="flex w-full mb-6 justify-start animate-fade-in">
      <div className="flex flex-col items-start max-w-[85%] md:max-w-[70%]">
        
        <div className="flex items-end gap-2">
          {/* Bot Avatar */}
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200 shadow-sm mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          {/* Typing Bubble */}
          <div className="px-4 py-3 bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-none flex items-center gap-3">
             <div className="flex space-x-1 h-2 items-center">
              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
            </div>
            <span className="text-xs font-medium text-gray-500 tracking-wide uppercase">{statusText}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;