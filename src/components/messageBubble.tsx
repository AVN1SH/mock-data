import React from 'react';
import { Message, Sender } from '../types';
import { BACK_OPTION_VALUE } from '../App';

interface MessageBubbleProps {
  message: Message;
  isLast: boolean;
  onOptionSelect: (option: string) => void;
  isFinished: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  isLast, 
  onOptionSelect,
  isFinished
}) => {
  const isBot = message.sender === Sender.BOT;

  return (
    <div className={`flex w-full mb-6 ${isBot ? 'justify-start' : 'justify-end'} animate-fade-in group`}>
      <div className={`flex flex-col max-w-[85%] md:max-w-[75%] ${isBot ? 'items-start' : 'items-end'}`}>
        
        <div className={`flex items-end gap-2 ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
          
          {/* Avatar */}
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border shadow-sm mb-1
            ${isBot 
              ? 'bg-indigo-50 border-indigo-100 text-indigo-600' 
              : 'bg-blue-600 border-blue-600 text-white'
            }`}
          >
            {isBot ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            ) : (
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
          </div>

          {/* Message Content */}
          <div className="flex flex-col">
             <div
              className={`px-5 py-3.5 text-[15px] shadow-sm relative leading-relaxed transition-all
                ${isBot 
                  ? 'bg-white text-gray-800 rounded-2xl rounded-tl-none border border-gray-100' 
                  : 'bg-blue-600 text-white rounded-2xl rounded-tr-none shadow-md'
                }
              `}
            >
              {message.text}
            </div>
          </div>
        </div>
        
        {/* Timestamp */}
        <span className={`text-[10px] text-gray-400 mt-1.5 px-1 ${isBot ? 'ml-11' : 'mr-11'}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>

        {/* Options (Suggestions) - Only show for Bot */}
        {isBot && message.options && message.options.length > 0 && (
          <div className={`flex flex-wrap gap-2 mt-3 ml-10 ${isLast && !isFinished ? 'opacity-100 translate-y-0' : 'opacity-40 pointer-events-none'}`}>
            {message.options.map((option, idx) => {
              const isBack = option === BACK_OPTION_VALUE;
              return (
                <button
                  key={idx}
                  onClick={() => onOptionSelect(option)}
                  disabled={!isLast || isFinished}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border flex items-center shadow-sm
                    ${isBack 
                        ? 'bg-white text-red-500 border-gray-200 hover:bg-red-50 hover:border-red-200' 
                        : (isLast && !isFinished)
                          ? 'bg-white border-indigo-100 text-indigo-700 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 hover:shadow-md cursor-pointer'
                          : 'bg-gray-50 border-gray-100 text-gray-400 cursor-default'
                    }
                  `}
                >
                  {isBack && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 -ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                  )}
                  {isBack ? "Go Back" : option}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;