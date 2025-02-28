
import React, { useState } from 'react';
import ChatInterface from './ChatInterface';
import MarkdownDisplay from './MarkdownDisplay';
import { Message } from '@/types/chat';
import { Button } from './ui/button';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { AnimatePresence, motion } from 'framer-motion';

// Default markdown to show before any docs are loaded
const DEFAULT_MARKDOWN = `# Welcome to DescBot 3000!

This intelligent assistant helps you generate video descriptions effortlessly.

## Features

* Chat with the AI assistant
* Generate video descriptions automatically
* Get suggestions and improvements for your content

## Getting Started

1. Type a message in the chat input
2. The assistant will respond with helpful descriptions
3. Use the documentation in this panel for guidance

## Tips

* Clear the chat history using the button above
* Ask for specific description styles or formats
* Let DescBot do the hard work for you!`;

// Define API URL with fallback
const API_URL = '/api';

const ChatbotApp: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [markdownContent, setMarkdownContent] = useState(DEFAULT_MARKDOWN);
  const [isLoading, setIsLoading] = useState(false);
  
  // Function to send messages to your Python backend
  const handleSendMessage = async (content: string) => {
    // Add user message immediately
    const userMessage: Message = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);
    
    // Show loading state
    setIsLoading(true);
    
    try {
      // Send the message to your Python backend
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          // Add any other data your backend requires (e.g., session ID, user context)
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Add the assistant's response to chat
      const assistantMessage: Message = { 
        role: 'assistant', 
        content: data.response || "Sorry, I couldn't process that request."
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // If the response includes markdown documentation, display it
      if (data.markdown) {
        setMarkdownContent(data.markdown);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to connect to the backend. Please check your connection.");
      
      // Optional: Add an error message to the chat
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm having trouble connecting to the server. Please check your network connection or try again later."
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const clearHistory = () => {
    setMessages([]);
    setMarkdownContent(DEFAULT_MARKDOWN);
    toast.success("Chat history cleared");
    
    // Optional: Notify your backend to clear the session
    try {
      fetch(`${API_URL}/clear-session`, { method: 'POST' })
        .catch(error => console.error("Error clearing session:", error));
    } catch (error) {
      // Silently handle errors for this optional functionality
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center mb-8"
        >
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-purple-pink-gradient mb-2">
            DescBot 3000
          </h1>
          <p className="text-xl text-white/80 italic">
            Lazily generating video descriptions so you don't have to!
          </p>
          <div className="flex justify-end w-full mt-4">
            <Button 
              variant="ghost" 
              className="bg-white/5 hover:bg-white/10 text-white rounded-full px-4 py-2 flex items-center gap-2"
              onClick={clearHistory}
            >
              <Trash2 size={16} />
              <span className="hidden sm:inline">Clear History</span>
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
        <ChatInterface 
          onSendMessage={handleSendMessage} 
          messages={messages}
          isLoading={isLoading}
        />
        <MarkdownDisplay content={markdownContent} />
      </div>
    </div>
  );
};

export default ChatbotApp;
