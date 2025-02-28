
import React, { useEffect, useState } from 'react';
import { Message } from '@/types/chat';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

interface MessageDisplayProps {
  message: Message;
  delay?: number;
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({ message, delay = 0 }) => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, delay * 1000);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  if (!visible) return null;
  
  return (
    <div 
      className={cn(
        "flex flex-col animate-fade-up",
        message.role === 'user' ? "items-end" : "items-start"
      )}
      style={{ 
        animationDelay: `${delay}s`,
        opacity: visible ? 1 : 0 
      }}
    >
      <div 
        className={cn(
          message.role === 'user' ? "user-message" : "assistant-message"
        )}
      >
        {message.role === 'assistant' ? (
          <ReactMarkdown className="prose prose-invert prose-sm max-w-none">
            {message.content}
          </ReactMarkdown>
        ) : (
          <div>{message.content}</div>
        )}
      </div>
    </div>
  );
};

export default MessageDisplay;
