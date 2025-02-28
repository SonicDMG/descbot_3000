
import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Message } from '@/types/chat';
import MessageDisplay from './MessageDisplay';

interface ChatInterfaceProps {
  onSendMessage: (message: string) => void;
  messages: Message[];
  isLoading?: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  onSendMessage, 
  messages,
  isLoading = false 
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Focus the input when the component mounts
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-full glass-panel rounded-xl overflow-hidden animate-fade-in">
      <div className="chat-header">
        Chat Interface
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-white/50 text-center">
              Start a conversation...
            </p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <MessageDisplay 
                key={index} 
                message={message} 
                delay={index * 0.1}
              />
            ))}
          </>
        )}
        {isLoading && (
          <div className="assistant-message inline-flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary/80 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-primary/80 rounded-full animate-pulse delay-75"></div>
            <div className="w-2 h-2 bg-primary/80 rounded-full animate-pulse delay-150"></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <Separator className="bg-white/10" />
      
      <form onSubmit={handleSubmit} className="p-4 relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="chat-input pr-12"
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          size="icon" 
          className="send-button"
          disabled={!inputValue.trim() || isLoading}
        >
          <Send size={18} />
        </Button>
      </form>
    </div>
  );
};

export default ChatInterface;
