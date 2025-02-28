
import React, { useState } from 'react';
import ChatInterface from './ChatInterface';
import MarkdownDisplay from './MarkdownDisplay';
import { Message } from '@/types/chat';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Trash2, Link, FileText } from 'lucide-react';
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

1. Paste in a YouTube video URL
2. Tell the bot about errors or updates you'd like to make
3. Once ready, let DescBot know you'd like to create a document

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
  const [videoUrl, setVideoUrl] = useState('');
  
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

  // Function to create a video description request
  const handleVideoUrlSubmit = () => {
    if (!videoUrl.trim()) {
      toast.error("Please enter a video URL");
      return;
    }
    
    const message = `Create a video description for ${videoUrl.trim()}`;
    handleSendMessage(message);
    setVideoUrl(''); // Clear the input after sending
  };

  // Function to request document creation
  const handleCreateDocument = () => {
    const message = "Create Document";
    handleSendMessage(message);
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full mt-4">
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                  <Link size={16} className="text-white/50" />
                </div>
                <Input
                  type="text"
                  placeholder="Enter YouTube URL"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="bg-white/5 hover:bg-white/10 text-white pl-8 h-10"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleVideoUrlSubmit();
                  }}
                />
              </div>
            </div>
            <div className="flex justify-end col-span-1 gap-3">
              <Button 
                onClick={handleCreateDocument}
                variant="ghost" 
                className="bg-white/5 hover:bg-white/10 text-white flex items-center gap-2 flex-1 md:flex-none"
              >
                <FileText size={16} />
                <span className="hidden sm:inline">Create Document</span>
              </Button>
              <Button 
                variant="ghost" 
                className="bg-white/5 hover:bg-white/10 text-white rounded-full px-4 py-2 flex items-center gap-2"
                onClick={clearHistory}
              >
                <Trash2 size={16} />
                <span className="hidden sm:inline">Clear History</span>
              </Button>
            </div>
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
